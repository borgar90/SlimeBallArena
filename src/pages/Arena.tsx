import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { SlimeBall } from '../types/SlimeBall';
import SlimeBallArena from '../components/SlimeBallArena';
import { Language, useTranslation } from '../utils/translations';

const socket: Socket = io('http://localhost:3000');

interface ArenaProps {
  language: Language;
}

const Arena: React.FC<ArenaProps> = ({ language }) => {
  const { matchId } = useParams<{ matchId: string }>();
  const t = useTranslation(language);
  const [playerSlimeBall, setPlayerSlimeBall] = useState<SlimeBall | null>(null);
  const [opponentSlimeBall, setOpponentSlimeBall] = useState<SlimeBall | null>(null);
  const [currentTurn, setCurrentTurn] = useState<'player' | 'opponent'>('player');
  const [countdown, setCountdown] = useState<number | null>(null);
  const [battleLog, setBattleLog] = useState<string[]>([]);

  useEffect(() => {
    if (matchId) {
      socket.emit('joinArena', matchId);

      socket.on('matchData', (data: { player: SlimeBall; opponent: SlimeBall }) => {
        setPlayerSlimeBall(data.player);
        setOpponentSlimeBall(data.opponent);
      });

      socket.on('countdown', (count: number) => {
        setCountdown(count);
      });

      socket.on('matchStart', () => {
        setCountdown(null);
        setBattleLog([t('battleStarted')]);
      });

      socket.on('turnChange', (turn: 'player' | 'opponent') => {
        setCurrentTurn(turn);
      });

      socket.on('attacked', ({ attacker, damage }) => {
        if (attacker === socket.id) {
          setOpponentSlimeBall((prev) => 
            prev ? { ...prev, stats: { ...prev.stats, health: Math.max(0, prev.stats.health - damage) } } : null
          );
          setBattleLog((prev) => [...prev, `${playerSlimeBall?.name} ${t('attacks')} ${opponentSlimeBall?.name} ${t('for')} ${damage} ${t('damage')}`]);
        } else {
          setPlayerSlimeBall((prev) => 
            prev ? { ...prev, stats: { ...prev.stats, health: Math.max(0, prev.stats.health - damage) } } : null
          );
          setBattleLog((prev) => [...prev, `${opponentSlimeBall?.name} ${t('attacks')} ${playerSlimeBall?.name} ${t('for')} ${damage} ${t('damage')}`]);
        }
      });
    }

    return () => {
      socket.off('matchData');
      socket.off('countdown');
      socket.off('matchStart');
      socket.off('turnChange');
      socket.off('attacked');
    };
  }, [matchId, t, playerSlimeBall, opponentSlimeBall]);

  const attack = useCallback(() => {
    if (currentTurn === 'player' && matchId) {
      const damage = Math.floor(Math.random() * (playerSlimeBall?.stats.attackPower || 0)) + 1;
      socket.emit('attack', { matchId, damage });
    }
  }, [currentTurn, matchId, playerSlimeBall]);

  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold mb-6">{t('battleArena')}</h2>
      {countdown !== null && <div className="text-2xl mb-4">{t('startingIn')} {countdown}</div>}
      <SlimeBallArena
        slimeBalls={[playerSlimeBall, opponentSlimeBall].filter((sb): sb is SlimeBall => sb !== null)}
        selectedSlimeBall={playerSlimeBall}
        opponentSlimeBall={opponentSlimeBall}
        isBattleMode={true}
        currentTurn={currentTurn}
      />
      {currentTurn === 'player' && countdown === null && (
        <div className="mt-4">
          <button
            onClick={attack}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            {t('attack')}
          </button>
        </div>
      )}
      <div className="mt-4">
        <h3 className="text-xl font-bold mb-2">{t('battleLog')}</h3>
        <ul className="list-disc list-inside">
          {battleLog.map((log, index) => (
            <li key={index}>{log}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Arena;