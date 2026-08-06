import { 
  collection, 
  getDocs, 
  query, 
  where, 
  doc, 
  addDoc, 
  serverTimestamp,
  updateDoc
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { ProofValidation } from '../types';

/**
 * COLLUSION SERVICE : Purement PASSIF.
 * Ce service détecte les anomalies et les patterns de fraude potentielle.
 * IMPORTANT : Ses sorties sont utilisées uniquement pour le logging et l'audit.
 * IL N'INFLUENCE JAMAIS le calcul des scores en temps réel (Credibility Engine).
 */
export async function detectCollusion(userId: string, validatorId: string) {
  const signals = {
    mutualValidationRate: 0,
    validatorDiversity: 0,
    validationEntropy: 0,
    isCycle: false
  };

  try {
    // 1. Check for Cycles (A -> B -> A)
    // We check if the current user (userId) has ever validated the validator (validatorId)
    const validatorProofsRef = collection(db, `users/${validatorId}/proofs`);
    const proofsSnap = await getDocs(validatorProofsRef);
    
    let cycleCount = 0;
    for (const pDoc of proofsSnap.docs) {
      const validationsRef = collection(db, `users/${validatorId}/proofs/${pDoc.id}/validations`);
      const vSnap = await getDocs(query(validationsRef, where('validatorId', '==', userId)));
      if (!vSnap.empty) {
        cycleCount++;
      }
    }

    if (cycleCount > 0) {
      signals.isCycle = true;
    }

    // 2. Mutual Validation Rate
    // How many times have these two validated each other vs total validations
    const userValidationsRef = collection(db, "audit_logs"); // Using audit logs or a dedicated collection would be better, but let's scan validations
    // For simplicity in this bloc, we use a heuristic based on recent validations
    signals.mutualValidationRate = cycleCount > 2 ? 0.8 : 0.2;

    // 3. Validator Diversity
    // How many unique validators does the user have?
    const userProofsRef = collection(db, `users/${userId}/proofs`);
    const userProofsSnap = await getDocs(userProofsRef);
    const uniqueValidators = new Set<string>();
    let totalValidations = 0;

    for (const pDoc of userProofsSnap.docs) {
      const vSnap = await getDocs(collection(db, `users/${userId}/proofs/${pDoc.id}/validations`));
      vSnap.docs.forEach(v => {
        uniqueValidators.add(v.data().validatorId);
        totalValidations++;
      });
    }

    signals.validatorDiversity = totalValidations > 0 ? uniqueValidators.size / totalValidations : 1;
    
    return signals;
  } catch (error) {
    console.error("Collusion detection failed", error);
    return signals;
  }
}

/**
 * BLOC 3 — TRUST PENALTY
 */
export function calculateCollusionPenalty(signals: any): number {
  let penalty = 0;
  
  if (signals.isCycle) penalty += 0.3;
  if (signals.mutualValidationRate > 0.5) penalty += 0.4;
  if (signals.validatorDiversity < 0.2) penalty += 0.2;

  return Math.min(penalty, 0.9); // Max 90% penalty
}

/**
 * BLOC 5 — AUDIT LOGS
 */
export async function logCollusionSuspicion(userId: string, validatorId: string, penalty: number, details: any) {
  if (penalty > 0.1) {
    await addDoc(collection(db, 'anomalies'), {
      userId,
      type: 'COLLUSION_SUSPICION',
      severity: penalty > 0.5 ? 'high' : 'medium',
      details: `Suspicion of collusion with validator ${validatorId}. Potential penalty delta: ${penalty * 100}%.`,
      signals: details,
      timestamp: serverTimestamp()
    });
  }
}
