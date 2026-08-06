import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, ArrowRight, RefreshCw, CheckCircle2 } from 'lucide-react';
import { analyzeTextForBias } from '../../services/intelligence/biasShieldService';
import { BiasAnalysisResult } from '../../services/intelligence/types';

export const BiasShieldPanel: React.FC = () => {
  const [inputText, setInputText] = useState<string>(
    "J'ai juste aidé l'équipe sur un petit projet de refonte du panier e-commerce."
  );
  const [result, setResult] = useState<BiasAnalysisResult | null>(null);
  const [analyzing, setAnalyzing] = useState<boolean>(false);

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;
    setAnalyzing(true);
    try {
      const res = await analyzeTextForBias(inputText);
      setResult(res);
    } catch (err) {
      console.error("Error running Bias Shield:", err);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-100 mb-4">
        <div className="w-8 h-8 rounded-lg bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-slate-900">RIL Bias Shield</h3>
          <p className="text-xs text-slate-500">Détection des tournures d'auto-dévaluation & neutralisation du biais d'imposteur</p>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Texte de la réalisation à analyser
          </label>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={3}
            className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none"
            placeholder="Saisissez votre brouillon de preuve..."
          />
        </div>

        <button
          onClick={handleAnalyze}
          disabled={analyzing || !inputText.trim()}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
        >
          {analyzing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />}
          Analyser les biais
        </button>

        {result && (
          <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
            {result.hasDevaluationTerms ? (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-center gap-2 text-amber-800 text-xs font-semibold mb-1">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  Biais d'auto-dévaluation détecté
                </div>
                <p className="text-xs text-amber-900">{result.explanation}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {result.detectedTerms.map((term, i) => (
                    <span key={i} className="px-2 py-0.5 bg-amber-200/80 text-amber-900 text-[10px] font-mono rounded">
                      "{term}"
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 text-xs text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Excellente formulation ! Aucun terme d'auto-dévaluation détecté.</span>
              </div>
            )}

            {result.hasDevaluationTerms && (
              <div className="p-3 bg-purple-50/60 border border-purple-100 rounded-lg">
                <span className="text-[10px] font-semibold text-purple-700 uppercase tracking-wider block mb-1">
                  Reformulation suggérée à fort impact
                </span>
                <p className="text-xs text-slate-900 font-medium">{result.suggestedReformulation}</p>
                <div className="mt-2 text-[11px] text-purple-700 font-medium">
                  Gain estimé : {result.impactGainEstimate}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
