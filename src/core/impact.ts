import { Contribution, MarketValueSignature, ValueImpact } from '../types';

/**
 * Core Impact Engine - Minimal Version (Architecture Reset v1)
 * Calculates basic impact without modulation or secondary audit layers.
 */

export function validateContribution(c: Contribution): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!c.impactScore) errors.push("Impact score required");
  return { valid: errors.length === 0, errors };
}

export function calculateMarketValueSignature(
  contributions: Contribution[]
): MarketValueSignature {
  if (contributions.length === 0) {
    return { 
      execution: 0, 
      decision: 0, 
      coordination: 0, 
      knowledge: 0,
      softProcedure: 0,
      agility: 0,
      decisionVelocity: 0,
      leverage: 0, 
      impactLevel: 'low', 
      totalValueCreated: 0, 
      topImpactProjects: [],
      isExperimental: false,
      stabilityScore: 100
    };
  }

  let totalImpact = 0;
  contributions.forEach(c => {
    totalImpact += c.impactScore;
  });

  const impactLevel: ValueImpact = totalImpact > 2000 ? 'high' : (totalImpact > 1000 ? 'medium' : 'low');

  return {
    execution: 100, // Simplified for reset
    decision: 0,
    coordination: 0,
    knowledge: 0,
    softProcedure: 0,
    agility: 0,
    decisionVelocity: 100,
    leverage: 0, 
    impactLevel,
    totalValueCreated: Math.round(totalImpact),
    topImpactProjects: [],
    isExperimental: false,
    stabilityScore: 100
  };
}

export const generateContributionHash = (c: Contribution): string => {
  return `WP-RESET-${c.id}`;
};
