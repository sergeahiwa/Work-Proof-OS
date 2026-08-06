import React, { useState, useMemo } from 'react';
import { 
  Search, 
  History, 
  User, 
  Filter, 
  ArrowRight, 
  Zap, 
  ShieldCheck,
  TrendingUp,
  AlertCircle,
  Maximize2,
  X
} from 'lucide-react';
import { DecisionSignalExtended } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface UserJourneyAuditProps {
  extendedSignals: DecisionSignalExtended[];
}

export default function UserJourneyAudit({ extendedSignals }: UserJourneyAuditProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedSignalId, setSelectedSignalId] = useState<string | null>(null);

  // Extract unique users from signals
  const users = useMemo(() => {
    const userMap = new Map<string, string>();
    extendedSignals.forEach(s => {
      userMap.set(s.networkId, s.networkName);
    });
    return Array.from(userMap.entries()).map(([id, name]) => ({ id, name }));
  }, [extendedSignals]);

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const userSignals = useMemo(() => {
    if (!selectedUserId) return [];
    return extendedSignals.filter(s => s.networkId === selectedUserId);
  }, [extendedSignals, selectedUserId]);

  const timelineData = useMemo(() => {
    return [...userSignals].reverse().map(s => ({
      time: new Date(s.createdAt).toLocaleTimeString(),
      confidence: Math.round(s.confidence * 100),
      risk: Math.round(s.signals.risk * 100),
      predictive: Math.round(s.signals.predictive * 100)
    }));
  }, [userSignals]);

  const selectedSignal = useMemo(() => {
    return userSignals.find(s => s.id === selectedSignalId);
  }, [userSignals, selectedSignalId]);

  const stats = useMemo(() => {
    if (userSignals.length === 0) return null;
    return {
      total: userSignals.length,
      avgConfidence: userSignals.reduce((acc, s) => acc + s.confidence, 0) / userSignals.length,
      criticalCount: userSignals.filter(s => s.severity === 'CRITICAL').length,
      lastSeverity: userSignals[0].severity
    };
  }, [userSignals]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Selection */}
        <div className="card p-6 bg-surface-section border border-surface-border space-y-4 h-fit">
          <div className="flex items-center gap-2 mb-2">
            <Search size={18} className="text-primary" />
            <h3 className="text-sm font-black uppercase tracking-widest">Recherche de Collaborateur</h3>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={14} />
            <input 
              type="text" 
              placeholder="Nom ou ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-surface-card border-2 border-surface-border rounded-xl py-2 pl-10 pr-4 text-xs font-bold focus:border-primary outline-none transition-all"
            />
          </div>

          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {filteredUsers.map(u => (
              <button
                key={u.id}
                onClick={() => setSelectedUserId(u.id)}
                className={`w-full p-3 rounded-xl border-2 flex items-center justify-between transition-all ${
                  selectedUserId === u.id 
                    ? 'border-primary bg-primary/5' 
                    : 'border-surface-border bg-surface-card hover:border-primary/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-surface-section rounded-lg">
                    <User size={14} className={selectedUserId === u.id ? 'text-primary' : 'text-text-muted'} />
                  </div>
                  <div className="text-left">
                    <div className="text-[10px] font-black uppercase tracking-tight">{u.name}</div>
                    <div className="text-[8px] font-bold text-text-muted uppercase tracking-widest">{u.id}</div>
                  </div>
                </div>
                <ArrowRight size={14} className={selectedUserId === u.id ? 'text-primary' : 'text-text-muted opacity-0 group-hover:opacity-100'} />
              </button>
            ))}
          </div>
        </div>

        {/* Journey Details */}
        <div className="lg:col-span-2 space-y-6">
          {!selectedUserId ? (
            <div className="card p-12 border-2 border-dashed border-surface-border flex flex-col items-center justify-center text-text-muted h-full">
              <History size={48} className="mb-4 opacity-20" />
              <p className="text-sm font-black uppercase tracking-widest">Sélectionnez un utilisateur pour voir son parcours</p>
            </div>
          ) : (
            <>
              {/* User Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="card p-4 bg-surface-section border border-surface-border">
                  <div className="text-[8px] font-black uppercase tracking-widest text-text-muted mb-1">Signaux Totaux</div>
                  <div className="text-xl font-headline font-black">{stats?.total}</div>
                </div>
                <div className="card p-4 bg-surface-section border border-surface-border">
                  <div className="text-[8px] font-black uppercase tracking-widest text-text-muted mb-1">Confiance Moyenne</div>
                  <div className="text-xl font-headline font-black text-primary">{(stats?.avgConfidence || 0 * 100).toFixed(0)}%</div>
                </div>
                <div className="card p-4 bg-surface-section border border-surface-border">
                  <div className="text-[8px] font-black uppercase tracking-widest text-text-muted mb-1">Alertes Critiques</div>
                  <div className="text-xl font-headline font-black text-error">{stats?.criticalCount}</div>
                </div>
              </div>

              {/* Confidence Timeline */}
              <div className="card p-6 bg-surface-section border border-surface-border">
                <div className="flex items-center gap-2 mb-6">
                  <TrendingUp size={18} className="text-primary" />
                  <h3 className="text-sm font-black uppercase tracking-widest">Évolution de la Confiance</h3>
                </div>
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={timelineData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                      <XAxis 
                        dataKey="time" 
                        stroke="#64748b" 
                        fontSize={8} 
                        tickLine={false} 
                        axisLine={false}
                      />
                      <YAxis 
                        stroke="#64748b" 
                        fontSize={8} 
                        tickLine={false} 
                        axisLine={false}
                        domain={[0, 100]}
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px', fontSize: '10px' }}
                        itemStyle={{ color: '#38bdf8' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="confidence" 
                        stroke="#38bdf8" 
                        strokeWidth={3} 
                        dot={false}
                        animationDuration={1000}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="risk" 
                        stroke="#ef4444" 
                        strokeWidth={1} 
                        strokeDasharray="4 4"
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Timeline */}
              <div className="card border-2 border-surface-border overflow-hidden">
                <div className="p-4 bg-surface-section border-b-2 border-surface-border flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <History size={18} className="text-primary" />
                    <h3 className="text-sm font-black uppercase tracking-widest">Historique des Attestations (50 derniers enregistrements)</h3>
                  </div>
                </div>

                <div className="p-6 space-y-6 relative">
                  <div className="absolute left-[31px] top-6 bottom-6 w-0.5 bg-surface-border border-dashed border-l-2" />
                  
                  <AnimatePresence mode="popLayout">
                    {userSignals.map((s, idx) => (
                      <motion.div 
                        key={s.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="relative pl-12"
                      >
                        <div className={`absolute left-0 top-1 w-4 h-4 rounded-full border-4 border-surface bg-surface shadow-sm z-10 ${
                          s.severity === 'CRITICAL' ? 'bg-error' :
                          s.severity === 'HIGH' ? 'bg-orange-500' :
                          s.severity === 'MEDIUM' ? 'bg-warning' :
                          'bg-success'
                        }`} />
                        
                        <div className="card p-4 border border-surface-border hover:border-primary/30 transition-all group">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-3">
                              <span className="text-[10px] font-mono font-bold text-text-muted">
                                {new Date(s.createdAt).toLocaleTimeString()}
                              </span>
                              <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${
                                s.severity === 'CRITICAL' ? 'bg-error/10 text-error border-error/20' :
                                s.severity === 'HIGH' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' :
                                s.severity === 'MEDIUM' ? 'bg-warning/10 text-warning border-warning/20' :
                                'bg-success/10 text-success border-success/20'
                              }`}>
                                {s.severity}
                              </span>
                            </div>
                            <button 
                              onClick={() => setSelectedSignalId(s.id)}
                              className="text-text-muted hover:text-primary transition-colors"
                            >
                              <Maximize2 size={12} />
                            </button>
                          </div>
                          
                          <p className="text-xs font-bold text-text-main leading-relaxed mb-3">
                            {s.narrativeExplainability}
                          </p>

                          <div className="flex flex-wrap gap-2">
                            {Object.entries(s.signals).map(([key, val]) => (
                              <div key={key} className="flex items-center gap-1.5 px-2 py-1 bg-surface-section rounded-lg border border-surface-border">
                                <span className="text-[8px] font-black uppercase tracking-widest text-text-muted">{key}</span>
                                <div className="w-8 h-1 bg-surface-border rounded-full overflow-hidden">
                                  <div className="h-full bg-primary" style={{ width: `${val * 100}%` }} />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Signal Detail Modal */}
      <AnimatePresence>
        {selectedSignal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="card w-full max-w-2xl bg-surface-section border-2 border-primary/30 shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-surface-border flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    selectedSignal.severity === 'CRITICAL' ? 'bg-error/10 text-error' :
                    selectedSignal.severity === 'HIGH' ? 'bg-orange-500/10 text-orange-500' :
                    'bg-primary/10 text-primary'
                  }`}>
                    <Zap size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black uppercase tracking-widest">Détails du Signal</h3>
                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{selectedSignal.id}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedSignalId(null)}
                  className="p-2 hover:bg-surface-card rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-8 space-y-8">
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="text-[10px] font-black uppercase tracking-widest text-text-muted">Confiance Globale</div>
                    <div className="text-4xl font-headline font-black text-primary">
                      {(selectedSignal.confidence * 100).toFixed(0)}%
                    </div>
                    <div className="w-full h-2 bg-surface-border rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${selectedSignal.confidence * 100}%` }}
                        className="h-full bg-primary"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="text-[10px] font-black uppercase tracking-widest text-text-muted">Sévérité & Action</div>
                    <div className={`text-2xl font-headline font-black ${
                      selectedSignal.severity === 'CRITICAL' ? 'text-error' :
                      selectedSignal.severity === 'HIGH' ? 'text-orange-500' :
                      'text-success'
                    }`}>
                      {selectedSignal.severity}
                    </div>
                    <div className="text-xs font-black uppercase tracking-widest text-text-muted">
                      RECOMMANDATION: {selectedSignal.recommendedAction}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="text-[10px] font-black uppercase tracking-widest text-text-muted">Narration ADSE</div>
                  <div className="p-6 bg-surface-card border border-surface-border rounded-2xl italic text-sm leading-relaxed text-text-main">
                    "{selectedSignal.narrativeExplainability}"
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(selectedSignal.signals).map(([key, val]) => (
                    <div key={key} className="card p-4 bg-surface-card border border-surface-border">
                      <div className="text-[8px] font-black uppercase tracking-widest text-text-muted mb-2">{key}</div>
                      <div className="text-xl font-headline font-black">{(val * 100).toFixed(0)}%</div>
                      <div className="w-full h-1 bg-surface-border rounded-full mt-2 overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${val * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 bg-surface-card border-t border-surface-border flex justify-end">
                <button 
                  onClick={() => setSelectedSignalId(null)}
                  className="px-8 py-3 bg-primary text-surface text-xs font-black uppercase tracking-widest rounded-xl hover:bg-primary-hover transition-colors"
                >
                  Fermer l'Audit
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
