import { Timestamp } from "firebase/firestore";

export type SignalType = 'activity' | 'evolution' | 'behavior' | 'skill_emergence';
export type SignalSource = 'user_input' | 'integration' | 'analysis';

export interface RealitySignalPayload {
  rawText?: string;
  context?: string;
  metricsDetected?: string[];
  actionVerbsDetected?: string[];
  skillsExtracted?: string[];
  projectId?: string;
}

export interface RealitySignal {
  id: string;
  userId: string;
  type: SignalType;
  source: SignalSource;
  payload: RealitySignalPayload;
  confidence: number; // [0 - 1]
  createdAt: any;
}

export type SuggestionStatus = 'pending' | 'accepted' | 'rejected' | 'dismissed';

export interface DraftProof {
  before: string;
  action: string;
  result: string;
  causality: string;
  title?: string;
}

export interface ProofSuggestion {
  id: string;
  userId: string;
  signalIds: string[];
  suggestedSkill: string;
  suggestedProofType: string;
  draftProof: DraftProof;
  explanation: string;
  status: SuggestionStatus;
  createdAt: any;
  updatedAt: any;
}

export interface SkillTrajectory {
  skill: string;
  firstDetectedAt: string;
  lastDetectedAt: string;
  occurrenceCount: number;
  velocityScore: number; // [0 - 100] scale for personal visualization
  associatedImpacts: string[];
  trend: 'emerging' | 'accelerating' | 'consolidated';
}

export interface BiasAnalysisResult {
  hasDevaluationTerms: boolean;
  detectedTerms: string[];
  originalText: string;
  suggestedReformulation: string;
  impactGainEstimate: string;
  explanation: string;
}
