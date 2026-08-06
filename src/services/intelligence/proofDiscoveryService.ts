import { db } from "../../lib/firebase";
import { collection, addDoc, getDocs, query, where, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { GoogleGenAI } from "@google/genai";
import { ProofSuggestion, RealitySignal, SuggestionStatus, DraftProof } from "./types";
import { getUserRealitySignals } from "./realitySignalService";

// In-memory fallback store for offline/demo operation
let localSuggestionsStore: ProofSuggestion[] = [
  {
    id: "sug-demo-1",
    userId: "demo-user",
    signalIds: ["sig-demo-1"],
    suggestedSkill: "DevOps & CI/CD",
    suggestedProofType: "optimisation_technique",
    draftProof: {
      title: "Optimisation du Pipeline CI/CD Titan",
      before: "Les déploiements manuels prenaient 45 minutes et bloquaient fréquemment l'équipe de 12 développeurs.",
      action: "Conception et automatisation intégrale du pipeline CI/CD avec conteneurisation et parallélisation des tests.",
      result: "Temps de déploiement réduit à 8 minutes, économisant ~30h de dev par mois.",
      causality: "L'automatisation directe des tests d'intégration et la mise en cache des dépendances ont neutralisé les goulets d'étranglement."
    },
    explanation: "Signal d'activité détecté avec gain mesurable (45min -> 8min). Prêt pour structuration STAR.",
    status: "pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "sug-demo-2",
    userId: "demo-user",
    signalIds: ["sig-demo-2"],
    suggestedSkill: "SQL Performance Tuning",
    suggestedProofType: "architecture_donnees",
    draftProof: {
      title: "Refonte d'indexation SQL API Search",
      before: "L'API Search subissait des latences élevées sur les tables de plus de 5M de lignes.",
      action: "Analyse des plans d'exécution SQL et réécriture des requêtes avec indexation composite.",
      result: "Gain de performance de 65% mesuré sur la latence P95 de l'API Search.",
      causality: "L'élimination des métriques de scan séquentiel au profit d'index b-tree ajustés."
    },
    explanation: "Opportunité de preuve d'impact technique identifiée à partir de l'analyse d'optimisation.",
    status: "pending",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString()
  }
];

export async function getUserSuggestions(userId: string): Promise<ProofSuggestion[]> {
  try {
    const q = query(
      collection(db, "proof_suggestions"),
      where("userId", "==", userId)
    );
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<ProofSuggestion, 'id'>)
      }));
    }
  } catch (e) {
    // Fallback
  }

  return localSuggestionsStore.filter(s => s.userId === userId || userId === "demo-user");
}

export async function generateProofSuggestionsFromSignals(userId: string): Promise<ProofSuggestion[]> {
  const currentSuggestions = await getUserSuggestions(userId);
  const activePending = currentSuggestions.filter(s => s.status === 'pending');

  // Hard limit invariant: Max 3 pending suggestions to avoid cognitive overload
  if (activePending.length >= 3) {
    return activePending;
  }

  const signals = await getUserRealitySignals(userId);
  if (signals.length === 0) return activePending;

  // Process unused signals
  const usedSignalIds = new Set(currentSuggestions.flatMap(s => s.signalIds));
  const newSignals = signals.filter(s => !usedSignalIds.has(s.id));

  for (const signal of newSignals) {
    if (activePending.length >= 3) break;

    let draft: DraftProof = {
      title: `Preuve basée sur ${signal.payload.skillsExtracted?.[0] || 'Activité'}`,
      before: signal.payload.context || "Contexte initial à préciser",
      action: signal.payload.actionVerbsDetected?.join(", ") ? `Mise en œuvre : ${signal.payload.rawText}` : (signal.payload.rawText || "Action réalisée"),
      result: signal.payload.metricsDetected?.join(" | ") ? `Résultat mesuré : ${signal.payload.metricsDetected.join(", ")}` : "Impact mesuré",
      causality: "L'intervention directe a permis l'atteinte de cette métrique."
    };

    let suggestedSkill = signal.payload.skillsExtracted?.[0] || "Exécution";
    let explanation = "Suggestion générée automatiquement par RIL à partir de votre signal d'activité.";

    if (process.env.GEMINI_API_KEY) {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const res = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `Tu es le Proof Discovery Engine de RIL (Work Proof OS).
Transforme la déclaration brute suivante en un brouillon de PREUVE au format STAR (Situation/Avant, Action, Résultat, Causalité).

Signal brut : "${signal.payload.rawText}"
Contexte : "${signal.payload.context || ''}"

Règles :
- Formule un titre professionnel court.
- "before" : la situation initiale ou le problème.
- "action" : l'action concrète avec verbes d'action.
- "result" : le résultat avec chiffres/métriques si disponibles.
- "causality" : le lien de cause à effet précis.

Réponds STRICTEMENT au format JSON :
{
  "title": "Titre court",
  "before": "Situation initiale...",
  "action": "Action réalisée...",
  "result": "Résultat mesuré...",
  "causality": "Lien de causalité...",
  "suggestedSkill": "Nom de la compétence",
  "explanation": "Pourquoi cette suggestion est pertinente..."
}`
        });

        const cleanJson = (res.text || "").replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(cleanJson);
        if (parsed.before && parsed.action && parsed.result) {
          draft = {
            title: parsed.title || draft.title,
            before: parsed.before,
            action: parsed.action,
            result: parsed.result,
            causality: parsed.causality || draft.causality
          };
          if (parsed.suggestedSkill) suggestedSkill = parsed.suggestedSkill;
          if (parsed.explanation) explanation = parsed.explanation;
        }
      } catch (e) {
        console.warn("RIL ProofDiscovery AI generation fallback to local rules:", e);
      }
    }

    const newSuggestionData: Omit<ProofSuggestion, 'id'> = {
      userId,
      signalIds: [signal.id],
      suggestedSkill,
      suggestedProofType: "realisation_technique",
      draftProof: draft,
      explanation: `${explanation} - Suggestion générée par RIL - Nécessite votre validation.`,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      const docRef = await addDoc(collection(db, "proof_suggestions"), {
        ...newSuggestionData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      const createdSug: ProofSuggestion = { id: docRef.id, ...newSuggestionData };
      localSuggestionsStore.unshift(createdSug);
      activePending.push(createdSug);
    } catch (e) {
      const createdSug: ProofSuggestion = { id: `sug-${Date.now()}`, ...newSuggestionData };
      localSuggestionsStore.unshift(createdSug);
      activePending.push(createdSug);
    }
  }

  return activePending;
}

export async function updateSuggestionStatus(
  suggestionId: string,
  status: SuggestionStatus
): Promise<void> {
  const idx = localSuggestionsStore.findIndex(s => s.id === suggestionId);
  if (idx !== -1) {
    localSuggestionsStore[idx].status = status;
    localSuggestionsStore[idx].updatedAt = new Date().toISOString();
  }

  try {
    await updateDoc(doc(db, "proof_suggestions", suggestionId), {
      status,
      updatedAt: serverTimestamp()
    });
  } catch (e) {
    // Local fallback handled above
  }
}
