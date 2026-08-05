export const EMBEDDING_CONFIG = {
  ENABLED: true, // KILL SWITCH (Bloc 5)
  MODEL: "text-embedding-004", // Gemini Embedding 2 (v4 in SDK)
  MODE: "vector_only",
  DEFAULT_THRESHOLD: 0.75, // Calibrated threshold (Bloc 4)
  ISOLATION_LEVEL: "STRICT_SEMANTIC_ESCROW",
  KAIROS_COMPATIBLE: true
};
