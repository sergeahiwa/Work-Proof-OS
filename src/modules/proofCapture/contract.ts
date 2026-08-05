import { RecruitmentOutcome, CommitmentType, ProofEvent } from '../../types';

export interface ModuleInput {
  outcome: RecruitmentOutcome;
  type: CommitmentType;
  actorId: string;
  economicValue?: number;
}

export interface ModuleOutput {
  event: ProofEvent;
  intent: 'capture_proof_event';
  metrics: {
    latency: number;
    confidence: number;
    decisionWeight: number;
  };
  version: string;
}
