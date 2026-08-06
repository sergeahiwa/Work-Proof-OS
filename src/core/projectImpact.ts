import { Project, Contribution, ValueImpact, MarketValueSignature } from '../types';

/**
 * Project Impact Engine - Minimal Version (Architecture Reset v1)
 */

export function calculateProjectMetrics(
  project: Project,
  contributions: Contribution[],
  signature: MarketValueSignature
): Partial<Project> {
  if (contributions.length === 0) {
    return {
      impactLevel: 'low',
      projectImpactScore: 0,
      projectCredibilityIndex: 0
    };
  }

  const totalImpact = contributions.reduce((acc, c) => acc + c.impactScore, 0);
  const credibilityIndex = signature.stabilityScore;

  let impactLevel: ValueImpact = 'low';
  if (totalImpact > 300) impactLevel = 'medium';
  if (totalImpact > 800) impactLevel = 'high';

  return {
    impactLevel,
    projectImpactScore: Math.round(totalImpact),
    projectCredibilityIndex: credibilityIndex,
  };
}
