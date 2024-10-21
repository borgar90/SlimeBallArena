import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

const matches = new Map();
const playerMatches = new Map();

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('createMatch', ({ nickname, slimeBall }) => {
    if (playerMatches.has(socket.id)) {
      socket.emit('error', 'You already have an active match');
      return;
    }

    const matchId = uuidv4();
    const newMatch = {
      id: matchId,
      creator: { id: socket.id, nickname, slimeBall },
      opponent: null,
      status: 'waiting'
    };
    matches.set(matchId, newMatch);
    playerMatches.set(socket.id, matchId);
    socket.join(matchId);
    io.emit('matchesUpdated', Array.from(matches.values()));
  });

  socket.on('joinMatch', ({ matchId, nickname, slimeBall }) => {
    const match = matches.get(matchId);
    if (match && match.status === 'waiting' && match.creator.id !== socket.id) {
      if (playerMatches.has(socket.id)) {
        socket.emit('error', 'You already have an active match');
        return;
      }

      match.opponent = { id: socket.id, nickname, slimeBall };
      match.status = 'ready';
      playerMatches.set(socket.id, matchId);
      socket.join(matchId);
      io.to(matchId).emit('matchReady', match);
      io.emit('matchesUpdated', Array.from(matches.values()));
    }
  });

  socket.on('acceptMatch', (matchId) => {
    const match = matches.get(matchId);
    if (match && match.status === 'ready' && match.creator.id === socket.id) {
      match.status = 'inProgress';
      io.to(matchId).emit('matchStarted', match);
      startCountdown(matchId);
    }
  });

  socket.on('attack', ({ matchId, damage }) => {
    const match = matches.get(matchId);
    if (match && match.status === 'inProgress' && 
        (match.creator.id === socket.id || match.opponent.id === socket.id)) {
      io.to(matchId).emit('attacked', { attacker: socket.id, damage });
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
    const matchId = playerMatches.get(socket.id);
    if (matchId) {
      const match = matches.get(matchId);
      if (match) {
        if (match.status === 'inProgress') {
          // Forfeit the match
          const winner = match.creator.id === socket.id ? match.opponent : match.creator;
          io.to(matchId).emit('matchEnded', { winner, reason: 'disconnect' });
        }
        matches.delete(matchId);
        io.emit('matchesUpdated', Array.from(matches.values()));
      }
      playerMatches.delete(socket.id);
    }
  });
});

function startCountdown(matchId) {
  let countdown = 10;
  const intervalId = setInterval(() => {
    io.to(matchId).emit('countdown', countdown);
    countdown--;
    if (countdown < 0) {
      clearInterval(intervalId);
      io.to(matchId).emit('matchStart');
    }
  }, 1000);
}

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});