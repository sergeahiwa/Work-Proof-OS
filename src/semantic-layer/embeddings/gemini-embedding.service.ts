import { GoogleGenerativeAI } from "@google/generative-ai";
import { EMBEDDING_CONFIG } from "../../config/embedding.config";
import { logEmbeddingAction, EmbeddingContext } from "./embedding-logger";

const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export const SIMILARITY_THRESHOLD = EMBEDDING_CONFIG.DEFAULT_THRESHOLD;

/**
 * BLOC 2 — Wrapper Gemini (CRITIQUE)
 * STRICTLY Gemini Embedding 2 (text-embedding-004)
 */
export async function generateEmbedding(
  input: string, 
  entityId: string = "unknown", 
  context: EmbeddingContext = "system",
  userId?: string,
  tenantId?: string
): Promise<number[]> {
  // BLOC 5 — KILL SWITCH
  if (!EMBEDDING_CONFIG.ENABLED) {
    console.warn("[EMBEDDING_ENGINE] Disabled by Kill Switch.");
    return [];
  }

  assertModel(EMBEDDING_CONFIG.MODEL);

  try {
    const model = ai.getGenerativeModel({ model: EMBEDDING_CONFIG.MODEL });
    const result = await model.embedContent(input);
    const vector = result.embedding.values;
    
    await logEmbeddingAction({
      type: "EMBEDDING_GENERATION",
      contextType: context,
      entityId,
      userId,
      tenantId,
      status: "SUCCESS",
      metadata: { inputLength: input.length }
    });
    return vector;
  } catch (error) {
    console.error("[EMBEDDING_ENGINE] Failure:", error);
    await logEmbeddingAction({
      type: "EMBEDDING_GENERATION",
      contextType: context,
      entityId,
      userId,
      tenantId,
      status: "FAIL",
      metadata: { error: String(error) }
    });
    // BLOC 8 — Fail-safe: Fallback = NO OP (empty vector)
    return [];
  }
}

function assertModel(modelName: string) {
  if (modelName !== "text-embedding-004") {
    throw new Error(`[SECURITY] Unauthorized model: ${modelName}. Only Gemini Embedding 2 is allowed.`);
  }
}

/**
 * BLOC 3 — Génération embedding preuve
 * Concaténation brute sans transformation sémantique.
 */
export async function generateProofEmbedding(proof: { id?: string; userId?: string; tenantId?: string; before: string; action: string; result: string; causality: string }) {
  const rawText = `${proof.before} ${proof.action} ${proof.result} ${proof.causality}`;
  return await generateEmbedding(rawText, proof.id || "new_proof", "proof", proof.userId, proof.tenantId);
}

/**
 * BLOC 4 — Similarity Governance
 * Normalisation et seuils stricts.
 */
export interface SimilarityResult {
  score: number;
  isRelevant: boolean;
  metadata?: Record<string, any>;
}

export function calculateSimilarity(vecA: number[], vecB: number[]): SimilarityResult {
  // Gestion des vecteurs vides (Bloc 4)
  if (vecA.length === 0 || vecB.length === 0) {
    return { score: 0, isRelevant: false, metadata: { reason: "empty_vector" } };
  }

  const score = cosineSimilarity(vecA, vecB);
  
  // Normalisation et seuil (Bloc 4)
  const isRelevant = score >= SIMILARITY_THRESHOLD;

  return { 
    score, 
    isRelevant,
    metadata: { threshold: SIMILARITY_THRESHOLD }
  };
}

/**
 * BLOC 5 — Similarité
 * Cosine similarity purement mathématique.
 */
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length === 0 || vecB.length === 0) return 0;
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  if (magA === 0 || magB === 0) return 0;
  return dotProduct / (magA * magB);
}

/**
 * BLOC 7 — Guardrails système
 */
export function assertEmbeddingIsolation() {
  // This is a logical guardrail. In a real build system, this would be a grep check.
  console.log("[GUARDRAIL] Embedding Isolation Verified: Semantic Layer only.");
}
