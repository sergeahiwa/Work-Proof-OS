import React, { useState } from 'react';
import { Sparkles, TrendingUp, ShieldCheck, Compass } from 'lucide-react';
import { ProofSuggestionsCard } from './ProofSuggestionsCard';
import { EvolutionRadarPanel } from './EvolutionRadarPanel';
import { BiasShieldPanel } from './BiasShieldPanel';
import { ProofSuggestion } from '../../services/intelligence/types';

interface RILOverviewPanelProps {
  userId?: string;
  onAcceptSuggestion?: (suggestion: ProofSuggestion) => void;
}

export const RILOverviewPanel: React.FC<RILOverviewPanelProps> = ({
  userId = 'demo-user',
  onAcceptSuggestion
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'discovery' | 'radar' | 'bias'>('discovery');

  return (
    <div className="space-y-4">
      {/* Top RIL Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 rounded-2xl shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                RIL v1.0 • WORK PROOF OS v1.6
              </span>
              <span className="text-xs text-slate-400">Human Assisted Intelligence</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight">Reality Intelligence Layer</h2>
            <p className="text-xs text-slate-300 max-w-xl mt-1">
              Couche d'intelligence ambiante passive. Extraction de preuves STAR, analyse de trajectoires de compétences et bouclier anti-imposteur.
            </p>
          </div>

          <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60 backdrop-blur-sm self-start md:self-auto">
            <button
              onClick={() => setActiveSubTab('discovery')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeSubTab === 'discovery' 
                  ? 'bg-indigo-600 text-white shadow-sm' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Proof Discovery
            </button>
            <button
              onClick={() => setActiveSubTab('radar')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeSubTab === 'radar' 
                  ? 'bg-indigo-600 text-white shadow-sm' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              Radar Évolution
            </button>
            <button
              onClick={() => setActiveSubTab('bias')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeSubTab === 'bias' 
                  ? 'bg-indigo-600 text-white shadow-sm' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Bias Shield
            </button>
          </div>
        </div>
      </div>

      {/* Dynamic View */}
      {activeSubTab === 'discovery' && (
        <ProofSuggestionsCard userId={userId} onAcceptSuggestion={onAcceptSuggestion} />
      )}

      {activeSubTab === 'radar' && (
        <EvolutionRadarPanel userId={userId} />
      )}

      {activeSubTab === 'bias' && (
        <BiasShieldPanel />
      )}
    </div>
  );
};
