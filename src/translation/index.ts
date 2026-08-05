import { ReliabilityLevel, ImpactLevel, TruthState, RecruitmentOutcome } from '../types';
import { calculateAttributionScore, generateValidationSources } from '../core/reliability';

/**
 * Translation Layer
 * Maps internal KPIs and technical terms into universal, human-readable language.
 * This is the ONLY layer the UX should interact with for display strings.
 */

// --- Impact Translation ---

export const getImpactLabel = (level: ImpactLevel | string): string => {
  switch (level) {
    case 'high': return 'Impact Élevé';
    case 'medium': return 'Impact Significatif';
    case 'low': return 'Impact Modéré';
    default: return 'Impact non défini';
  }
};

export const explainImpact = (score: number): string => {
  if (score >= 80) return "Cette réalisation a débloqué une valeur majeure pour l'organisation.";
  if (score >= 50) return "Cette contribution a eu un effet direct et mesurable sur les résultats.";
  return "Cette action a soutenu le bon fonctionnement des opérations.";
};

// --- Reliability / Confidence Translation ---

export const getConfidenceLabel = (level: ReliabilityLevel | string): string => {
  switch (level) {
    case 'highly_reliable': return 'Confiance Absolue';
    case 'reliable': return 'Niveau de Confiance Élevé';
    case 'uncertain': return 'Vérification en cours';
    case 'risky': return 'Attention requise';
    default: return 'Non vérifié';
  }
};

export const getTruthStateLabel = (state: TruthState): string => {
  switch (state) {
    case 'verified': return 'Preuve validée';
    case 'probable': return 'Fortement probable';
    case 'disputed': return 'Contesté';
    case 'unverified': return 'En attente de preuve';
    default: return 'Inconnu';
  }
};

// --- KPI Mapping (Internal to Universal) ---

export const translateKPI = (key: string): string => {
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
    optimization: 'Optimisation'
  };
  return mapping[key] || key;
};

// --- Detailed Explanations for UX ---

export const getDetailedConfidenceExplanation = (outcome: RecruitmentOutcome) => {
  const sources = outcome.validationSources && outcome.validationSources.length > 0 
    ? outcome.validationSources 
    : generateValidationSources(outcome);

  const labelMapping: Record<string, string> = {
    'causal_technical': 'Traçabilité des échanges',
    'human_confirmation': 'Validation par les pairs',
    'external_signals': 'Signaux externes (LinkedIn, etc.)',
    'market_validation': 'Réputation sur le marché'
  };

  return sources.map(s => ({
    label: labelMapping[s.label] || s.label,
    percentage: s.confidence,
    weight: Math.round(s.weight * 100),
    status: s.status
  }));
};

export const getGlobalConfidenceExplanation = (outcome: RecruitmentOutcome): string => {
  const score = calculateAttributionScore(outcome);
  if (score >= 85) return "Profil hautement vérifié avec des preuves multi-sources.";
  if (score >= 65) return "Profil fiable avec des confirmations solides.";
  if (score >= 40) return "Profil en cours de consolidation.";
  return "Niveau de preuve insuffisant pour une recommandation automatique.";
};
