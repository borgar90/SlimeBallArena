import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { SlimeBall, SlimeType } from '../types/SlimeBall';

interface SlimeBallArenaProps {
  slimeBalls: SlimeBall[];
  selectedSlimeBall: SlimeBall | null;
  opponentSlimeBall: SlimeBall | null;
  isBattleMode: boolean;
  currentTurn: 'player' | 'opponent';
}

const SlimeBallArena: React.FC<SlimeBallArenaProps> = ({
  slimeBalls,
  selectedSlimeBall,
  opponentSlimeBall,
  isBattleMode,
  currentTurn
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Render slime balls
    slimeBalls.forEach((slimeBall) => {
      renderSlimeBall(svg, slimeBall, slimeBall === selectedSlimeBall);
    });

    // Render battle mode elements if in battle mode
    if (isBattleMode && selectedSlimeBall && opponentSlimeBall) {
      renderBattleMode(svg, selectedSlimeBall, opponentSlimeBall, currentTurn);
    }
  }, [slimeBalls, selectedSlimeBall, opponentSlimeBall, isBattleMode, currentTurn]);

  return (
    <svg ref={svgRef} width="800" height="400" className="bg-gray-800 rounded-lg"></svg>
  );
};

function renderSlimeBall(
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  slimeBall: SlimeBall,
  isSelected: boolean
) {
  const group = svg.append('g')
    .attr('transform', `translate(${slimeBall.x}, ${slimeBall.y})`);

  // Slime body
  group.append('circle')
    .attr('r', slimeBall.size)
    .attr('fill', slimeBall.color)
    .attr('stroke', isSelected ? 'white' : 'none')
    .attr('stroke-width', 3);

  // Eyes
  group.append('circle')
    .attr('cx', -15)
    .attr('cy', -10)
    .attr('r', 8)
    .attr('fill', 'white');

  group.append('circle')
    .attr('cx', 15)
    .attr('cy', -10)
    .attr('r', 8)
    .attr('fill', 'white');

  group.append('circle')
    .attr('cx', -15)
    .attr('cy', -10)
    .attr('r', 4)
    .attr('fill', 'black');

  group.append('circle')
    .attr('cx', 15)
    .attr('cy', -10)
    .attr('r', 4)
    .attr('fill', 'black');

  // Mouth
  const mouthPath = getMouthPath(slimeBall.type);
  group.append('path')
    .attr('d', mouthPath)
    .attr('fill', 'none')
    .attr('stroke', 'black')
    .attr('stroke-width', 2);
}

function getMouthPath(type: SlimeType): string {
  switch (type) {
    case SlimeType.Fire:
      return 'M-20,20 Q0,35 20,20';
    case SlimeType.Nature:
      return 'M-20,20 Q0,10 20,20';
    case SlimeType.Water:
      return 'M-20,25 Q0,35 20,25';
    case SlimeType.Evil:
      return 'M-25,20 L-5,25 L5,20 L25,25';
    default:
      return 'M-20,20 Q0,30 20,20';
  }
}

function renderBattleMode(
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  playerSlimeBall: SlimeBall,
  opponentSlimeBall: SlimeBall,
  currentTurn: 'player' | 'opponent'
) {
  // Position slime balls for battle
  playerSlimeBall.x = 200;
  playerSlimeBall.y = 200;
  opponentSlimeBall.x = 600;
  opponentSlimeBall.y = 200;

  renderSlimeBall(svg, playerSlimeBall, currentTurn === 'player');
  renderSlimeBall(svg, opponentSlimeBall, currentTurn === 'opponent');

  // Render health bars
  renderHealthBar(svg, playerSlimeBall, 50, 350);
  renderHealthBar(svg, opponentSlimeBall, 450, 350);
}

function renderHealthBar(
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  slimeBall: SlimeBall,
  x: number,
  y: number
) {
  const healthPercentage = slimeBall.stats.health / 100;

  svg.append('rect')
    .attr('x', x)
    .attr('y', y)
    .attr('width', 300)
    .attr('height', 20)
    .attr('fill', 'gray');

  svg.append('rect')
    .attr('x', x)
    .attr('y', y)
    .attr('width', 300 * healthPercentage)
    .attr('height', 20)
    .attr('fill', 'green');

  svg.append('text')
    .attr('x', x + 150)
    .attr('y', y + 15)
    .attr('text-anchor', 'middle')
    .attr('fill', 'white')
    .text(`${slimeBall.stats.health} / 100`);
}

function animateAttack(
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  attacker: SlimeBall,
  defender: SlimeBall
) {
  const attackerGroup = svg.select(`g[transform*="translate(${attacker.x},${attacker.y})"]`);
  const defenderGroup = svg.select(`g[transform*="translate(${defender.x},${defender.y})"]`);

  // Attacker animation
  attackerGroup.transition()
    .duration(500)
    .attr('transform', `translate(${(attacker.x + defender.x) / 2}, ${(attacker.y + defender.y) / 2}) scale(1.2)`)
    .transition()
    .duration(500)
    .attr('transform', `translate(${attacker.x}, ${attacker.y}) scale(1)`);

  // Defender animation
  defenderGroup.transition()
    .duration(100)
    .attr('transform', `translate(${defender.x + 10}, ${defender.y})`)
    .transition()
    .duration(100)
    .attr('transform', `translate(${defender.x - 10}, ${defender.y})`)
    .transition()
    .duration(100)
    .attr('transform', `translate(${defender.x}, ${defender.y})`);

  // Create slime pool under the defender
  const poolSize = defender.size * 1.5;
  const pool = svg.append('ellipse')
    .attr('cx', defender.x)
    .attr('cy', defender.y + defender.size)
    .attr('rx', 0)
    .attr('ry', 0)
    .attr('fill', defender.color)
    .style('opacity', 0.5);

  pool.transition()
    .duration(1000)
    .attr('rx', poolSize)
    .attr('ry', poolSize / 3);

  // Animate slime drops
  const dropCount = 10;
  const drops = svg.append('g')
    .attr('class', 'slime-drops')
    .selectAll('circle')
    .data(d3.range(dropCount))
    .enter()
    .append('circle')
    .attr('cx', defender.x)
    .attr('cy', defender.y)
    .attr('r', 5)
    .attr('fill', defender.color)
    .style('opacity', 0.7);

  drops.transition()
    .duration(1000)
    .attr('cy', (_, i) => defender.y + defender.size + Math.random() * poolSize / 3)
    .attr('cx', (_, i) => defender.x + (Math.random() - 0.5) * poolSize)
    .style('opacity', 0)
    .remove();

  // Check if defender's health is low and animate accordingly
  if (defender.stats.health <= 20) {
    animateLowHealth(defenderGroup, defender);
  }
}

function animateLowHealth(
  defenderGroup: d3.Selection<d3.BaseType, unknown, null, undefined>,
  defender: SlimeBall
) {
  // Make eyes bulge out
  defenderGroup.selectAll('circle')
    .filter((_, i, nodes) => i < 4) // Select only the eye circles
    .transition()
    .duration(300)
    .attr('cy', -15)
    .attr('r', 10);

  // Make slime body pulsate
  defenderGroup.select('circle')
    .transition()
    .duration(500)
    .attr('r', defender.size * 0.9)
    .transition()
    .duration(500)
    .attr('r', defender.size)
    .on('end', () => animateLowHealth(defenderGroup, defender));
}

export default SlimeBallArena;