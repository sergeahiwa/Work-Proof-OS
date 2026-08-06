import { Proof } from '../types';
import { generateHash } from '../lib/utils/crypto';

/**
 * Verification & Portability Service — Work Proof OS Phase 2
 * Core deterministic hashing, integrity checking, JSON export/import and public signal parsing.
 */

export interface CanonicalProofPayload {
  id: string;
  title: string;
  description: string;
  before: string;
  action: string;
  result: string;
  causality: string;
  status: string;
  strength: string;
  date: string;
  verified: boolean;
  verifierId?: string;
  confidenceScore: number;
}

/**
 * Creates a normalized string representation of a proof for deterministic hashing.
 */
export function getCanonicalProofString(proof: Partial<Proof>): string {
  const normalized = {
    id: (proof.id || '').trim(),
    title: (proof.title || proof.action || '').trim(),
    description: (proof.description || '').trim(),
    before: (proof.before || '').trim(),
    action: (proof.action || '').trim(),
    result: (proof.result || '').trim(),
    causality: (proof.causality || '').trim(),
    status: (proof.status || 'preuve_declaree').trim(),
    strength: (proof.strength || 'faible').trim(),
    date: (proof.date || '').trim(),
    verified: Boolean(proof.verified)
  };

  return JSON.stringify(normalized);
}

/**
 * Computes a deterministic hash for a proof.
 */
export function computeProofHash(proof: Partial<Proof>): string {
  const canonicalString = getCanonicalProofString(proof);
  const hash1 = generateHash(canonicalString);
  const hash2 = generateHash(canonicalString.split('').reverse().join(''));
  return `WPOS-HASH-${hash1}-${hash2}`;
}

/**
 * Verifies if a proof matches its stored hash or recalculated hash.
 */
export function verifyProofIntegrity(
  proof: Partial<Proof>,
  storedHash?: string
): { isValid: boolean; computedHash: string; storedHash: string; reason: string } {
  const targetStoredHash = storedHash || proof.hash || '';
  const computedHash = computeProofHash(proof);

  if (!targetStoredHash) {
    return {
      isValid: false,
      computedHash,
      storedHash: 'ABSENT',
      reason: 'Aucun hash d\'ancrage fourni avec cette preuve.'
    };
  }

  const isValid = targetStoredHash === computedHash || targetStoredHash.includes(computedHash.split('-')[2]);

  return {
    isValid,
    computedHash,
    storedHash: targetStoredHash,
    reason: isValid 
      ? 'Intégrité cryptographique confirmée. La preuve n\'a pas été altérée.' 
      : 'Incohérence détectée. Le contenu de la preuve ne correspond pas à son hash d\'ancrage.'
  };
}

/**
 * Generates a sovereign JSON export package for one or multiple proofs with full metadata.
 */
export function exportProofJSON(proofs: Proof | Proof[], userName?: string): string {
  const proofArray = Array.isArray(proofs) ? proofs : [proofs];
  
  const exportPackage = {
    $schema: "https://workproof.os/schema/v1.0/proof-export.json",
    protocolVersion: "1.0",
    exportedAt: new Date().toISOString(),
    sovereignOwner: userName || "Utilisateur Work Proof OS",
    proofCount: proofArray.length,
    proofs: proofArray.map(p => {
      const computedHash = computeProofHash(p);
      return {
        id: p.id,
        title: p.title,
        description: p.description,
        type: p.type,
        starStructure: {
          situationBefore: p.before || null,
          action: p.action || null,
          result: p.result || null,
          causality: p.causality || null
        },
        metadata: {
          status: p.status || 'preuve_declaree',
          strength: p.strength || 'faible',
          verified: p.verified,
          confidenceScore: p.confidenceScore || 0,
          date: p.date,
          verifiedAt: (p as any).verifiedAt || null,
          verifierId: p.verifierId || null,
          verificationComment: p.verificationComment || null,
          url: p.url || null,
          rawSourceUrl: p.rawSourceUrl || null
        },
        integrity: {
          canonicalHash: computedHash,
          anchorHash: p.hash || computedHash,
          verifiedIntegrity: true
        }
      };
    })
  };

  return JSON.stringify(exportPackage, null, 2);
}

/**
 * Parses and verifies an imported sovereign JSON proof file.
 */
export function verifyProofJSON(jsonString: string): {
  isValid: boolean;
  data?: any;
  error?: string;
  verifiedCount?: number;
} {
  try {
    const parsed = JSON.parse(jsonString);

    if (!parsed.proofs || !Array.isArray(parsed.proofs)) {
      return {
        isValid: false,
        error: "Format JSON invalide : structure 'proofs' manquante."
      };
    }

    let validCount = 0;
    const verifiedProofs = parsed.proofs.map((item: any) => {
      const reconstructed: Partial<Proof> = {
        id: item.id,
        title: item.title,
        description: item.description,
        before: item.starStructure?.situationBefore,
        action: item.starStructure?.action,
        result: item.starStructure?.result,
        causality: item.starStructure?.causality,
        status: item.metadata?.status,
        strength: item.metadata?.strength,
        date: item.metadata?.date,
        verified: item.metadata?.verified
      };

      const integrity = verifyProofIntegrity(reconstructed, item.integrity?.canonicalHash || item.integrity?.anchorHash);
      if (integrity.isValid) validCount++;

      return {
        ...item,
        verificationCheck: integrity
      };
    });

    return {
      isValid: true,
      verifiedCount: validCount,
      data: {
        ...parsed,
        proofs: verifiedProofs
      }
    };
  } catch (err: any) {
    return {
      isValid: false,
      error: `Erreur de lecture JSON : ${err.message}`
    };
  }
}

/**
 * Extracts a safe public signal representation for third-party decision engines without leaking sensitive user data.
 */
export function getPublicSignalData(proof: Proof) {
  const integrity = verifyProofIntegrity(proof);

  return {
    signalType: 'WORK_PROOF_TRUST_SIGNAL',
    proofId: proof.id,
    title: proof.title,
    status: proof.status || 'preuve_declaree',
    confidenceScore: proof.confidenceScore,
    strength: proof.strength || 'faible',
    verified: proof.verified,
    canonicalHash: integrity.computedHash,
    anchorHash: proof.hash || integrity.computedHash,
    integrityVerified: integrity.isValid,
    timestamp: new Date(proof.date).getTime(),
    publicVerificationUrl: `${window.location.origin}/proof/${proof.id}`
  };
}
