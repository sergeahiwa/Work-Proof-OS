import { useState, useEffect } from 'react';
import { ArrowRight, Plus, Sparkles, TrendingUp, ShieldCheck, Activity, Target, Users, History, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { mockUser, mockProjects, mockOpportunities } from '../store/mockData';
import { CalibrationPanel } from '../components/CalibrationPanel';
import { useAuth } from '../components/FirebaseProvider';
import { collection, query, onSnapshot, orderBy, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import {
  CredibilityScore,
  ProofCard,
  ImpactTrajectory,
  ValidationSeal,
  OpportunityMatchCard
} from '../components/ui';
import { RILOverviewPanel } from '../components/intelligence/RILOverviewPanel';

export default function Dashboard() {
  const { user, profile, loading: authLoading } = useAuth();
  const [realProjects, setRealProjects] = useState<any[]>([]);
  const [realProofs, setRealProofs] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    if (user) {
      setLoadingData(true);
      
      const projectsQ = query(collection(db, `users/${user.uid}/projects`), limit(5));
      const unsubscribeProjects = onSnapshot(projectsQ, (snapshot) => {
        setRealProjects(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      }, (err) => {
        console.warn("Firestore projects listener notice:", err);
      });

      const proofsQ = query(collection(db, `users/${user.uid}/proofs`), orderBy('date', 'desc'), limit(10));
      const unsubscribeProofs = onSnapshot(proofsQ, (snapshot) => {
        setRealProofs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setLoadingData(false);
      }, (err) => {
        console.warn("Firestore proofs listener notice:", err);
        setLoadingData(false);
      });

      return () => {
        unsubscribeProjects();
        unsubscribeProofs();
      };
    }
  }, [user]);

  const activeUser = profile ? profile : mockUser;
  const displayProjects = profile ? realProjects : mockProjects.slice(0, 3);
  const recentProofs = profile ? realProofs : displayProjects.flatMap(p => p.proofs || []).slice(0, 6);

  if (authLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Activity className="animate-spin text-blue-500" size={48} />
        <p className="text-slate-400 font-mono text-sm tracking-tight">Chargement du registre Work Proof...</p>
      </div>
    );
  }

  // Calculate total validations across proofs
  const totalValidations = recentProofs.reduce((acc, p) => {
    return acc + (p.scoreAggregate?.validationCount || (p.status === 'preuve_verifiee' ? 1 : 0));
  }, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-7xl mx-auto pb-12">
      {/* BANDEAU DEMO MODE */}
      {(!user || !profile) && (
        <div className="bg-amber-500/10 border border-amber-500/30 text-amber-300 p-4 rounded-xl flex items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
              Mode Démonstration
            </span>
            <span>Données d'exemple affichées. Connectez-vous pour afficher votre registre réel.</span>
          </div>
        </div>
      )}

      {/* HEADER DE PAGE */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-surface-border pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-blue-500/10 text-blue-500 border border-blue-500/20">
              WORK PROOF OS v1.5.0
            </span>
            <span className="font-mono text-xs text-text-muted">•</span>
            <span className="font-mono text-xs text-text-muted">
              Souveraineté des Compétences
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold font-display tracking-tight text-text">
            Tableau de Bord
          </h1>
          <p className="text-text-muted text-sm md:text-base font-normal max-w-2xl">
            Suivez vos preuves de réalisations, vos sceaux de validation par les pairs et votre trajectoire de valeur certifiée.
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3 shrink-0">
          <Link 
            to="/create-proof"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-display font-bold text-sm bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-lg shadow-blue-600/25"
          >
            <Plus size={18} />
            Ancrer un succès
          </Link>
        </div>
      </div>

      {/* SECTION CREDIBILITY SCORE & METRICS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Credibility Score Component */}
        <div className="lg:col-span-8">
          <CredibilityScore
            score={activeUser.impactScore || 88}
            proofCount={recentProofs.length}
            validationCount={totalValidations}
            confidenceIndex={activeUser.confidenceIndex ? activeUser.confidenceIndex / 100 : (activeUser.marketTrustIndex / 100)}
          />
        </div>

        {/* Secondary Metric Highlights */}
        <div className="lg:col-span-4 grid grid-cols-2 gap-4">
          <div className="rounded-2xl bg-surface border border-surface-border p-4 flex flex-col justify-between shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-text-muted">Fiabilité Marché</span>
              <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg">
                <ShieldCheck size={18} />
              </div>
            </div>
            <div>
              <p className="font-mono text-3xl font-extrabold text-text">
                {activeUser.marketTrustIndex || 94}%
              </p>
              <p className="text-[11px] font-mono text-text-muted mt-1">Sceaux sans litige</p>
            </div>
          </div>

          <div className="rounded-2xl bg-surface border border-surface-border p-4 flex flex-col justify-between shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-text-muted">Missions Actives</span>
              <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg">
                <TrendingUp size={18} />
              </div>
            </div>
            <div>
              <p className="font-mono text-3xl font-extrabold text-text">
                {displayProjects.length}
              </p>
              <p className="text-[11px] font-mono text-text-muted mt-1">Actifs ancrés</p>
            </div>
          </div>
        </div>
      </div>

      {/* REALITY INTELLIGENCE LAYER (RIL v1.0) */}
      <section className="my-6">
        <RILOverviewPanel userId={user?.uid || 'demo-user'} />
      </section>

      {/* GRILLE PRINCIPALE (2 COLONNES) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* COLONNE PRINCIPALE : PREUVES RÉCENTES & CALIBRATION */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* SECIONS: RECENT PROOFS */}
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <h2 className="text-xl font-bold font-display text-text flex items-center gap-2">
                 <History size={20} className="text-blue-500" />
                 <span>Succès & Preuves Récents</span>
              </h2>
              <span className="font-mono text-xs text-text-muted">
                {recentProofs.length} {recentProofs.length === 1 ? 'élément' : 'éléments'}
              </span>
            </div>
            
            <div className="space-y-4">
              {recentProofs.length > 0 ? (
                recentProofs.map((proof: any) => (
                  <ProofCard key={proof.id} proof={proof} />
                ))
              ) : (
                <div className="py-12 text-center bg-surface rounded-2xl border border-dashed border-surface-border p-6">
                   <p className="text-text-muted font-mono text-sm">Aucun succès enregistré récemment.</p>
                   <Link to="/create-proof" className="text-blue-500 font-mono text-xs font-bold hover:underline mt-2 inline-block">
                     Ancrer une réalisation dans le registre →
                   </Link>
                </div>
              )}
            </div>
          </section>

          {/* SECTION: TRAJECTOIRE D'IMPACT */}
          <section className="space-y-4">
            <ImpactTrajectory proofs={recentProofs} />
          </section>

          {/* SECTION: CALIBRATION SIGNATURE */}
          <section className="space-y-4">
             <div className="flex items-center justify-between border-b border-surface-border pb-3">
                <h2 className="text-xl font-bold font-display text-text flex items-center gap-2">
                  <Target size={20} className="text-blue-500" />
                  <span>Analyse de la Signature de Valeur</span>
                </h2>
             </div>
             <CalibrationPanel signature={activeUser.marketValueSignature || mockUser.marketValueSignature} />
          </section>
        </div>

        {/* COLONNE LATÉRALE : CONSEIL, SCEAUX & OPPORTUNITÉS */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* ORACLE ACTION SIMPLE */}
          <div className="rounded-2xl bg-surface border border-surface-border p-5 shadow-xl space-y-4 relative overflow-hidden">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-amber-500">
              <Sparkles size={16} className="text-amber-500" />
              <span>Recommandation Oracle Work Proof</span>
            </div>
            <div className="bg-surface-section p-4 rounded-xl border border-surface-border">
               <p className="text-xs text-text leading-relaxed font-mono">
                 "D'après vos récents succès, valoriser votre impact en <strong>Management de Crise</strong> renforcerait votre profil de +12%."
               </p>
               <button className="mt-3 w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg font-display font-bold text-xs transition-colors">
                 Valoriser cette compétence
               </button>
            </div>
          </div>

          {/* EXEMPLE SCEAU DE VALIDATION */}
          <section className="space-y-3">
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-text-muted">Dernier Sceau Reçu</h3>
            <ValidationSeal
              validation={{
                id: 'val_sample_1',
                proofId: recentProofs[0]?.id || 'p1',
                validatorId: 'v1',
                validatorType: 'manager',
                status: 'approved',
                weight: 1.2,
                comment: 'Supervision directe des opérations et audit de l\'impact quantifié.',
                timestamp: '2024-03-15'
              }}
              validatorName="Jean-Marc Durand"
              validatorRole="Directeur des Opérations"
            />
          </section>

          {/* MISSIONS EN COURS */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-text-muted">Missions en cours</h3>
              <Link to="/projects" className="text-xs font-mono text-blue-500 hover:underline flex items-center gap-1">
                <span>Toutes</span>
                <ArrowRight size={12} />
              </Link>
            </div>
            <div className="space-y-3">
              {displayProjects.map((project) => (
                <div key={project.id} className="rounded-xl bg-surface border border-surface-border p-4 transition-all hover:border-surface-hover">
                   <div className="flex justify-between items-start mb-2">
                     <span className="text-[10px] font-mono font-bold bg-blue-500/10 text-blue-500 border border-blue-500/20 px-2 py-0.5 rounded uppercase">
                       {project.industry || 'Opérations'}
                     </span>
                     <span className="text-xs font-mono font-bold text-emerald-500">
                       +{project.impactRating || 15} pts
                     </span>
                   </div>
                   <h4 className="font-display font-bold text-sm text-text">{project.title}</h4>
                   <p className="text-xs text-text-muted mt-1 line-clamp-2">{project.description?.split('→')[0]}</p>
                </div>
              ))}
            </div>
          </section>

          {/* OPPORTUNITÉS MARCHÉ MATCHED */}
          <section className="space-y-4">
             <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-text-muted">Opportunités Détectées</h3>
             <div className="space-y-4">
                {mockOpportunities.slice(0, 2).map((opp: any) => (
                  <OpportunityMatchCard
                    key={opp.id}
                    roleTitle={opp.role || opp.title || 'Opportunité Opérationnelle'}
                    companyName={opp.companyName || opp.company || 'Entreprise Partenaire'}
                    matchPercentage={opp.attributionConfidenceScore || opp.matchScore || 85}
                    requiredSkills={['Logistique', 'Opérations', 'Leadership']}
                    verifiedSkills={['Logistique', 'Opérations']}
                    matchingProofs={recentProofs.slice(0, 2)}
                  />
                ))}
             </div>
          </section>

        </div>
      </div>
    </div>
  );
}

