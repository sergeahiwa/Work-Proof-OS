import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, CheckCircle2, XCircle, AlertCircle, Plus, Send, Zap, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ProofSuggestion, RealitySignal } from '../../services/intelligence/types';
import { 
  getUserSuggestions, 
  generateProofSuggestionsFromSignals, 
  updateSuggestionStatus,
  captureRealitySignal 
} from '../../services/intelligence';

interface ProofSuggestionsCardProps {
  userId?: string;
  onAcceptSuggestion?: (suggestion: ProofSuggestion) => void;
}

export const ProofSuggestionsCard: React.FC<ProofSuggestionsCardProps> = ({ 
  userId = 'demo-user',
  onAcceptSuggestion 
}) => {
  const navigate = useNavigate();
  const [suggestions, setSuggestions] = useState<ProofSuggestion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [rawInput, setRawInput] = useState<string>('');
  const [contextInput, setContextInput] = useState<string>('');
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'suggestions' | 'capture'>('suggestions');

  const loadData = async () => {
    setLoading(true);
    try {
      const active = await generateProofSuggestionsFromSignals(userId);
      setSuggestions(active.filter(s => s.status === 'pending'));
    } catch (err) {
      console.error("Error loading RIL suggestions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [userId]);

  const handleCaptureSignal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawInput.trim()) return;

    setIsCapturing(true);
    try {
      await captureRealitySignal(userId, rawInput, contextInput);
      setRawInput('');
      setContextInput('');
      setActiveTab('suggestions');
      await loadData();
    } catch (err) {
      console.error("Error capturing signal:", err);
    } finally {
      setIsCapturing(false);
    }
  };

  const handleAccept = async (sug: ProofSuggestion) => {
    await updateSuggestionStatus(sug.id, 'accepted');
    if (onAcceptSuggestion) {
      onAcceptSuggestion(sug);
    } else {
      // Navigate to create-proof with state
      navigate('/create-proof', { 
        state: { 
          fromSuggestion: true, 
          draft: sug.draftProof,
          skill: sug.suggestedSkill 
        } 
      });
    }
  };

  const handleDismiss = async (sugId: string) => {
    await updateSuggestionStatus(sugId, 'dismissed');
    setSuggestions(prev => prev.filter(s => s.id !== sugId));
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-slate-900">Proof Discovery (RIL)</h3>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                <ShieldCheck className="w-3 h-3" />
                Advisory Only
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Détection passive de signaux d'activité & suggestions de preuves STAR
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs font-medium">
          <button
            onClick={() => setActiveTab('suggestions')}
            className={`px-3 py-1 rounded-md transition-colors ${
              activeTab === 'suggestions' 
                ? 'bg-white text-slate-900 shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Suggestions ({suggestions.length})
          </button>
          <button
            onClick={() => setActiveTab('capture')}
            className={`px-3 py-1 rounded-md transition-colors ${
              activeTab === 'capture' 
                ? 'bg-white text-slate-900 shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            + Saisir Signal
          </button>
        </div>
      </div>

      {/* Main Content */}
      {activeTab === 'suggestions' && (
        <div>
          {loading ? (
            <div className="py-8 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
              <Zap className="w-4 h-4 animate-spin text-indigo-500" />
              Analyse des signaux d'activité en cours...
            </div>
          ) : suggestions.length === 0 ? (
            <div className="py-8 text-center bg-slate-50 rounded-lg border border-dashed border-slate-200">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-800">Aucune suggestion en attente</p>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Ajoutez un nouveau signal d'activité brute pour que RIL en extrait une opportunité de preuve certifiable.
              </p>
              <button
                onClick={() => setActiveTab('capture')}
                className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Saisir un signal d'activité
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {suggestions.map((sug) => (
                <div 
                  key={sug.id} 
                  className="p-4 bg-gradient-to-br from-indigo-50/40 via-white to-slate-50 border border-indigo-100 rounded-xl relative group hover:border-indigo-300 transition-all"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <span className="inline-block px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded text-[11px] font-semibold tracking-wide uppercase">
                        {sug.suggestedSkill}
                      </span>
                      <h4 className="text-sm font-semibold text-slate-900 mt-1">
                        {sug.draftProof.title || 'Opportunité de Preuve Détectée'}
                      </h4>
                    </div>
                    <button
                      onClick={() => handleDismiss(sug.id)}
                      className="text-slate-400 hover:text-slate-600 p-1 rounded hover:bg-slate-100"
                      title="Ignorer la suggestion"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>

                  {/* STAR Breakdown */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs my-3 bg-white/80 p-2.5 rounded-lg border border-slate-100">
                    <div>
                      <span className="font-semibold text-slate-500 uppercase text-[10px]">Avant / Problème</span>
                      <p className="text-slate-700 line-clamp-2">{sug.draftProof.before}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-500 uppercase text-[10px]">Action Réalisée</span>
                      <p className="text-slate-700 line-clamp-2">{sug.draftProof.action}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-indigo-600 uppercase text-[10px]">Résultat Mesuré</span>
                      <p className="text-slate-800 font-medium line-clamp-2">{sug.draftProof.result}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-500 uppercase text-[10px]">Lien de Causalité</span>
                      <p className="text-slate-700 line-clamp-2">{sug.draftProof.causality}</p>
                    </div>
                  </div>

                  {/* AI Advisory Note */}
                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                    <div className="flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                      <span className="truncate max-w-xs">{sug.explanation}</span>
                    </div>

                    <button
                      onClick={() => handleAccept(sug)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium text-xs shadow-xs transition-colors whitespace-nowrap"
                    >
                      Accepter & Structurer
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Capture Tab */}
      {activeTab === 'capture' && (
        <form onSubmit={handleCaptureSignal} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Saisie brute d'activité ou compte-rendu
            </label>
            <textarea
              value={rawInput}
              onChange={(e) => setRawInput(e.target.value)}
              placeholder="Ex: J'ai migré le serveur PostgreSQL de production vers v15, réduisant les temps de réponse de 35% et éliminant les timeouts de pointe..."
              rows={3}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Contexte ou projet (optionnel)
            </label>
            <input
              type="text"
              value={contextInput}
              onChange={(e) => setContextInput(e.target.value)}
              placeholder="Ex: Infra Backend / Projet Alpha"
              className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-slate-400">
              RIL extraira automatiquement les verbes d'action, métriques et compétences.
            </span>
            <button
              type="submit"
              disabled={isCapturing || !rawInput.trim()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg text-xs font-medium transition-colors"
            >
              {isCapturing ? <Zap className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              Analyser & Traiter
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
