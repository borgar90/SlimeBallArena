import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { SlimeBall, slimeBalls } from '../types/SlimeBall';

const socket: Socket = io('http://localhost:3000');

interface Match {
  id: string;
  creator: {
    id: string;
    nickname: string;
    slimeBall: SlimeBall;
  };
  opponent: {
    id: string;
    nickname: string;
    slimeBall: SlimeBall;
  } | null;
  status: 'waiting' | 'ready' | 'inProgress';
}

const Matchmaking: React.FC = () => {
  const [nickname, setNickname] = useState('');
  const [selectedSlimeBall, setSelectedSlimeBall] = useState<SlimeBall | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [creatingMatch, setCreatingMatch] = useState(false);
  const [playerMatchId, setPlayerMatchId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    socket.on('matchesUpdated', (updatedMatches: Match[]) => {
      setMatches(updatedMatches);
    });

    socket.on('matchReady', (match: Match) => {
      if (match.creator.id === socket.id) {
        // Show accept button for creator
        setPlayerMatchId(match.id);
      }
    });

    socket.on('matchStarted', (match: Match) => {
      navigate(`/arena/${match.id}`);
    });

    return () => {
      socket.off('matchesUpdated');
      socket.off('matchReady');
      socket.off('matchStarted');
    };
  }, [navigate]);

  const createMatch = () => {
    if (nickname && selectedSlimeBall) {
      socket.emit('createMatch', { nickname, slimeBall: selectedSlimeBall });
      setCreatingMatch(false);
      setPlayerMatchId(null); // Reset player's match ID when creating a new match
    }
  };

  const joinMatch = (matchId: string) => {
    if (nickname && selectedSlimeBall) {
      socket.emit('joinMatch', { matchId, nickname, slimeBall: selectedSlimeBall });
    }
  };

  const acceptMatch = () => {
    if (playerMatchId) {
      socket.emit('acceptMatch', playerMatchId);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Matchmaking</h1>
      {!creatingMatch && !playerMatchId ? (
        <button
          onClick={() => setCreatingMatch(true)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
        >
          Create New Match
        </button>
      ) : null}
      {creatingMatch && (
        <div className="mb-4">
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="Enter your nickname"
            className="border p-2 mr-2"
          />
          <select
            value={selectedSlimeBall?.id || ''}
            onChange={(e) => setSelectedSlimeBall(slimeBalls.find(sb => sb.id === e.target.value) || null)}
            className="border p-2 mr-2"
          >
            <option value="">Select a SlimeBall</option>
            {slimeBalls.map((sb) => (
              <option key={sb.id} value={sb.id}>{sb.name}</option>
            ))}
          </select>
          <button
            onClick={createMatch}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Create Match
          </button>
        </div>
      )}
      {playerMatchId && (
        <div className="mb-4">
          <p>Waiting for opponent to join...</p>
          <button
            onClick={acceptMatch}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-2"
          >
            Accept Match
          </button>
        </div>
      )}
      <h2 className="text-2xl font-bold mb-4">Available Matches</h2>
      <ul>
        {matches.map((match) => (
          <li key={match.id} className="mb-2">
            {match.creator.nickname}'s match ({match.creator.slimeBall.name})
            {match.status === 'waiting' && match.creator.id !== socket.id && (
              <button
                onClick={() => joinMatch(match.id)}
                className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded ml-2"
              >
                Join
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Matchmaking;