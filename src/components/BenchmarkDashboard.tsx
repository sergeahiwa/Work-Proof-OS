import React, { useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from 'recharts';
import { 
  Activity, 
  ShieldCheck, 
  ShieldAlert, 
  TrendingUp, 
  AlertTriangle, 
  Download,
  Zap,
  BarChart3,
  LayoutDashboard,
  Layers,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { NetworkBenchmark, TrustNetwork } from '../types';
import { motion } from 'motion/react';

interface BenchmarkDashboardProps {
  benchmark: NetworkBenchmark;
  onExport?: () => void;
}

export default function BenchmarkDashboard({ benchmark, onExport }: BenchmarkDashboardProps) {
  const stabilityData = useMemo(() => benchmark.networks.map(n => ({
    name: n.name,
    Stability: n.kpi.systemStabilityScore,
    Impact: n.kpi.impactedProfilesPercentage
  })), [benchmark]);

  const scoreComparisonData = useMemo(() => benchmark.networks.map(n => ({
    name: n.name,
    Raw: Math.round(n.kpi.avgRawScore.TRUSTED),
    Adjusted: Math.round(n.kpi.avgAdjustedScore.TRUSTED)
  })), [benchmark]);

  // Radar data for the top performer
  const topNetwork = benchmark.networks.find(n => n.id === benchmark.topPerformers[0]);
  const radarData = useMemo(() => {
    if (!topNetwork) return [];
    return [
      { subject: 'Stabilité', A: topNetwork.kpi.systemStabilityScore, fullMark: 100 },
      { subject: 'Confiance', A: (1 - topNetwork.kpi.avgRegimeChangeProbability) * 100, fullMark: 100 },
      { subject: 'Résilience', A: Math.min(100, topNetwork.kpi.totalInterventions * 10), fullMark: 100 },
      { subject: 'Intégrité', A: 100 - topNetwork.kpi.impactedProfilesPercentage, fullMark: 100 },
      { subject: 'Performance', A: (topNetwork.kpi.avgAdjustedScore.TRUSTED / (topNetwork.kpi.avgRawScore.TRUSTED || 1)) * 100, fullMark: 100 },
    ];
  }, [topNetwork]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Network Comparison Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 card p-8 border-2 border-surface-border bg-surface-section/30">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-headline font-black uppercase flex items-center gap-2">
              <Layers className="text-primary" size={20} />
              Benchmarking de Stabilité Multi-Réseaux
            </h3>
            <button onClick={onExport} className="p-2 hover:bg-surface-card rounded-lg transition-all text-text-muted">
              <Download size={16} />
            </button>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stabilityData}>
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
                <Bar dataKey="Stability" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Impact" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Performer Radar */}
        <div className="card p-8 border-2 border-surface-border bg-surface-section/30">
          <h3 className="text-xl font-headline font-black uppercase mb-8 flex items-center gap-2">
            <CheckCircle2 className="text-success" size={20} />
            Top Performer: {topNetwork?.name}
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={10} fontWeight="bold" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#94a3b8" fontSize={8} />
                <Radar
                  name={topNetwork?.name}
                  dataKey="A"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Network Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {benchmark.networks.map((network, idx) => {
          const isAtRisk = benchmark.atRiskNetworks.includes(network.id);
          const isTop = benchmark.topPerformers.includes(network.id);

          return (
            <motion.div 
              key={network.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`card p-6 border-2 relative overflow-hidden transition-all hover:shadow-xl ${
                isAtRisk ? 'border-error/30 bg-error/5' : 
                isTop ? 'border-success/30 bg-success/5' : 'border-surface-border'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-sm font-black uppercase tracking-widest">{network.name}</h4>
                  <p className="text-[10px] text-text-muted uppercase font-bold">{network.users.length} Profils</p>
                </div>
                <div className={`px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest ${
                  isAtRisk ? 'bg-error text-surface' : 
                  isTop ? 'bg-success text-surface' : 'bg-surface-card text-text-muted'
                }`}>
                  {isAtRisk ? 'Risque Élevé' : isTop ? 'Top Performance' : 'Stable'}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[8px] font-black uppercase tracking-widest text-text-muted">Indice de Stabilité</p>
                    <p className={`text-2xl font-headline font-black ${isAtRisk ? 'text-error' : 'text-text-main'}`}>
                      {network.kpi.systemStabilityScore}%
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[8px] font-black uppercase tracking-widest text-text-muted">Anomalies</p>
                    <p className="text-sm font-black text-text-main">{network.kpi.criticalAnomalyCount}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-surface-border/50">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Score Ajusté (Avg)</p>
                    <span className="text-xs font-mono font-bold text-primary">
                      {Math.round(network.kpi.avgAdjustedScore.TRUSTED)}
                    </span>
                  </div>
                  <div className="w-full bg-surface-card h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-1000 ${isAtRisk ? 'bg-error' : 'bg-primary'}`} 
                      style={{ width: `${(network.kpi.avgAdjustedScore.TRUSTED / (network.kpi.avgRawScore.TRUSTED || 1)) * 100}%` }} 
                    />
                  </div>
                </div>
              </div>

              {isAtRisk && (
                <div className="mt-4 p-3 bg-error/10 border border-error/20 rounded-lg flex items-center gap-2 text-error">
                  <AlertTriangle size={14} />
                  <span className="text-[8px] font-black uppercase tracking-widest">Intervention Requise</span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
