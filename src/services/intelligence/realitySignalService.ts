import { db } from "../../lib/firebase";
import { collection, addDoc, getDocs, query, where, orderBy, serverTimestamp, doc, updateDoc } from "firebase/firestore";
import { GoogleGenAI } from "@google/genai";
import { RealitySignal, RealitySignalPayload, SignalSource, SignalType } from "./types";

const ACTION_VERBS_REGEX = /(créé|développé|optimisé|réduit|augmenté|conçu|implémenté|corrigé|négocié|vendu|formé|automatisé|déployé|géré|dirigé|structuré|migré|lancé|résolu)/gi;
const METRICS_REGEX = /(\d+(?:[.,]\d+)?\s*(?:%|€|\$|k€|M€|s|min|h|heures|jours|clients|ventes|leads|points|ms|utilisateurs|requêtes))/gi;
const SKILL_KEYWORDS = [
  "React", "TypeScript", "Node.js", "Python", "SQL", "PostgreSQL", "Firebase", 
  "System Architecture", "Leadership", "Agile", "DevOps", "CI/CD", "Docker",
  "UI/UX Design", "Product Management", "Data Analysis", "API Design", "Security"
];

// Memory store for offline / unauthenticated fallback
let localSignalsStore: RealitySignal[] = [
  {
    id: "sig-demo-1",
    userId: "demo-user",
    type: "activity",
    source: "user_input",
    payload: {
      rawText: "J'ai automatisé le pipeline CI/CD du projet Titan, réduisant le temps de déploiement de 45 minutes à 8 minutes pour 12 développeurs.",
      context: "Projet Titan - Infrastructure CI/CD",
      metricsDetected: ["45 minutes", "8 minutes", "12 développeurs"],
      actionVerbsDetected: ["automatisé", "réduisant"],
      skillsExtracted: ["DevOps", "CI/CD", "Automation"]
    },
    confidence: 0.92,
    createdAt: new Date().toISOString()
  },
  {
    id: "sig-demo-2",
    userId: "demo-user",
    type: "skill_emergence",
    source: "analysis",
    payload: {
      rawText: "Optimisation de requêtes SQL sur une base de 5M de lignes, gain de performance de 65% sur l'API Search.",
      context: "Backend Data Optimisation",
      metricsDetected: ["5M de lignes", "65%"],
      actionVerbsDetected: ["Optimisation"],
      skillsExtracted: ["SQL", "PostgreSQL", "API Design", "Performance Tuning"]
    },
    confidence: 0.88,
    createdAt: new Date(Date.now() - 86400000).toISOString()
  }
];

export function extractSignalLocally(text: string, context?: string): RealitySignalPayload {
  const actionVerbsDetected = Array.from(new Set(text.match(ACTION_VERBS_REGEX) || []));
  const metricsDetected = Array.from(new Set(text.match(METRICS_REGEX) || []));
  
  const skillsExtracted = SKILL_KEYWORDS.filter(skill => 
    new RegExp(`\\b${skill}\\b`, 'i').test(text) || (context && new RegExp(`\\b${skill}\\b`, 'i').test(context))
  );

  return {
    rawText: text,
    context: context || "Saisie brute d'activité",
    metricsDetected,
    actionVerbsDetected,
    skillsExtracted: skillsExtracted.length > 0 ? skillsExtracted : ["Gestion de projet", "Exécution"]
  };
}

/**
  Reality Signal Capture Service
 */
export async function captureRealitySignal(
  userId: string,
  rawText: string,
  context?: string,
  type: SignalType = 'activity',
  source: SignalSource = 'user_input'
): Promise<RealitySignal> {
  let payload: RealitySignalPayload = extractSignalLocally(rawText, context);

  // Optional AI enhancement if GEMINI_API_KEY is available
  if (process.env.GEMINI_API_KEY) {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Tu es le Reality Signal Engine de Work Proof OS.
Analyse la déclaration brute d'activité suivante et extrait :
1. Les verbes d'action clés
2. Les métriques / chiffres mentionnés
3. Les compétences techniques ou soft skills sous-jacentes.

Texte : "${rawText}"
Contexte : "${context || 'Non précisé'}"

Réponds STRICTEMENT au format JSON :
{
  "actionVerbsDetected": ["verbe1", "verbe2"],
  "metricsDetected": ["métrique1", "métrique2"],
  "skillsExtracted": ["skill1", "skill2"],
  "confidence": 0.90
}`,
      });

      const cleanJson = (response.text || "").replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleanJson);
      if (parsed.actionVerbsDetected) payload.actionVerbsDetected = parsed.actionVerbsDetected;
      if (parsed.metricsDetected) payload.metricsDetected = parsed.metricsDetected;
      if (parsed.skillsExtracted) payload.skillsExtracted = parsed.skillsExtracted;
    } catch (err) {
      console.warn("RIL RealitySignal AI extraction fallback to local regex:", err);
    }
  }

  const signalData: Omit<RealitySignal, 'id'> = {
    userId,
    type,
    source,
    payload,
    confidence: payload.metricsDetected && payload.metricsDetected.length > 0 ? 0.9 : 0.75,
    createdAt: new Date().toISOString()
  };

  try {
    const docRef = await addDoc(collection(db, "reality_signals"), {
      ...signalData,
      createdAt: serverTimestamp()
    });
    const createdSignal: RealitySignal = { id: docRef.id, ...signalData };
    localSignalsStore.unshift(createdSignal);
    return createdSignal;
  } catch (e) {
    // Fallback if Firestore write fails (e.g., demo/unauth mode)
    const newSignal: RealitySignal = { id: `sig-${Date.now()}`, ...signalData };
    localSignalsStore.unshift(newSignal);
    return newSignal;
  }
}

export async function getUserRealitySignals(userId: string): Promise<RealitySignal[]> {
  try {
    const q = query(
      collection(db, "reality_signals"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<RealitySignal, 'id'>)
      }));
    }
  } catch (e) {
    // Silent fallback to local store
  }

  return localSignalsStore.filter(s => s.userId === userId || userId === "demo-user");
}
