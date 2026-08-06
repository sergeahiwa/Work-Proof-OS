import React, { useMemo } from 'react';
import { 
  Zap, 
  AlertTriangle, 
  Activity, 
  ShieldAlert, 
  Play, 
  Square, 
  TrendingUp, 
  Users, 
  BarChart3, 
  Clock,
  ArrowRight
} from 'lucide-react';
import { User, StressScenario, StressTestStatus } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface StressTestPanelProps {
  status: StressTestStatus;
  users: User[];
  onStartScenario: (scenario: StressScenario) => void;
  onStopScenario: () => void;
}

const SCENARIO_CONFIG = {
  anomaly_spike: { 
    label: 'Pic d\'Anomalie Massif', 
    description: '20% des profils dépassent 0.8 d\'anomalie simultanément.',
    icon: AlertTriangle,
    color: 'text-error border-error/20 bg-error/5'
  },
  mass_deviation: { 
    label: 'Déviation Rapide', 
    description: 'Déviation brutale > 0.5 pour plusieurs profils à la fois.',
    icon: Zap,
    color: 'text-warning border-warning/20 bg-warning/5'
  },
  fake_user_flood: { 
    label: 'Flux de Faux Profils', 
    description: 'Injection massive de données incohérentes et suspectes.',
    icon: Users,
    color: 'text-info border-info/20 bg-info/5'
  },
  recovery_test: { 
    label: 'Test de Récupération', 
    description: 'Chute brutale d\'anomalie pour tester la stabilité post-crise.',
    icon: Activity,
    color: 'text-success border-success/20 bg-success/5'
  }
};

export default function StressTestPanel({ status, users, onStartScenario, onStopScenario }: StressTestPanelProps) {
  const anomalyDistribution = useMemo(() => {
    const bins = Array(10).fill(0);
    users.forEach(u => {
      const binIdx = Math.min(9, Math.floor(u.trustFactors.anomalyScore * 10));
      bins[binIdx]++;
    });
    return bins;
  }, [users]);

  const highRiskCount = users.filter(u => u.trustFactors.anomalyScore > 0.8).length;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Scenario Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {(Object.keys(SCENARIO_CONFIG) as StressScenario[]).map(key => {
          const config = SCENARIO_CONFIG[key];
          const Icon = config.icon;
          const isActive = status.isActive && status.currentScenario === key;

          return (
            <motion.div 
              key={key}
              whileHover={{ y: -4 }}
              className={`card p-6 border-2 transition-all relative overflow-hidden ${isActive ? 'border-primary ring-2 ring-primary/20' : 'border-surface-border'}`}
            >
              <div className={`p-3 rounded-xl w-fit mb-4 ${config.color}`}>
                <Icon size={24} />
              </div>
              <h4 className="text-sm font-black uppercase tracking-widest mb-2">{config.label}</h4>
              <p className="text-[10px] text-text-muted leading-relaxed mb-6">{config.description}</p>
              
              <button
                onClick={() => isActive ? onStopScenario() : onStartScenario(key)}
                disabled={status.isActive && !isActive}
                className={`w-full py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                  isActive ? 'bg-error text-surface' : 'bg-surface-section text-text-muted hover:text-text hover:bg-surface-card'
                } ${status.isActive && !isActive ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isActive ? <Square size={12} fill="currentColor" /> : <Play size={12} fill="currentColor" />}
                {isActive ? 'Arrêter' : 'Lancer'}
              </button>

              {isActive && (
                <div className="absolute top-2 right-2">
                  <span className="flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Real-time Crisis Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Anomaly Heatmap/Histogram */}
        <div className="lg:col-span-2 card p-8 border-2 border-surface-border bg-surface-section/30">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-headline font-black uppercase flex items-center gap-2">
              <BarChart3 className="text-primary" size={20} />
              Distribution des Anomalies
            </h3>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-[8px] font-black uppercase tracking-widest text-text-muted">Risque Critique</p>
                <p className={`text-xl font-headline font-black ${highRiskCount > 5 ? 'text-error' : 'text-text-main'}`}>
                  {highRiskCount} Profils
                </p>
              </div>
            </div>
          </div>

          <div className="h-48 flex items-end gap-2 px-4">
            {anomalyDistribution.map((count, i) => {
              const height = (count / (users.length || 1)) * 100;
              const isHighRisk = i >= 8;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative">
                  <div 
                    className={`w-full rounded-t-lg transition-all duration-500 ${isHighRisk ? 'bg-error/60 group-hover:bg-error' : 'bg-primary/40 group-hover:bg-primary'}`}
                    style={{ height: `${Math.max(4, height)}%` }}
                  />
                  <span className="text-[8px] font-mono font-bold text-text-muted">{(i / 10).toFixed(1)}</span>
                  
                  {/* Tooltip */}
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-surface-card border border-surface-border p-2 rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    <p className="text-[8px] font-black uppercase tracking-widest whitespace-nowrap">{count} Utilisateurs</p>
                    <p className="text-[8px] font-mono text-text-muted">Score: {i/10} - {(i+1)/10}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Crisis Log / Stats */}
        <div className="card p-8 border-2 border-surface-border bg-surface-section/30">
          <h3 className="text-xl font-headline font-black uppercase mb-8 flex items-center gap-2">
            <Clock className="text-primary" size={20} />
            État de Crise
          </h3>
          
          <div className="space-y-6">
            <div className="p-4 bg-surface-card border border-surface-border rounded-xl">
              <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-1">Statut Simulation</p>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${status.isActive ? 'bg-error animate-pulse' : 'bg-success'}`} />
                <span className="text-xs font-black uppercase">{status.isActive ? 'En Cours' : 'Stable'}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-surface-card border border-surface-border rounded-xl">
                <p className="text-[8px] font-black uppercase tracking-widest text-text-muted mb-1">Impactés</p>
                <p className="text-2xl font-headline font-black">{status.impactedCount}</p>
              </div>
              <div className="p-4 bg-surface-card border border-surface-border rounded-xl">
                <p className="text-[8px] font-black uppercase tracking-widest text-text-muted mb-1">Interventions</p>
                <p className="text-2xl font-headline font-black text-primary">{status.totalInterventionsDuringStress}</p>
              </div>
            </div>

            {status.isActive && (
              <div className="p-4 bg-error/10 border border-error/20 rounded-xl animate-in fade-in duration-500">
                <div className="flex items-center gap-2 text-error mb-2">
                  <ShieldAlert size={14} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Alerte de Résilience</span>
                </div>
                <p className="text-[10px] font-medium leading-relaxed">
                  Le ResilienceEngine traite actuellement un flux massif d'anomalies. Temps de réaction moyen : <span className="font-bold">12ms</span>.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Impacted Profiles List (during stress) */}
      {status.isActive && (
        <div className="card overflow-hidden border-2 border-error/20 bg-error/5 animate-in slide-in-from-bottom-4 duration-500">
          <div className="p-6 border-b border-error/20 flex justify-between items-center">
            <h3 className="text-lg font-headline font-black uppercase flex items-center gap-2 text-error">
              <Activity size={18} />
              Profils sous Stress Critique
            </h3>
            <span className="text-[8px] font-black uppercase tracking-widest bg-error text-surface px-2 py-1 rounded">Action Automatique Active</span>
          </div>
          <div className="divide-y divide-error/10">
            {users.filter(u => u.trustFactors.anomalyScore > 0.8).slice(0, 5).map(u => (
              <div key={u.id} className="p-4 flex justify-between items-center hover:bg-error/5 transition-colors">
                <div className="flex items-center gap-3">
                  <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full border border-error/30" referrerPolicy="no-referrer" />
                  <div>
                    <p className="text-xs font-bold">{u.name}</p>
                    <p className="text-[8px] font-black uppercase tracking-widest text-text-muted">{u.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <p className="text-[10px] font-black text-error">Anomalie: {Math.round(u.trustFactors.anomalyScore * 100)}%</p>
                    <p className="text-[8px] font-bold text-text-muted uppercase">Plafonnement Appliqué</p>
                  </div>
                  <button className="p-2 hover:bg-error/10 rounded-lg transition-colors text-error">
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
