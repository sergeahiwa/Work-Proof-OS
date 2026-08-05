import { ModuleInput, ModuleOutput, ImpactLevel, ReliabilityLevel, TruthState } from './contract';
import { tracker } from '../../lib/internal-tracking';
import * as core from '../../core/reliability';

/**
 * Signal Translation Module
 * Internal logic for mapping technical KPIs to human-readable language.
 */

export async function execute(input: ModuleInput): Promise<ModuleOutput> {
  const startTime = Date.now();
  const { type, value } = input;
  let translation: any;

  switch (type) {
    case 'impact':
      translation = getImpactLabel(value);
      break;
    case 'confidence':
      translation = getConfidenceLabel(value);
      break;
    case 'truth':
      translation = getTruthStateLabel(value);
      break;
    case 'kpi':
      translation = translateKPI(value);
      break;
    case 'detailed_confidence':
      translation = core.getDetailedConfidenceExplanation(value);
      break;
    case 'global_confidence':
      const score = typeof value === 'number' ? value : (value.attributionConfidenceScore || value);
      translation = core.getGlobalConfidenceExplanation(score);
      break;
    default:
      translation = value;
  }

  const latency = Date.now() - startTime;

  const output: ModuleOutput = {
    translation,
    intent: 'translate_signal',
    metrics: {
      latency,
      confidence: 100,
      decisionWeight: 0.1
    },
    version: '1.1.0'
  };

  await tracker.log({
    timestamp: new Date().toISOString(),
    moduleId: 'signal-translation',
    intent: output.intent,
    version: output.version,
    metrics: output.metrics
  });

  return output;
}

function getImpactLabel(level: ImpactLevel | string): string {
  switch (level) {
    case 'high': return 'Impact Élevé';
    case 'medium': return 'Impact Significatif';
    case 'low': return 'Impact Modéré';
    default: return 'Impact non défini';
  }
}

function getConfidenceLabel(level: ReliabilityLevel | string): string {
  switch (level) {
    case 'highly_reliable': return 'Confiance Absolue';
    case 'reliable': return 'Niveau de Confiance Élevé';
    case 'uncertain': return 'Vérification en cours';
    case 'risky': return 'Attention requise';
    default: return 'Non vérifié';
  }
}

function getTruthStateLabel(state: TruthState): string {
  switch (state) {
    case 'verified': return 'Preuve validée';
    case 'probable': return 'Fortement probable';
    case 'disputed': return 'Contesté';
    case 'unverified': return 'En attente de preuve';
    default: return 'Inconnu';
  }
}

function translateKPI(key: string): string {
  const mapping: Record<string, string> = {
    leverageScore: 'Impact sur le projet',
    impactScore: 'Résultat produit',
    signalScore: 'Niveau de crédibilité',
    reliabilityScore: 'Indice de fiabilité',
    reputationScore: 'Score de confiance',
    rawScore: 'Volume de preuves',
    weightedScore: 'Valeur vérifiée',
    decision: 'Prise de décision',
    execution: 'Mise en œuvre',
    strategy: 'Vision stratégique',
    coordination: 'Coordination d\'équipe',
    knowledge: 'Capitalisation du Savoir',
    soft_procedure: 'Impact Procédures Molles',
    agility: 'Score Désapprentissage & Agilité',
    decisionVelocity: 'Vélocité Décisionnelle',
    optimization: 'Optimisation'
  };
  return mapping[key] || key;
}
