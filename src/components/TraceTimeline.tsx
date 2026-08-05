import React from 'react';
import { Terminal, Activity, ShieldCheck, AlertCircle } from 'lucide-react';

interface TraceEntry {
  id: string;
  timestamp: string;
  moduleId: string;
  intent: string;
  status: 'success' | 'warning' | 'error';
  traceId: string;
}

const TraceTimeline: React.FC<{ entries: TraceEntry[] }> = ({ entries }) => {
  return (
    <div className="bg-surface border border-surface-border font-mono text-[10px] overflow-hidden flex flex-col h-full">
      <div className="bg-surface-section border-b border-surface-border p-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal size={14} className="text-cyan" />
          <span className="uppercase tracking-widest font-black text-text-dim">SYSTEM_TRACE_LOG</span>
        </div>
        <div className="flex items-center gap-2">
          <Activity size={12} className="text-success animate-pulse" />
          <span className="text-[8px] text-success font-black">REALTIME_POLLING</span>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto p-2 space-y-1 bg-bg/50 custom-scrollbar">
        {entries.length === 0 && (
          <div className="text-text-dim/30 p-4 text-center">NO_ACTIVITY_DETECTED</div>
        )}
        {entries.map((entry) => (
          <div key={entry.id} className="flex gap-3 hover:bg-surface-section/50 py-1 px-2 border-l border-surface-border group">
            <span className="text-text-dim opacity-50 shrink-0">[{entry.timestamp.split('T')[1].split('.')[0]}]</span>
            <span className="text-cyan font-bold shrink-0">{entry.moduleId.toUpperCase()}</span>
            <span className="text-text-main shrink-1 truncate">{entry.intent}</span>
            <div className="ml-auto flex items-center gap-2 shrink-0">
              {entry.status === 'success' && <ShieldCheck size={10} className="text-success" />}
              {entry.status === 'warning' && <AlertCircle size={10} className="text-amber" />}
              <span className="text-[8px] text-text-dim opacity-30 group-hover:opacity-100 transition-opacity uppercase">ID: {entry.traceId.substring(0, 6)}</span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-surface-section p-1 px-3 flex justify-between border-t border-surface-border opacity-50 italic">
        <span>total_events: {entries.length}</span>
        <span>kernel_v: 1.1.0-alpha</span>
      </div>
    </div>
  );
};

export default TraceTimeline;
