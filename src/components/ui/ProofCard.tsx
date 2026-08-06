import React from 'react';
import { ShieldCheck, FileCheck, AlertTriangle, Clock, Activity, Target, Zap, ChevronRight } from 'lucide-react';
import { Proof } from '../../types';

export interface ProofCardProps {
  proof: Proof;
  onInspectSeals?: (proof: Proof) => void;
  className?: string;
  isCompact?: boolean;
}

export const ProofCard: React.FC<ProofCardProps> = ({
  proof,
  onInspectSeals,
  className = '',
  isCompact = false
}) => {
  // Determine status styling
  const isVerified = proof.status === 'preuve_verifiee' || (proof.scoreAggregate && proof.scoreAggregate.validationCount > 0);
  const isDisputed = proof.status === 'rejetee';
  const isPending = proof.status === 'en_verification' || proof.status === 'preuve_structuree';

  const statusColorClass = isVerified
    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold'
    : isDisputed
    ? 'border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-400 font-bold'
    : 'border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-300 font-bold';

  const statusLabel = isVerified
    ? 'VALIDÉE PAR PAIRS'
    : isDisputed
    ? 'LITIGE / CONTESTÉE'
    : 'EN ATTENTE DE SCEAU';

  const strengthLabel = proof.strength
    ? proof.strength.toUpperCase()
    : 'STRUCTURÉE';

  const strengthColorClass = proof.strength === 'credible'
    ? 'text-amber-700 dark:text-amber-400 bg-amber-500/10 border-amber-500/30 font-bold'
    : proof.strength === 'moyenne'
    ? 'text-blue-700 dark:text-blue-400 bg-blue-500/10 border-blue-500/30 font-bold'
    : 'text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 font-bold';

  const validationCount = proof.scoreAggregate?.validationCount ?? 0;

  return (
    <div
      className={`relative rounded-2xl bg-surface border border-surface-border p-5 md:p-6 transition-all duration-200 hover:border-surface-hover shadow-xl ${
        isVerified ? 'hover:border-emerald-500/40' : ''
      } ${className}`}
    >
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-surface-border pb-4 mb-4">
        <div className="space-y-1 max-w-xl">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-xs font-bold tracking-wider text-text-muted uppercase">
              ID: {proof.id.slice(0, 10)}
            </span>
            <span className="text-text-dim">•</span>
            <span className="font-mono text-xs text-text-muted flex items-center gap-1">
              <Clock className="w-3 h-3 text-text-muted" />
              {proof.date || 'Ancré récemment'}
            </span>
          </div>
          <h3 className="text-lg md:text-xl font-bold font-display text-text leading-snug">
            {proof.title}
          </h3>
        </div>

        {/* Status & Strength Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider border ${statusColorClass}`}>
            {isVerified ? (
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            ) : isDisputed ? (
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
            ) : (
              <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            )}
            {statusLabel}
          </span>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold border ${strengthColorClass}`}>
            FORCE: {strengthLabel}
          </span>
        </div>
      </div>

      {/* Tripartite Body: Contexte -> Action -> Résultat */}
      <div className="space-y-4">
        {/* Contexte / Problème */}
        {(proof.causality || proof.before) && (
          <div className="rounded-xl bg-surface-section border border-surface-border p-3.5">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-text-muted mb-1">
              <Activity className="w-3.5 h-3.5 text-blue-500" />
              <span>Contexte & Problématique</span>
            </div>
            <p className="text-sm text-text-muted leading-relaxed">
              {proof.causality || proof.before || 'Contexte opérationnel défini.'}
            </p>
          </div>
        )}

        {/* Action Spécifique */}
        {(proof.action || proof.description) && (
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-text-muted">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Contribution Spécifique</span>
            </div>
            <p className="text-sm text-text leading-relaxed font-normal">
              {proof.action || proof.description}
            </p>
          </div>
        )}

        {/* Encart Résultat Mesurable */}
        <div className="rounded-xl bg-surface-section border border-blue-500/20 p-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-emerald-500">
              <Target className="w-3.5 h-3.5" />
              <span>Impact Mesurable Certifié</span>
            </div>
            {proof.scoreAggregate && proof.scoreAggregate.totalWeightedScore > 0 && (
              <span className="font-mono text-xs text-amber-500 font-bold">
                +{Math.round(proof.scoreAggregate.totalWeightedScore)} PTS CRÉDIBILITÉ
              </span>
            )}
          </div>
          <p className="font-mono text-base md:text-lg font-bold text-emerald-600 dark:text-emerald-300 leading-snug">
            {proof.result || 'Résultat quantifié et documenté dans le registre.'}
          </p>
        </div>
      </div>

      {/* Footer */}
      {!isCompact && (
        <div className="mt-5 pt-4 border-t border-surface-border flex flex-wrap items-center justify-between gap-3 text-xs text-text-muted">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-mono text-text font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>{validationCount} {validationCount === 1 ? 'Sceau Apposé' : 'Sceaux Apposés'}</span>
            </span>
            {proof.authorIdentityLinked && (
              <span className="font-mono text-[11px] text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                IDENTITÉ SOUVERAINE LIÉE
              </span>
            )}
          </div>

          {onInspectSeals && (
            <button
              onClick={() => onInspectSeals(proof)}
              className="inline-flex items-center gap-1 text-xs font-mono font-semibold text-blue-500 hover:text-blue-600 dark:hover:text-blue-300 transition-colors"
            >
              <span>Inspecter le registre</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
