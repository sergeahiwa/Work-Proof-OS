import React, { useMemo } from 'react';
import { 
  AlertTriangle, 
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
  FileText
} from 'lucide-react';
import { ProactiveAlert, TrustNetwork, AlertPriority } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface ProactiveManagementPanelProps {
  alerts: ProactiveAlert[];
  networks: TrustNetwork[];
  onResolve: (id: string) => void;
  onClear: () => void;
  onExport: () => void;
  onStrategicReport: () => void;
}

const PRIORITY_COLORS: Record<AlertPriority, string> = {
  CRITICAL: 'text-error bg-error/10 border-error/20',
  HIGH: 'text-warning bg-warning/10 border-warning/20',
  MODERATE: 'text-info bg-info/10 border-info/20',
  LOW: 'text-success bg-success/10 border-success/20'
};

export default function ProactiveManagementPanel({ 
  alerts, 
  networks, 
  onResolve, 
  onClear, 
  onExport,
  onStrategicReport
}: ProactiveManagementPanelProps) {
  const activeAlerts = useMemo(() => alerts.filter(a => a.status === 'ACTIVE'), [alerts]);
  const resolvedAlerts = useMemo(() => alerts.filter(a => a.status === 'RESOLVED'), [alerts]);

  const stats = useMemo(() => {
    const total = alerts.length;
    const critical = alerts.filter(a => a.priority === 'CRITICAL').length;
    const high = alerts.filter(a => a.priority === 'HIGH').length;
    const efficiency = total > 0 ? (resolvedAlerts.length / total) * 100 : 100;

    return { total, critical, high, efficiency };
  }, [alerts, resolvedAlerts]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Strategic Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6 border-2 border-surface-border bg-surface-section/30">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-error/10 rounded-lg text-error">
              <ShieldAlert size={20} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-error">Critique</span>
          </div>
          <p className="text-3xl font-headline font-black text-text-main">{stats.critical}</p>
          <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Alertes Critiques</p>
        </div>

        <div className="card p-6 border-2 border-surface-border bg-surface-section/30">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-warning/10 rounded-lg text-warning">
              <Bell size={20} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-warning">Total</span>
          </div>
          <p className="text-3xl font-headline font-black text-text-main">{stats.total}</p>
          <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Alertes Détectées</p>
        </div>

        <div className="card p-6 border-2 border-surface-border bg-surface-section/30">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-success/10 rounded-lg text-success">
              <Zap size={20} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-success">Efficacité</span>
          </div>
          <p className="text-3xl font-headline font-black text-text-main">{stats.efficiency.toFixed(1)}%</p>
          <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Taux de Résolution</p>
        </div>

        <div className="card p-6 border-2 border-primary/20 bg-primary/5">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <FileText size={20} />
            </div>
            <button 
              onClick={onStrategicReport}
              className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline"
            >
              Générer Rapport
            </button>
          </div>
          <p className="text-sm font-headline font-black text-text-main">Rapport Stratégique</p>
          <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Consolidation Multi-Réseaux</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Alerts List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-headline font-black uppercase flex items-center gap-2">
              <Bell className="text-primary" size={20} />
              Alertes Actives ({activeAlerts.length})
            </h3>
            <div className="flex gap-2">
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
              {activeAlerts.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="card p-12 border-2 border-dashed border-surface-border flex flex-col items-center justify-center text-text-muted"
                >
                  <CheckCircle2 size={48} className="mb-4 text-success/30" />
                  <p className="text-sm font-black uppercase tracking-widest">Aucune alerte active</p>
                  <p className="text-[10px] font-bold uppercase mt-2">Le système est stable sur tous les réseaux</p>
                </motion.div>
              ) : (
                activeAlerts.map((alert) => (
                  <motion.div
                    key={alert.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className={`card p-6 border-2 relative overflow-hidden ${PRIORITY_COLORS[alert.priority]}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${alert.priority === 'CRITICAL' ? 'bg-error/20' : 'bg-surface-card/50'}`}>
                          {alert.type === 'ANOMALY_SPIKE' ? <Zap size={16} /> : 
                           alert.type === 'STABILITY_DROP' ? <ShieldAlert size={16} /> : <Activity size={16} />}
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest opacity-70">
                            {alert.networkName} {alert.userName ? `• ${alert.userName}` : ''}
                          </p>
                          <h4 className="text-sm font-black uppercase tracking-tight">{alert.message}</h4>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="text-[8px] font-black uppercase tracking-widest opacity-60">
                          {new Date(alert.timestamp).toLocaleTimeString()}
                        </span>
                        <button 
                          onClick={() => onResolve(alert.id)}
                          className="px-3 py-1 bg-surface-card/50 hover:bg-surface-card rounded-lg text-[8px] font-black uppercase tracking-widest transition-all"
                        >
                          Résoudre
                        </button>
                      </div>
                    </div>
                    {alert.actionTaken && (
                      <div className="mt-3 pt-3 border-t border-current/10 flex items-center gap-2">
                        <Zap size={12} className="animate-pulse" />
                        <p className="text-[9px] font-bold uppercase italic">{alert.actionTaken}</p>
                      </div>
                    )}
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Network Health Overview */}
        <div className="space-y-6">
          <h3 className="text-xl font-headline font-black uppercase flex items-center gap-2">
            <Layers className="text-primary" size={20} />
            Santé des Réseaux
          </h3>
          <div className="space-y-4">
            {networks.map(network => (
              <div key={network.id} className="card p-4 border-2 border-surface-border bg-surface-section/30">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-xs font-black uppercase tracking-widest">{network.name}</h4>
                  <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                    network.kpi.systemStabilityScore < 50 ? 'bg-error text-surface' : 'bg-success/20 text-success'
                  }`}>
                    {network.kpi.systemStabilityScore < 50 ? 'Critique' : 'Stable'}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold uppercase text-text-muted">
                    <span>Stabilité</span>
                    <span>{network.kpi.systemStabilityScore}%</span>
                  </div>
                  <div className="w-full bg-surface-card h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-1000 ${
                        network.kpi.systemStabilityScore < 50 ? 'bg-error' : 'bg-success'
                      }`} 
                      style={{ width: `${network.kpi.systemStabilityScore}%` }} 
                    />
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <div className="p-2 bg-surface-card rounded-lg">
                    <p className="text-[8px] font-black uppercase text-text-muted">Anomalies</p>
                    <p className="text-xs font-black text-text-main">{network.kpi.criticalAnomalyCount}</p>
                  </div>
                  <div className="p-2 bg-surface-card rounded-lg">
                    <p className="text-[8px] font-black uppercase text-text-muted">Interventions</p>
                    <p className="text-xs font-black text-text-main">{network.kpi.totalInterventions}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Efficiency Stats */}
          <div className="card p-6 border-2 border-primary/20 bg-primary/5">
            <h4 className="text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-2">
              <Activity size={16} className="text-primary" />
              Efficacité du Système
            </h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-[10px] font-bold uppercase text-text-muted">Temps de réponse moyen</p>
                <p className="text-xs font-black text-text-main">1.2s</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-[10px] font-bold uppercase text-text-muted">Alertes résolues auto</p>
                <p className="text-xs font-black text-text-main">84%</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-[10px] font-bold uppercase text-text-muted">Précision prédictive</p>
                <p className="text-xs font-black text-text-main">92.5%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
