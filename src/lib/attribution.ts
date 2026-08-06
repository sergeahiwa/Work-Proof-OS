import { RecruitmentOutcome, TruthState, ValidationSource, ReliabilityLevel, ProofEvent, CommitmentType } from '../types';
import * as core from '../core/reliability';

/**
 * Captures a formal Proof Event (The Economic Anchor)
 * Does NOT model legal objects, only captures perceived economic signals
 */
export const captureProofEvent = core.captureProofEvent;

/**
 * Calculates the total confidence score based on multi-source validation
 * Refined weighting: External > 40%, Causal > 30%, Human > 20%, Market < 10%
 */
export const calculateAttributionScore = core.calculateAttributionScore;

/**
 * Anti-Gaming System: Detects anomalies in feedback and confirmations
 */
export const detectAnomalies = core.detectAnomalies;

/**
 * Generates the multi-source validation layer for an outcome
 * Weights: Causal (0.3), Human (0.2), External (0.4), Market (0.1)
 */
export const generateValidationSources = core.generateValidationSources;

/**
 * Determines the Reliability Level (Analysis Layer)
 * Anchors the decision if a formal commitment event exists
 */
export const calculateReliability = core.calculateReliability;

/**
 * Detects fraud signals and returns risk flags
 */
export const detectFraudSignals = core.detectFraudSignals;

/**
 * Determines the Truth State of an outcome based on confidence and signals
 */
export const getTruthState = core.getTruthState;

/**
 * Calculates the reputation penalty
 */
export const calculatePenalty = core.calculatePenalty;

/**
 * Explains the confidence score components for UI
 */
export interface ScoreFactor {
  label: string;
  score: number;
  weight: number;
  status: 'verified' | 'pending' | 'failed';
}

export const getDetailedScoreExplanation = (outcome: RecruitmentOutcome): ScoreFactor[] => {
  const sources = outcome.validationSources && outcome.validationSources.length > 0 
    ? outcome.validationSources 
    : core.generateValidationSources(outcome);

  return sources.map(s => ({
    label: s.label,
    score: s.confidence,
    weight: s.weight * 100,
    status: s.status
  }));
};

export const getScoreExplanation = (outcome: RecruitmentOutcome): string[] => {
  return getDetailedScoreExplanation(outcome).map(f => `${f.label}: ${f.score}% (Poids ${f.weight}%)`);
};
