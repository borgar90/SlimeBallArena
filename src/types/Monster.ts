import { v4 as uuidv4 } from 'uuid';

export enum ElementType {
  Fire = 'Fire',
  Water = 'Water',
  Earth = 'Earth',
  Air = 'Air',
}

export interface MonsterStats {
  attackPower: number;
  defense: number;
  health: number;
  speed: number;
  recoveryTime: number;
}

export interface Attack {
  name: string;
  power: number;
  type: 'attack' | 'defense';
}

export interface Monster {
  id: string;
  name: string;
  type: ElementType;
  level: number;
  xp: number;
  stats: MonsterStats;
  color: string;
  strongAgainst: ElementType;
  weakAgainst: ElementType;
  attacks: Attack[];
}

const createAttack = (name: string, power: number, type: 'attack' | 'defense'): Attack => ({
  name,
  power,
  type,
});

export const monsters: Monster[] = [
  {
    id: uuidv4(),
    name: 'Flameburst',
    type: ElementType.Fire,
    level: 1,
    xp: 0,
    stats: { attackPower: 10, defense: 5, health: 50, speed: 8, recoveryTime: 2 },
    color: '#FF4136',
    strongAgainst: ElementType.Earth,
    weakAgainst: ElementType.Water,
    attacks: [
      createAttack('Fireball', 15, 'attack'),
      createAttack('Heat Shield', 10, 'defense'),
    ],
  },
  {
    id: uuidv4(),
    name: 'Aquasurge',
    type: ElementType.Water,
    level: 1,
    xp: 0,
    stats: { attackPower: 8, defense: 7, health: 60, speed: 7, recoveryTime: 1.5 },
    color: '#7FDBFF',
    strongAgainst: ElementType.Fire,
    weakAgainst: ElementType.Earth,
    attacks: [
      createAttack('Water Blast', 12, 'attack'),
      createAttack('Bubble Barrier', 12, 'defense'),
    ],
  },
  {
    id: uuidv4(),
    name: 'Terrafirm',
    type: ElementType.Earth,
    level: 1,
    xp: 0,
    stats: { attackPower: 7, defense: 10, health: 70, speed: 5, recoveryTime: 2.5 },
    color: '#3D9970',
    strongAgainst: ElementType.Water,
    weakAgainst: ElementType.Air,
    attacks: [
      createAttack('Rock Throw', 14, 'attack'),
      createAttack('Stone Skin', 15, 'defense'),
    ],
  },
  {
    id: uuidv4(),
    name: 'Zephyros',
    type: ElementType.Air,
    level: 1,
    xp: 0,
    stats: { attackPower: 9, defense: 6, health: 55, speed: 10, recoveryTime: 1 },
    color: '#FFFFFF',
    strongAgainst: ElementType.Earth,
    weakAgainst: ElementType.Fire,
    attacks: [
      createAttack('Gust', 13, 'attack'),
      createAttack('Wind Veil', 11, 'defense'),
    ],
  },
];

export const getMonsterById = (id: string): Monster | undefined => {
  return monsters.find(monster => monster.id === id);
};

const newAttacks: { [key: number]: Attack[] } = {
  3: [
    createAttack('Flame Burst', 20, 'attack'),
    createAttack('Tidal Surge', 18, 'attack'),
    createAttack('Boulder Crush', 22, 'attack'),
    createAttack('Cyclone', 19, 'attack'),
  ],
  5: [
    createAttack('Inferno', 25, 'attack'),
    createAttack('Tsunami', 23, 'attack'),
    createAttack('Earthquake', 27, 'attack'),
    createAttack('Tornado', 24, 'attack'),
  ],
  7: [
    createAttack('Phoenix Shield', 20, 'defense'),
    createAttack('Ice Armor', 22, 'defense'),
    createAttack('Mountain Guard', 25, 'defense'),
    createAttack('Tempest Cloak', 21, 'defense'),
  ],
};

export const levelUpMonster = (monster: Monster): Monster => {
  const newLevel = monster.level + 1;
  const statIncrease = Math.floor(Math.random() * 3) + 1;

  const updatedMonster = {
    ...monster,
    level: newLevel,
    xp: monster.xp - 100,
    stats: {
      attackPower: monster.stats.attackPower + statIncrease,
      defense: monster.stats.defense + statIncrease,
      health: monster.stats.health + (statIncrease * 5),
      speed: monster.stats.speed + (statIncrease / 2),
      recoveryTime: Math.max(1, monster.stats.recoveryTime - 0.1),
    },
  };

  if (newAttacks[newLevel]) {
    const newAttack = newAttacks[newLevel].find(attack => 
      attack.name.toLowerCase().includes(monster.type.toLowerCase())
    );
    if (newAttack) {
      updatedMonster.attacks = [...monster.attacks, newAttack];
    }
  }

  return updatedMonster;
};