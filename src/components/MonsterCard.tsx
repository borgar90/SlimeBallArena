import React from 'react';
import { Monster } from '../types/Monster';

interface MonsterCardProps {
  monster: Monster;
}

const MonsterCard: React.FC<MonsterCardProps> = ({ monster }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
      <div
        className="w-24 h-24 mx-auto mb-4 rounded-lg"
        style={{ backgroundColor: monster.color }}
      ></div>
      <h3 className="text-xl font-bold mb-2">{monster.name}</h3>
      <p className="text-sm mb-2">Type: {monster.type}</p>
      <p className="text-sm mb-2">Level: {monster.level}</p>
      <div className="text-sm">
        <p>ATK: {monster.stats.attackPower}</p>
        <p>DEF: {monster.stats.defense}</p>
        <p>HP: {monster.stats.health}</p>
        <p>SPD: {monster.stats.speed}</p>
      </div>
      <div className="mt-2">
        <p className="font-bold">Attacks:</p>
        <ul className="list-disc list-inside">
          {monster.attacks.map((attack) => (
            <li key={attack.name} className="text-sm">
              {attack.name} ({attack.type})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MonsterCard;