import React from 'react';
import { ShieldCheck, FileCheck, Calendar, ArrowUpRight } from 'lucide-react';
import { Proof } from '../../types';

export interface ImpactTrajectoryProps {
  proofs: Proof[];
  onSelectProof?: (proof: Proof) => void;
  className?: string;
}

export const ImpactTrajectory: React.FC<ImpactTrajectoryProps> = ({
  proofs,
  onSelectProof,
  className = ''
}) => {
  if (!proofs || proofs.length === 0) {
    return (
      <div className={`rounded-2xl bg-surface border border-surface-border p-6 text-center text-text-muted font-mono text-sm ${className}`}>
        Aucune empreinte de réalisation ancrée dans la trajectoire.
      </div>
    );
  }

  return (
    <div className={`rounded-2xl bg-surface border border-surface-border p-5 md:p-6 shadow-xl ${className}`}>
      <div className="flex items-center justify-between border-b border-surface-border pb-4 mb-6">
        <div>
          <h3 className="font-display font-bold text-lg text-text flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <span>Trajectoire d'Impact Certifiée</span>
          </h3>
          <p className="text-xs text-text-muted font-mono mt-0.5">
            Historique chronologique des réalisations attestées par consensus
          </p>
        </div>
        <span className="font-mono text-xs font-bold text-text bg-surface-section px-3 py-1 rounded-full border border-surface-border">
          {proofs.length} {proofs.length === 1 ? 'Actif Ancré' : 'Actifs Ancrés'}
        </span>
      </div>

      {/* Vertical Timeline */}
      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-surface-border">
        {proofs.map((proof) => {
          const isVerified = proof.status === 'preuve_verifiee' || (proof.scoreAggregate && proof.scoreAggregate.validationCount > 0);

          return (
            <div key={proof.id} className="relative group">
              {/* Timeline Node Icon */}
              <div
                className={`absolute -left-6 top-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                  isVerified
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-500 shadow-lg shadow-emerald-500/20'
                    : 'bg-surface border-surface-border text-text-muted'
                }`}
              >
                {isVerified ? (
                  <ShieldCheck className="w-3 h-3" />
                ) : (
                  <FileCheck className="w-3 h-3" />
                )}
              </div>

              {/* Node Card */}
              <div
                onClick={() => onSelectProof && onSelectProof(proof)}
                className={`rounded-xl bg-surface-section border border-surface-border p-4 transition-all duration-200 ${
                  onSelectProof ? 'cursor-pointer hover:border-surface-hover hover:bg-surface-hover' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-text-muted flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-text-dim" />
                        {proof.date || 'Ancré récemment'}
                      </span>
                      {isVerified && (
                        <span className="font-mono text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          VALIDÉ
                        </span>
                      )}
                    </div>
                    <h4 className="font-display font-bold text-base text-text leading-snug group-hover:text-blue-500 transition-colors">
                      {proof.title}
                    </h4>
                  </div>

                  {onSelectProof && (
                    <ArrowUpRight className="w-4 h-4 text-text-muted group-hover:text-blue-500 transition-colors" />
                  )}
                </div>

                {/* Key Result Highlight */}
                {proof.result && (
                  <p className="font-mono text-xs text-emerald-600 dark:text-emerald-300 bg-surface p-2.5 rounded-lg border border-surface-border mt-2">
                    <span className="text-text-muted mr-1">RÉSULTAT:</span>
                    {proof.result}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
