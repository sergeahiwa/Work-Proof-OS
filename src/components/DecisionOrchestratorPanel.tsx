import React, { useMemo } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Activity, 
  Download, 
  Zap, 
  Layers,
  CheckCircle2,
  Bell,
  Clock,
  ArrowRight,
  Filter,
  Search,
  Trash2,
  FileText,
  Cpu,
  GanttChart,
  Target,
  TrendingUp
} from 'lucide-react';
import { DecisionAction, TrustNetwork, DecisionOrchestratorStats } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface DecisionOrchestratorPanelProps {
  actions: DecisionAction[];
  networks: TrustNetwork[];
  stats: DecisionOrchestratorStats;
  onClear: () => void;
  onExport: () => void;
}

const PRIORITY_COLORS: Record<string, string> = {
  CRITICAL: 'text-error bg-error/10 border-error/20',
  HIGH: 'text-warning bg-warning/10 border-warning/20',
  MODERATE: 'text-info bg-info/10 border-info/20',
  LOW: 'text-success bg-success/10 border-success/20'
};

const TYPE_ICONS: Record<string, any> = {
  SCORE_ADJUSTMENT: Zap,
  REGIME_LOCK: ShieldCheck,
  QUARANTINE: ShieldAlert,
  VALIDATION_REQUEST: Target
};

export default function DecisionOrchestratorPanel({ 
  actions, 
  networks, 
  stats, 
  onClear, 
  onExport 
}: DecisionOrchestratorPanelProps) {
  const realNetworks = useMemo(() => networks.filter(n => n.type === 'REAL'), [networks]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Real-World Orchestration Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6 border-2 border-primary/20 bg-primary/5">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <Cpu size={20} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-primary">Orchestration</span>
          </div>
          <p className="text-3xl font-headline font-black text-text-main">{stats.totalActions}</p>
          <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Interventions Réelles</p>
        </div>

        <div className="card p-6 border-2 border-surface-border bg-surface-section/30">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-warning/10 rounded-lg text-warning">
              <Clock size={20} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-warning">En cours</span>
          </div>
          <p className="text-3xl font-headline font-black text-text-main">{stats.pendingActions}</p>
          <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Actions Priorisées</p>
        </div>

        <div className="card p-6 border-2 border-surface-border bg-surface-section/30">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-success/10 rounded-lg text-success">
              <CheckCircle2 size={20} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-success">Succès</span>
          </div>
          <p className="text-3xl font-headline font-black text-text-main">{stats.successRate.toFixed(1)}%</p>
          <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Taux d'Exécution</p>
        </div>

        <div className="card p-6 border-2 border-surface-border bg-surface-section/30">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-info/10 rounded-lg text-info">
              <Zap size={20} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-info">Vélocité</span>
          </div>
          <p className="text-3xl font-headline font-black text-text-main">{stats.avgResponseTime}</p>
          <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Temps de Réaction</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Decision Timeline */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-headline font-black uppercase flex items-center gap-2">
              <GanttChart className="text-primary" size={20} />
              Timeline des Interventions (Réseaux Réels)
            </h3>
            <div className="flex gap-2">
              <button 
                onClick={onExport}
                className="p-2 hover:bg-surface-card rounded-lg transition-all text-text-muted"
                title="Exporter Audit"
              >
                <Download size={16} />
              </button>
              <button 
                onClick={onClear}
                className="p-2 hover:bg-surface-card rounded-lg transition-all text-error/70 hover:text-error"
                title="Tout effacer"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            <AnimatePresence mode="popLayout">
              {actions.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="card p-12 border-2 border-dashed border-surface-border flex flex-col items-center justify-center text-text-muted"
                >
                  <ShieldCheck size={48} className="mb-4 text-success/30" />
                  <p className="text-sm font-black uppercase tracking-widest">Aucune intervention requise</p>
                  <p className="text-[10px] font-bold uppercase mt-2">L'orchestrateur surveille les réseaux réels</p>
                </motion.div>
              ) : (
                actions.map((action) => {
                  const Icon = TYPE_ICONS[action.type] || Activity;
                  return (
                    <motion.div
                      key={action.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`card p-5 border-2 relative overflow-hidden bg-surface-section/50 ${PRIORITY_COLORS[action.priority]}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg bg-surface-card/80`}>
                            <Icon size={18} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-[10px] font-black uppercase tracking-widest opacity-70">
                                {action.networkName} • {action.targetName}
                              </p>
                              <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase ${
                                action.status === 'COMPLETED' ? 'bg-success text-surface' : 'bg-warning text-surface'
                              }`}>
                                {action.status}
                              </span>
                            </div>
                            <h4 className="text-sm font-black uppercase tracking-tight">{action.type.replace('_', ' ')}</h4>
                          </div>
                        </div>
                        <span className="text-[8px] font-black uppercase tracking-widest opacity-60">
                          {new Date(action.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="mt-3 space-y-2">
                        <p className="text-[10px] font-bold text-text-main opacity-80 italic">"{action.reason}"</p>
                        <div className="p-2 bg-surface-card/40 rounded border border-current/10">
                          <p className="text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                            <ArrowRight size={10} />
                            Impact: {action.impact}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Real Network Focus */}
        <div className="space-y-6">
          <h3 className="text-xl font-headline font-black uppercase flex items-center gap-2">
            <Target className="text-primary" size={20} />
            Focus Réseaux Réels
          </h3>
          <div className="space-y-4">
            {realNetworks.map(network => (
              <div key={network.id} className="card p-5 border-2 border-primary/30 bg-primary/5 ai-insight-glow">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                    <h4 className="text-xs font-black uppercase tracking-widest">{network.name}</h4>
                  </div>
                  <span className="text-[8px] font-black uppercase tracking-widest bg-primary text-surface px-2 py-0.5 rounded">
                    Production
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="space-y-1">
                    <p className="text-[8px] font-black uppercase text-text-muted">Stabilité</p>
                    <p className="text-lg font-headline font-black text-text-main">{network.kpi.systemStabilityScore}%</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[8px] font-black uppercase text-text-muted">Anomalies</p>
                    <p className="text-lg font-headline font-black text-error">{network.kpi.criticalAnomalyCount}</p>
                  </div>
                </div>

                <div className="p-3 bg-surface-card/50 rounded-lg border border-surface-border">
                  <p className="text-[8px] font-black uppercase text-text-muted mb-2">Prédiction de Risque (Production)</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp size={12} className={network.kpi.avgRegimeChangeProbability > 0.3 ? 'text-warning' : 'text-success'} />
                      <span className="text-[10px] font-black uppercase">
                        {network.kpi.avgRegimeChangeProbability > 0.3 ? 'Risque de Dérive' : 'Flux Stable'}
                      </span>
                    </div>
                    <span className="text-[10px] font-black">{(network.kpi.avgRegimeChangeProbability * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Orchestrator Rules */}
          <div className="card p-6 border-2 border-surface-border bg-surface-section/30">
            <h4 className="text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-2">
              <ShieldCheck size={16} className="text-primary" />
              Règles Décisionnelles
            </h4>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <div className="mt-1 w-1 h-1 rounded-full bg-primary" />
                <p className="text-[9px] font-bold uppercase text-text-muted">Priorisation automatique des anomalies critiques ({'>'}0.9).</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="mt-1 w-1 h-1 rounded-full bg-primary" />
                <p className="text-[9px] font-bold uppercase text-text-muted">Quarantaine réseau si stabilité {'<'} 40%.</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="mt-1 w-1 h-1 rounded-full bg-primary" />
                <p className="text-[9px] font-bold uppercase text-text-muted">Verrouillage de régime sur dérive rapide ({'>'}0.5).</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="mt-1 w-1 h-1 rounded-full bg-primary" />
                <p className="text-[9px] font-bold uppercase text-text-muted">Audit obligatoire pour toute action de production.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
