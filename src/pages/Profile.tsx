import { CheckCircle, ShieldCheck, ShieldAlert, Sparkles, Target, Briefcase, TrendingUp, AlertTriangle, Clock, History, Gavel, Zap, Globe, CheckCircle2, Activity, Database, Network, GitBranch, Lock, Award, Fingerprint, Loader2, EyeOff, UserCheck, Share2 } from 'lucide-react';
import { mockUser, mockProjects, mockOutcomes, mockContributions } from '../store/mockData';
import { CalibrationPanel } from '../components/CalibrationPanel';
import { IcebergProofSummary } from '../components/IcebergProofSummary';
import { ProofPortabilityModal } from '../components/ProofPortabilityModal';
import { TruthState, ReliabilityLevel, Contribution } from '../types';
import { generateContributionHash } from '../core/impact';
import { useAuth } from '../components/FirebaseProvider';
import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

import { profileCopy } from '../content/copy';
import { getImpactLabel, getConfidenceLabel, translateKPI, getTruthStateLabel } from '../translation';
import {
  CredibilityScore,
  ProofCard,
  ImpactTrajectory,
  ValidationSeal
} from '../components/ui';

const VerdictBadge = ({ verdict }: { verdict: ReliabilityLevel }) => {
  const configs = {
    highly_reliable: { color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30', label: getConfidenceLabel('highly_reliable'), icon: ShieldCheck },
    reliable: { color: 'text-blue-400 bg-blue-500/10 border-blue-500/30', label: getConfidenceLabel('reliable'), icon: CheckCircle2 },
    uncertain: { color: 'text-amber-400 bg-amber-500/10 border-amber-500/30', label: getConfidenceLabel('uncertain'), icon: Zap },
    risky: { color: 'text-red-400 bg-red-500/10 border-red-500/30', label: getConfidenceLabel('risky'), icon: AlertTriangle }
  };
  const config = configs[verdict] || configs.reliable;
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border font-mono text-xs font-bold uppercase tracking-wider ${config.color}`}>
      <Icon size={12} />
      <span>{config.label}</span>
    </div>
  );
};

const ContributionCard = ({ contribution }: { contribution: Contribution }) => {
  const hash = generateContributionHash(contribution);
  const parts = contribution.description.split('→').map(p => p.trim());
  
  // Handle 4-part formula: AVANT → ACTION → APRÈS → PREUVE
  const avant = parts.length >= 4 ? parts[0] : "Contexte";
  const action = parts.length >= 4 ? parts[1] : (parts[0] || contribution.title);
  const apres = parts.length >= 4 ? parts[2] : (parts[1] || "Impact significatif");
  const proof = parts.length >= 4 ? parts[3] : (parts[2] || "Validé par les pairs");

  return (
    <div className="rounded-2xl bg-surface border border-surface-border p-6 space-y-5 transition-all duration-200 hover:border-surface-hover shadow-xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-6 text-blue-500/5 group-hover:text-blue-500/10 transition-colors pointer-events-none">
        <Zap size={72} />
      </div>

      <div className="flex items-center justify-between relative z-10 border-b border-surface-border pb-3">
        <div className="flex items-center gap-1.5 bg-blue-500/10 text-blue-500 px-2.5 py-1 rounded-full border border-blue-500/20 font-mono text-xs font-bold">
          <ShieldCheck size={14} />
          <span>{contribution.impactScore}% IMPACT</span>
        </div>
        <span className="font-mono text-xs text-text-muted">
          HASH: {hash.substring(0, 8)}
        </span>
      </div>

      <div className="relative z-10 space-y-3">
        <div>
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-text-muted mb-1">
            CONTEXTE INITIAL
          </div>
          <p className="text-xs text-text-muted font-normal italic">"{avant}"</p>
        </div>

        <div>
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-500 mb-1">
            ACTION SPÉCIFIQUE
          </div>
          <h4 className="font-display font-bold text-lg text-text group-hover:text-blue-500 transition-colors">
            {contribution.title}
          </h4>
          <p className="text-sm text-text font-medium mt-1">{action}</p>
        </div>
        
        <div className="pt-3 border-t border-surface-border">
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-500 mb-1">
            RÉSULTAT PROUVÉ
          </div>
          <p className="font-mono text-sm font-bold text-emerald-600 dark:text-emerald-300 leading-snug">{apres}</p>
        </div>

        <div className="pt-2 border-t border-surface-border flex items-center justify-between text-xs text-text-muted font-mono">
          <span className="text-text-muted">PREUVE:</span>
          <span className="text-text italic">{proof}</span>
        </div>
      </div>
    </div>
  );
};

export default function Profile() {
  const { user, profile, tenantId, loading: authLoading } = useAuth();
  const [realProofs, setRealProofs] = useState<any[]>([]);
  const [realContributions, setRealContributions] = useState<any[]>([]);
  const [realProjects, setRealProjects] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [isPortabilityModalOpen, setIsPortabilityModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      setLoadingData(true);
      const tid = tenantId || 'demo';
      console.log('[TRACKING] Profile View', { userId: user.uid, tenantId: tid });
      
      const proofsQuery = query(collection(db, `users/${user.uid}/proofs`));
      const contribsQuery = query(collection(db, `users/${user.uid}/contributions`));
      const projectsQuery = query(collection(db, `users/${user.uid}/projects`));

      const unsubProofs = onSnapshot(proofsQuery, (snapshot) => {
        setRealProofs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      }, (err) => {
        console.warn("Firestore proofs listener notice:", err);
      });

      const unsubContribs = onSnapshot(contribsQuery, (snapshot) => {
        setRealContributions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      }, (err) => {
        console.warn("Firestore contribs listener notice:", err);
      });

      const unsubProjects = onSnapshot(projectsQuery, (snapshot) => {
        setRealProjects(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setLoadingData(false);
      }, (err) => {
        console.warn("Firestore projects listener notice:", err);
        setLoadingData(false);
      });

      return () => {
        unsubProofs();
        unsubContribs();
        unsubProjects();
      };
    }
  }, [user]);

  if (authLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="animate-spin text-blue-500" size={48} />
        <p className="text-slate-400 font-mono text-sm tracking-tight">Chargement de votre identité certifiée...</p>
      </div>
    );
  }

  const activeUser = profile || mockUser;
  const displayProofs = profile ? realProofs : mockProjects.flatMap(p => p.proofs);
  const displayContributions = profile ? realContributions : mockContributions.filter(c => c.userId === mockUser.id);
  
  const sig = activeUser.marketValueSignature || mockUser.marketValueSignature;
  const topContributions = [...displayContributions].sort((a, b) => b.impactScore - a.impactScore).slice(0, 3);

  const totalValidations = displayProofs.reduce((acc, p) => {
    return acc + (p.scoreAggregate?.validationCount || (p.status === 'preuve_verifiee' ? 1 : 0));
  }, 0);

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-24 animate-in fade-in duration-300">
      {/* BANDEAU DEMO MODE */}
      {!user && (
        <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-3">
            <div className="bg-amber-500/20 text-amber-400 p-2 rounded-lg border border-amber-500/40">
              <Lock size={18} />
            </div>
            <div>
              <h4 className="font-bold text-amber-300">Mode Démonstration Actif</h4>
              <p className="text-slate-400 text-xs">Connectez-vous pour structurer et ancrer votre propre Proof Identity sur le registre.</p>
            </div>
          </div>
          <button className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-display font-bold text-xs rounded-xl transition-colors whitespace-nowrap">
            Se Connecter avec Google
          </button>
        </div>
      )}

      {/* PROOF IDENTITY HEADER */}
      <header className="rounded-2xl bg-surface border border-surface-border p-6 md:p-10 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <Fingerprint size={200} />
        </div>
        
        <div className="relative space-y-8">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center text-center md:text-left">
            <div className="w-28 h-28 md:w-36 md:h-36 rounded-2xl overflow-hidden border-2 border-surface-border shadow-2xl shrink-0">
              <img src={activeUser.avatar} alt={activeUser.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>

            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                <h1 className="text-3xl md:text-5xl font-extrabold font-display tracking-tight text-text">{activeUser.name}</h1>
                {sig && (sig.knowledge + sig.softProcedure + sig.agility > 30) && (
                  <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 px-3 py-1 text-xs font-mono font-bold rounded-full flex items-center gap-1.5">
                    <Sparkles size={12} />
                    IMPACT ÉCOSYSTÉMIQUE
                  </span>
                )}
                <span className="bg-blue-500/10 text-blue-500 border border-blue-500/30 px-3 py-1 text-xs font-mono font-bold rounded-full flex items-center gap-1.5">
                  <Fingerprint size={12} />
                  SOUVERAINETÉ CERTIFIÉE
                </span>
              </div>
              <p className="text-text-muted text-base md:text-lg font-medium">{activeUser.role}</p>
              
              <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
                <p className="text-blue-500 text-xs md:text-sm font-mono italic">"Montre ce que tu as accompli et vérifié par consensus."</p>
                <button
                  onClick={() => setIsPortabilityModalOpen(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold rounded-xl flex items-center gap-2 shadow-lg transition-colors shrink-0"
                >
                  <Share2 size={15} />
                  <span>Partager mon Identité de Preuve</span>
                </button>
              </div>
            </div>
          </div>

          {/* CREDIBILITY SCORE SUMMARY BAR */}
          <div className="pt-6 border-t border-surface-border">
            <CredibilityScore
              score={activeUser.impactScore || 88}
              proofCount={displayProofs.length}
              validationCount={totalValidations}
              confidenceIndex={activeUser.confidenceIndex ? activeUser.confidenceIndex / 100 : (activeUser.marketTrustIndex / 100)}
            />
          </div>
        </div>
      </header>

      {/* PHASE 2 — ICEBERG PROOF SUMMARY */}
      <IcebergProofSummary 
        proofCount={displayProofs.length}
        validationCount={totalValidations}
        role={activeUser.role}
        name={activeUser.name}
        contributions={displayContributions}
      />

      {/* RE-ARCHITECTED SECTIONS: TOP ACHIEVEMENTS & IMPACT TRAJECTORY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* COLONNE GAUCHE: TOP CONTRIBUTIONS & VERIFIABLE PROOFS */}
        <section className="lg:col-span-8 space-y-8">
          
          {/* TOP ACHIEVEMENTS */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 border-b border-surface-border pb-3">
              <Award size={22} className="text-blue-500" />
              <h3 className="text-xl font-bold font-display text-text">{profileCopy.sections.topAchievements}</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {topContributions.map(contrib => (
                <ContributionCard key={contrib.id} contribution={contrib} />
              ))}
            </div>
          </div>

          {/* IMPACT TRAJECTORY */}
          <div className="space-y-4">
            <ImpactTrajectory proofs={displayProofs} />
          </div>

          {/* ALL PROOFS GRID */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 border-b border-surface-border pb-3">
              <ShieldCheck size={22} className="text-emerald-500" />
              <h3 className="text-xl font-bold font-display text-text">{profileCopy.sections.achievements}</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {displayProofs.map(proof => (
                <ProofCard key={proof.id} proof={proof} />
              ))}
            </div>
          </div>
        </section>

        {/* COLONNE DROITE: SIGNATURE, ANALYSE & SCEAUX */}
        <section className="lg:col-span-4 space-y-8">
          
          {/* ANALYSIS & CREDIBILITY VERDICT */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 border-b border-surface-border pb-3">
              <Zap size={22} className="text-amber-500" />
              <h3 className="text-xl font-bold font-display text-text">{profileCopy.sections.impactAnalysis}</h3>
            </div>
            
            <div className="rounded-2xl bg-surface border border-surface-border p-5 space-y-5 shadow-xl">
              <div className="p-4 bg-surface-section rounded-xl border border-surface-border space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase text-blue-500">Analyse de Crédibilité</span>
                  <VerdictBadge verdict={activeUser.marketTrustIndex > 80 ? "highly_reliable" : "reliable"} />
                </div>
                <p className="text-xs text-text-muted leading-relaxed font-mono italic">
                  "{activeUser.name} dispose d'un ancrage de crédibilité élevé. Ses réalisations ont débloqué de la valeur directe et renforcé l'efficacité des équipes."
                </p>
                {sig && (sig.knowledge + sig.softProcedure + sig.agility > 20) && (
                  <div className="pt-3 border-t border-surface-border">
                    <p className="text-[11px] font-mono font-bold text-emerald-500 flex items-center gap-1.5">
                      <Sparkles size={12} />
                      Profil Écosystémique Détecté
                    </p>
                    <p className="text-[11px] text-text-muted mt-0.5">
                      Forte contribution à la capitalisation du savoir et à l'agilité collective.
                    </p>
                  </div>
                )}
              </div>
              
              <div className="space-y-2.5 font-mono text-xs">
                <div className="flex items-center justify-between text-text-muted bg-surface-section p-2.5 rounded-lg border border-surface-border">
                  <span>Vérification Technique</span>
                  <span className="text-emerald-500 font-bold">Vérifié (98%)</span>
                </div>
                <div className="flex items-center justify-between text-text-muted bg-surface-section p-2.5 rounded-lg border border-surface-border">
                  <span>Validation Marché</span>
                  <span className="text-emerald-500 font-bold">Vérifié (92%)</span>
                </div>
                <div className="flex items-center justify-between text-text-muted bg-surface-section p-2.5 rounded-lg border border-surface-border">
                  <span>Causalité Économique</span>
                  <span className="text-blue-500 font-bold">WP-LEDGER ANCRÉ</span>
                </div>
              </div>
            </div>
          </div>

          {/* SCEAUX DE VALIDATION REÇUS */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <h3 className="text-lg font-bold font-display text-text flex items-center gap-2">
                <UserCheck size={18} className="text-emerald-500" />
                <span>Sceaux de Validation</span>
              </h3>
              <span className="font-mono text-xs text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                {totalValidations} Attestés
              </span>
            </div>

            <div className="space-y-3">
              <ValidationSeal
                validation={{
                  id: 'val_prof_1',
                  proofId: displayProofs[0]?.id || 'p1',
                  validatorId: 'v1',
                  validatorType: 'manager',
                  status: 'approved',
                  weight: 1.5,
                  comment: 'Attestation directe de la livraison du système sous contrainte.',
                  timestamp: '2024-02-28'
                }}
                validatorName="Nathalie Mercier"
                validatorRole="VP Engineering"
              />
              <ValidationSeal
                validation={{
                  id: 'val_prof_2',
                  proofId: displayProofs[1]?.id || 'p2',
                  validatorId: 'v2',
                  validatorType: 'client',
                  status: 'approved',
                  weight: 1.2,
                  comment: 'Attestation d\'impact mesurable et retour sur investissement validé.',
                  timestamp: '2024-03-10'
                }}
                validatorName="Alexandre Petit"
                validatorRole="Directeur de Clientèle"
              />
            </div>
          </div>

          {/* SIGNATURE ÉCOSYSTÉMIQUE & CALIBRATION */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <h3 className="text-lg font-bold font-display text-text flex items-center gap-2">
                <Network size={18} className="text-blue-500" />
                <span>Signature Écosystémique</span>
              </h3>
            </div>
            
            {sig && <CalibrationPanel signature={sig} />}
          </div>
        </section>
      </div>

      {/* RESULTS HISTORY & ATTRIBUTION OUTCOMES */}
      <section className="space-y-6 pt-4 border-t border-surface-border">
        <div className="flex items-center gap-3 border-b border-surface-border pb-3">
          <Award size={22} className="text-blue-500" />
          <h3 className="text-xl font-bold font-display text-text">{profileCopy.sections.resultsHistory}</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mockOutcomes.filter(o => o.userId === mockUser.id).map(outcome => (
            <div key={outcome.id} className="rounded-2xl bg-surface border border-surface-border p-6 space-y-4 shadow-xl">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div>
                  <h4 className="text-lg font-display font-bold text-text">{outcome.role}</h4>
                  <p className="text-xs font-mono text-text-muted">{outcome.companyName}</p>
                </div>
                <VerdictBadge verdict={outcome.verdict} />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono text-text-muted">
                  <span>Confiance de Résultat</span>
                  <span className="text-emerald-500 font-bold">{outcome.attributionConfidenceScore}%</span>
                </div>
                <div className="h-2 bg-surface-section rounded-full overflow-hidden border border-surface-border">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${outcome.attributionConfidenceScore}%` }} />
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  {outcome.isLockedToPlatform && (
                    <span className="px-2.5 py-1 bg-blue-500/10 border border-blue-500/20 rounded-md text-[10px] font-mono font-bold uppercase text-blue-500">
                      Preuve Plateforme
                    </span>
                  )}
                  {outcome.commitment && (
                    <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-md text-[10px] font-mono font-bold uppercase text-emerald-500">
                      Signal: {outcome.commitment.type.replace(/_/g, ' ')}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CREDIBILITY AUDIT JOURNAL */}
      <section className="space-y-4 pt-4 border-t border-surface-border">
        <div className="flex items-center gap-2 border-b border-surface-border pb-3">
          <ShieldAlert size={20} className="text-amber-500" />
          <h3 className="text-xl font-bold font-display text-text">{profileCopy.sections.credibilityJournal}</h3>
        </div>
        <div className="space-y-3">
          {mockUser.auditLog
            .filter(log => log.action === 'anomaly_detected' || log.action === 'recruiter_confirmed')
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .map(log => (
              <div 
                key={log.id} 
                className={`p-4 rounded-xl border-l-4 ${
                  log.action === 'anomaly_detected' 
                    ? 'border-l-rose-500 bg-rose-500/10 border-surface-border' 
                    : 'border-l-emerald-500 bg-emerald-500/10 border-surface-border'
                } bg-surface border border-surface-border`}
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-1 gap-2">
                  <span className={`text-xs font-mono font-bold uppercase ${
                    log.action === 'anomaly_detected' ? 'text-rose-500' : 'text-emerald-500'
                  }`}>
                    {log.action === 'anomaly_detected' ? 'Incohérence Détectée' : 'Validation Positive'}
                  </span>
                  <span className="text-[11px] font-mono text-text-muted">
                    {new Date(log.timestamp).toLocaleString('fr-FR')}
                  </span>
                </div>
                <p className="text-xs text-text-muted font-mono leading-relaxed">{log.details}</p>
                {log.targetId && (
                  <div className="mt-1 text-[10px] text-text-muted uppercase font-mono">
                    ID CIBLE: {log.targetId}
                  </div>
                )}
              </div>
            ))}
          {mockUser.auditLog.filter(log => log.action === 'anomaly_detected' || log.action === 'recruiter_confirmed').length === 0 && (
            <div className="p-8 border border-dashed border-surface-border rounded-2xl text-center bg-surface">
              <p className="text-text-muted font-mono text-xs">Aucun événement de crédibilité critique enregistré</p>
            </div>
          )}
        </div>
      </section>

      {/* PHASE 3 — PROOF PORTABILITY MODAL */}
      <ProofPortabilityModal
        isOpen={isPortabilityModalOpen}
        onClose={() => setIsPortabilityModalOpen(false)}
        userId={user?.uid || activeUser.id}
        userName={activeUser.name}
        proofCount={displayProofs.length}
      />
    </div>
  );
}

