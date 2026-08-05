import React from 'react';
import { ShieldCheck, UserCheck, Briefcase, Award, Clock } from 'lucide-react';
import { ProofValidation } from '../../types';

export interface ValidationSealProps {
  validation: ProofValidation;
  validatorName?: string;
  validatorRole?: string;
  validatorAvatar?: string;
  className?: string;
}

export const ValidationSeal: React.FC<ValidationSealProps> = ({
  validation,
  validatorName,
  validatorRole,
  validatorAvatar,
  className = ''
}) => {
  const isApproved = validation.status === 'approved';
  const isRejected = validation.status === 'rejected';

  const typeLabel =
    validation.validatorType === 'manager'
      ? 'SUPERVISEUR'
      : validation.validatorType === 'client'
      ? 'CLIENT'
      : validation.validatorType === 'automated'
      ? 'AUTOMATISÉ'
      : 'PAIR DU RÉSEAU';

  const typeIcon =
    validation.validatorType === 'manager' ? (
      <Briefcase className="w-3.5 h-3.5 text-blue-400" />
    ) : validation.validatorType === 'client' ? (
      <Award className="w-3.5 h-3.5 text-amber-400" />
    ) : (
      <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
    );

  const formattedDate =
    typeof validation.timestamp === 'string'
      ? validation.timestamp
      : validation.timestamp?.toDate
      ? validation.timestamp.toDate().toLocaleDateString('fr-FR')
      : 'Attesté récent';

  return (
    <div
      className={`rounded-xl bg-surface border border-surface-border p-4 relative overflow-hidden transition-all duration-200 hover:border-surface-hover ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Avatar or Placeholder */}
          <div className="relative">
            {validatorAvatar ? (
              <img
                src={validatorAvatar}
                alt={validatorName || 'Validateur'}
                className="w-10 h-10 rounded-full object-cover border border-surface-border"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-surface-section border border-surface-border flex items-center justify-center font-mono font-bold text-text text-sm">
                {(validatorName || 'V').charAt(0).toUpperCase()}
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 bg-surface rounded-full p-0.5 border border-surface-border">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-display font-bold text-sm text-text">
                {validatorName || 'Validateur Anonyme'}
              </h4>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-text-muted mt-0.5">
              {typeIcon}
              <span className="font-mono text-[11px] font-semibold text-text uppercase">
                {validatorRole || typeLabel}
              </span>
            </div>
          </div>
        </div>

        {/* Seal Weight Badge */}
        <div className="text-right">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            POIDS {validation.weight ? validation.weight.toFixed(1) : '1.0'}
          </span>
          <div className="flex items-center justify-end gap-1 text-[11px] font-mono text-text-dim mt-1">
            <Clock className="w-3 h-3" />
            <span>{formattedDate}</span>
          </div>
        </div>
      </div>

      {/* Validation Comment */}
      {validation.comment && (
        <div className="mt-3 pt-2.5 border-t border-surface-border/60 text-xs text-text-muted italic bg-surface-section p-2.5 rounded-lg">
          "{validation.comment}"
        </div>
      )}
    </div>
  );
};
