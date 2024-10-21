import { Monster, ElementType, Attack } from '../types/Monster';

const calculateDamage = (attacker: Monster, defender: Monster, attack: Attack): number => {
  let damage = (attacker.stats.attackPower + attack.power) - defender.stats.defense;
  
  // Apply type advantages
  if (attacker.strongAgainst === defender.type) {
    damage *= 1.5;
  } else if (attacker.weakAgainst === defender.type) {
    damage *= 0.5;
  }
  
  return Math.max(1, Math.floor(damage)); // Ensure at least 1 damage is dealt
};

export const simulateBattle = (
  monster1: Monster,
  monster2: Monster,
  monster1Attack: Attack,
  monster2Attack: Attack
): { winner: Monster, loser: Monster, battleLog: string[] } => {
  let hp1 = monster1.stats.health;
  let hp2 = monster2.stats.health;
  let battleLog: string[] = [];
  
  const firstAttacker = monster1.stats.speed >= monster2.stats.speed ? monster1 : monster2;
  const secondAttacker = firstAttacker === monster1 ? monster2 : monster1;
  const firstAttack = firstAttacker === monster1 ? monster1Attack : monster2Attack;
  const secondAttack = firstAttacker === monster1 ? monster2Attack : monster1Attack;

  while (hp1 > 0 && hp2 > 0) {
    // First monster attacks
    if (firstAttack.type === 'attack') {
      const damage = calculateDamage(firstAttacker, secondAttacker, firstAttack);
      if (firstAttacker === monster1) {
        hp2 -= damage;
        battleLog.push(`${monster1.name} uses ${firstAttack.name} and deals ${damage} damage to ${monster2.name}`);
      } else {
        hp1 -= damage;
        battleLog.push(`${monster2.name} uses ${firstAttack.name} and deals ${damage} damage to ${monster1.name}`);
      }
    } else {
      const defense = firstAttack.power;
      if (firstAttacker === monster1) {
        hp1 = Math.min(monster1.stats.health, hp1 + defense);
        battleLog.push(`${monster1.name} uses ${firstAttack.name} and recovers ${defense} HP`);
      } else {
        hp2 = Math.min(monster2.stats.health, hp2 + defense);
        battleLog.push(`${monster2.name} uses ${firstAttack.name} and recovers ${defense} HP`);
      }
    }
    if (hp1 <= 0 || hp2 <= 0) break;
    
    // Second monster attacks
    if (secondAttack.type === 'attack') {
      const damage = calculateDamage(secondAttacker, firstAttacker, secondAttack);
      if (secondAttacker === monster1) {
        hp2 -= damage;
        battleLog.push(`${monster1.name} uses ${secondAttack.name} and deals ${damage} damage to ${monster2.name}`);
      } else {
        hp1 -= damage;
        battleLog.push(`${monster2.name} uses ${secondAttack.name} and deals ${damage} damage to ${monster1.name}`);
      }
    } else {
      const defense = secondAttack.power;
      if (secondAttacker === monster1) {
        hp1 = Math.min(monster1.stats.health, hp1 + defense);
        battleLog.push(`${monster1.name} uses ${secondAttack.name} and recovers ${defense} HP`);
      } else {
        hp2 = Math.min(monster2.stats.health, hp2 + defense);
        battleLog.push(`${monster2.name} uses ${secondAttack.name} and recovers ${defense} HP`);
      }
    }
  }
  
  if (hp1 > 0) {
    battleLog.push(`${monster1.name} wins the battle!`);
    return { winner: monster1, loser: monster2, battleLog };
  } else {
    battleLog.push(`${monster2.name} wins the battle!`);
    return { winner: monster2, loser: monster1, battleLog };
  }
};

export const awardXP = (winner: Monster, loser: Monster): number => {
  const baseXP = 10;
  const levelDifference = loser.level - winner.level;
  const xpGained = baseXP + (levelDifference * 2);
  return Math.max(1, xpGained); // Ensure at least 1 XP is gained
};