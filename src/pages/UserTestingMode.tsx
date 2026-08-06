import React, { useState } from 'react';
import { 
  Play, 
  RotateCcw, 
  User, 
  Building2, 
  ShieldCheck, 
  Zap, 
  Timer, 
  Smile, 
  Brain, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ArrowRight, 
  Check, 
  Layers, 
  MessageSquare, 
  Award, 
  Scale, 
  Lock, 
  FileText, 
  ExternalLink 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { useAuth } from '../components/FirebaseProvider';
import { 
  CredibilityScore, 
  ProofCard, 
  ValidationSeal, 
  OpportunityMatchCard 
} from '../components/ui';
import { Proof, ProofValidation } from '../types';

export default function UserTestingMode() {
  const { user, profile } = useAuth();
  const [testStatus, setTestStatus] = useState<Record<string, 'idle' | 'in_progress' | 'completed'>>({
    candidate: 'idle',
    recruiter: 'idle',
    trust: 'idle'
  });

  const [cognitiveAnswers, setCognitiveAnswers] = useState({
    conceptUnderstanding: true,
    valuePerception: true,
    linkedinComparison: 'workproof_far_superior',
    confusionPoints: ''
  });

  const [feedbackSaved, setFeedbackSaved] = useState(false);

  const tests = [
    {
      id: 'candidate',
      title: 'Test 1 : Parcours Talent',
      description: 'Incarnez un candidat. Ajoutez une preuve de réalisation, observez la génération automatique du score de crédibilité et la réaction des paires.',
      target: 'KPI : Décision d\'ancrage d\'une preuve réelle en moins de 45s.',
      link: '/',
      icon: User
    },
    {
      id: 'recruiter',
      title: 'Test 2 : Décision Recruteur',
      description: 'Incarnez un recruteur. Comparez les profils audités et prenez une décision d\'embauche fondée sur la fiabilité certifiée.',
      target: 'KPI : Vitesse de décision < 30s et niveau de confiance maximal.',
      link: '/recruiter',
      icon: Building2
    },
    {
      id: 'trust',
      title: 'Test 3 : Validation par Tiers',
      description: 'Présentez un sceau de validation à un pair externe. Demandez : "Faites-vous confiance à cette preuve non-collusive ?"',
      target: 'KPI : Adhésion immédiate sans hésitation.',
      link: '/profile',
      icon: ShieldCheck
    }
  ];

  const sampleProof: Proof = {
    id: 'proof_testing_demo',
    title: 'Migration Infrastructure Cloud Run & Zero Downtime',
    description: 'Refonte complète de l\'architecture conteneurisée avec réduction de 40% de la latence p99 et économie mensuelle de 12 000€.',
    type: 'metric',
    url: 'https://workproof.os/evidence/cloud-run-migration',
    rawSourceUrl: 'https://workproof.os/evidence/cloud-run-migration',
    isPubliclyVerifiable: true,
    verified: true,
    verificationLevel: 'high',
    date: new Date().toISOString(),
    confidenceScore: 96,
    impactScore: 92,
    impactLevel: 'high',
    context: 'production',
    authorIdentityLinked: true,
    sourceQuality: 95,
    externalCheckStatus: 'success'
  };

  const sampleValidation: ProofValidation = {
    id: 'val_testing_demo',
    proofId: 'proof_testing_demo',
    validatorId: 'v_peer_01',
    validatorType: 'manager',
    status: 'approved',
    comment: 'Migration validée en production. Zéro interruption de service enregistrée lors du basculement.',
    weight: 0.95,
    timestamp: new Date().toISOString()
  };

  const handleReset = () => {
    setTestStatus({
      candidate: 'idle',
      recruiter: 'idle',
      trust: 'idle'
    });
    setFeedbackSaved(false);
    console.log('[TRACKING] User Testing Session Reset');
  };

  const handleSaveFeedback = () => {
    setFeedbackSaved(true);
    console.log('[TRACKING] Cognitive Rupture Feedback Saved:', cognitiveAnswers);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-500">
      {/* Header Authority */}
      <header className="border-b border-[#1E293B] pb-8 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-xs font-mono font-bold uppercase tracking-widest">
              <Zap size={14} /> User Testing OS v1.5.0
            </div>
            <h1 className="text-3xl md:text-5xl font-display font-extrabold text-slate-100 tracking-tight">
              Mode Validation <span className="text-blue-400 font-mono">User Testing</span>
            </h1>
            <p className="text-slate-400 text-sm md:text-base max-w-2xl">
              Phase de validation terrain. Observez et mesurez la rupture cognitive provoquée par la transition du modèle déclaratif vers l'ancrage par la preuve.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={handleReset}
              className="bg-[#111726] hover:bg-slate-800 text-slate-300 border border-[#1E293B] px-4 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2"
            >
              <RotateCcw size={14} /> Réinitialiser les Tests
            </button>
          </div>
        </div>
      </header>

      {/* Core Paradigm Shift Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#111726] via-[#1B2438] to-[#111726] border border-blue-500/30 p-6 md:p-8 space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center justify-between border-b border-[#1E293B] pb-4">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-blue-400 tracking-widest">
            <ShieldCheck size={16} /> Le Dogme Fondateur
          </div>
          <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            Proof &gt; Claims
          </span>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl md:text-3xl font-display font-black text-slate-100 tracking-tight">
            "Work Proof remplace la déclaration par la preuve."
          </h2>
          <p className="text-slate-300 text-sm md:text-base max-w-3xl leading-relaxed">
            Nous ne testons pas de simples boutons. Nous mesurons l'effet de choc lorsque l'utilisateur réalise qu'un profil n'est plus une liste de CV auto-proclamée, mais un graphe de preuves vérifiées et infalsifiables.
          </p>
        </div>

        {/* Side by Side Model Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <div className="bg-rose-500/5 border border-rose-500/20 p-5 rounded-xl space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-rose-400">
              <XCircle size={16} /> Modèle Classique (ex: LinkedIn)
            </div>
            <p className="text-xs font-mono text-slate-400 leading-relaxed">
              • Auto-déclaration de compétences non vérifiée<br />
              • Recommandations de complaisance réciproques<br />
              • Titres de postes gonflés et metrics invérifiables<br />
              • Bruit informationnel élevé, confiance faible
            </p>
          </div>

          <div className="bg-emerald-500/5 border border-emerald-500/20 p-5 rounded-xl space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-emerald-400">
              <CheckCircle2 size={16} /> Modèle Work Proof OS
            </div>
            <p className="text-xs font-mono text-slate-300 leading-relaxed">
              • Preuves tangibles ancrées avec traces causales<br />
              • Validation par pairs avec contrôle de non-collusion<br />
              • Score de crédibilité certifié et auditable<br />
              • Transparence totale, prise de décision en secondes
            </p>
          </div>
        </div>
      </div>

      {/* Test Scenarios Grid */}
      <div className="space-y-4">
        <h3 className="text-lg font-display font-bold text-slate-100 uppercase tracking-tight flex items-center gap-2 border-b border-[#1E293B] pb-3">
          <Layers size={18} className="text-blue-400" /> Parcours de Test Terrain
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tests.map((test) => {
            const Icon = test.icon;
            const status = testStatus[test.id];

            return (
              <div 
                key={test.id} 
                className="bg-[#111726] border border-[#1E293B] hover:border-blue-500/50 transition-all p-6 rounded-2xl flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
                      <Icon size={22} />
                    </div>
                    <span className={`text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-full border ${
                      status === 'completed' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' :
                      status === 'in_progress' ? 'text-amber-400 bg-amber-500/10 border-amber-500/30' :
                      'text-slate-400 bg-slate-800 border-slate-700'
                    }`}>
                      {status === 'completed' ? 'Terminé' : status === 'in_progress' ? 'En Cours' : 'A Faire'}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-lg font-display font-bold text-slate-100">{test.title}</h4>
                    <p className="text-xs text-slate-400 font-mono mt-2 leading-relaxed">{test.description}</p>
                  </div>

                  <div className="p-3 bg-[#1B2438] rounded-xl border border-[#1E293B] space-y-1">
                    <span className="block text-[10px] font-mono font-bold uppercase text-blue-400">Objectif Mesurable</span>
                    <span className="text-xs font-mono text-slate-300 font-semibold">{test.target}</span>
                  </div>
                </div>

                <Link
                  to={test.link}
                  onClick={() => setTestStatus(prev => ({ ...prev, [test.id]: 'in_progress' }))}
                  className="w-full bg-blue-500 text-slate-950 py-3 rounded-xl font-mono text-xs font-bold uppercase hover:bg-blue-400 transition-colors flex items-center justify-center gap-2"
                >
                  Lancer ce Test <Play size={14} fill="currentColor" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Visual Proof Component Showcase */}
      <div className="bg-[#111726] border border-[#1E293B] p-6 md:p-8 rounded-2xl space-y-6">
        <div className="flex justify-between items-center border-b border-[#1E293B] pb-3">
          <h3 className="text-base font-display font-bold text-slate-100 uppercase tracking-tight flex items-center gap-2">
            <Award size={18} className="text-emerald-400" /> Échantillon de Preuve Présenté lors du Test
          </h3>
          <span className="text-xs font-mono text-blue-400">Généré par Work Proof Design System</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-4">
            <CredibilityScore 
              score={96}
              proofCount={12}
              validationCount={34}
              confidenceIndex={0.98}
            />
            <ValidationSeal 
              validation={sampleValidation}
              validatorName="Directeur Technique Externe"
              validatorRole="Validateur Pair Certifié"
            />
          </div>

          <div className="lg:col-span-7">
            <ProofCard proof={sampleProof} />
          </div>
        </div>
      </div>

      {/* Test Protocol & Observer Guide */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Protocol Steps (7 cols) */}
        <div className="lg:col-span-7 bg-[#111726] border border-[#1E293B] rounded-2xl p-6 md:p-8 space-y-6">
          <h3 className="text-lg font-display font-bold text-slate-100 uppercase tracking-tight flex items-center gap-2 border-b border-[#1E293B] pb-3">
            <Timer size={18} className="text-blue-400" /> Protocole "Passage Terrain"
          </h3>

          <div className="space-y-4">
            <div className="p-4 bg-[#1B2438] rounded-xl border border-[#1E293B] space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-blue-400 uppercase">
                <span className="w-2 h-2 bg-blue-500 rounded-full" /> Étape 1 : Le Flash (10 secondes)
              </div>
              <p className="text-xs font-mono text-slate-300 leading-relaxed">
                Affichez un profil Work Proof OS pendant 10s. Masquez l'écran. Demandez : "Qu'a réellement accompli ce candidat ?" Observez la clarté immédiate des réponses.
              </p>
            </div>

            <div className="p-4 bg-[#1B2438] rounded-xl border border-[#1E293B] space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 uppercase">
                <span className="w-2 h-2 bg-emerald-500 rounded-full" /> Étape 2 : La Preuve (30 secondes)
              </div>
              <p className="text-xs font-mono text-slate-300 leading-relaxed">
                Invitez l'utilisateur à inspecter une carte de preuve. Demandez : "Pourquoi faites-vous confiance à cette métrique ?" Observez la détection du sceau de validation.
              </p>
            </div>

            <div className="p-4 bg-[#1B2438] rounded-xl border border-[#1E293B] space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 uppercase">
                <span className="w-2 h-2 bg-amber-500 rounded-full" /> Étape 3 : La Réciprocité (1 minute)
              </div>
              <p className="text-xs font-mono text-slate-300 leading-relaxed">
                Montrez la section Réseau et l'action de validation. Demandez : "Quel est l'impact de votre validation sur votre propre réputation ?"
              </p>
            </div>
          </div>
        </div>

        {/* Cognitive Feedback Form (5 cols) */}
        <div className="lg:col-span-5 bg-[#111726] border border-[#1E293B] rounded-2xl p-6 md:p-8 space-y-6">
          <h3 className="text-lg font-display font-bold text-slate-100 uppercase tracking-tight flex items-center gap-2 border-b border-[#1E293B] pb-3">
            <Brain size={18} className="text-amber-400" /> Relevé d'Observation Terrain
          </h3>

          <div className="space-y-4 text-xs font-mono">
            <div>
              <label className="block text-slate-400 font-bold uppercase mb-2">Compréhension du Concept (&lt; 10s)</label>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => setCognitiveAnswers(a => ({ ...a, conceptUnderstanding: true }))}
                  className={`py-2 px-3 rounded-xl border font-bold uppercase ${
                    cognitiveAnswers.conceptUnderstanding 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                      : 'bg-[#1B2438] text-slate-400 border-[#1E293B]'
                  }`}
                >
                  ✓ Immédiat
                </button>
                <button 
                  onClick={() => setCognitiveAnswers(a => ({ ...a, conceptUnderstanding: false }))}
                  className={`py-2 px-3 rounded-xl border font-bold uppercase ${
                    !cognitiveAnswers.conceptUnderstanding 
                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' 
                      : 'bg-[#1B2438] text-slate-400 border-[#1E293B]'
                  }`}
                >
                  ✕ Confusion
                </button>
              </div>
            </div>

            <div>
              <label className="block text-slate-400 font-bold uppercase mb-2">Comparaison LinkedIn</label>
              <select
                value={cognitiveAnswers.linkedinComparison}
                onChange={(e) => setCognitiveAnswers(a => ({ ...a, linkedinComparison: e.target.value }))}
                className="w-full bg-[#1B2438] border border-[#1E293B] text-slate-100 rounded-xl p-3 focus:outline-none focus:border-blue-500"
              >
                <option value="workproof_far_superior">Work Proof nettement plus crédible</option>
                <option value="equivalent">Perçu comme équivalent</option>
                <option value="needs_explanation">Nécessite plus d'explications</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-bold uppercase mb-2">Points de Friction / Citations</label>
              <textarea 
                rows={3}
                placeholder="Ex: 'C'est fou, on ne peut pas mentir sur le score...'"
                value={cognitiveAnswers.confusionPoints}
                onChange={(e) => setCognitiveAnswers(a => ({ ...a, confusionPoints: e.target.value }))}
                className="w-full bg-[#1B2438] border border-[#1E293B] text-slate-100 rounded-xl p-3 focus:outline-none focus:border-blue-500 placeholder:text-slate-600"
              />
            </div>

            <button
              onClick={handleSaveFeedback}
              className="w-full bg-emerald-500 text-slate-950 py-3 rounded-xl font-mono text-xs font-bold uppercase hover:bg-emerald-400 transition-colors flex items-center justify-center gap-2"
            >
              {feedbackSaved ? <Check size={16} /> : null}
              {feedbackSaved ? 'Observation Enregistrée' : 'Enregistrer le Relevé'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
