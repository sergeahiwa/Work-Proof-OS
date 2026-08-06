import { GoogleGenAI } from "@google/genai";
import { BiasAnalysisResult } from "./types";

const DEVALUATION_TERMS = [
  "j'ai juste", "juste aidé", "petit projet", "un petit", "on a fait", 
  "j'ai un peu", "simple participation", "rien de spécial", "banal", 
  "sans prétention", "j'ai essayé de", "modestement"
];

const REPLACEMENT_MAP: Record<string, string> = {
  "j'ai juste aidé": "j'ai co-dirigé et contribué activement",
  "petit projet": "initiative ciblée à fort impact",
  "on a fait": "j'ai orchestré la mise en œuvre de",
  "j'ai un peu": "j'ai pris en charge l'optimisation de",
  "simple participation": "contribution stratégique clé",
  "rien de spécial": "réalisation opérationnelle structurée"
};

export async function analyzeTextForBias(text: string): Promise<BiasAnalysisResult> {
  const lower = text.toLowerCase();
  const detectedTerms = DEVALUATION_TERMS.filter(term => lower.includes(term));
  const hasDevaluationTerms = detectedTerms.length > 0;

  let suggestedReformulation = text;
  detectedTerms.forEach(term => {
    if (REPLACEMENT_MAP[term]) {
      const reg = new RegExp(term, 'gi');
      suggestedReformulation = suggestedReformulation.replace(reg, REPLACEMENT_MAP[term]);
    }
  });

  let explanation = hasDevaluationTerms
    ? `RIL Bias Shield a détecté ${detectedTerms.length} terme(s) d'auto-dévaluation ("${detectedTerms.join('", "')}"). Une reformulation à plus fort impact valorise mieux vos réalisations réelles.`
    : "Aucun biais d'auto-dévaluation détecté dans votre formulation.";

  if (hasDevaluationTerms && process.env.GEMINI_API_KEY) {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Tu es le Bias Shield Service de RIL (Work Proof OS).
Ta mission est de neutraliser le syndrome de l'imposteur et l'auto-dévaluation dans la description suivante de réalisation professionnelle.

Texte original : "${text}"

Consignes :
1. Conserve la stricte vérité des faits sans inventer de fausses métriques.
2. Remplace les termes passifs ou dévalorisants (ex: "j'ai juste aidé", "petit truc") par des verbes d'action précis.
3. Rends la tournure active et professionnelle.

Réponds STRICTEMENT au format JSON :
{
  "suggestedReformulation": "Texte reformulé à fort impact",
  "explanation": "Explication pédagogique du changement",
  "impactGainEstimate": "+25% de lisibilité professionnelle"
}`
      });

      const cleanJson = (response.text || "").replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleanJson);
      if (parsed.suggestedReformulation) {
        suggestedReformulation = parsed.suggestedReformulation;
      }
      if (parsed.explanation) {
        explanation = `${parsed.explanation} - Note: Suggestion RIL (Advisory Only).`;
      }
    } catch (e) {
      console.warn("RIL BiasShield AI analysis fallback to local rules:", e);
    }
  }

  return {
    hasDevaluationTerms,
    detectedTerms,
    originalText: text,
    suggestedReformulation,
    impactGainEstimate: hasDevaluationTerms ? "+30% de clarté d'impact" : "Optimal",
    explanation
  };
}
