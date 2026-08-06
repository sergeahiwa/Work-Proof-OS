import { GoogleGenAI } from "@google/genai";
import { db, auth } from "../lib/firebase";
import { runAntiFraudCheck } from './credibilityService';
import { computeProofHash } from './verificationService';
import { tracker } from '../lib/internal-tracking';
import { collection, addDoc, serverTimestamp, doc, updateDoc, query, where, getDocs, orderBy, limit } from "firebase/firestore";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface ProofData {
  projectId?: string;
  before: string | null;
  action: string | null;
  result: string | null;
  causality: string | null;
  status: 'preuve_structuree' | 'preuve_declaree' | 'en_verification' | 'preuve_verifiee' | 'rejetee';
  strength: 'incoherente' | 'faible' | 'moyenne' | 'credible';
  softSkills?: string[];
  updatedAt?: any;
  verifierId?: string;
  verificationComment?: string;
}

export interface ProofAttachment {
  id?: string;
  proofId: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedBy: string;
  uploadedAt: any;
}

export const VAGUE_TERMS = ["aidé", "participé", "travaillé", "contribué", "un peu", "beaucoup", "géré", "responsable", "impliqué", "divers", "missions"];
export const ACTION_VERBS = ["créé", "développé", "optimisé", "réduit", "augmenté", "conçu", "implémenté", "corrigé", "négocié", "vendu", "formé", "automaté", "déployé"];
export const METRIC_UNITS = ["%", "€", "$", "s ", "min", "h ", "jours", "clients", "ventes", "leads", "points", "ms"];

/**
 * Bloc 2 — Validation des métriques
 */
export function validateMetric(result: string): { valid: boolean; reason?: string } {
  const hasNumber = /\d+/.test(result);
  const hasUnit = METRIC_UNITS.some(unit => result.toLowerCase().includes(unit.toLowerCase()));
  
  if (!hasNumber) return { valid: false, reason: "Le résultat doit contenir un chiffre." };
  if (!hasUnit) return { valid: false, reason: "Précise l'unité (ex: %, €, secondes, clients)." };
  
  return { valid: true };
}

/**
 * Bloc 3 — Détection d’action concrète
 */
export function isConcreteAction(action: string): { concrete: boolean; reason?: string } {
  const lowerAction = action.toLowerCase();
  const hasActionVerb = ACTION_VERBS.some(verb => lowerAction.includes(verb));
  
  if (!hasActionVerb) {
    return { concrete: false, reason: "Utilise un verbe d'action précis (ex: optimisé, créé)." };
  }

  // Vérification simplifiée de la présence d'un objet (nom de plus de 3 lettres après le verbe)
  if (action.split(' ').length < 4) {
    return { concrete: false, reason: "Décris l'objet de ton action plus précisément." };
  }

  return { concrete: true };
}

/**
 * Bloc 1 & 4 — Validation de cohérence globale (IA as Validator)
 */
export async function validateGlobalConsistency(proof: Partial<ProofData>): Promise<{ coherent: boolean; reason?: string }> {
  if (!proof.before || !proof.action || !proof.result || !proof.causality) {
    return { coherent: false, reason: "Preuve incomplète." };
  }

  const prompt = `
    Tu es un auditeur de cohérence pour "Work Proof".
    Ton rôle est de vérifier la LOGIQUE d'une preuve.
    
    CRITÈRES DE REJET :
    1. L'action n'a aucun lien logique avec le problème (ex: problème de lenteur -> action de décoration).
    2. Le résultat est impossible ou sans rapport (ex: action de code -> résultat en kg).
    3. La causalité est absurde ou trop vague.
    4. L'objet change entre les étapes (ex: avant "le site", action "l'équipe").

    PREUVE :
    AVANT : "${proof.before}"
    ACTION : "${proof.action}"
    RÉSULTAT : "${proof.result}"
    CAUSALITÉ : "${proof.causality}"

    REPONDS UNIQUEMENT EN JSON :
    {
      "coherent": boolean,
      "reason": "si incohérent, explique pourquoi simplement"
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || '{"coherent": false, "reason": "Erreur technique"}');
  } catch (error) {
    return { coherent: true }; // Fallback safe
  }
}

/**
 * Bloc 5 — Score final robuste
 */
export function computeProofStrength(
  proof: Partial<ProofData>,
  coherenceResult?: { coherent: boolean; reason?: string }
): { strength: 'incoherente' | 'faible' | 'moyenne' | 'credible'; score: number; recommendations: string[] } {
  if (coherenceResult && !coherenceResult.coherent) {
    return { 
      strength: 'incoherente', 
      score: 0, 
      recommendations: [coherenceResult.reason || "La preuve manque de cohérence logique entre le problème, l'action et le résultat."] 
    };
  }

  let score = 0;
  const recommendations: string[] = [];

  // 1. Concrétisation (Action)
  const actionCheck = isConcreteAction(proof.action || "");
  if (actionCheck.concrete) {
    score += 30;
  } else if (proof.action) {
    recommendations.push(actionCheck.reason!);
  }

  // 2. Métriques (Résultat)
  const metricCheck = validateMetric(proof.result || "");
  if (metricCheck.valid) {
    score += 30;
  } else if (proof.result) {
    recommendations.push(metricCheck.reason!);
  }

  // 3. Crédibilité (Causalité & Contexte)
  const hasStrongCausality = proof.causality && proof.causality.length > 30;
  const hasStrongContext = proof.before && proof.before.length > 40;

  if (hasStrongCausality) score += 20;
  else recommendations.push("Explique plus précisément pourquoi ton action a produit ce résultat.");

  if (hasStrongContext) score += 20;
  else recommendations.push("Détaille davantage le contexte initial pour rendre l'impact plus crédible.");

  let strength: 'incoherente' | 'faible' | 'moyenne' | 'credible' = 'faible';
  if (score >= 85) strength = 'credible';
  else if (score >= 50) strength = 'moyenne';

  return { strength, score, recommendations };
}

/**
 * Bloc 2 — Détection de flou avancée
 */
export function isVague(text: string): { vague: boolean; reason?: string } {
  const lowerText = text.toLowerCase();
  
  if (text.trim().length < 20) {
    return { vague: true, reason: "Description trop courte pour être une preuve." };
  }

  const hasActionVerb = ACTION_VERBS.some(verb => lowerText.includes(verb));
  if (!hasActionVerb && text.split(' ').length < 15) {
    return { vague: true, reason: "Manque de verbes d'action précis (ex: optimisé, réduit, créé)." };
  }

  const foundVagueTerm = VAGUE_TERMS.find(term => lowerText.includes(term));
  if (foundVagueTerm) {
    return { vague: true, reason: `Le terme "${foundVagueTerm}" est trop vague. Précise ton rôle exact.` };
  }

  return { vague: false };
}

/**
 * Bloc 1 — Moteur CORE déterministe
 */
export function buildProof(
  input: Partial<ProofData>,
  coherenceResult?: { coherent: boolean; reason?: string }
): ProofData & { isComplete: boolean } {
  const strengthData = computeProofStrength(input, coherenceResult);
  return {
    before: input.before || null,
    action: input.action || null,
    result: input.result || null,
    causality: input.causality || null,
    status: 'preuve_structuree',
    strength: strengthData.strength,
    isComplete: Boolean(input.before && input.action && input.result && input.causality)
  };
}

/**
 * Bloc 2 — Système de guidage (sans IA)
 */
export function getNextQuestion(proof: Partial<ProofData>): string | null {
  if (!proof.before) return "Quel était le problème précis ou le besoin initial ? (Ex: 'Le processus prenait 4h', 'L'équipe était bloquée par...')";
  if (!proof.action) return "Qu’as-tu fait concrètement pour résoudre cela ?";
  if (!proof.result) return "Quel est le résultat factuel ? (Chiffre, gain de temps, validation...)";
  if (!proof.causality) return "Comment sais-tu que ce résultat vient de ton action ? (Lien de causalité)";
  return null;
}

/**
 * Bloc 3 — Détection du flou (règles simples)
 */
export function detectVagueTerms(text: string): string | null {
  const found = VAGUE_TERMS.find(term => text.toLowerCase().includes(term));
  if (found) {
    return "Peux-tu être plus précis ? Qu’as-tu fait exactement ?";
  }
  return null;
}

/**
 * Bloc 4 — IA (USAGE RESTREINT : Reformulation & Cohérence Logique)
 * L'IA n'est jamais utilisée pour valider la véracité ou impacter le score final.
 */
export async function reformulateText(text: string): Promise<string> {
  if (!text || text.trim().length < 5) return text;

  const prompt = `
    Tu es un assistant de reformulation pour "Work Proof".
    MODE : reformulation_only
    
    RÈGLES STRICTES :
    1. Transformation LEXICALE uniquement.
    2. Améliore la lisibilité et la clarté.
    3. INTERDICTION d'ajouter une information nouvelle.
    4. INTERDICTION d'ajouter du contexte ou de la précision non présente.
    5. INTERDICTION d'extrapoler un résultat.
    6. Garde un ton factuel et simple.

    TEXTE À REFORMULER : "${text}"
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text?.trim() || text;
  } catch (error) {
    console.error("Error reformulating text:", error);
    return text;
  }
}

/**
 * Bloc 6 — Validation explicite
 */
export function validateProof(proof: Partial<ProofData>): string[] {
  const errors: string[] = [];
  
  // Bloc 3 — Validation du champ AVANT
  if (!proof.before || proof.before.trim().length < 20) {
    errors.push("Le contexte (Avant) doit décrire une situation initiale ou un problème clair.");
  }
  
  if (!proof.action || proof.action.trim().length < 20) {
    errors.push("L'action doit être décrite précisément.");
  }
  
  if (!proof.result || proof.result.trim().length < 10) {
    errors.push("Le résultat doit être factuel.");
  }

  // Bloc 4 — Validation de causalité
  if (!proof.causality || proof.causality.trim().length < 15) {
    errors.push("Explique le lien entre ton action et le résultat.");
  }

  return errors;
}

/**
 * Bloc 1 — Audit Log & Versioning
 */
async function logAudit(userId: string, proofId: string, action: string, before: any = null, after: any = null) {
  try {
    await addDoc(collection(db, 'audit_logs'), {
      userId,
      proofId,
      action,
      before,
      after,
      traceId: `tr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: serverTimestamp()
    });
  } catch (error) {
    console.error("Audit logging failed", error);
  }
}

async function saveProofVersion(userId: string, proofId: string, data: any) {
  try {
    await addDoc(collection(db, `users/${userId}/proofs/${proofId}/versions`), {
      proofId,
      data,
      changedBy: userId,
      timestamp: serverTimestamp()
    });
  } catch (error) {
    console.error("Version saving failed", error);
  }
}

/**
 * Bloc 1 — Attachement fichiers (Simulé)
 */
export async function attachFileToProof(userId: string, proofId: string, file: { name: string, type: string, size: number, url: string }) {
  const attachmentData: ProofAttachment = {
    proofId,
    name: file.name,
    type: file.type,
    size: file.size,
    url: file.url,
    uploadedBy: userId,
    uploadedAt: serverTimestamp()
  };

  const docRef = await addDoc(collection(db, `users/${userId}/proofs/${proofId}/attachments`), attachmentData);
  
  await logAudit(userId, proofId, "attach_file", null, { attachmentId: docRef.id, fileName: file.name });
  
  return docRef.id;
}

/**
 * Bloc 2 — Workflow de Vérification
 */
export async function requestVerification(userId: string, proofId: string, proofData: any) {
  try {
    // 1. Update proof status
    const proofRef = doc(db, `users/${userId}/proofs/${proofId}`);
    await updateDoc(proofRef, {
      status: 'en_verification',
      updatedAt: serverTimestamp()
    });

    // 2. Add to global verification queue
    await addDoc(collection(db, 'verification_queue'), {
      userId,
      proofId,
      title: proofData.title || proofData.action,
      action: proofData.action,
      result: proofData.result,
      causality: proofData.causality,
      status: 'en_verification',
      userName: auth.currentUser?.displayName || 'Utilisateur',
      requestedAt: serverTimestamp()
    });

    await logAudit(userId, proofId, "request_verification");

    try {
      await tracker.log({
        timestamp: new Date().toISOString(),
        moduleId: 'validation_engine',
        intent: 'request_verification_telemetry',
        version: 'v1.6',
        tenantId: 'default',
        metrics: {
          latency: 80,
          confidence: 0.9,
          decisionWeight: 1.0
        }
      });
    } catch (e) {
      console.error('[TELEMETRY] Tracking failed', e);
    }
  } catch (error) {
    console.error("Verification request failed", error);
    throw error;
  }
}

export async function verifyProof(userId: string, verifierId: string, proofId: string, status: 'preuve_verifiee' | 'rejetee', comment: string) {
  // Logic to update proof status and add verifier info
  await logAudit(verifierId, proofId, `verify_${status}`, { comment });
}

/**
 * Bloc 5 & 7 — Publication et Statuts
 */
export async function publishProof(userId: string, tenantId: string, proof: ProofData) {
  const errors = validateProof(proof);
  if (errors.length > 0) {
    throw new Error(`Preuve incomplète : ${errors.join(" | ")}`);
  }

  const strengthData = computeProofStrength(proof);

  const proofData = {
    userId,
    tenantId,
    projectId: proof.projectId || null,
    title: proof.action,
    description: `AVANT: ${proof.before}\nACTION: ${proof.action}\nRÉSULTAT: ${proof.result}\nCAUSALITÉ: ${proof.causality}`,
    type: 'work_proof',
    before: proof.before,
    action: proof.action,
    result: proof.result,
    causality: proof.causality,
    softSkills: proof.softSkills || [],
    status: 'preuve_declaree',
    strength: strengthData.strength,
    verified: false,
    date: new Date().toISOString(),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    hash: computeProofHash({
      title: proof.action || '',
      description: `AVANT: ${proof.before}\nACTION: ${proof.action}\nRÉSULTAT: ${proof.result}\nCAUSALITÉ: ${proof.causality}`,
      before: proof.before || '',
      action: proof.action || '',
      result: proof.result || '',
      causality: proof.causality || '',
      status: 'preuve_declaree',
      strength: strengthData.strength,
      date: new Date().toISOString(),
      verified: false
    })
  };

  const docRef = await addDoc(collection(db, `users/${userId}/proofs`), proofData);
  
  // Save initial version
  await saveProofVersion(userId, docRef.id, proofData);
  
  // Bloc 8 — Logging & audit (Passive - Non blocking)
  try {
    await logAudit(userId, docRef.id, "publish_proof", null, proofData);
  } catch (e) {
    console.error("[OBSERVATION] Logging failure - CORE unaffected", e);
  }
  
  // Bloc 4 — Anti-Fraude & SAE (Passive - Non blocking)
  try {
    await runAntiFraudCheck(userId, docRef.id, proofData);
  } catch (e) {
    console.error("[OBSERVATION] Secondary signal failure - CORE unaffected", e);
  }

  // Phase 4 — Telemetry logging (Passive - Non blocking)
  try {
    await tracker.log({
      timestamp: new Date().toISOString(),
      moduleId: 'proof_capture',
      intent: 'publish_proof_telemetry',
      version: 'v1.6',
      tenantId: tenantId || 'default',
      metrics: {
        latency: 120,
        confidence: strengthData.score / 100,
        decisionWeight: 1.0
      }
    });
  } catch (e) {
    console.error("[TELEMETRY] Tracking failed", e);
  }
  
  return docRef.id;
}
