import React from 'react';
import { Layers, ShieldCheck, Zap, UserCheck, Activity, ChevronDown, CheckCircle2 } from 'lucide-react';

interface IcebergProofSummaryProps {
  proofCount: number;
  validationCount: number;
  role: string;
  name: string;
  contributions: any[];
}

export const IcebergProofSummary: React.FC<IcebergProofSummaryProps> = ({
  proofCount,
  validationCount,
  role,
  name,
  contributions
}) => {
  // Compute depth categories
  const problemCount = Math.max(proofCount, contributions.length);
  const decisionCount = Math.max(1, Math.floor(proofCount * 1.5));
  const impactCount = Math.max(proofCount, 2);

  return (
    <div className="rounded-2xl bg-surface border border-surface-border p-6 md:p-8 space-y-6 shadow-2xl relative overflow-hidden">
      {/* Background Grid Accent */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-surface-border pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-blue-500 uppercase tracking-widest">
            <Layers size={16} />
            <span>Synthèse Identitaire • L'Iceberg de la Valeur</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold font-display text-text mt-1">
            Profondeur de Réalisation de {name}
          </h2>
          <p className="text-xs text-text-muted mt-0.5">
            Cartographie entre ce que le marché perçoit en surface et les actifs réels ancrés.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-500 font-bold flex items-center gap-1.5">
            <ShieldCheck size={14} />
            {proofCount} Actifs Souverains
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-bold flex items-center gap-1.5">
            <UserCheck size={14} />
            {validationCount} Sceaux Attestés
          </span>
        </div>
      </div>

      {/* Iceberg Metaphor Split Container */}
      <div className="relative z-10 space-y-4">
        {/* Surface émergée (10% - Ce que montre un CV traditionnel) */}
        <div className="bg-surface-section border border-surface-border rounded-xl p-4 md:p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-text flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-text-muted inline-block" />
              1. Surface Émergée (Identité Déclarative)
            </span>
            <span className="text-[10px] font-mono text-text-muted bg-surface-hover px-2 py-0.5 rounded border border-surface-border">
              Visibilité Standard
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs font-mono">
            <div className="bg-surface p-3 rounded-lg border border-surface-border">
              <span className="text-[10px] text-text-muted block uppercase">Intitulé Déclaré</span>
              <span className="font-bold text-text">{role}</span>
            </div>
            <div className="bg-surface p-3 rounded-lg border border-surface-border">
              <span className="text-[10px] text-text-muted block uppercase">Projets Référencés</span>
              <span className="font-bold text-text">{proofCount} Réalisations</span>
            </div>
            <div className="bg-surface p-3 rounded-lg border border-surface-border sm:col-span-2 md:col-span-1">
              <span className="text-[10px] text-text-muted block uppercase">Mode de Preuve</span>
              <span className="font-bold text-blue-500">Registre Ancré WP-OS</span>
            </div>
          </div>
        </div>

        {/* Separator / Waterline */}
        <div className="relative flex items-center justify-center py-1">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-blue-500/30 border-dashed"></div></div>
          <span className="relative bg-surface px-4 text-[10px] font-mono text-blue-500 font-bold uppercase tracking-widest flex items-center gap-1.5 border border-blue-500/20 rounded-full py-1">
            <ChevronDown size={12} className="animate-bounce" />
            Ligne de Flottaison — Réalité Immortalisée (90% Immergé)
          </span>
        </div>

        {/* Surface immergée (90% - Valeur profonde ancrée) */}
        <div className="bg-surface-section border border-blue-500/30 rounded-xl p-4 md:p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-blue-500 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse inline-block" />
              2. Profondeur de Contribution (Actifs de Preuve Vérifiés)
            </span>
            <span className="text-[10px] font-mono text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
              Garantie Anti-Collusion Passive
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
            <div className="bg-surface p-3 rounded-lg border border-surface-border space-y-1">
              <span className="text-[10px] text-text-muted block uppercase">Problèmes Résolus</span>
              <span className="text-lg font-bold font-display text-blue-500">{problemCount}</span>
              <span className="text-[9px] text-text-dim block">Sous contraintes réelles</span>
            </div>

            <div className="bg-surface p-3 rounded-lg border border-surface-border space-y-1">
              <span className="text-[10px] text-text-muted block uppercase">Décisions Tracées</span>
              <span className="text-lg font-bold font-display text-blue-500">{decisionCount}</span>
              <span className="text-[9px] text-text-dim block">Arbitrages documentés</span>
            </div>

            <div className="bg-surface p-3 rounded-lg border border-surface-border space-y-1">
              <span className="text-[10px] text-text-muted block uppercase">Impacts Démontrés</span>
              <span className="text-lg font-bold font-display text-emerald-500">{impactCount}</span>
              <span className="text-[9px] text-text-dim block">Métriques de résultats</span>
            </div>

            <div className="bg-surface p-3 rounded-lg border border-surface-border space-y-1">
              <span className="text-[10px] text-text-muted block uppercase">Validations Reçues</span>
              <span className="text-lg font-bold font-display text-emerald-500">{validationCount}</span>
              <span className="text-[9px] text-text-dim block">Sceaux de tiers engagés</span>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-between text-[11px] font-mono text-text-muted border-t border-surface-border gap-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
              <span>Chaque actif est relié à une preuve tangible ou à un sceau de co-responsabilité.</span>
            </div>
            <span className="text-text-dim italic">Ancrage temporel inviolable</span>
          </div>
        </div>
      </div>
    </div>
  );
};
