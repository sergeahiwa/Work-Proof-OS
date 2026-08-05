import React, { useMemo } from 'react';
import { 
  ShieldAlert, 
  TrendingDown, 
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
  AlertTriangle,
  BarChart3,
  History,
  ShieldCheck
} from 'lucide-react';
import { RiskForecast, RiskForecastStats, TrustNetwork } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface RiskForecastPanelProps {
  forecasts: RiskForecast[];
  stats: RiskForecastStats;
  onClear: () => void;
  onExport: () => void;
  onGenerateReport: () => void;
}

const RISK_LEVEL_COLORS: Record<string, string> = {
  CRITICAL: 'text-error bg-error/10 border-error/20',
  HIGH: 'text-warning bg-warning/10 border-warning/20',
  MEDIUM: 'text-info bg-info/10 border-info/20',
  LOW: 'text-success bg-success/10 border-success/20'
};

const TIME_TO_IMPACT_LABELS: Record<string, string> = {
  IMMEDIATE: 'Immédiat',
  SHORT_TERM: 'Court Terme',
  MEDIUM_TERM: 'Moyen Terme'
};

export default function RiskForecastPanel({ 
  forecasts, 
  stats, 
  onClear, 
  onExport,
  onGenerateReport
}: RiskForecastPanelProps) {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Risk Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6 border-2 border-error/20 bg-error/5">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-error/10 rounded-lg text-error">
              <AlertTriangle size={20} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-error">Critique</span>
          </div>
          <p className="text-3xl font-headline font-black text-text-main">{stats.criticalRisks}</p>
          <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Risques Critiques</p>
        </div>

        <div className="card p-6 border-2 border-surface-border bg-surface-section/30">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-warning/10 rounded-lg text-warning">
              <TrendingDown size={20} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-warning">Probabilité</span>
          </div>
          <p className="text-3xl font-headline font-black text-text-main">{(stats.avgRiskProbability * 100).toFixed(1)}%</p>
          <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Probabilité Moyenne</p>
        </div>

        <div className="card p-6 border-2 border-surface-border bg-surface-section/30">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-success/10 rounded-lg text-success">
              <CheckCircle2 size={20} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-success">Mitigation</span>
          </div>
          <p className="text-3xl font-headline font-black text-text-main">{stats.mitigationRate.toFixed(1)}%</p>
          <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Taux de Résolution</p>
        </div>

        <div className="card p-6 border-2 border-surface-border bg-surface-section/30">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-info/10 rounded-lg text-info">
              <Activity size={20} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-info">Total</span>
          </div>
          <p className="text-3xl font-headline font-black text-text-main">{stats.totalRisks}</p>
          <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Risques Identifiés</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Risk Timeline */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-headline font-black uppercase flex items-center gap-2">
              <ShieldAlert className="text-error" size={20} />
              Prévisions des Risques (Production & Sandbox)
            </h3>
            <div className="flex gap-2">
              <button 
                onClick={onGenerateReport}
                className="p-2 hover:bg-surface-card rounded-lg transition-all text-primary"
                title="Générer Rapport Stratégique"
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
              {forecasts.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="card p-12 border-2 border-dashed border-surface-border flex flex-col items-center justify-center text-text-muted"
                >
                  <ShieldCheck size={48} className="mb-4 text-success/30" />
                  <p className="text-sm font-black uppercase tracking-widest">Aucun risque détecté</p>
                  <p className="text-[10px] font-bold uppercase mt-2">Le système est actuellement stable</p>
                </motion.div>
              ) : (
                forecasts.map((forecast) => (
                  <motion.div
                    key={forecast.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`card p-5 border-2 relative overflow-hidden bg-surface-section/50 ${RISK_LEVEL_COLORS[forecast.riskLevel]}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-surface-card/80`}>
                          <AlertTriangle size={18} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-70">
                              {forecast.networkName} • {forecast.targetName}
                            </p>
                            <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase ${
                              forecast.isSimulated ? 'bg-info text-surface' : 'bg-error text-surface'
                            }`}>
                              {forecast.isSimulated ? 'Sandbox' : 'Production'}
                            </span>
                          </div>
                          <h4 className="text-sm font-black uppercase tracking-tight">{forecast.riskLevel} RISK</h4>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-[8px] font-black uppercase tracking-widest opacity-60">
                          {new Date(forecast.timestamp).toLocaleTimeString()}
                        </span>
                        <span className="text-[8px] font-black uppercase tracking-widest text-primary">
                          Probabilité: {(forecast.probability * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                    <div className="mt-3 space-y-3">
                      <div className="flex flex-wrap gap-2">
                        {forecast.factors.map((factor, idx) => (
                          <span key={idx} className="text-[8px] font-black uppercase px-2 py-0.5 bg-surface-card/60 rounded-full border border-current/10">
                            {factor}
                          </span>
                        ))}
                      </div>
                      <div className="grid grid-cols-2 gap-4 p-3 bg-surface-card/40 rounded border border-current/10">
                        <div>
                          <p className="text-[8px] font-black uppercase text-text-muted mb-1">Impact Estimé</p>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1 bg-surface-border rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-current" 
                                style={{ width: `${forecast.impactScore}%` }} 
                              />
                            </div>
                            <span className="text-[10px] font-black">{forecast.impactScore}/100</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-[8px] font-black uppercase text-text-muted mb-1">Échéance</p>
                          <p className="text-[10px] font-black uppercase tracking-widest">
                            {TIME_TO_IMPACT_LABELS[forecast.timeToImpact]}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Risk Factors & Rules */}
        <div className="space-y-6">
          <h3 className="text-xl font-headline font-black uppercase flex items-center gap-2">
            <Target className="text-primary" size={20} />
            Analyse des Facteurs
          </h3>
          
          <div className="card p-6 border-2 border-surface-border bg-surface-section/30">
            <h4 className="text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-2">
              <BarChart3 size={16} className="text-primary" />
              Top Facteurs de Risque
            </h4>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase">
                  <span>Anomalies Critiques</span>
                  <span>42%</span>
                </div>
                <div className="h-1.5 bg-surface-border rounded-full overflow-hidden">
                  <div className="h-full bg-error w-[42%]" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase">
                  <span>Dérive de Régime</span>
                  <span>28%</span>
                </div>
                <div className="h-1.5 bg-surface-border rounded-full overflow-hidden">
                  <div className="h-full bg-warning w-[28%]" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase">
                  <span>Incohérence Temporelle</span>
                  <span>15%</span>
                </div>
                <div className="h-1.5 bg-surface-border rounded-full overflow-hidden">
                  <div className="h-full bg-info w-[15%]" />
                </div>
              </div>
            </div>
          </div>

          <div className="card p-6 border-2 border-surface-border bg-surface-section/30">
            <h4 className="text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-2">
              <History size={16} className="text-primary" />
              Règles de Prévision
            </h4>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <div className="mt-1 w-1 h-1 rounded-full bg-primary" />
                <p className="text-[9px] font-bold uppercase text-text-muted">Alerte Immédiate si Stabilité {'<'} 45%.</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="mt-1 w-1 h-1 rounded-full bg-primary" />
                <p className="text-[9px] font-bold uppercase text-text-muted">Détection de dérive si Anomaly {'>'} 0.65.</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="mt-1 w-1 h-1 rounded-full bg-primary" />
                <p className="text-[9px] font-bold uppercase text-text-muted">Analyse prédictive sur chute de cohérence.</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="mt-1 w-1 h-1 rounded-full bg-primary" />
                <p className="text-[9px] font-bold uppercase text-text-muted">Isolation stricte des calculs Sandbox.</p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl border-2 border-dashed border-surface-border bg-surface-section/20">
            <p className="text-[8px] font-black uppercase text-center text-text-muted">
              Le moteur de prévision utilise des modèles d'extrapolation linéaire et d'analyse de pattern pour anticiper les crises de confiance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
