import React, { useMemo } from 'react';
import { 
  TrendingUp, 
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
  FlaskConical,
  Eye,
  AlertCircle
} from 'lucide-react';
import { PredictiveInsight, TrustNetwork } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface PredictiveInsightsPanelProps {
  insights: PredictiveInsight[];
  networks: TrustNetwork[];
  onClear: () => void;
  onExport: () => void;
  onValidationReport: () => void;
}

const SEVERITY_COLORS: Record<string, string> = {
  CRITICAL: 'text-error bg-error/10 border-error/20',
  HIGH: 'text-warning bg-warning/10 border-warning/20',
  MEDIUM: 'text-info bg-info/10 border-info/20',
  LOW: 'text-success bg-success/10 border-success/20'
};

const TYPE_ICONS: Record<string, any> = {
  DRIFT_DETECTION: TrendingUp,
  RULE_VALIDATION: FlaskConical,
  PATTERN_RECOGNITION: Eye
};

export default function PredictiveInsightsPanel({ 
  insights, 
  networks, 
  onClear, 
  onExport,
  onValidationReport
}: PredictiveInsightsPanelProps) {
  const simulatedNetworks = useMemo(() => networks.filter(n => n.type === 'SIMULATED'), [networks]);

  const stats = useMemo(() => {
    const total = insights.length;
    const critical = insights.filter(i => i.severity === 'CRITICAL').length;
    const high = insights.filter(i => i.severity === 'HIGH').length;
    const avgConfidence = total > 0 ? (insights.reduce((acc, i) => acc + i.confidence, 0) / total) * 100 : 100;

    return { total, critical, high, avgConfidence };
  }, [insights]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Sandbox Insights Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6 border-2 border-info/20 bg-info/5">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-info/10 rounded-lg text-info">
              <FlaskConical size={20} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-info">Sandbox</span>
          </div>
          <p className="text-3xl font-headline font-black text-text-main">{stats.total}</p>
          <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Insights Détectés</p>
        </div>

        <div className="card p-6 border-2 border-surface-border bg-surface-section/30">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-error/10 rounded-lg text-error">
              <AlertCircle size={20} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-error">Critique</span>
          </div>
          <p className="text-3xl font-headline font-black text-text-main">{stats.critical}</p>
          <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Règles Validées</p>
        </div>

        <div className="card p-6 border-2 border-surface-border bg-surface-section/30">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-warning/10 rounded-lg text-warning">
              <TrendingUp size={20} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-warning">Dérives</span>
          </div>
          <p className="text-3xl font-headline font-black text-text-main">{stats.high}</p>
          <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Dérives Hautes</p>
        </div>

        <div className="card p-6 border-2 border-surface-border bg-surface-section/30">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-success/10 rounded-lg text-success">
              <CheckCircle2 size={20} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-success">Confiance</span>
          </div>
          <p className="text-3xl font-headline font-black text-text-main">{stats.avgConfidence.toFixed(1)}%</p>
          <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Précision Sandbox</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Insights Timeline */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-headline font-black uppercase flex items-center gap-2">
              <FlaskConical className="text-info" size={20} />
              Insights Prédictifs (Sandbox Only)
            </h3>
            <div className="flex gap-2">
              <button 
                onClick={onValidationReport}
                className="p-2 hover:bg-surface-card rounded-lg transition-all text-info"
                title="Générer Rapport de Validation"
              >
                <FileText size={16} />
              </button>
              <button 
                onClick={onExport}
                className="p-2 hover:bg-surface-card rounded-lg transition-all text-text-muted"
                title="Exporter CSV"
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
              {insights.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="card p-12 border-2 border-dashed border-surface-border flex flex-col items-center justify-center text-text-muted"
                >
                  <FlaskConical size={48} className="mb-4 text-info/30" />
                  <p className="text-sm font-black uppercase tracking-widest">Aucun insight détecté</p>
                  <p className="text-[10px] font-bold uppercase mt-2">Le sandbox est en cours d'analyse</p>
                </motion.div>
              ) : (
                insights.map((insight) => {
                  const Icon = TYPE_ICONS[insight.type] || Activity;
                  return (
                    <motion.div
                      key={insight.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`card p-5 border-2 relative overflow-hidden bg-surface-section/50 ${SEVERITY_COLORS[insight.severity]}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg bg-surface-card/80`}>
                            <Icon size={18} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-[10px] font-black uppercase tracking-widest opacity-70">
                                {insight.networkName} • {insight.targetName}
                              </p>
                              <span className="text-[8px] font-black px-1.5 py-0.5 rounded uppercase bg-info text-surface">
                                Sandbox
                              </span>
                            </div>
                            <h4 className="text-sm font-black uppercase tracking-tight">{insight.type.replace('_', ' ')}</h4>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-[8px] font-black uppercase tracking-widest opacity-60">
                            {new Date(insight.timestamp).toLocaleTimeString()}
                          </span>
                          <span className="text-[8px] font-black uppercase tracking-widest text-success">
                            Confiance: {(insight.confidence * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                      <div className="mt-3 space-y-2">
                        <p className="text-[10px] font-bold text-text-main opacity-80 italic">"{insight.message}"</p>
                        {insight.suggestedAction && (
                          <div className="p-2 bg-surface-card/40 rounded border border-current/10">
                            <p className="text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                              <ArrowRight size={10} />
                              Action Suggérée: {insight.suggestedAction}
                            </p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Sandbox Network Overview */}
        <div className="space-y-6">
          <h3 className="text-xl font-headline font-black uppercase flex items-center gap-2">
            <Layers className="text-info" size={20} />
            Réseaux Sandbox
          </h3>
          <div className="space-y-4">
            {simulatedNetworks.map(network => (
              <div key={network.id} className="card p-5 border-2 border-info/30 bg-info/5 ai-insight-glow">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-info animate-pulse" />
                    <h4 className="text-xs font-black uppercase tracking-widest">{network.name}</h4>
                  </div>
                  <span className="text-[8px] font-black uppercase tracking-widest bg-info text-surface px-2 py-0.5 rounded">
                    Simulated
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="space-y-1">
                    <p className="text-[8px] font-black uppercase text-text-muted">Stabilité</p>
                    <p className="text-lg font-headline font-black text-text-main">{network.kpi.systemStabilityScore}%</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[8px] font-black uppercase text-text-muted">Dérive Régime</p>
                    <p className="text-lg font-headline font-black text-warning">{(network.kpi.avgRegimeChangeProbability * 100).toFixed(0)}%</p>
                  </div>
                </div>

                <div className="p-3 bg-surface-card/50 rounded-lg border border-surface-border">
                  <p className="text-[8px] font-black uppercase text-text-muted mb-2">Validation de Règle</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FlaskConical size={12} className="text-info" />
                      <span className="text-[10px] font-black uppercase">
                        Règles en cours de test
                      </span>
                    </div>
                    <span className="text-[10px] font-black">3 actives</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sandbox Rules */}
          <div className="card p-6 border-2 border-surface-border bg-surface-section/30">
            <h4 className="text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-2">
              <ShieldAlert size={16} className="text-info" />
              Règles Sandbox
            </h4>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <div className="mt-1 w-1 h-1 rounded-full bg-info" />
                <p className="text-[9px] font-bold uppercase text-text-muted">Détection de dérive systémique ({'>'}35%).</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="mt-1 w-1 h-1 rounded-full bg-info" />
                <p className="text-[9px] font-bold uppercase text-text-muted">Pattern-matching fraude sophistiquée.</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="mt-1 w-1 h-1 rounded-full bg-info" />
                <p className="text-[9px] font-bold uppercase text-text-muted">Validation des seuils critiques (0.75).</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
