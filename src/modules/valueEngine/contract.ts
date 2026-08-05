import { Contribution, MarketValueSignature, ProjectValueGraph } from '../../types';

export interface ModuleInput {
  contributions: Contribution[];
}

export interface ModuleOutput {
  signature: MarketValueSignature;
  graph?: ProjectValueGraph;
  intent: 'calculate_market_value';
  metrics: {
    latency: number;
    confidence: number;
    decisionWeight: number;
  };
  version: string;
}
