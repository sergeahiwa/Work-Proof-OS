import React from 'react';
import { ShieldCheck, Info, Award, Users, Briefcase } from 'lucide-react';

export interface CredibilityScoreProps {
  score: number; // 0-100 or raw aggregate score
  proofCount?: number;
  validationCount?: number;
  confidenceIndex?: number;
  className?: string;
  isCompact?: boolean;
}

export const CredibilityScore: React.FC<CredibilityScoreProps> = ({
  score,
  proofCount = 0,
  validationCount = 0,
  confidenceIndex = 1.0,
  className = '',
  isCompact = false
}) => {
  const roundedScore = Math.round(score);

  return (
    <div
      className={`rounded-2xl bg-surface border border-surface-border p-5 md:p-6 relative overflow-hidden shadow-xl ${className}`}
    >
      {/* Background Accent Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Main Score Display */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-amber-500">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Crédibilité Certifiée</span>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="font-mono text-4xl md:text-5xl font-extrabold text-text tracking-tight">
              {roundedScore}
            </span>
            <span className="font-mono text-sm font-bold text-amber-500/90 uppercase tracking-wider">
              PTS CRÉDIBILITÉ
            </span>
          </div>

          <p className="text-xs text-text-muted flex items-center gap-1 font-mono pt-0.5">
            <Info className="w-3.5 h-3.5 text-text-dim shrink-0" />
            <span>Calcul Transactionnel O(1) • Source Consensus</span>
          </p>
        </div>

        {/* Distribution Breakdown & Metrics */}
        {!isCompact && (
          <div className="flex flex-wrap items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 md:border-l border-surface-border md:pl-6">
            <div className="rounded-xl bg-surface-section border border-surface-border p-3 text-center min-w-[90px]">
              <div className="flex items-center justify-center gap-1 text-text-muted text-xs mb-0.5">
                <Award className="w-3.5 h-3.5 text-blue-500" />
                <span className="font-mono uppercase text-[10px]">Preuves</span>
              </div>
              <span className="font-mono text-lg font-bold text-text">
                {proofCount}
              </span>
            </div>

            <div className="rounded-xl bg-surface-section border border-surface-border p-3 text-center min-w-[90px]">
              <div className="flex items-center justify-center gap-1 text-text-muted text-xs mb-0.5">
                <Users className="w-3.5 h-3.5 text-emerald-500" />
                <span className="font-mono uppercase text-[10px]">Sceaux</span>
              </div>
              <span className="font-mono text-lg font-bold text-emerald-500">
                {validationCount}
              </span>
            </div>

            <div className="rounded-xl bg-surface-section border border-surface-border p-3 text-center min-w-[90px]">
              <div className="flex items-center justify-center gap-1 text-text-muted text-xs mb-0.5">
                <Briefcase className="w-3.5 h-3.5 text-amber-500" />
                <span className="font-mono uppercase text-[10px]">Indice</span>
              </div>
              <span className="font-mono text-lg font-bold text-amber-500">
                {Math.round(confidenceIndex * 100)}%
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
