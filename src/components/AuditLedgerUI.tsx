import React from 'react';
import { Database, Link as LinkIcon, RefreshCw } from 'lucide-react';

interface AuditRecord {
  id: string;
  hash: string;
  actor: string;
  type: string;
  block: number;
}

const AuditLedgerUI: React.FC<{ records: AuditRecord[] }> = ({ records }) => {
  return (
    <div className="bg-surface border border-surface-border text-[9px] font-mono">
      <div className="p-3 border-b border-surface-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Database size={14} className="text-amber" />
          <span className="font-black tracking-widest text-text">AUDIT_LEDGER_CHAIN</span>
        </div>
        <RefreshCw size={12} className="text-text-dim hover:text-cyan cursor-pointer transition-colors" />
      </div>
      
      <table className="w-full text-left">
        <thead className="bg-surface-section text-text-dim border-b border-surface-border">
          <tr>
            <th className="p-2 font-black uppercase">Block</th>
            <th className="p-2 font-black uppercase">Actor_Hash</th>
            <th className="p-2 font-black uppercase">Type</th>
            <th className="p-2 font-black uppercase">Payload_Sig</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r) => (
            <tr key={r.id} className="border-b border-surface-border/50 hover:bg-surface-hover transition-colors">
              <td className="p-2 text-amber font-bold">#{r.block}</td>
              <td className="p-2 text-text-muted truncate max-w-[80px]">{r.actor}</td>
              <td className="p-2">
                <span className="bg-surface-section px-1.5 py-0.5 border border-surface-border text-text-main uppercase font-bold">
                  {r.type}
                </span>
              </td>
              <td className="p-2 text-text-dim font-mono flex items-center gap-1">
                <LinkIcon size={8} />
                {r.hash.substring(0, 12)}...
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AuditLedgerUI;
