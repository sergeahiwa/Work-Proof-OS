import React, { useState, useMemo } from 'react';
import { 
  MessageSquareText, 
  Brain, 
  ShieldAlert, 
  Activity, 
  Filter, 
  Search,
  ArrowRight,
  Info,
  Layers,
  Zap
} from 'lucide-react';
import { DecisionSignalExtended } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface AdvancedExplainabilityPanelProps {
  extendedSignals: DecisionSignalExtended[];
}

const SEVERITY_COLORS = {
  LOW: 'text-success border-success/20 bg-success/5',
  MEDIUM: 'text-warning border-warning/20 bg-warning/5',
  HIGH: 'text-orange-500 border-orange-500/20 bg-orange-500/5',
  CRITICAL: 'text-error border-error/20 bg-error/5'
};

export default function AdvancedExplainabilityPanel({ extendedSignals }: AdvancedExplainabilityPanelProps) {
  const [filterNetwork, setFilterNetwork] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSignals = useMemo(() => {
    return extendedSignals.filter(s => {
      const matchNet = filterNetwork === 'ALL' || s.networkId === filterNetwork;
      const matchSearch = s.networkName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         s.narrativeExplainability.toLowerCase().includes(searchQuery.toLowerCase());
      return matchNet && matchSearch;
    });
  }, [extendedSignals, filterNetwork, searchQuery]);

  const networks = useMemo(() => {
    const unique = new Set(extendedSignals.map(s => s.networkId));
    return Array.from(unique).map(id => ({
      id,
      name: extendedSignals.find(s => s.networkId === id)?.networkName || id
    }));
  }, [extendedSignals]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-surface-section p-4 rounded-2xl border border-surface-border">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-xl text-primary">
            <MessageSquareText size={24} />
          </div>
          <div>
            <h3 className="text-lg font-headline font-black uppercase tracking-tight">Advanced Explainability (ADSE)</h3>
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Générateur Narratif Déterministe</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 w-full lg:w-auto">
          <div className="flex-1 lg:flex-none flex items-center gap-2 bg-surface-card px-3 py-1.5 rounded-xl border border-surface-border min-w-[200px]">
            <Search size={14} className="text-text-muted" />
            <input 
              type="text"
              placeholder="Rechercher dans les récits..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-[10px] font-black uppercase tracking-widest border-none focus:ring-0 w-full"
            />
          </div>

          <div className="flex items-center gap-2 bg-surface-card px-3 py-1.5 rounded-xl border border-surface-border">
            <Layers size={14} className="text-text-muted" />
            <select 
              value={filterNetwork}
              onChange={(e) => setFilterNetwork(e.target.value)}
              className="bg-transparent text-[10px] font-black uppercase tracking-widest border-none focus:ring-0 cursor-pointer"
            >
              <option value="ALL">Tous les réseaux</option>
              {networks.map(n => <option key={n.id} value={n.id}>{n.name}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Narrative Cards */}
      <div className="grid grid-cols-1 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredSignals.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="card p-12 border-2 border-dashed border-surface-border flex flex-col items-center justify-center text-text-muted"
            >
              <Brain size={48} className="mb-4 opacity-20" />
              <p className="text-sm font-black uppercase tracking-widest">Aucun récit généré</p>
              <p className="text-[10px] font-bold uppercase mt-2">En attente de signaux de décision</p>
            </motion.div>
          ) : (
            filteredSignals.map((signal) => (
              <motion.div
                key={signal.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`card p-6 border-2 relative overflow-hidden ${SEVERITY_COLORS[signal.severity]}`}
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-surface-card rounded-xl border border-surface-border text-text-main">
                      <Activity size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-black uppercase tracking-tight text-text-main">{signal.networkName}</h4>
                        <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase ${
                          signal.networkType === 'REAL' ? 'bg-primary text-surface' : 'bg-info text-surface'
                        }`}>
                          {signal.networkType}
                        </span>
                      </div>
                      <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
                        Signal ID: {signal.id} • {new Date(signal.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="px-4 py-2 rounded-xl border border-current/20 flex flex-col items-center justify-center min-w-[100px]">
                      <span className="text-[8px] font-black uppercase tracking-widest opacity-70">Sévérité</span>
                      <span className="text-xs font-black uppercase">{signal.severity}</span>
                    </div>
                    <div className="px-4 py-2 rounded-xl border border-current/20 flex flex-col items-center justify-center min-w-[100px]">
                      <span className="text-[8px] font-black uppercase tracking-widest opacity-70">Confiance</span>
                      <span className="text-xs font-black uppercase">{(signal.confidence * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Narrative Section */}
                  <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center gap-2 text-text-main">
                      <MessageSquareText size={16} className="text-primary" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Analyse Narrative</span>
                    </div>
                    <div className="p-5 bg-surface-card/50 rounded-2xl border border-surface-border relative">
                      <div className="absolute top-4 right-4 opacity-5">
                        <MessageSquareText size={48} />
                      </div>
                      <p className="text-sm font-bold text-text-main leading-relaxed italic">
                        "{signal.narrativeExplainability}"
                      </p>
                    </div>
                  </div>

                  {/* Impact Breakdown */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-text-main">
                      <Zap size={16} className="text-primary" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Poids des Sources</span>
                    </div>
                    <div className="space-y-3">
                      {[
                        { label: 'Risque', val: signal.signals.risk, color: 'bg-error' },
                        { label: 'Prédictif', val: signal.signals.predictive, color: 'bg-info' },
                        { label: 'KPI', val: signal.signals.kpi, color: 'bg-warning' },
                        { label: 'Proactif', val: signal.signals.proactive, color: 'bg-success' }
                      ].map((s, idx) => (
                        <div key={idx} className="bg-surface-card/30 p-3 rounded-xl border border-surface-border">
                          <div className="flex justify-between items-center mb-1.5">
                            <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">{s.label}</span>
                            <span className="text-[10px] font-bold">{(s.val * 100).toFixed(0)}%</span>
                          </div>
                          <div className="w-full h-1 bg-surface-border rounded-full overflow-hidden">
                            <div className={`h-full ${s.color}`} style={{ width: `${s.val * 100}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-surface-border flex justify-between items-center">
                  <div className="flex items-center gap-2 text-text-muted">
                    <Info size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Généré par ADSE Engine v1.0</span>
                  </div>
                  <div className="flex items-center gap-2 text-text-main">
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-70">Action Recommandée:</span>
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-surface-card rounded-lg border border-surface-border">
                      <span className="text-[10px] font-black uppercase">{signal.recommendedAction}</span>
                      <ArrowRight size={12} />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
