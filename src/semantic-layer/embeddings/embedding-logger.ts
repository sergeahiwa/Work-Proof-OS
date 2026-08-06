import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../lib/firebase";

export type EmbeddingLogType = "EMBEDDING_GENERATION" | "SIMILARITY_QUERY" | "INDEXATION";
export type EmbeddingContext = "proof" | "validation" | "search" | "system";

export interface EmbeddingLogEntry {
  type: EmbeddingLogType;
  contextType: EmbeddingContext;
  userId?: string;
  tenantId?: string;
  entityId: string;
  status: "SUCCESS" | "FAIL";
  metadata: Record<string, any>;
  timestamp?: any;
}

export async function logEmbeddingAction(entry: EmbeddingLogEntry) {
  try {
    await addDoc(collection(db, "embedding_logs"), {
      ...entry,
      timestamp: serverTimestamp()
    });
  } catch (error) {
    console.error("[EMBEDDING_LOGGER] Failed to log action:", error);
  }
}

export async function logShadowMetric(
  metricType: string,
  value: any,
  metadata: Record<string, any> = {}
) {
  try {
    await addDoc(collection(db, "embedding_shadow_metrics"), {
      metricType,
      value,
      metadata,
      timestamp: serverTimestamp()
    });
  } catch (error) {
    console.error("[EMBEDDING_LOGGER] Failed to log shadow metric:", error);
  }
}
