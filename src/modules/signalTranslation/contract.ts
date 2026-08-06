import { ReliabilityLevel, ImpactLevel, TruthState } from '../../types';

export interface ModuleInput {
  type: 'impact' | 'confidence' | 'truth' | 'kpi' | 'detailed_confidence' | 'global_confidence';
  value: any;
}

export interface ModuleOutput {
  translation: any;
  intent: 'translate_signal';
  metrics: {
    latency: number;
    confidence: number;
    decisionWeight: number;
  };
  version: string;
}

export type { ImpactLevel, ReliabilityLevel, TruthState };
