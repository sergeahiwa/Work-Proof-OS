import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  query, 
  where, 
  getDocs, 
  doc, 
  updateDoc, 
  increment,
  getDoc,
  runTransaction
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { Proof, ProofValidation, Anomaly, User } from '../types';
import { SCORING_CONFIG } from '../config/scoring.config';
import { detectCollusion, calculateCollusionPenalty, logCollusionSuspicion } from './collusionService';

const VALIDATOR_WEIGHTS = {
  peer: 1.0,
  manager: 2.5,
  client: 2.0,
  automated: 1.5
};

/**
 * BLOC 4 & 5 — UPDATE TEMPS RÉEL & CONSISTENCE
 * Refactorisation O(1) via transactions et agrégats incrémentaux.
 */
export async function addProofValidation(
  userId: string, 
  proofId: string, 
  validation: Omit<ProofValidation, 'id' | 'timestamp'>
) {
  try {
    // Anti Auto-Validation
    if (auth.currentUser?.uid === userId) {
      throw new Error("You cannot validate your own proof.");
    }

    const weight = VALIDATOR_WEIGHTS[validation.validatorType as keyof typeof VALIDATOR_WEIGHTS] || 1.0;
    
    // ANALYTICS ONLY: La collusion est détectée pour l'audit mais n'ajuste pas le score.
    // Source unique de vérité pour le score = Validations humaines pondérées.
    const collusionSignals = await detectCollusion(userId, validation.validatorId);
    const penalty = calculateCollusionPenalty(collusionSignals);

    const proofRef = doc(db, `users/${userId}/proofs/${proofId}`);
    const userRef = doc(db, `users/${userId}`);
    const validationRef = doc(collection(db, `users/${userId}/proofs/${proofId}/validations`));

    await runTransaction(db, async (transaction) => {
      const proofSnap = await transaction.get(proofRef);
      const userSnap = await transaction.get(userRef);

      if (!proofSnap.exists() || !userSnap.exists()) {
        throw new Error("Proof or User not found.");
      }

      const proofData = proofSnap.data() as Proof;
      const userData = userSnap.data() as User;

      // 1. Update Proof Aggregate (Source unique de vérité : Validations Humaines)
      const oldAggregate = proofData.scoreAggregate || { totalWeightedScore: 0, totalWeight: 0, validationCount: 0 };
      const oldProofScore = proofData.weightedScore || 0;

      let newTotalWeightedScore = oldAggregate.totalWeightedScore;
      let newTotalWeight = oldAggregate.totalWeight + weight;
      
      if (validation.status === 'approved') {
        newTotalWeightedScore += (100 * weight);
      }

      const newProofScore = newTotalWeight > 0 ? Math.round(newTotalWeightedScore / newTotalWeight) : 0;

      // 2. Update User Aggregate (Incremental)
      const oldUserAggregate = userData.impactAggregate || { totalScore: 0, proofCount: 0 };
      let newUserTotalScore = oldUserAggregate.totalScore;
      let newUserProofCount = oldUserAggregate.proofCount;

      // Si le score de la preuve a changé, on ajuste le total utilisateur
      if (newProofScore !== oldProofScore) {
        // Si l'ancienne preuve n'était pas comptée (score 0)
        if (oldProofScore === 0 && newProofScore > 0) {
          newUserProofCount += 1;
          newUserTotalScore += newProofScore;
        } 
        // Si elle était comptée et reste comptée
        else if (oldProofScore > 0 && newProofScore > 0) {
          newUserTotalScore = newUserTotalScore - oldProofScore + newProofScore;
        }
        // Si elle était comptée et devient 0
        else if (oldProofScore > 0 && newProofScore === 0) {
          newUserProofCount -= 1;
          newUserTotalScore -= oldProofScore;
        }
      }

      const newImpactScore = newUserProofCount > 0 ? Math.round(newUserTotalScore / newUserProofCount) : 0;

      // 3. Write Operations
      transaction.set(validationRef, {
        ...validation,
        weight,
        timestamp: serverTimestamp()
      });

      transaction.update(proofRef, {
        weightedScore: newProofScore,
        confidenceScore: newProofScore,
        scoreAggregate: {
          totalWeightedScore: newTotalWeightedScore,
          totalWeight: newTotalWeight,
          validationCount: oldAggregate.validationCount + 1
        },
        updatedAt: serverTimestamp()
      });

      transaction.update(userRef, {
        impactScore: newImpactScore,
        marketTrustIndex: newImpactScore,
        impactAggregate: {
          totalScore: newUserTotalScore,
          proofCount: newUserProofCount
        },
        updatedAt: serverTimestamp()
      });

      // BLOC 6 — AUDIT TRAIL
      const auditRef = doc(collection(db, 'audit_logs'));
      transaction.set(auditRef, {
        userId,
        action: 'SCORE_INCREMENTAL_UPDATE',
        details: `Proof ${proofId}: ${oldProofScore}->${newProofScore}. User Impact: ${userData.impactScore}->${newImpactScore}. Collusion Penalty: ${penalty * 100}%`,
        traceId: `tr_${Date.now()}_inc_${proofId}`,
        timestamp: serverTimestamp()
      });
    });

    // BLOC 5 — AUDIT LOGS / Passive (AURION Rollback check)
    try {
      await logCollusionSuspicion(userId, validation.validatorId, penalty, collusionSignals);
    } catch (e) {
      console.error("[OBSERVATION] Collusion logging failure - CORE unaffected", e);
    }

    return validationRef.id;
  } catch (error) {
    console.error("Failed to add validation incrementally", error);
    throw error;
  }
}

/**
 * BLOC 1 — FULL RECOMPUTE ENGINE
 * Recalcule le score exact depuis la source de vérité (O(N)).
 */
export async function recomputeUserScore(userId: string): Promise<{ impactScore: number; proofScores: Record<string, number> }> {
  const proofsRef = collection(db, `users/${userId}/proofs`);
  const proofsSnap = await getDocs(proofsRef);
  
  let userTotalScore = 0;
  let userProofCount = 0;
  const proofScores: Record<string, number> = {};

  for (const pDoc of proofsSnap.docs) {
    const proofId = pDoc.id;
    const validationsRef = collection(db, `users/${userId}/proofs/${proofId}/validations`);
    const vSnap = await getDocs(validationsRef);
    
    let pTotalWeightedScore = 0;
    let pTotalWeight = 0;

    vSnap.docs.forEach(vDoc => {
      const vData = vDoc.data() as ProofValidation;
      const weight = vData.weight || 1.0;
      if (vData.status === 'approved') {
        pTotalWeightedScore += (100 * weight);
        pTotalWeight += weight;
      } else if (vData.status === 'rejected') {
        pTotalWeight += weight;
      }
    });

    const finalPScore = pTotalWeight > 0 ? Math.round(pTotalWeightedScore / pTotalWeight) : 0;
    proofScores[proofId] = finalPScore;

    if (finalPScore > 0) {
      userTotalScore += finalPScore;
      userProofCount++;
    }
  }

  const finalImpactScore = userProofCount > 0 ? Math.round(userTotalScore / userProofCount) : 0;
  return { impactScore: finalImpactScore, proofScores };
}

/**
 * recalculateProofScore and updateUserGlobalScores are kept for manual recovery if needed.
 */
export async function recalculateProofScore(userId: string, proofId: string) {
  console.warn("recalculateProofScore is deprecated. Use incremental updates.");
  // Implementation remains for emergency recovery
  const validationsRef = collection(db, `users/${userId}/proofs/${proofId}/validations`);
  const snapshot = await getDocs(validationsRef);
  
  let totalWeightedScore = 0;
  let totalWeight = 0;
  
  snapshot.docs.forEach(doc => {
    const data = doc.data() as ProofValidation;
    if (data.status === 'approved') {
      totalWeightedScore += (100 * data.weight);
      totalWeight += data.weight;
    } else if (data.status === 'rejected') {
      totalWeight += data.weight;
    }
  });

  const finalScore = totalWeight > 0 ? Math.round(totalWeightedScore / totalWeight) : 0;

  const proofRef = doc(db, `users/${userId}/proofs/${proofId}`);
  await updateDoc(proofRef, {
    weightedScore: finalScore,
    confidenceScore: finalScore,
    scoreAggregate: {
      totalWeightedScore,
      totalWeight,
      validationCount: snapshot.size
    },
    updatedAt: serverTimestamp()
  });

  await updateUserGlobalScores(userId);
}

async function updateUserGlobalScores(userId: string) {
  const proofsRef = collection(db, `users/${userId}/proofs`);
  const snapshot = await getDocs(proofsRef);
  
  let totalScore = 0;
  let count = 0;
  
  snapshot.docs.forEach(doc => {
    const data = doc.data() as Proof;
    if (data.weightedScore && data.weightedScore > 0) {
      totalScore += data.weightedScore;
      count++;
    }
  });

  const avgImpact = count > 0 ? Math.round(totalScore / count) : 0;

  const userRef = doc(db, `users/${userId}`);
  await updateDoc(userRef, {
    impactScore: avgImpact,
    marketTrustIndex: avgImpact,
    impactAggregate: {
      totalScore,
      proofCount: count
    },
    updatedAt: serverTimestamp()
  });
}

/**
 * Bloc 4 — Signal Audit Engine (SAE) - Pure logging only
 */
export async function runAntiFraudCheck(userId: string, proofId: string, proofData: any) {
  const anomalies: Omit<Anomaly, 'id' | 'timestamp'>[] = [];

  // 1. KPI Incoherence check
  if (proofData.result && proofData.result.includes('%')) {
    const value = parseInt(proofData.result.match(/\d+/)?.[0] || '0');
    if (value > 500) {
      anomalies.push({
        userId,
        proofId,
        type: 'SUSPICIOUS_KPI',
        severity: 'medium',
        details: `KPI value (${value}%) seems abnormally high.`
      });
    }
  }

  // Log anomalies for audit trail (No mutation of User object)
  for (const anomaly of anomalies) {
    await addDoc(collection(db, 'anomalies'), {
      ...anomaly,
      timestamp: serverTimestamp()
    });
  }
}

/**
 * Bloc 6 — Export & Certificate
 */
export async function generateProofCertificate(userId: string, proofId: string) {
  const proofRef = doc(db, `users/${userId}/proofs/${proofId}`);
  const proofSnap = await getDoc(proofRef);
  const proofData = proofSnap.data() as Proof;

  if (!proofData || proofData.status !== 'preuve_verifiee') {
    throw new Error("Only verified proofs can be exported.");
  }

  // Simulate PDF generation and hash
  const hash = btoa(`${proofId}-${Date.now()}`).substring(0, 16);
  const exportUrl = `https://workproof.com/verify/${hash}`;

  const exportRef = await addDoc(collection(db, 'exports'), {
    userId,
    proofId,
    url: exportUrl,
    hash,
    createdAt: serverTimestamp()
  });

  return { id: exportRef.id, url: exportUrl, hash };
}
