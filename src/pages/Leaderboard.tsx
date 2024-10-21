import React from 'react';

const Leaderboard: React.FC = () => {
  // Placeholder data for the leaderboard
  const topPlayers = [
    { name: 'Player1', wins: 150, topMonster: 'Flameburst' },
    { name: 'Player2', wins: 120, topMonster: 'Aquasurge' },
    { name: 'Player3', wins: 100, topMonster: 'Terrafirm' },
    // Add more placeholder data as needed
  ];

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Leaderboard</h2>
      <table className="w-full bg-gray-800 rounded-lg overflow-hidden">
        <thead className="bg-gray-700">
          <tr>
            <th className="px-4 py-2">Rank</th>
            <th className="px-4 py-2">Player</th>
            <th className="px-4 py-2">Wins</th>
            <th className="px-4 py-2">Top Monster</th>
          </tr>
        </thead>
        <tbody>
          {topPlayers.map((player, index) => (
            <tr key={index} className="border-b border-gray-700">
              <td className="px-4 py-2 text-center">{index + 1}</td>
              <td className="px-4 py-2">{player.name}</td>
              <td className="px-4 py-2 text-center">{player.wins}</td>
              <td className="px-4 py-2">{player.topMonster}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;