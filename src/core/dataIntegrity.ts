import { User, TrustFactors } from '../types';

/**
 * Data Integrity Engine - Minimal Version (Architecture Reset v1)
 */

export const DEFAULT_TRUST_FACTORS: TrustFactors = {
  reliability: 0.8,
  validatorDiversity: 0.5,
  identityStrength: 0.5,
  sourceQuality: 0.5,
  reputationHistory: 0.5,
  temporalFreshness: 0.8,
  impactWeight: 0.5,
  consistencyScore: 0.8,
  anomalyScore: 0.05
};

export function ensureTrustFactors(user: any): User {
  if (!user.trustFactors) {
    user.trustFactors = { ...DEFAULT_TRUST_FACTORS };
  }
  return user as User;
}
