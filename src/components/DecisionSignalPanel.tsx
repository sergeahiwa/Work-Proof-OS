import React, { useState, useMemo } from 'react';
import { 
  Activity, 
  ShieldAlert, 
  ShieldCheck, 
  Info, 
  Filter, 
  Search,
  ArrowRight,
  Brain,
  Zap,
  Layers,
  BarChart3
} from 'lucide-react';
import { DecisionSignal } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface DecisionSignalPanelProps {
  signals: DecisionSignal[];
  onClear?: () => void;
}

const SEVERITY_COLORS = {
  LOW: 'text-success bg-success/10 border-success/20',
  MEDIUM: 'text-warning bg-warning/10 border-warning/20',
  HIGH: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
  CRITICAL: 'text-error bg-error/10 border-error/20'
};

const ACTION_COLORS = {
  MONITOR: 'bg-success/20 text-success',
  INVESTIGATE: 'bg-warning/20 text-warning',
  RESTRICT: 'bg-orange-500/20 text-orange-500',
  ESCALATE: 'bg-error/20 text-error'
};

export default function DecisionSignalPanel({ signals, onClear }: DecisionSignalPanelProps) {
  const [filterNetwork, setFilterNetwork] = useState<string>('ALL');
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');

  const filteredSignals = useMemo(() => {
    return signals.filter(s => {
      const matchNet = filterNetwork === 'ALL' || s.networkId === filterNetwork;
      const matchSev = filterSeverity === 'ALL' || s.severity === filterSeverity;
      return matchNet && matchSev;
    });
  }, [signals, filterNetwork, filterSeverity]);

  const networks = useMemo(() => {
    const unique = new Set(signals.map(s => s.networkId));
    return Array.from(unique).map(id => ({
      id,
      name: signals.find(s => s.networkId === id)?.networkName || id
    }));
  }, [signals]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header & Filters */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-surface-section p-4 rounded-2xl border border-surface-border">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-xl text-primary">
            <Brain size={24} />
          </div>
          <div>
            <h3 className="text-lg font-headline font-black uppercase tracking-tight">Decision Signal Aggregator</h3>
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Frontière Work Proof ↔ KAIROS</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
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

          <div className="flex items-center gap-2 bg-surface-card px-3 py-1.5 rounded-xl border border-surface-border">
            <Filter size={14} className="text-text-muted" />
            <select 
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="bg-transparent text-[10px] font-black uppercase tracking-widest border-none focus:ring-0 cursor-pointer"
            >
              <option value="ALL">Toutes sévérités</option>
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
              <option value="CRITICAL">CRITICAL</option>
            </select>
          </div>

          {onClear && (
            <button 
              onClick={onClear}
              className="px-4 py-1.5 bg-surface-card border border-surface-border rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-error/50 hover:text-error transition-all"
            >
              Effacer
            </button>
          )}
        </div>
      </div>

      {/* Signals List */}
      <div className="grid grid-cols-1 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredSignals.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="card p-12 border-2 border-dashed border-surface-border flex flex-col items-center justify-center text-text-muted"
            >
              <Zap size={48} className="mb-4 opacity-20" />
              <p className="text-sm font-black uppercase tracking-widest">Aucun signal détecté</p>
              <p className="text-[10px] font-bold uppercase mt-2">Le DSA est en attente de données analytiques</p>
            </motion.div>
          ) : (
            filteredSignals.map((signal) => (
              <motion.div
                key={signal.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`card p-5 border-2 relative overflow-hidden bg-surface-section/50 ${SEVERITY_COLORS[signal.severity]}`}
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${signal.severity === 'CRITICAL' ? 'bg-error text-surface' : 'bg-surface-card'}`}>
                      {signal.severity === 'CRITICAL' ? <ShieldAlert size={20} /> : <Activity size={20} />}
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
                    <div className="text-right">
                      <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-1">Confiance</p>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-1.5 bg-surface-border rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-current transition-all duration-1000" 
                            style={{ width: `${signal.confidence * 100}%` }} 
                          />
                        </div>
                        <span className="text-xs font-black">{(signal.confidence * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                    <div className={`px-4 py-2 rounded-xl border border-current/20 flex flex-col items-center justify-center min-w-[100px]`}>
                      <span className="text-[8px] font-black uppercase tracking-widest opacity-70">Sévérité</span>
                      <span className="text-xs font-black uppercase">{signal.severity}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  {[
                    { label: 'Risk', val: signal.signals.risk, icon: ShieldAlert },
                    { label: 'Predictive', val: signal.signals.predictive, icon: Brain },
                    { label: 'KPI', val: signal.signals.kpi, icon: BarChart3 },
                    { label: 'Proactive', val: signal.signals.proactive, icon: Zap }
                  ].map((s, idx) => (
                    <div key={idx} className="bg-surface-card/50 p-3 rounded-xl border border-surface-border">
                      <div className="flex justify-between items-center mb-2">
                        <s.icon size={12} className="text-text-muted" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">{s.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1 bg-surface-border rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: `${s.val * 100}%` }} />
                        </div>
                        <span className="text-[10px] font-bold">{(s.val * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
                  <div className="flex-1 p-4 bg-surface-card/80 rounded-xl border border-surface-border">
                    <div className="flex items-center gap-2 mb-2">
                      <Info size={14} className="text-primary" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-primary">Explicabilité</span>
                    </div>
                    <p className="text-xs font-bold text-text-main leading-relaxed italic">
                      "{signal.explainability}"
                    </p>
                  </div>

                  <div className={`p-4 rounded-xl border border-current/20 flex flex-col justify-center ${ACTION_COLORS[signal.recommendedAction]}`}>
                    <span className="text-[8px] font-black uppercase tracking-widest opacity-70 mb-1">Action Recommandée</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black uppercase tracking-tight">{signal.recommendedAction}</span>
                      <ArrowRight size={16} />
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
