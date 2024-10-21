import React from 'react';
import MonsterCard from '../components/MonsterCard';
import { monsters } from '../types/Monster';

const Profile: React.FC = () => {
  // Placeholder data for the player's profile
  const playerName = 'Player1';
  const playerLevel = 10;
  const playerMonsters = monsters.slice(0, 3); // Just use the first 3 monsters as an example

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Player Profile</h2>
      <div className="bg-gray-800 rounded-lg p-6 mb-8">
        <h3 className="text-2xl font-bold mb-2">{playerName}</h3>
        <p className="text-lg mb-4">Level: {playerLevel}</p>
        <p className="text-lg">Total Monsters: {playerMonsters.length}</p>
      </div>
      <h3 className="text-2xl font-bold mb-4">Your Monsters</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {playerMonsters.map((monster) => (
          <MonsterCard key={monster.id} monster={monster} />
        ))}
      </div>
    </div>
  );
};

export default Profile;