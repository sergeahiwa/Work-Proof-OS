import { db } from "../../lib/firebase";
import { collection, addDoc, serverTimestamp, query, getDocs } from "firebase/firestore";
import { generateProofEmbedding, calculateSimilarity } from "./gemini-embedding.service";
import { logEmbeddingAction, logShadowMetric } from "./embedding-logger";

/**
 * BLOC 1 — Service isolé
 * Responsabilité : Indexation et recherche sans impact sur le CORE.
 */
export async function indexProofVector(userId: string, proofId: string, proof: any) {
  try {
    const vector = await generateProofEmbedding({ ...proof, id: proofId, userId });
    if (vector.length === 0) {
      await logEmbeddingAction({
        type: "INDEXATION",
        contextType: "proof",
        entityId: proofId,
        userId,
        status: "FAIL",
        metadata: { reason: "empty_vector" }
      });
      return;
    }

    await addDoc(collection(db, "proof_vectors"), {
      userId,
      proofId,
      vector,
      timestamp: serverTimestamp()
    });

    await logEmbeddingAction({
      type: "INDEXATION",
      contextType: "proof",
      entityId: proofId,
      userId,
      status: "SUCCESS",
      metadata: {}
    });
    console.log(`[EMBEDDING_ENGINE] Indexed proof: ${proofId}`);
  } catch (error) {
    await logEmbeddingAction({
      type: "INDEXATION",
      contextType: "proof",
      entityId: proofId,
      userId,
      status: "FAIL",
      metadata: { error: String(error) }
    });
    throw error;
  }
}

/**
 * BLOC 5 — Similarité
 * Recherche de preuves similaires via cosine similarity.
 */
export async function findSimilarProofs(targetVector: number[], userId?: string, threshold: number = 0.75) {
  const snapshot = await getDocs(collection(db, "proof_vectors"));
  const results: { proofId: string; similarity: number }[] = [];
  
  let totalScore = 0;
  let highSimilarityCount = 0;
  let anomalyDetected = false;

  snapshot.docs.forEach(doc => {
    const data = doc.data();
    const simResult = calculateSimilarity(targetVector, data.vector);
    
    totalScore += simResult.score;
    
    // BLOC 3 — Shadow Intelligence (Anomalies)
    if (simResult.score > 0.95) {
      highSimilarityCount++;
      if (highSimilarityCount > 3) anomalyDetected = true; // Multiple near-identical matches
    }

    if (simResult.isRelevant) {
      results.push({ proofId: data.proofId, similarity: simResult.score });
    }
  });

  // BLOC 5 — Shadow Mode Analytics
  await logShadowMetric("SIMILARITY_QUERY_STATS", {
    queryCount: snapshot.size,
    relevantCount: results.length,
    averageSimilarity: snapshot.size > 0 ? totalScore / snapshot.size : 0,
    anomaliesCount: highSimilarityCount,
    anomalyDetected // BLOC 3
  });

  await logEmbeddingAction({
    type: "SIMILARITY_QUERY",
    contextType: "search",
    entityId: "batch",
    userId,
    status: "SUCCESS",
    metadata: { 
      resultsCount: results.length,
      totalScanned: snapshot.size,
      anomalyDetected
    }
  });

  return results.sort((a, b) => b.similarity - a.similarity);
}
