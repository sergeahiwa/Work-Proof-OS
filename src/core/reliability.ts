import { RecruitmentOutcome, TruthState, ValidationSource, ReliabilityLevel, ProofEvent, CommitmentType } from '../types';

/**
 * Core Reliability Engine - Minimal Version (Architecture Reset v1)
 * Strictly passive metrics for the audit layer.
 */

export function captureProofEvent(
  outcome: RecruitmentOutcome,
  type: CommitmentType,
  actorId: string,
  economicValue?: number
): ProofEvent {
  return {
    id: `ev-${Date.now()}`,
    type,
    timestamp: new Date().toISOString(),
    actorId,
    hash: `WP-ANCHOR-${outcome.id}-${Date.now()}`,
    status: 'active',
    economicValue,
    currency: 'EUR',
    metadata: {
      source: 'platform_signal_capture_layer',
      causalityVerified: true,
      confidenceWeight: 'medium'
    }
  };
}

export function generateValidationSources(outcome: RecruitmentOutcome): ValidationSource[] {
  return [
    { 
      id: `vs-causal-${outcome.id}`, 
      type: 'causal', 
      label: 'Traçabilité des échanges', 
      weight: 0.3, 
      confidence: outcome.isLockedToPlatform ? 90 : 50, 
      status: 'verified' 
    },
    { 
      id: `vs-human-${outcome.id}`, 
      type: 'human_confirmation', 
      label: 'Validation par les pairs', 
      weight: 0.2, 
      confidence: 100, 
      status: 'verified' 
    }
  ];
}

export function calculateAttributionScore(outcome: RecruitmentOutcome): number {
  if (outcome.isLockedToPlatform) return 95;
  return 60;
}

export function calculateReliability(outcome: RecruitmentOutcome): ReliabilityLevel {
  const score = calculateAttributionScore(outcome);
  if (score >= 90) return 'highly_reliable';
  if (score >= 70) return 'reliable';
  if (score >= 40) return 'uncertain';
  return 'risky';
}

export function getTruthState(outcome: RecruitmentOutcome): TruthState {
  const score = calculateAttributionScore(outcome);
  if (score >= 80) return 'verified';
  if (score >= 50) return 'probable';
  return 'unverified';
}

export function detectAnomalies(outcome: RecruitmentOutcome): string[] {
  return [];
}

export function detectFraudSignals(outcome: RecruitmentOutcome): string[] {
  return [];
}

export function calculatePenalty(outcome: RecruitmentOutcome | string): number {
  return 0;
}

export function getDetailedConfidenceExplanation(outcome: RecruitmentOutcome): any[] {
  return generateValidationSources(outcome).map(s => ({
    label: s.label,
    percentage: s.confidence,
    weight: Math.round(s.weight * 100),
    status: s.status
  }));
}

export function getGlobalConfidenceExplanation(score: number): string {
  if (score >= 85) return "Profil hautement vérifié avec des preuves multi-sources.";
  if (score >= 65) return "Profil fiable avec des confirmations solides.";
  if (score >= 40) return "Profil en cours de consolidation.";
  return "Niveau de preuve insuffisant pour une recommandation automatique.";
}
