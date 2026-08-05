import React, { useState } from 'react';
import { 
  Shield, 
  Users, 
  Briefcase, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  CheckCircle2,
  Search, 
  BarChart3, 
  Scale,
  MessageSquare,
  History,
  ExternalLink,
  Gavel,
  ShieldAlert,
  ArrowRight,
  ShieldCheck,
  Zap,
  Activity,
  BookOpen,
  Check,
  Globe,
  Lock,
  Award,
  FileText,
  Eye
} from 'lucide-react';
import { mockMetrics, mockOutcomes, mockUsers, mockProjects } from '../store/mockData';
import { 
  RecruitmentOutcome, 
  TruthState, 
  ReliabilityLevel, 
  Proof, 
  ProofValidation 
} from '../types';
import { motion, AnimatePresence } from 'motion/react';
import GlossaryPanel from '../components/GlossaryPanel';
import TenantManagement from '../components/TenantManagement';
import { useAuth } from '../components/FirebaseProvider';
import { terminologyMap } from '../content/copy';

import { 
  CredibilityScore, 
  ProofCard, 
  ValidationSeal, 
  OpportunityMatchCard 
} from '../components/ui';

const VerdictBadge = ({ verdict }: { verdict: ReliabilityLevel }) => {
  const configs = {
    highly_reliable: { color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30', label: terminologyMap.verdict.getLabel('Highly Reliable'), icon: ShieldCheck },
    reliable: { color: 'text-blue-500 bg-blue-500/10 border-blue-500/30', label: terminologyMap.verdict.getLabel('Reliable'), icon: CheckCircle2 },
    uncertain: { color: 'text-amber-500 bg-amber-500/10 border-amber-500/30', label: 'Incertain', icon: Zap },
    risky: { color: 'text-rose-500 bg-rose-500/10 border-rose-500/30', label: 'Risqué', icon: AlertTriangle }
  };
  const config = configs[verdict] || configs.reliable;
  const Icon = config.icon;

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest border inline-flex items-center gap-1 w-fit ${config.color}`}>
      <Icon size={12} />
      {config.label}
    </span>
  );
};

const TruthStateBadge = ({ state }: { state: TruthState }) => {
  const configs = {
    verified: { color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30', label: 'Vérifié', icon: ShieldCheck },
    probable: { color: 'text-blue-500 bg-blue-500/10 border-blue-500/30', label: 'Probable', icon: Zap },
    disputed: { color: 'text-rose-500 bg-rose-500/10 border-rose-500/30', label: 'Contesté', icon: AlertTriangle },
    unverified: { color: 'text-text-muted bg-surface-hover border-surface-border', label: 'Non Vérifié', icon: History }
  };
  const config = configs[state] || configs.unverified;
  const Icon = config.icon;

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest border inline-flex items-center gap-1 w-fit ${config.color}`}>
      <Icon size={12} />
      {config.label}
    </span>
  );
};

export default function AdminDashboard() {
  const { user, profile } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'disputes' | 'fraud' | 'matches' | 'glossary' | 'tenants'>('overview');
  const [resolvedDisputeIds, setResolvedDisputeIds] = useState<string[]>([]);
  const [selectedOutcomeId, setSelectedOutcomeId] = useState<string | null>(mockOutcomes[0]?.id || null);

  const disputedOutcomes = mockOutcomes.filter(o => 
    (o.truthState === 'disputed' || o.disputeStatus === 'open') && !resolvedDisputeIds.includes(o.id)
  );

  const handleResolveDispute = (id: string) => {
    setResolvedDisputeIds(prev => [...prev, id]);
  };

  const currentSelectedOutcome = mockOutcomes.find(o => o.id === selectedOutcomeId) || mockOutcomes[0];
  const targetUser = mockUsers.find(u => u.id === currentSelectedOutcome?.userId) || mockUsers[0];

  // Helper to build proof objects for selected outcome
  const outcomeProofs: Proof[] = mockProjects.flatMap(p => p.proofs).length > 0
    ? mockProjects.flatMap(p => p.proofs).slice(0, 2).map((pr, idx) => ({
        ...pr,
        id: `pr_admin_${currentSelectedOutcome?.id}_${idx}`,
        title: `${currentSelectedOutcome?.role || 'Réalisation'} — Preuve sous Audit`,
        description: `Preuve soumise par ${targetUser.name} dans le cadre de la mission chez ${currentSelectedOutcome?.companyName}.`,
        verified: currentSelectedOutcome?.truthState === 'verified',
        confidenceScore: currentSelectedOutcome?.attributionConfidenceScore || 88
      }))
    : [];

  const outcomeValidations: ProofValidation[] = (currentSelectedOutcome?.validationSources || []).map((src, idx) => ({
    id: src.id || `val_admin_${idx}`,
    proofId: outcomeProofs[0]?.id || 'pr1',
    validatorId: `val_user_${idx}`,
    validatorType: idx === 0 ? 'manager' : idx === 1 ? 'client' : 'peer',
    status: src.status === 'verified' ? 'approved' : 'pending',
    comment: `Validation de la preuve par ${src.label}. Poids de réputation : ${src.weight || 0.8}.`,
    weight: src.weight || 0.8,
    timestamp: new Date().toISOString(),
    createdAt: new Date().toISOString()
  }));

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Demo Mode Banner */}
      {(!user || !profile) && (
        <div className="bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-300 p-4 rounded-xl flex items-center justify-between gap-4 text-xs font-mono font-semibold">
          <div className="flex items-center gap-2">
            <span className="bg-amber-500 text-white font-mono font-black px-2 py-0.5 rounded uppercase">Mode Démonstration</span>
            <span>Console d'administration Work Proof OS en environnement de test.</span>
          </div>
        </div>
      )}

      {/* Header Decision Console */}
      <header className="border-b border-surface-border pb-8 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-full text-xs font-mono font-bold uppercase tracking-widest">
              <Gavel size={14} /> Console d'Arbitrage & Supervision
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-extrabold text-text tracking-tight">
              Console de Décision <span className="text-blue-500 font-mono">Oracle</span>
            </h1>
            <p className="text-text-muted text-sm md:text-base max-w-2xl">
              Observez les anomalies réseau, arbitrez les litiges de preuves et supervisez les états de vérité en temps réel.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap bg-surface p-1.5 rounded-2xl border border-surface-border gap-1">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all ${
                activeTab === 'overview' 
                  ? 'bg-surface-section text-text border border-surface-border shadow-sm' 
                  : 'text-text-muted hover:text-text'
              }`}
            >
              Vue Globale
            </button>
            <button 
              onClick={() => setActiveTab('disputes')}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                activeTab === 'disputes' 
                  ? 'bg-surface-section text-text border border-surface-border shadow-sm' 
                  : 'text-text-muted hover:text-text'
              }`}
            >
              Litiges & Arbitrages
              {disputedOutcomes.length > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-rose-500 text-white font-bold">
                  {disputedOutcomes.length}
                </span>
              )}
            </button>
            <button 
              onClick={() => setActiveTab('fraud')}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all ${
                activeTab === 'fraud' 
                  ? 'bg-surface-section text-text border border-surface-border shadow-sm' 
                  : 'text-text-muted hover:text-text'
              }`}
            >
              Signaux de Risque
            </button>
            <button 
              onClick={() => setActiveTab('matches')}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all ${
                activeTab === 'matches' 
                  ? 'bg-surface-section text-text border border-surface-border shadow-sm' 
                  : 'text-text-muted hover:text-text'
              }`}
            >
              Matchs Audités
            </button>
            <button 
              onClick={() => setActiveTab('glossary')}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                activeTab === 'glossary' 
                  ? 'bg-surface-section text-text border border-surface-border shadow-sm' 
                  : 'text-text-muted hover:text-text'
              }`}
            >
              <BookOpen size={13} />
              Glossaire
            </button>
            <button 
              onClick={() => setActiveTab('tenants')}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                activeTab === 'tenants' 
                  ? 'bg-surface-section text-text border border-surface-border shadow-sm' 
                  : 'text-text-muted hover:text-text'
              }`}
            >
              <Users size={13} />
              Tenants
            </button>
          </div>
        </div>
      </header>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Integrity Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-surface p-6 rounded-2xl border border-surface-border space-y-3">
              <div className="flex justify-between items-start">
                <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500"><Scale size={20} /></div>
                <span className="text-xs font-mono font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">+2.4%</span>
              </div>
              <div>
                <span className="block text-[10px] font-mono font-bold uppercase tracking-widest text-text-muted">Indice de Vérité Global</span>
                <span className="text-3xl font-mono font-black text-text">94.2%</span>
              </div>
            </div>

            <div className="bg-surface p-6 rounded-2xl border border-surface-border space-y-3">
              <div className="flex justify-between items-start">
                <div className="p-3 bg-rose-500/10 rounded-xl text-rose-500"><AlertTriangle size={20} /></div>
                <span className="text-xs font-mono font-bold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">-15%</span>
              </div>
              <div>
                <span className="block text-[10px] font-mono font-bold uppercase tracking-widest text-text-muted">Taux de Litiges Actifs</span>
                <span className="text-3xl font-mono font-black text-rose-500">{disputedOutcomes.length * 2.1}%</span>
              </div>
            </div>

            <div className="bg-surface p-6 rounded-2xl border border-surface-border space-y-3">
              <div className="flex justify-between items-start">
                <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500"><Search size={20} /></div>
                <span className="text-xs font-mono font-bold text-text-muted">Stable</span>
              </div>
              <div>
                <span className="block text-[10px] font-mono font-bold uppercase tracking-widest text-text-muted">Faux Positifs Détectés</span>
                <span className="text-3xl font-mono font-black text-text">0.4%</span>
              </div>
            </div>

            <div className="bg-surface p-6 rounded-2xl border border-surface-border space-y-3">
              <div className="flex justify-between items-start">
                <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500"><ShieldCheck size={20} /></div>
                <span className="text-xs font-mono font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Ancré</span>
              </div>
              <div>
                <span className="block text-[10px] font-mono font-bold uppercase tracking-widest text-text-muted">Preuves Certifiées</span>
                <span className="text-3xl font-mono font-black text-emerald-500">68%</span>
              </div>
            </div>
          </div>

          {/* System Credibility Inspection */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-surface border border-surface-border p-6 rounded-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-surface-border pb-3">
                  <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-text flex items-center gap-2">
                    <Activity size={16} className="text-blue-500" /> Score Système Évalué
                  </h3>
                  <span className="text-xs font-mono text-emerald-500">Consensus d'Intégrité</span>
                </div>

                <CredibilityScore 
                  score={94}
                  proofCount={142}
                  validationCount={380}
                  confidenceIndex={0.96}
                />
              </div>

              {/* Sample Audited Proof Card */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-mono font-bold uppercase text-text-muted">Preuve sous Supervision</h4>
                  <span className="text-[10px] font-mono text-emerald-500">Vérification Automatique</span>
                </div>
                {outcomeProofs[0] && (
                  <ProofCard proof={outcomeProofs[0]} />
                )}
              </div>
            </div>

            {/* Audit Stream Table */}
            <div className="lg:col-span-7 bg-surface border border-surface-border rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-surface-border pb-3">
                <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-text flex items-center gap-2">
                  <History size={16} className="text-blue-500" /> Flux des Vérifications Récents
                </h3>
                <span className="text-xs font-mono text-text-muted">{mockOutcomes.length} Événements Audités</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-surface-section text-text-muted text-[10px] font-mono font-bold uppercase tracking-wider border-b border-surface-border">
                    <tr>
                      <th className="p-3">Candidat</th>
                      <th className="p-3">Entreprise</th>
                      <th className="p-3">Fiabilité</th>
                      <th className="p-3">État Vérité</th>
                      <th className="p-3">Confiance</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-border text-xs font-mono">
                    {mockOutcomes.map(outcome => {
                      const candidateUser = mockUsers.find(u => u.id === outcome.userId);
                      return (
                        <tr key={outcome.id} className="hover:bg-surface-hover transition-colors">
                          <td className="p-3 font-bold text-text">{candidateUser?.name || 'Inconnu'}</td>
                          <td className="p-3 text-text-muted">{outcome.companyName}</td>
                          <td className="p-3"><VerdictBadge verdict={outcome.verdict} /></td>
                          <td className="p-3"><TruthStateBadge state={outcome.truthState} /></td>
                          <td className="p-3">
                            <span className="font-bold text-blue-500">{outcome.attributionConfidenceScore}%</span>
                          </td>
                          <td className="p-3 text-right">
                            <button 
                              onClick={() => {
                                setSelectedOutcomeId(outcome.id);
                                setActiveTab('disputes');
                              }}
                              className="p-1.5 hover:bg-surface-hover text-text-muted hover:text-blue-500 rounded-lg transition-colors"
                              title="Examiner dans le centre d'arbitrage"
                            >
                              <Eye size={16} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DISPUTES TAB */}
      {activeTab === 'disputes' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-surface-border pb-4">
            <h2 className="text-xl font-display font-bold text-text uppercase tracking-tight flex items-center gap-2">
              <Gavel size={20} className="text-rose-500" /> Centre de Résolution des Litiges & Arbitrage
            </h2>
            <span className="text-xs font-mono font-bold text-rose-500 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
              {disputedOutcomes.length} Litige(s) en attente
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* List of Disputes */}
            <div className="lg:col-span-5 space-y-4">
              {disputedOutcomes.length > 0 ? (
                disputedOutcomes.map(outcome => {
                  const candidateUser = mockUsers.find(u => u.id === outcome.userId);
                  const isSelected = currentSelectedOutcome?.id === outcome.id;

                  return (
                    <div 
                      key={outcome.id} 
                      onClick={() => setSelectedOutcomeId(outcome.id)}
                      className={`p-5 rounded-2xl border cursor-pointer transition-all space-y-3 ${
                        isSelected 
                          ? 'bg-surface-section border-rose-500 shadow-lg shadow-rose-500/5' 
                          : 'bg-surface border-surface-border hover:border-surface-hover'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <h4 className="font-display font-bold text-text text-sm">{outcome.role}</h4>
                          <p className="text-xs font-mono text-text-muted">{outcome.companyName} • {candidateUser?.name}</p>
                        </div>
                        <VerdictBadge verdict={outcome.verdict} />
                      </div>

                      <div className="flex items-center justify-between text-xs font-mono text-text-muted pt-2 border-t border-surface-border">
                        <span className="text-rose-500 font-bold flex items-center gap-1">
                          <AlertTriangle size={12} /> Contesté le {new Date(outcome.disputeHistory?.[0]?.timestamp || outcome.updatedAt).toLocaleDateString()}
                        </span>
                        <span className="text-blue-500 font-bold">{outcome.attributionConfidenceScore}% Confiance</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-12 border-2 border-dashed border-surface-border rounded-2xl text-center bg-surface">
                  <CheckCircle size={40} className="text-emerald-500 mx-auto mb-3 opacity-60" />
                  <p className="text-text font-display font-bold">Aucun litige actif</p>
                  <p className="text-text-muted text-xs font-mono mt-1">L'ensemble des litiges soumis au réseau ont été arbitrés.</p>
                </div>
              )}
            </div>

            {/* Arbitration Detail & Verification Inspector */}
            <div className="lg:col-span-7">
              {currentSelectedOutcome ? (
                <div className="bg-surface border border-surface-border rounded-2xl p-6 md:p-8 space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-surface-border pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-2xl font-display font-extrabold text-text">{currentSelectedOutcome.role}</h3>
                        <TruthStateBadge state={currentSelectedOutcome.truthState} />
                      </div>
                      <p className="text-sm font-mono text-text-muted">{currentSelectedOutcome.companyName} — Candidat : {targetUser.name}</p>
                    </div>

                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleResolveDispute(currentSelectedOutcome.id)}
                        className="bg-emerald-500 hover:bg-emerald-400 text-white font-mono text-xs font-bold uppercase px-4 py-2.5 rounded-xl transition-colors flex items-center gap-1.5"
                      >
                        <Check size={14} /> Marquer comme Traité
                      </button>
                    </div>
                  </div>

                  {/* Disputed Arguments Box */}
                  <div className="bg-rose-500/10 border-l-4 border-rose-500 p-4 rounded-r-xl space-y-2">
                    <span className="block text-xs font-mono font-bold uppercase text-rose-500 flex items-center gap-1.5">
                      <AlertTriangle size={14} /> Arguments de la Contestation
                    </span>
                    <p className="text-sm font-display text-text italic">
                      "{currentSelectedOutcome.disputeHistory?.[0]?.reason || 'Divergence signalée sur l’attribution de la réalisation entre la partie cliente et le candidat.'}"
                    </p>
                  </div>

                  {/* Inspected Proofs Cards */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-mono font-bold uppercase text-text-muted flex items-center gap-2">
                      <ShieldCheck size={14} className="text-blue-500" /> Preuve Associée au Dossier
                    </h4>
                    {outcomeProofs[0] && (
                      <ProofCard proof={outcomeProofs[0]} />
                    )}
                  </div>

                  {/* Inspected Validation Seals */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-mono font-bold uppercase text-text-muted flex items-center gap-2">
                      <Award size={14} className="text-amber-500" /> Validation par Tiers Audités
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {outcomeValidations.map(val => (
                        <ValidationSeal 
                          key={val.id} 
                          validation={val}
                          validatorName="Évaluateur Certifié"
                          validatorRole="Superviseur Réseau"
                        />
                      ))}
                    </div>
                  </div>

                  {/* Technical Causal Signals */}
                  <div className="bg-surface-section p-5 rounded-xl border border-surface-border space-y-3 text-xs font-mono">
                    <span className="block font-bold text-text uppercase tracking-wider">Données Causales de la Plateforme</span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 border-t border-surface-border">
                      <div>
                        <span className="block text-text-dim text-[10px]">Causalité Ancrée</span>
                        <span className={`font-bold ${currentSelectedOutcome.isLockedToPlatform ? 'text-emerald-500' : 'text-rose-500'}`}>
                          {currentSelectedOutcome.isLockedToPlatform ? 'OUI' : 'NON'}
                        </span>
                      </div>
                      <div>
                        <span className="block text-text-dim text-[10px]">Confiance Ancrée</span>
                        <span className="font-bold text-blue-500">{currentSelectedOutcome.attributionConfidenceScore}%</span>
                      </div>
                      <div>
                        <span className="block text-text-dim text-[10px]">Signaux Externes</span>
                        <span className="font-bold text-text">{currentSelectedOutcome.externalSignals?.length || 0} détectés</span>
                      </div>
                      <div>
                        <span className="block text-text-dim text-[10px]">Anomalies</span>
                        <span className="font-bold text-amber-500">{currentSelectedOutcome.riskFlags?.length || 0} drapeaux</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full min-h-[400px] flex items-center justify-center p-8 bg-surface border border-surface-border rounded-2xl text-center text-text-muted font-mono text-sm">
                  Sélectionnez un litige pour l'arbitrer.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* FRAUD / RISK SIGNALS TAB */}
      {activeTab === 'fraud' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-surface-border pb-4">
            <h2 className="text-xl font-display font-bold text-text uppercase tracking-tight flex items-center gap-2">
              <ShieldAlert size={20} className="text-amber-500" /> Signaux de Risque & Détection Passive de Collusion
            </h2>
            <span className="text-xs font-mono font-bold text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
              Audit Continu Actif
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-surface p-6 rounded-2xl border border-surface-border space-y-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-text-muted">Patterns de Collusion Détectés</span>
              <div className="text-3xl font-mono font-black text-amber-500">12 Signaux</div>
              <p className="text-xs font-mono text-text-muted">Poids réputation sous surveillance</p>
            </div>
            <div className="bg-surface p-6 rounded-2xl border border-surface-border space-y-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-text-muted">Profils Atypiques en Révision</span>
              <div className="text-3xl font-mono font-black text-blue-500">45 Profils</div>
              <p className="text-xs font-mono text-text-muted">Espace de preuve sous contrôle</p>
            </div>
            <div className="bg-surface p-6 rounded-2xl border border-surface-border space-y-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-text-muted">Fiabilité Réseau Moyenne</span>
              <div className="text-3xl font-mono font-black text-emerald-500">94.2%</div>
              <p className="text-xs font-mono text-emerald-500">Intégrité certifiée par contrat</p>
            </div>
          </div>

          <div className="bg-surface border border-surface-border rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-text">Signaux d'Anomalie Prioritaires</h3>
            
            <div className="space-y-3">
              {mockOutcomes.filter(o => (o.riskFlags?.length || 0) > 0).map(outcome => {
                const candidateUser = mockUsers.find(u => u.id === outcome.userId);
                return (
                  <div key={outcome.id} className="p-4 bg-surface-section border border-surface-border rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center shrink-0">
                        <AlertTriangle size={18} />
                      </div>
                      <div>
                        <h4 className="font-display font-bold text-text text-sm">{candidateUser?.name}</h4>
                        <p className="text-xs font-mono text-text-muted">{outcome.companyName} • {outcome.role}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {outcome.riskFlags?.map((flag, idx) => (
                        <span key={idx} className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-[10px] font-mono font-bold text-amber-500">
                          {flag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-right font-mono">
                        <span className="block text-xs font-bold text-blue-500">Score : {outcome.attributionConfidenceScore}%</span>
                        <span className="text-[10px] text-text-dim">Risque Calculé</span>
                      </div>
                      <button 
                        onClick={() => {
                          setSelectedOutcomeId(outcome.id);
                          setActiveTab('disputes');
                        }}
                        className="bg-surface hover:bg-surface-hover text-text p-2 rounded-xl border border-surface-border transition-colors"
                      >
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* MATCHES AUDITED TAB */}
      {activeTab === 'matches' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-surface-border pb-4">
            <h2 className="text-xl font-display font-bold text-text uppercase tracking-tight flex items-center gap-2">
              <Briefcase size={20} className="text-blue-500" /> Opportunités & Matching Soumis à Audit
            </h2>
            <span className="text-xs font-mono font-bold text-blue-500 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
              Audit de Causalité
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockOutcomes.slice(0, 2).map((outcome) => {
              const candidateUser = mockUsers.find(u => u.id === outcome.userId) || mockUsers[0];
              return (
                <OpportunityMatchCard 
                  key={outcome.id}
                  roleTitle={outcome.role}
                  companyName={outcome.companyName}
                  matchPercentage={outcome.attributionConfidenceScore || 85}
                  requiredSkills={['Audit de Preuve', 'Consensus', 'Vérification']}
                  verifiedSkills={candidateUser.topSkills}
                  matchingProofs={outcomeProofs}
                  onApplyOrInspect={() => {
                    setSelectedOutcomeId(outcome.id);
                    setActiveTab('disputes');
                  }}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* GLOSSARY TAB */}
      {activeTab === 'glossary' && (
        <GlossaryPanel />
      )}

      {/* TENANTS TAB */}
      {activeTab === 'tenants' && (
        <TenantManagement />
      )}
    </div>
  );
}
