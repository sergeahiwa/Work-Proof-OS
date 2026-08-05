import React, { useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { 
  Activity, 
  ShieldCheck, 
  ShieldAlert, 
  TrendingUp, 
  AlertTriangle, 
  Clock, 
  Download,
  Zap,
  BarChart3,
  PieChart as PieIcon,
  LayoutDashboard
} from 'lucide-react';
import { GlobalKPI, TrustRegime } from '../types';
import { motion } from 'motion/react';

interface GlobalKPIDashboardProps {
  kpi: GlobalKPI;
  onExport?: () => void;
}

const COLORS = {
  TRUSTED: '#10b981',
  UNCERTAIN: '#f59e0b',
  RISKY: '#ef4444',
};

export default function GlobalKPIDashboard({ kpi, onExport }: GlobalKPIDashboardProps) {
  const scoreData = useMemo(() => [
    { name: 'TRUSTED', Raw: kpi.avgRawScore.TRUSTED, Adjusted: kpi.avgAdjustedScore.TRUSTED },
    { name: 'UNCERTAIN', Raw: kpi.avgRawScore.UNCERTAIN, Adjusted: kpi.avgAdjustedScore.UNCERTAIN },
    { name: 'RISKY', Raw: kpi.avgRawScore.RISKY, Adjusted: kpi.avgAdjustedScore.RISKY },
  ], [kpi]);

  const stabilityColor = kpi.systemStabilityScore > 80 ? 'text-success' : 
                        kpi.systemStabilityScore > 50 ? 'text-warning' : 'text-error';

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Global Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6 border-l-4 border-primary bg-surface-section relative overflow-hidden">
          <div className="flex justify-between items-start mb-2">
            <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Stabilité Système</p>
            <Activity className={stabilityColor} size={16} />
          </div>
          <h3 className={`text-4xl font-headline font-black ${stabilityColor}`}>{kpi.systemStabilityScore}%</h3>
          <p className="text-[8px] font-bold text-text-muted mt-1 uppercase tracking-widest">Indice de Santé Global</p>
          <div className="absolute bottom-0 left-0 h-1 bg-primary/20" style={{ width: `${kpi.systemStabilityScore}%` }} />
        </div>

        <div className="card p-6 border-l-4 border-info bg-surface-section">
          <div className="flex justify-between items-start mb-2">
            <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Auto-Corrections</p>
            <ShieldCheck className="text-info" size={16} />
          </div>
          <h3 className="text-4xl font-headline font-black">{kpi.totalInterventions}</h3>
          <p className="text-[8px] font-bold text-text-muted mt-1 uppercase tracking-widest">Interventions ResilienceEngine</p>
        </div>

        <div className="card p-6 border-l-4 border-error bg-surface-section">
          <div className="flex justify-between items-start mb-2">
            <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Anomalies Critiques</p>
            <AlertTriangle className="text-error" size={16} />
          </div>
          <h3 className="text-4xl font-headline font-black">{kpi.criticalAnomalyCount}</h3>
          <p className="text-[8px] font-bold text-text-muted mt-1 uppercase tracking-widest">{kpi.impactedProfilesPercentage.toFixed(1)}% des Profils</p>
        </div>

        <div className="card p-6 border-l-4 border-warning bg-surface-section">
          <div className="flex justify-between items-start mb-2">
            <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Dérive de Régime</p>
            <TrendingUp className="text-warning" size={16} />
          </div>
          <h3 className="text-4xl font-headline font-black">{Math.round(kpi.avgRegimeChangeProbability * 100)}%</h3>
          <p className="text-[8px] font-bold text-text-muted mt-1 uppercase tracking-widest">Probabilité Moyenne 24h</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Score Comparison Chart */}
        <div className="card p-8 border-2 border-surface-border bg-surface-section/30">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-headline font-black uppercase flex items-center gap-2">
              <BarChart3 className="text-primary" size={20} />
              Performance des Régimes
            </h3>
            <button onClick={onExport} className="p-2 hover:bg-surface-card rounded-lg transition-all text-text-muted">
              <Download size={16} />
            </button>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scoreData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#94a3b8" 
                  fontSize={10} 
                  fontWeight="bold" 
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="#94a3b8" 
                  fontSize={10} 
                  fontWeight="bold" 
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                  itemStyle={{ fontSize: '10px', fontWeight: 'bold' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', paddingTop: '20px' }} />
                <Bar dataKey="Raw" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Adjusted" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Alerts & Stability Timeline */}
        <div className="card p-8 border-2 border-surface-border bg-surface-section/30">
          <h3 className="text-xl font-headline font-black uppercase mb-8 flex items-center gap-2">
            <ShieldAlert className="text-error" size={20} />
            Alertes Globales & État Critique
          </h3>
          
          <div className="space-y-4">
            {kpi.activeAlerts.length > 0 ? (
              kpi.activeAlerts.map((alert, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-4 bg-error/10 border border-error/20 rounded-xl flex items-start gap-3"
                >
                  <AlertTriangle className="text-error mt-0.5" size={16} />
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-error">Alerte Système</p>
                    <p className="text-xs font-medium text-text-main mt-1">{alert}</p>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="p-12 text-center border-2 border-dashed border-surface-border rounded-xl">
                <ShieldCheck size={48} className="text-success/20 mx-auto mb-4" />
                <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Aucune Alerte Critique</p>
                <p className="text-[8px] text-text-muted mt-1 uppercase">Le réseau fonctionne dans les paramètres nominaux.</p>
              </div>
            )}

            <div className="mt-8 pt-8 border-t border-surface-border">
              <div className="flex justify-between items-center mb-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Réactivité ResilienceEngine</p>
                <span className="text-xs font-mono font-bold text-success">12ms avg</span>
              </div>
              <div className="w-full bg-surface-card h-2 rounded-full overflow-hidden">
                <div className="bg-success h-full" style={{ width: '92%' }} />
              </div>
              <p className="text-[8px] font-bold text-text-muted mt-2 uppercase tracking-widest">Temps de réponse moyen aux anomalies critiques</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
