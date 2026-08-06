import { collection, getDocs, doc, updateDoc, writeBatch } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { ensureTrustFactors, DEFAULT_TRUST_FACTORS } from '../core/dataIntegrity';

/**
 * Migration Script: Normalizes trustFactors for all users in Firestore.
 * This ensures that legacy data is consistent with the new strict model.
 */

export async function migrateUserTrustFactors() {
  console.log('--- STARTING MIGRATION: trustFactors Normalization ---');
  const usersCollection = collection(db, 'users');
  const snapshot = await getDocs(usersCollection);
  
  let totalUsers = 0;
  let correctedUsers = 0;
  let anomaliesDetected = 0;
  const batch = writeBatch(db);

  snapshot.forEach((userDoc) => {
    totalUsers++;
    const userData = userDoc.data();
    const userId = userDoc.id;

    if (!userData.trustFactors || typeof userData.trustFactors !== 'object') {
      anomaliesDetected++;
      console.log(`[ANOMALY_DETECTED] User ${userId} missing trustFactors.`);
    }

    const normalizedUser = ensureTrustFactors({ ...userData, id: userId });
    
    // Check if update is needed
    const needsUpdate = JSON.stringify(normalizedUser.trustFactors) !== JSON.stringify(userData.trustFactors);

    if (needsUpdate) {
      correctedUsers++;
      batch.update(doc(db, 'users', userId), {
        trustFactors: normalizedUser.trustFactors,
        isNormalized: true,
        lastMigrationAt: new Date().toISOString()
      });
      console.log(`[MIGRATION_APPLIED] User ${userId} normalized.`);
    }
  });

  if (correctedUsers > 0) {
    await batch.commit();
  }

  const report = `
# Migration Log: trustFactors Normalization
**Date:** ${new Date().toISOString()}
**Total Users Scanned:** ${totalUsers}
**Anomalies Detected (Missing trustFactors):** ${anomaliesDetected}
**Users Corrected/Normalized:** ${correctedUsers}
**Status:** SUCCESS
  `;

  console.log('--- MIGRATION COMPLETE ---');
  console.log(report);
  
  return report;
}
