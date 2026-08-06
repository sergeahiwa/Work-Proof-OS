import React from 'react';
import { 
  Zap, 
  CheckCircle2, 
  Clock, 
  Server, 
  ArrowRight, 
  ShieldCheck,
  Activity,
  AlertCircle
} from 'lucide-react';
import { KairosHandshake } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface KairosHandshakePanelProps {
  handshakes: KairosHandshake[];
}

export default function KairosHandshakePanel({ handshakes }: KairosHandshakePanelProps) {
  const stats = {
    total: handshakes.length,
    acknowledged: handshakes.filter(h => h.status === 'ACKNOWLEDGED').length,
    avgLatency: handshakes.length > 0 
      ? handshakes.reduce((acc, h) => acc + h.latency, 0) / handshakes.length 
      : 0,
    failed: handshakes.filter(h => h.status === 'FAILED').length
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Stats Header */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-4 bg-surface-section border border-surface-border">
          <div className="flex items-center gap-2 mb-2">
            <Activity size={14} className="text-primary" />
            <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Total Signaux</span>
          </div>
          <div className="text-2xl font-headline font-black">{stats.total}</div>
        </div>
        <div className="card p-4 bg-surface-section border border-surface-border">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 size={14} className="text-success" />
            <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Ack Reçus</span>
          </div>
          <div className="text-2xl font-headline font-black text-success">{stats.acknowledged}</div>
        </div>
        <div className="card p-4 bg-surface-section border border-surface-border">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={14} className="text-info" />
            <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Temps de Validation Moyen</span>
          </div>
          <div className="text-2xl font-headline font-black text-info">{stats.avgLatency.toFixed(1)}ms</div>
        </div>
        <div className="card p-4 bg-surface-section border border-surface-border">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle size={14} className="text-error" />
            <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Échecs</span>
          </div>
          <div className="text-2xl font-headline font-black text-error">{stats.failed}</div>
        </div>
      </div>

      {/* Handshake List */}
      <div className="card border-2 border-surface-border overflow-hidden">
        <div className="p-4 bg-surface-section border-b-2 border-surface-border flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Server size={18} className="text-primary" />
            <h3 className="text-sm font-black uppercase tracking-widest">Flux de Synchronisation de Preuves</h3>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-success">Lien Actif</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface-section/50 border-b border-surface-border">
              <tr>
                <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-text-muted">Timestamp</th>
                <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-text-muted">Signal ID</th>
                <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-text-muted">Réseau</th>
                <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-text-muted">Status</th>
                <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-text-muted">Latence</th>
                <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-text-muted">Token KAIROS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              <AnimatePresence mode="popLayout">
                {handshakes.slice().reverse().map((h) => (
                  <motion.tr 
                    key={h.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="hover:bg-surface-section/30 transition-colors"
                  >
                    <td className="px-6 py-4 text-[10px] font-mono font-bold">
                      {new Date(h.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="px-6 py-4 text-[10px] font-mono text-primary">
                      {h.signalId.substring(0, 12)}...
                    </td>
                    <td className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">
                      {h.networkId}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${
                        h.status === 'ACKNOWLEDGED' ? 'bg-success/10 text-success border-success/20' :
                        h.status === 'SENT' ? 'bg-info/10 text-info border-info/20' :
                        'bg-error/10 text-error border-error/20'
                      }`}>
                        {h.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[10px] font-bold">
                      {h.latency}ms
                    </td>
                    <td className="px-6 py-4 text-[8px] font-mono text-text-muted break-all max-w-[150px]">
                      {h.kairosMetadata?.validationToken || 'PENDING...'}
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* Handshake Visual Flow */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center p-8 bg-surface-section rounded-2xl border-2 border-surface-border border-dashed">
        <div className="flex flex-col items-center gap-4">
          <div className="p-6 bg-primary/10 rounded-full text-primary border-2 border-primary/20 shadow-lg shadow-primary/5">
            <Activity size={32} />
          </div>
          <div className="text-center">
            <h4 className="text-xs font-black uppercase tracking-widest">Work Proof</h4>
            <p className="text-[8px] font-bold text-text-muted uppercase">Signal Producer</p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="w-full h-1 bg-surface-border relative overflow-hidden rounded-full">
            <motion.div 
              className="absolute inset-0 bg-primary"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
          </div>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary">
            <Zap size={12} /> Encrypted Stream
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="p-6 bg-info/10 rounded-full text-info border-2 border-info/20 shadow-lg shadow-info/5">
            <ShieldCheck size={32} />
          </div>
          <div className="text-center">
            <h4 className="text-xs font-black uppercase tracking-widest">KAIROS DSA</h4>
            <p className="text-[8px] font-bold text-text-muted uppercase">Decision Aggregator</p>
          </div>
        </div>
      </div>
    </div>
  );
}
