import { v4 as uuidv4 } from 'uuid';

export enum SlimeType {
  Fire = 'fire',
  Nature = 'nature',
  Water = 'water',
  Evil = 'evil',
}

export interface SlimeBallStats {
  health: number;
  attackPower: number;
  defense: number;
  speed: number;
}

export interface SlimeBall {
  id: string;
  name: string;
  type: SlimeType;
  color: string;
  stats: SlimeBallStats;
  x: number;
  y: number;
  size: number;
}

export const createSlimeBall = (
  name: string,
  type: SlimeType,
  x: number,
  y: number
): SlimeBall => {
  const baseStats = {
    health: 100,
    attackPower: 10,
    defense: 5,
    speed: 5,
  };

  const colors = {
    [SlimeType.Fire]: '#FF4136',
    [SlimeType.Nature]: '#2ECC40',
    [SlimeType.Water]: '#0074D9',
    [SlimeType.Evil]: '#111111',
  };

  return {
    id: uuidv4(),
    name,
    type,
    color: colors[type],
    stats: { ...baseStats },
    x,
    y,
    size: 50,
  };
};

export const slimeBalls: SlimeBall[] = [
  createSlimeBall('Flameball', SlimeType.Fire, 100, 150),
  createSlimeBall('Natureball', SlimeType.Nature, 300, 150),
  createSlimeBall('Aquaball', SlimeType.Water, 500, 150),
  createSlimeBall('Shadowball', SlimeType.Evil, 700, 150),
];