import { ModuleInput, ModuleOutput } from './contract';
import { tracker } from '../../lib/internal-tracking';
import * as core from '../../core/reliability';

/**
 * Proof Capture Module
 * Internal logic for capturing and anchoring proof events.
 */

export async function execute(input: ModuleInput): Promise<ModuleOutput> {
  const startTime = Date.now();
  const { outcome, type, actorId, economicValue } = input;
  
  const event = core.captureProofEvent(outcome, type, actorId, economicValue);

  const latency = Date.now() - startTime;
  const confidence = outcome.isLockedToPlatform ? 100 : 60;
  const decisionWeight = type === 'economic_activity_signal' ? 0.9 : 0.4;

  const output: ModuleOutput = {
    event,
    intent: 'capture_proof_event',
    metrics: {
      latency,
      confidence,
      decisionWeight
    },
    version: '1.1.0'
  };

  // Internal tracking
  await tracker.log({
    timestamp: event.timestamp,
    moduleId: 'proof-capture',
    intent: output.intent,
    version: output.version,
    metrics: output.metrics
  });

  return output;
}
