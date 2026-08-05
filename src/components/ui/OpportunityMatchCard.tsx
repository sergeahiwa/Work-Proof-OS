import React from 'react';
import { Briefcase, ShieldCheck, CheckCircle2, AlertCircle, ArrowUpRight } from 'lucide-react';
import { Proof } from '../../types';

export interface OpportunityMatchCardProps {
  roleTitle: string;
  companyName?: string;
  matchPercentage: number; // 0-100
  requiredSkills: string[];
  verifiedSkills: string[];
  matchingProofs?: Proof[];
  onApplyOrInspect?: () => void;
  className?: string;
}

export const OpportunityMatchCard: React.FC<OpportunityMatchCardProps> = ({
  roleTitle,
  companyName = 'Opportunité Réseau',
  matchPercentage,
  requiredSkills,
  verifiedSkills,
  matchingProofs = [],
  onApplyOrInspect,
  className = ''
}) => {
  const roundedMatch = Math.round(matchPercentage);

  const matchColorClass =
    roundedMatch >= 80
      ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30'
      : roundedMatch >= 50
      ? 'text-amber-500 bg-amber-500/10 border-amber-500/30'
      : 'text-text-muted bg-surface-hover border-surface-border';

  return (
    <div
      className={`rounded-2xl bg-surface border border-surface-border p-5 md:p-6 shadow-xl relative overflow-hidden transition-all duration-200 hover:border-surface-hover ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-surface-border pb-4 mb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-semibold text-text-muted mb-1">
            <Briefcase className="w-3.5 h-3.5 text-blue-500" />
            <span>{companyName}</span>
          </div>
          <h3 className="font-display font-bold text-lg md:text-xl text-text">
            {roleTitle}
          </h3>
        </div>

        {/* Match Percentage Pill */}
        <div className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border font-mono font-bold text-sm shrink-0 ${matchColorClass}`}>
          <ShieldCheck className="w-4 h-4" />
          <span>MATCH {roundedMatch}% (PREUVES)</span>
        </div>
      </div>

      {/* Skills Coverage Breakdown */}
      <div className="space-y-3 mb-5">
        <div className="flex items-center justify-between text-xs font-mono font-semibold text-text-muted">
          <span>COMPÉTENCES REQUISES ({verifiedSkills.length}/{requiredSkills.length} ATTESTÉES)</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {requiredSkills.map((skill) => {
            const isVerified = verifiedSkills.includes(skill);
            return (
              <span
                key={skill}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-medium border ${
                  isVerified
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border-emerald-500/30'
                    : 'bg-surface-section text-text-muted border-surface-border'
                }`}
              >
                {isVerified ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5 text-text-dim" />
                )}
                <span>{skill}</span>
              </span>
            );
          })}
        </div>
      </div>

      {/* Matching Proofs Preview */}
      {matchingProofs.length > 0 && (
        <div className="border-t border-surface-border pt-3.5 mb-4 space-y-2">
          <div className="text-xs font-mono font-semibold text-text-muted uppercase">
            Preuves associées ({matchingProofs.length})
          </div>
          <div className="space-y-1.5">
            {matchingProofs.slice(0, 2).map((proof) => (
              <div
                key={proof.id}
                className="flex items-center justify-between text-xs font-mono bg-surface-section p-2 rounded-lg border border-surface-border text-text"
              >
                <span className="truncate max-w-[280px]">{proof.title}</span>
                <span className="text-emerald-500 text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 shrink-0">
                  VALIDÉ
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action CTA */}
      {onApplyOrInspect && (
        <button
          onClick={onApplyOrInspect}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-display font-bold text-sm bg-blue-600 hover:bg-blue-500 text-white transition-colors shadow-lg shadow-blue-600/20"
        >
          <span>Consulter le dossier certifié</span>
          <ArrowUpRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
