export interface ContractRule {
  id: string;
  description: string;
  files: string[];
  patterns: {
    forbidden?: RegExp[];
    required?: RegExp[];
  };
}

export const RULES: ContractRule[] = [
  {
    id: 'COLLUSION_PASSIVE',
    description: 'Collusion service must remain passive (no score modification).',
    files: ['src/services/collusionService.ts'],
    patterns: {
      forbidden: [
        /updateDoc.*score/i,
        /setDoc.*score/i,
        /weightedScore/i,
        /impactScore/i
      ]
    }
  },
  {
    id: 'AI_NO_SCORING',
    description: 'AI output must only be used for text reformulation, never for scoring.',
    files: ['src/services/proofService.ts'],
    patterns: {
      forbidden: [
        /parse.*aiResponse.*score/i,
        /Number\(aiResponse\)/i,
        /parseFloat\(aiResponse\)/i
      ]
    }
  },
  {
    id: 'CREDIBILITY_TRANSACTIONAL',
    description: 'Credibility service updates must be wrapped in runTransaction.',
    files: ['src/services/credibilityService.ts'],
    patterns: {
      required: [
        /runTransaction/
      ]
    }
  }
];
