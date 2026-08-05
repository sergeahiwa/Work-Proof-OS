import { RecruitmentOutcome, ValidationSource } from '../../types';

export interface ModuleInput {
  outcome: RecruitmentOutcome;
}

export interface ModuleOutput {
  anomalies: string[];
  validationSources: ValidationSource[];
  penalty: number;
  intent: 'analyze_trust';
  metrics: {
    latency: number;
    confidence: number;
    decisionWeight: number;
  };
  version: string;
}
