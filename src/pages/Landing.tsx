import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Zap, 
  Award, 
  CheckCircle2, 
  XCircle, 
  Fingerprint, 
  TrendingUp, 
  Users, 
  Timer, 
  LogIn, 
  Loader2, 
  ArrowRight, 
  Lock, 
  FileText, 
  Layers, 
  Scale, 
  Check, 
  Target, 
  Briefcase, 
  Activity,
  Sparkles,
  ChevronRight,
  HelpCircle,
  Eye,
  Building2,
  HardHat,
  GraduationCap,
  Hammer,
  Code2,
  Compass,
  ArrowUpRight
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../components/FirebaseProvider';
import { ProofCard, ValidationSeal, CredibilityScore, OpportunityMatchCard } from '../components/ui';
import { Proof, ProofValidation } from '../types';

export default function Landing() {
  const { user, signIn, loading } = useAuth();
  const navigate = useNavigate();
  const [activePersonaTab, setActivePersonaTab] = useState<number>(0);
  const [activeIndustryTab, setActiveIndustryTab] = useState<number>(0);

  const handleStart = async () => {
    if (user) {
      navigate('/dashboard');
    } else {
      await signIn();
    }
  };

  // Official Hero Proof Demo Asset
  const heroDemoProof: Proof = {
    id: 'proof_demo_hero_v2',
    title: 'Migration Architecture Cloud Run & Scaling Zero Downtime',
    description: 'Refonte architecture serverless, optimisation du déploiement et amélioration du système de cache Redis.',
    causality: 'Infrastructure confrontée à des problèmes de saturation lors des pics de charge.',
    action: 'Refonte sous microservices serverless, orchestration Cloud Run et implémentation du caching Redis.',
    result: 'Réduction de 42% de la latence critique. 14 000€/mois d\'économie opérationnelle. Disponibilité maintenue à 99,99%.',
    type: 'metric',
    url: 'https://workproof.os/evidence/cloud-run-migration',
    rawSourceUrl: 'https://workproof.os/evidence/cloud-run-migration',
    isPubliclyVerifiable: true,
    verified: true,
    verificationLevel: 'high',
    date: '03 Août 2026',
    confidenceScore: 96,
    impactScore: 94,
    impactLevel: 'high',
    context: 'production',
    status: 'preuve_verifiee',
    strength: 'credible',
    authorIdentityLinked: true,
    sourceQuality: 95,
    externalCheckStatus: 'success',
    scoreAggregate: {
      totalWeightedScore: 96,
      totalWeight: 1.0,
      validationCount: 4,
      collusionAdjustment: 1.0
    }
  };

  const heroDemoValidation: ProofValidation = {
    id: 'val_demo_cto_v2',
    proofId: 'proof_demo_hero_v2',
    validatorId: 'v_cto_external',
    validatorType: 'manager',
    status: 'approved',
    comment: 'Migration auditée en production. Stabilité constatée sur 90 jours.',
    weight: 0.95,
    timestamp: '2026-08-01'
  };

  // Acte 3 Metiers Data
  const industryExamples = [
    {
      role: "Ingénieur Logiciel",
      icon: Code2,
      realization: "Migration Cloud Serverless",
      action: "Refonte de l'architecture monolithique sous microservices Cloud Run",
      metric: "-42% de latence critique p99",
      validator: "Validée par un Responsable Technique",
      tag: "Tech & Cloud"
    },
    {
      role: "Commercial B2B",
      icon: TrendingUp,
      realization: "Négociation Fournisseur Stratégique",
      action: "Renégociation globale des contrats d'approvisionnement annuel",
      metric: "+18% de marge opérationnelle brute",
      validator: "Validée par la Direction Financière",
      tag: "Ventes & Négociation"
    },
    {
      role: "Chef de Chantier",
      icon: HardHat,
      realization: "Livraison Anticipée d'un Projet Complexe",
      action: "Optimisation du planning de second œuvre et gestion des sous-traitants",
      metric: "Livraison à J-12 sans réserves majeures",
      validator: "Validée par le Maître d'Ouvrage",
      tag: "BTP & Infrastructure"
    },
    {
      role: "Artisan & Designer",
      icon: Hammer,
      realization: "Fabrication Agencement Sur-Mesure",
      action: "Conception et pose complète du mobilier de réception siège social",
      metric: "100% de conformité au cahier des charges",
      validator: "Validée par l'Architecte d'Intérieur",
      tag: "Artisanat & Métiers d'Art"
    },
    {
      role: "Étudiant & Junior",
      icon: GraduationCap,
      realization: "Hackathon & Projet Académique",
      action: "Développement d'un module d'accessibilité web Open Source",
      metric: "Adopté par +1 200 utilisateurs actifs",
      validator: "Validée par l'Enseignant Référent",
      tag: "Formation & Open Source"
    }
  ];

  // Acte 8 Ecosystem Personas
  const ecosystemPersonas = [
    {
      role: "Talent Salarié",
      icon: Briefcase,
      tagline: "Construisez une identité professionnelle souveraine qui vous accompagne à vie.",
      detail: "Ne laissez plus vos contributions réelles être oubliées après une réorganisation ou un changement de poste. Ancrez vos accomplissements dans un registre souverain qui valorise durablement votre parcours."
    },
    {
      role: "Freelance & Consultant",
      icon: Users,
      tagline: "Affirmez votre posture d'expert par la preuve irréfutable de votre impact.",
      detail: "Proposez une preuve directe du ROI livré lors de vos missions précédentes. Éliminez la négociation basée sur le doute et justifiez votre valeur par des résultats dûment scellés."
    },
    {
      role: "Entrepreneur & Founder",
      icon: Target,
      tagline: "Démontrez la maturité opérationnelle réelle de votre organisation.",
      detail: "Présentez aux investisseurs, partenaires et grands comptes des preuves chiffrées d'exécution certifiées par des tiers indépendants et responsables."
    },
    {
      role: "Étudiant & Junior",
      icon: GraduationCap,
      tagline: "Faites de vos premières réalisations le socle d'une trajectoire ambitieuse.",
      detail: "Ne butez plus sur le paradoxe 'expérience requise'. Transformez vos projets académiques, travaux pratiques et initiatives en preuves tangibles de valeur."
    },
    {
      role: "Recruteur & Décideur",
      icon: ShieldCheck,
      tagline: "Instaurez une relation de confiance authentique fondée sur le respect des faits.",
      detail: "Passez de la spéculation sur CV au constat d'impact. Évaluez directement des candidats aux résultats audités tout en valorisant la transparence humaine."
    }
  ];

  return (
    <div className="min-h-screen bg-[#090D16] text-[#F8FAFC] font-sans selection:bg-[#3B82F6] selection:text-white relative overflow-hidden">
      {/* Background Decorative Grid */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#1E293B_1px,transparent_1px),linear-gradient(to_bottom,#1E293B_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none"
      />

      {/* NAVIGATION HEADER */}
      <nav className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center border-b border-[#1E293B]/80 relative z-30 backdrop-blur-md bg-[#090D16]/85 sticky top-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#3B82F6]/10 border border-[#3B82F6]/30 flex items-center justify-center text-[#3B82F6]">
            <Fingerprint size={22} />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-extrabold tracking-tight font-display text-white leading-none">WORK PROOF <span className="text-[#3B82F6]">OS</span></span>
            <span className="text-[10px] font-mono text-slate-400 tracking-wider">Infrastructure de Crédibilité Professionnelle</span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8 text-xs font-mono text-slate-300">
          <button onClick={handleStart} className="hover:text-[#3B82F6] transition-colors">Construire mon identité</button>
          <a href="#demo" className="hover:text-[#3B82F6] transition-colors">Découvrir les preuves</a>
          <Link to="/recruiter" className="hover:text-[#3B82F6] transition-colors flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-[#10B981]" />
            <span>Console Recruteur</span>
          </Link>
          <Link to="/test-mode" className="hover:text-[#3B82F6] transition-colors flex items-center gap-1.5 text-amber-400">
            <Activity size={14} />
            <span>Terrain Testing</span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {loading ? (
            <Loader2 className="animate-spin text-[#3B82F6]" size={20} />
          ) : user ? (
            <Link 
              to="/dashboard" 
              className="bg-[#3B82F6] text-white px-5 py-2.5 text-xs font-mono font-bold uppercase tracking-wider rounded-xl hover:bg-[#2563EB] transition-all shadow-lg shadow-[#3B82F6]/20 flex items-center gap-2"
            >
              <span>Dashboard</span>
              <ArrowRight size={14} />
            </Link>
          ) : (
            <button 
              onClick={signIn} 
              className="bg-[#3B82F6] text-white px-5 py-2.5 text-xs font-mono font-bold uppercase tracking-wider rounded-xl hover:bg-[#2563EB] transition-all shadow-lg shadow-[#3B82F6]/20 flex items-center gap-2"
            >
              <LogIn size={14} /> 
              <span>Connexion</span>
            </button>
          )}
        </div>
      </nav>

      {/* ACTE 0 — HERO SECTION */}
      <section className="max-w-7xl mx-auto px-6 pt-10 pb-16 md:pt-16 md:pb-20 text-center relative z-10">
        {/* Category Eyebrow */}
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 bg-[#111726] border border-[#1E293B] rounded-full text-xs font-mono font-bold text-[#3B82F6] mb-6 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-[#3B82F6] animate-pulse" />
          <span>Infrastructure de Crédibilité Professionnelle</span>
        </div>

        {/* Master H1 */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black font-display tracking-tight leading-[1.12] max-w-5xl mx-auto text-white">
          Le monde a mesuré la valeur du travail par des mots.<br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#3B82F6] via-blue-400 to-[#10B981]">
            Nous construisons l'avenir où elle se mesure par des preuves.
          </span>
        </h1>

        {/* Subtitle Body */}
        <div className="mt-6 text-sm sm:text-base md:text-lg text-slate-300 font-normal max-w-3xl mx-auto leading-relaxed space-y-2.5">
          <p>
            Pendant des décennies, votre carrière a été résumée par des titres, des compétences déclarées et des descriptions de poste.
          </p>
          <p className="text-slate-200 font-medium">
            Mais votre vraie valeur ne se trouve pas dans ce que vous affirmez savoir faire. Elle se trouve dans les problèmes que vous avez résolus, les résultats que vous avez créés et l'impact que vous avez généré.
          </p>
          <p className="text-blue-400/90 font-medium text-xs sm:text-sm md:text-base italic">
            Parce que derrière chaque preuve existe une réalité humaine essentielle : des arbitrages complexes, des décisions sous contrainte et une contribution qui mérite d'être reconnue.
          </p>
          <p className="text-slate-400 text-xs sm:text-sm md:text-base">
            Work Proof OS transforme vos réalisations réelles en actifs professionnels vérifiables, construisant une identité basée sur votre contribution réelle.
          </p>
        </div>

        {/* Hero CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-3.5">
          <button 
            onClick={handleStart}
            className="w-full sm:w-auto bg-[#3B82F6] hover:bg-[#2563EB] text-white font-mono font-bold text-xs sm:text-sm px-7 py-3.5 rounded-xl shadow-lg shadow-[#3B82F6]/20 transition-all flex items-center justify-center gap-2.5 border border-blue-400/30"
          >
            <Fingerprint size={16} />
            <span>Construire mon identité de preuve</span>
            <ArrowRight size={16} />
          </button>

          <button
            onClick={() => navigate('/recruiter')}
            className="w-full sm:w-auto bg-[#0D121F] hover:bg-[#161F33] text-slate-300 border border-[#1E293B] font-mono font-bold text-xs sm:text-sm px-7 py-3.5 rounded-xl transition-all flex items-center justify-center gap-2.5 shadow-sm"
          >
            <ShieldCheck size={16} className="text-[#10B981]" />
            <span>Accéder à la Console Recruteur</span>
          </button>
        </div>

        {/* HERO CATEGORY TRANSFORMATION VISUAL ARCHITECTURE */}
        <div className="mt-10 max-w-4xl mx-auto bg-[#0D121F] border border-[#1E293B] rounded-2xl p-4 sm:p-5 text-left font-mono text-xs shadow-2xl relative overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1E293B] pb-3 mb-3">
            <span className="text-slate-200 font-bold uppercase tracking-wider text-[11px] flex items-center gap-2">
              <Sparkles size={14} className="text-[#3B82F6]" />
              Révolution de Catégorie : Du Déclaratif au Démontrable
            </span>
            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
              <ShieldCheck size={12} />
              Souverain & Observable
            </span>
          </div>

          <div className="grid md:grid-cols-3 gap-3 relative">
            {/* Stage 1: Ancien Monde */}
            <div className="bg-[#111726]/90 border border-red-500/20 rounded-xl p-3.5 space-y-2 relative flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-red-400 font-bold border-b border-red-500/10 pb-1.5 mb-1.5">
                  <span className="flex items-center gap-1.5"><XCircle size={14} /> 1. Monde Déclaratif</span>
                  <span className="text-[9px] bg-red-500/10 px-1.5 py-0.5 rounded text-red-400">PDF / Text</span>
                </div>
                <p className="text-slate-400 text-[11px] font-sans leading-relaxed">
                  CVs statiques, titres auto-attribués, mots-clés sans contexte et déclarations unilatérales invérifiables.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-800/80 flex items-center gap-1 text-[10px] text-red-400/90 font-mono">
                <Lock size={12} /> Bruit & doute permanent
              </div>
            </div>

            {/* Stage 2: Moteur de Transformation */}
            <div className="bg-[#111726] border border-[#3B82F6]/40 rounded-xl p-3.5 space-y-2 relative flex flex-col justify-between shadow-lg shadow-blue-500/5">
              <div>
                <div className="flex items-center justify-between text-[#3B82F6] font-bold border-b border-blue-500/10 pb-1.5 mb-1.5">
                  <span className="flex items-center gap-1.5"><Zap size={14} /> 2. Moteur de Faits</span>
                  <span className="text-[9px] bg-blue-500/10 px-1.5 py-0.5 rounded text-blue-400">Extraction Causale</span>
                </div>
                <p className="text-slate-300 text-[11px] font-sans leading-relaxed">
                  Contexte → Action → Impact économique mesurable → Validation scellée par les pairs.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-center gap-1 text-[10px] text-[#3B82F6] font-mono font-bold bg-[#3B82F6]/10 rounded py-1">
                <ArrowRight size={12} /> Compression du bruit
              </div>
            </div>

            {/* Stage 3: Work Proof OS */}
            <div className="bg-[#111726] border border-emerald-500/40 rounded-xl p-3.5 space-y-2 relative flex flex-col justify-between shadow-lg shadow-emerald-500/5">
              <div>
                <div className="flex items-center justify-between text-emerald-400 font-bold border-b border-emerald-500/10 pb-1.5 mb-1.5">
                  <span className="flex items-center gap-1.5"><ShieldCheck size={14} /> 3. Registre Souverain</span>
                  <span className="text-[9px] bg-emerald-500/10 px-1.5 py-0.5 rounded text-emerald-400">Actif Scellé</span>
                </div>
                <p className="text-slate-200 text-[11px] font-sans leading-relaxed">
                  Sceaux de co-responsabilité, empreinte infalsifiable et réputation professionnelle portable.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-800/80 flex items-center gap-1 text-[10px] text-emerald-400 font-mono font-bold">
                <Fingerprint size={12} /> Identité de preuve souveraine
              </div>
            </div>
          </div>
        </div>

        {/* HERO LIVE PROOF DEMO PREVIEW */}
        <div id="demo" className="mt-12 max-w-4xl mx-auto text-left">
          <div className="bg-[#111726] border border-[#1E293B] rounded-2xl p-5 md:p-6 shadow-2xl relative overflow-hidden space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1E293B] pb-3 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
                <span className="text-white font-bold uppercase tracking-wider">Registre de Preuve Souverain</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-400">
                <span>ID : <strong className="text-slate-200">PRF_2026_CR89</strong></span>
                <span className="text-slate-600">•</span>
                <span className="px-2 py-0.5 rounded bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981] font-bold">VALIDÉE PAR DES TIERS</span>
                <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold">FORCE : CRÉDIBLE</span>
              </div>
            </div>

            {/* Proof Body Structure */}
            <div className="space-y-3.5">
              {/* Visual Chain of Trust Banner */}
              <div className="bg-[#0D121F] border border-[#1E293B] rounded-xl p-3 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-[#3B82F6]" />
                  <span className="font-bold">1. Action Réelle</span>
                </div>
                <ChevronRight size={14} className="text-slate-600 hidden sm:block" />
                <div className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-[#3B82F6]" />
                  <span className="font-bold">2. Preuve Structurée</span>
                </div>
                <ChevronRight size={14} className="text-slate-600 hidden sm:block" />
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                  <span className="font-bold">3. Impact Mesuré</span>
                </div>
                <ChevronRight size={14} className="text-slate-600 hidden sm:block" />
                <div className="flex items-center gap-1.5 text-amber-400">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span className="font-bold">4. Validation Tierce</span>
                </div>
                <ChevronRight size={14} className="text-slate-600 hidden sm:block" />
                <div className="flex items-center gap-1.5 text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-lg border border-blue-500/20 font-bold">
                  <ShieldCheck size={13} />
                  <span>Actif de Crédibilité</span>
                </div>
              </div>

              <h3 className="text-lg md:text-xl font-bold font-display text-white">
                Migration Architecture Cloud Run & Scaling Zero Downtime
              </h3>

              <div className="grid md:grid-cols-3 gap-3 font-mono text-xs">
                <div className="bg-[#1B2438]/50 p-3 rounded-xl border border-[#1E293B]">
                  <span className="text-slate-500 block uppercase mb-1 font-bold">Le contexte</span>
                  <p className="text-slate-300">Infrastructure confrontée à des problèmes de saturation lors des pics de charge.</p>
                </div>

                <div className="bg-[#1B2438]/50 p-3 rounded-xl border border-[#1E293B]">
                  <span className="text-[#3B82F6] block uppercase mb-1 font-bold">La contribution</span>
                  <p className="text-slate-300">Refonte architecture serverless, optimisation du déploiement et amélioration du système de cache.</p>
                </div>

                <div className="bg-[#10B981]/10 p-3 rounded-xl border border-[#10B981]/30">
                  <span className="text-[#10B981] block uppercase mb-1 font-bold">L'impact démontré</span>
                  <p className="text-emerald-300 font-bold">Réduction de 42% de la latence critique. 14 000€/mois d'économie. Disponibilité 99,99%.</p>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-[#1E293B]/80 text-xs font-mono text-slate-400">
                <span className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-[#10B981]" />
                  <span>4 validations associées</span>
                </span>
                <span className="flex items-center gap-2 text-slate-300">
                  <Fingerprint size={14} className="text-[#3B82F6]" />
                  <span>Identité professionnelle liée</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ACTE 1 — LE PROBLÈME HUMAIN */}
      <section className="py-14 md:py-20 bg-[#090D16] border-t border-[#1E293B]/80 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-1 rounded-full">
              ACTE 1 • Le Constat Professionnel
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-display tracking-tight text-white leading-tight">
              Votre valeur existe déjà.<br />Mais le monde professionnel a encore du mal à la voir.
            </h2>
            <div className="text-slate-300 text-sm md:text-base leading-relaxed space-y-2.5 font-normal">
              <p>Chaque jour, des millions de personnes créent de la valeur réelle.</p>
              <p className="text-white font-medium">Elles développent. Elles construisent. Elles améliorent. Elles résolvent.</p>
              <p className="text-slate-400">
                Pourtant, au moment de saisir une opportunité, cette valeur disparaît souvent derrière quelques lignes : un intitulé de poste, une liste de compétences, un profil rempli de déclarations.
              </p>
              <p className="text-[#3B82F6] font-mono font-bold pt-1">
                Le problème n'est pas le manque de talents. Le problème est l'absence d'une preuve fiable.
              </p>
            </div>
          </div>

          {/* 3 Actors in Difficulty */}
          <div className="grid md:grid-cols-3 gap-5 mt-10">
            <div className="bg-[#111726] border border-[#1E293B] rounded-2xl p-5 space-y-3 relative">
              <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center">
                <Eye size={18} />
              </div>
              <h3 className="text-lg font-bold font-display text-white">Les talents exceptionnels restent invisibles</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Certains professionnels produisent des résultats remarquables mais ne savent pas transformer leurs réalisations en reconnaissance durable.
              </p>
            </div>

            <div className="bg-[#111726] border border-[#1E293B] rounded-2xl p-5 space-y-3 relative">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                <Users size={18} />
              </div>
              <h3 className="text-lg font-bold font-display text-white">Les indépendants doivent convaincre sans cesse</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                La compétence existe, mais le doute bloque la décision avant même le premier échange client.
              </p>
            </div>

            <div className="bg-[#111726] border border-[#1E293B] rounded-2xl p-5 space-y-3 relative">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
                <HelpCircle size={18} />
              </div>
              <h3 className="text-lg font-bold font-display text-white">Les entreprises recrutent dans l'incertitude</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Les décideurs doivent encore tenter de distinguer la vraie capacité opérationnelle derrière les discours.
              </p>
            </div>
          </div>

          {/* VISUAL METAPHOR — L'ICEBERG DE LA VALEUR PROFESSIONNELLE */}
          <div className="mt-10 bg-[#0D121F] border border-[#1E293B] rounded-2xl p-5 md:p-7 space-y-4 font-mono text-xs shadow-2xl relative overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1E293B] pb-3">
              <span className="text-[#3B82F6] font-bold uppercase tracking-wider text-[11px] flex items-center gap-2">
                <Layers size={15} />
                L'Iceberg de la Valeur Professionnelle
              </span>
              <span className="text-[10px] text-slate-400 bg-[#111726] border border-[#1E293B] px-2.5 py-1 rounded-full">
                Pourquoi 90% de votre vrai travail reste invisible sur un CV
              </span>
            </div>

            <p className="text-slate-300 font-sans text-xs sm:text-sm leading-relaxed border-b border-[#1E293B]/60 pb-3 font-normal italic">
              Pendant des années, des millions de professionnels ont été réduits à quelques lignes. La majorité de leur travail réel et de leur valeur est restée invisible. Work Proof OS fait émerger cette réalité.
            </p>

            <div className="space-y-4">
              {/* Surface émergée - Ce que le monde voit */}
              <div className="bg-[#1B2438]/50 border border-slate-700/50 rounded-xl p-4 space-y-2.5">
                <div className="flex items-center justify-between text-slate-300 font-bold">
                  <span className="flex items-center gap-2 text-slate-300 text-[11px] uppercase tracking-wider">
                    <span className="w-2 h-2 rounded-full bg-slate-400" />
                    Ce que le marché voit aujourd'hui (~10% de la surface)
                  </span>
                  <span className="text-[10px] bg-slate-800 text-slate-400 px-2.5 py-0.5 rounded border border-slate-700 font-mono">Déclaratif Fragile</span>
                </div>
                <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-2 text-[11px] text-slate-400">
                  <div className="bg-[#111726] px-3 py-2 rounded-lg border border-[#1E293B] text-slate-400">
                    • Intitulé de poste officiel
                  </div>
                  <div className="bg-[#111726] px-3 py-2 rounded-lg border border-[#1E293B] text-slate-400">
                    • Mots-clés de CV génériques
                  </div>
                  <div className="bg-[#111726] px-3 py-2 rounded-lg border border-[#1E293B] text-slate-400">
                    • Météo d'auto-évaluation
                  </div>
                  <div className="bg-[#111726] px-3 py-2 rounded-lg border border-[#1E293B] text-slate-400">
                    • Années d'ancienneté brutes
                  </div>
                </div>
              </div>

              {/* Ligne d'immersion - Seuil d'invisibilité */}
              <div className="flex items-center justify-center gap-3 py-1">
                <div className="h-px bg-gradient-to-r from-transparent via-[#3B82F6]/60 to-transparent flex-1" />
                <span className="text-[10px] text-[#3B82F6] font-bold uppercase tracking-widest bg-blue-500/10 px-3.5 py-1 rounded-full border border-blue-500/30 flex items-center gap-1.5 shadow-sm">
                  <Eye size={12} /> Seuil d'Invisibilité Traditionnel
                </span>
                <div className="h-px bg-gradient-to-r from-transparent via-[#3B82F6]/60 to-transparent flex-1" />
              </div>

              {/* Partie immergée - Ce que vous avez réellement construit */}
              <div className="bg-[#111726] border border-[#3B82F6]/40 rounded-xl p-4 sm:p-5 space-y-3 shadow-xl shadow-blue-500/5">
                <div className="flex items-center justify-between text-[#3B82F6] font-bold">
                  <span className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-emerald-400">
                    <ShieldCheck size={16} className="text-[#10B981]" />
                    Ce que vous avez réellement construit (~90% de votre valeur souveraine)
                  </span>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2.5 py-0.5 rounded border border-emerald-500/20 font-bold">Actifs Observable Work Proof</span>
                </div>
                <div className="grid sm:grid-cols-2 gap-2.5 text-[11px] text-slate-200 pt-1">
                  <div className="bg-[#1B2438]/80 p-3 rounded-lg border border-[#1E293B] flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                    <span>Problèmes complexes résolus sous contrainte réelle</span>
                  </div>
                  <div className="bg-[#1B2438]/80 p-3 rounded-lg border border-[#1E293B] flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                    <span>Métriques réelles d'impact économique ou technique</span>
                  </div>
                  <div className="bg-[#1B2438]/80 p-3 rounded-lg border border-[#1E293B] flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                    <span>Contexte organisationnel et degré d'autonomie</span>
                  </div>
                  <div className="bg-[#1B2438]/80 p-3 rounded-lg border border-[#1E293B] flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span>Validations hiérarchiques et collégiales scellées</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Paradigm Transition Diagram */}
          <div className="mt-12 bg-[#0D121F] border border-[#1E293B] rounded-2xl p-6 md:p-8 space-y-6">
            <div className="text-center max-w-xl mx-auto space-y-1">
              <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-slate-400">
                TRANSITION PARADIGMATIQUE
              </span>
              <h3 className="text-lg font-bold font-display text-white">
                Du déclaratif subjectif à la preuve vérifiée
              </h3>
            </div>

            <div className="grid md:grid-cols-2 gap-6 relative">
              {/* Ancien Modèle */}
              <div className="bg-[#111726]/60 border border-red-500/20 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-red-500/20 pb-2.5">
                  <span className="text-xs font-mono font-bold uppercase text-red-400 flex items-center gap-2">
                    <XCircle size={14} /> Ancien Modèle (Déclaratif)
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">Incertitude Élevée</span>
                </div>
                <div className="space-y-2.5 text-xs font-mono">
                  <div className="flex items-center gap-2 text-slate-400">
                    <span className="w-5 h-5 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center font-bold text-[10px]">1</span>
                    <span>Déclaration unilatérale d'intitulé de poste</span>
                  </div>
                  <ChevronRight size={14} className="text-slate-600 ml-1" />
                  <div className="flex items-center gap-2 text-slate-400">
                    <span className="w-5 h-5 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center font-bold text-[10px]">2</span>
                    <span>Interprétation subjective & doutes des recruteurs</span>
                  </div>
                  <ChevronRight size={14} className="text-slate-600 ml-1" />
                  <div className="flex items-center gap-2 text-slate-400">
                    <span className="w-5 h-5 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center font-bold text-[10px]">3</span>
                    <span>Prise de contact lourde & prises de références partielles</span>
                  </div>
                  <ChevronRight size={14} className="text-slate-600 ml-1" />
                  <div className="p-2.5 bg-red-500/10 border border-red-500/20 rounded-lg text-red-300 text-center font-bold">
                    Résultat : Décision risquée sous réserve
                  </div>
                </div>
              </div>

              {/* Work Proof OS */}
              <div className="bg-[#111726] border border-emerald-500/30 rounded-xl p-5 space-y-4 shadow-lg shadow-emerald-500/5">
                <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2.5">
                  <span className="text-xs font-mono font-bold uppercase text-emerald-400 flex items-center gap-2">
                    <CheckCircle2 size={14} /> Work Proof OS (Actifs Vérifiés)
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Souverain & Factuel</span>
                </div>
                <div className="space-y-2.5 text-xs font-mono">
                  <div className="flex items-center gap-2 text-slate-200">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px]">1</span>
                    <span>Réalisation réelle ancrée dans son contexte</span>
                  </div>
                  <ChevronRight size={14} className="text-emerald-500/50 ml-1" />
                  <div className="flex items-center gap-2 text-slate-200">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px]">2</span>
                    <span>Impact mesuré et résultats tangibles</span>
                  </div>
                  <ChevronRight size={14} className="text-emerald-500/50 ml-1" />
                  <div className="flex items-center gap-2 text-slate-200">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px]">3</span>
                    <span>Validation responsable par les superviseurs</span>
                  </div>
                  <ChevronRight size={14} className="text-emerald-500/50 ml-1" />
                  <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-300 text-center font-bold">
                    Résultat : Confiance immédiate & valeur démontrée
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ACTE 2 — LE NOUVEAU PARADIGME */}
      <section className="py-14 md:py-20 bg-[#0D121F]/80 border-t border-[#1E293B] relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl sm:max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#3B82F6] bg-[#3B82F6]/10 border border-[#3B82F6]/20 px-3 py-1 rounded-full">
              ACTE 2 • Le Nouveau Paradigme
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-display tracking-tight text-white leading-tight">
              Une carrière ne devrait pas être une liste de postes.<br />Elle devrait être une trajectoire de réalisations démontrées.
            </h2>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
              Work Proof OS introduit une nouvelle manière de représenter la valeur professionnelle : pas un profil basé sur des déclarations, mais une identité construite autour d'actifs professionnels.
            </p>
          </div>

          {/* Causal Realization Structure Pipeline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-10">
            <div className="bg-[#111726] border border-[#1E293B] rounded-2xl p-5 space-y-2.5 relative">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-slate-500 uppercase">Étape 01</span>
                <span className="w-2 h-2 rounded-full bg-slate-500" />
              </div>
              <h3 className="text-lg font-bold font-display text-white">Action</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Ce qui a réellement été accompli sur le terrain.
              </p>
            </div>

            <div className="bg-[#111726] border border-[#1E293B] rounded-2xl p-5 space-y-2.5 relative">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-[#3B82F6] uppercase">Étape 02</span>
                <span className="w-2 h-2 rounded-full bg-[#3B82F6]" />
              </div>
              <h3 className="text-lg font-bold font-display text-white">Résultat</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Ce qui a changé concrètement grâce à cette action.
              </p>
            </div>

            <div className="bg-[#111726] border border-[#1E293B] rounded-2xl p-5 space-y-2.5 relative">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-amber-400 uppercase">Étape 03</span>
                <span className="w-2 h-2 rounded-full bg-amber-400" />
              </div>
              <h3 className="text-lg font-bold font-display text-white">Impact</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                La valeur créée pour une organisation, un client ou une communauté.
              </p>
            </div>

            <div className="bg-[#111726] border border-[#1E293B] rounded-2xl p-5 space-y-2.5 relative">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-[#10B981] uppercase">Étape 04</span>
                <span className="w-2 h-2 rounded-full bg-[#10B981]" />
              </div>
              <h3 className="text-lg font-bold font-display text-white">Validation</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                La confirmation apportée par des personnes impliquées.
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <span className="inline-block font-mono text-xs sm:text-sm font-semibold text-slate-300 bg-[#1B2438] border border-[#1E293B] px-4 py-2 rounded-xl">
              Votre carrière devient progressivement un registre vivant de contribution.
            </span>
          </div>
        </div>
      </section>

      {/* ACTE 3 — UNE PREUVE POUR TOUS LES MÉTIERS */}
      <section className="py-14 md:py-20 bg-[#090D16] border-t border-[#1E293B]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl sm:max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#10B981] bg-[#10B981]/10 border border-[#10B981]/20 px-3 py-1 rounded-full">
              ACTE 3 • Universalité du Modèle
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-display tracking-tight text-white">
              La preuve ne favorise aucun métier.
            </h2>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
              Un développeur, un commercial, un chef de chantier, un artisan ou un étudiant utilisent des langages différents. Mais leur valeur suit toujours la même logique : une action réelle, un résultat observable, un impact mesurable, une validation crédible.
            </p>
          </div>

          {/* Universal Sector Indicator Badges */}
          <div className="mt-8 mb-6 flex flex-wrap justify-center gap-3 text-xs font-mono">
            <span className="bg-[#111726] border border-[#1E293B] px-3 py-1.5 rounded-lg text-slate-300 flex items-center gap-1.5">
              <Code2 size={14} className="text-[#3B82F6]" /> Tech & Cloud
            </span>
            <span className="bg-[#111726] border border-[#1E293B] px-3 py-1.5 rounded-lg text-slate-300 flex items-center gap-1.5">
              <TrendingUp size={14} className="text-emerald-400" /> Commerce & Vente
            </span>
            <span className="bg-[#111726] border border-[#1E293B] px-3 py-1.5 rounded-lg text-slate-300 flex items-center gap-1.5">
              <Hammer size={14} className="text-amber-400" /> BTP & Artisanat
            </span>
            <span className="bg-[#111726] border border-[#1E293B] px-3 py-1.5 rounded-lg text-slate-300 flex items-center gap-1.5">
              <GraduationCap size={14} className="text-purple-400" /> Éducation & Études
            </span>
          </div>

          {/* Industry Interactive Tabs */}
          <div className="mt-4">
            <div className="flex flex-wrap justify-center gap-2.5 mb-6">
              {industryExamples.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndustryTab(idx)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-mono text-xs font-bold transition-all border ${
                    activeIndustryTab === idx 
                      ? 'bg-[#3B82F6] text-white border-blue-400/50 shadow-md shadow-[#3B82F6]/20' 
                      : 'bg-[#111726] text-slate-400 border-[#1E293B] hover:text-white'
                  }`}
                >
                  <item.icon size={15} />
                  <span>{item.role}</span>
                </button>
              ))}
            </div>

            {/* Display Active Industry Realization */}
            <div className="bg-[#111726] border border-[#1E293B] rounded-2xl p-5 md:p-7 max-w-4xl mx-auto space-y-5">
              <div className="flex items-center justify-between border-b border-[#1E293B] pb-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#3B82F6]/10 border border-[#3B82F6]/30 flex items-center justify-center text-[#3B82F6]">
                    {React.createElement(industryExamples[activeIndustryTab].icon, { size: 18 })}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold font-display text-white">{industryExamples[activeIndustryTab].role}</h3>
                    <span className="text-xs font-mono text-slate-400">{industryExamples[activeIndustryTab].tag}</span>
                  </div>
                </div>
                <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981] font-bold">
                  Preuve Vérifiée
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-5 font-mono text-xs">
                <div className="space-y-2.5">
                  <div>
                    <span className="text-slate-500 uppercase block font-bold mb-0.5">Réalisation</span>
                    <p className="text-white text-xs sm:text-sm font-sans font-semibold">{industryExamples[activeIndustryTab].realization}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 uppercase block font-bold mb-0.5">Action Concrète</span>
                    <p className="text-slate-300">{industryExamples[activeIndustryTab].action}</p>
                  </div>
                </div>

                <div className="space-y-2.5 bg-[#1B2438]/50 p-3.5 rounded-xl border border-[#1E293B]">
                  <div>
                    <span className="text-[#10B981] uppercase block font-bold mb-0.5">Métrique & Impact</span>
                    <p className="text-emerald-300 font-bold text-xs sm:text-sm">{industryExamples[activeIndustryTab].metric}</p>
                  </div>
                  <div>
                    <span className="text-amber-400 uppercase block font-bold mb-0.5">Validation Indépendante</span>
                    <p className="text-slate-300">{industryExamples[activeIndustryTab].validator}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <span className="text-xs font-mono text-slate-400">
              La preuve professionnelle devient universelle.
            </span>
          </div>
        </div>
      </section>

      {/* ACTE 4 — LA CONFIANCE AU-DELÀ DES RECOMMANDATIONS */}
      <section className="py-14 md:py-20 bg-[#0D121F]/60 border-t border-[#1E293B]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl sm:max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
              ACTE 4 • La Responsabilité du Réseau
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-display tracking-tight text-white">
              Les validations ne sont pas des compliments.<br />Ce sont des engagements.
            </h2>
            <div className="text-slate-300 text-sm md:text-base leading-relaxed space-y-2">
              <p>Les réseaux professionnels traditionnels mesurent souvent la popularité. Work Proof mesure la responsabilité.</p>
              <p className="text-white font-medium">Une personne qui valide une réalisation engage sa propre crédibilité.</p>
              <p className="text-slate-400 text-xs sm:text-sm">
                Une preuve n'est pas forte parce qu'elle reçoit beaucoup d'approbations. Elle est forte parce qu'elle repose sur des validations responsables.
              </p>
            </div>
          </div>

          <div className="mt-10 max-w-3xl mx-auto relative group">
            {/* Visual Authority Commitment Banner */}
            <div className="mb-4 bg-[#111726] border border-[#1E293B] rounded-xl p-3.5 flex flex-wrap items-center justify-around gap-3 text-xs font-mono text-slate-300 text-center">
              <div className="flex items-center gap-2">
                <Fingerprint size={16} className="text-[#3B82F6]" />
                <span><strong>Auteur</strong> • Fait avéré</span>
              </div>
              <span className="text-slate-600 font-bold">+</span>
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-amber-400" />
                <span><strong>Validateur</strong> • Engagement de réputation</span>
              </div>
              <span className="text-slate-600 font-bold">=</span>
              <div className="flex items-center gap-2 text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20">
                <CheckCircle2 size={16} />
                <span>Sceau d'Inviolabilité</span>
              </div>
            </div>

            <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/10 via-[#3B82F6]/10 to-emerald-500/10 rounded-2xl blur-lg opacity-30 group-hover:opacity-60 transition-opacity pointer-events-none" />
            <div className="relative bg-[#0D121F] border border-[#1E293B] rounded-2xl p-2 sm:p-4 shadow-xl">
              <ValidationSeal 
                validation={heroDemoValidation}
                validatorName="Directeur Technique Externe"
                validatorRole="Superviseur Projet & Audit Production"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ACTE 5 — UNE IDENTITÉ QUI GRANDIT AVEC VOUS */}
      <section className="py-14 md:py-20 bg-[#090D16] border-t border-[#1E293B]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#3B82F6] bg-[#3B82F6]/10 border border-[#3B82F6]/20 px-3 py-1 rounded-full">
                ACTE 5 • Continuité de Carrière
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-display tracking-tight text-white leading-tight">
                Votre meilleure réalisation ne devrait pas être oubliée après votre départ.
              </h2>
              <div className="text-slate-300 text-sm md:text-base leading-relaxed space-y-2.5">
                <p>
                  Votre carrière évolue. Vos compétences progressent. Vos expériences s'accumulent. Work Proof transforme cette progression en trajectoire visible.
                </p>
                <div className="bg-[#111726] border border-[#1E293B] rounded-xl p-3.5 font-mono text-xs space-y-1.5 text-slate-300">
                  <p className="text-white font-bold">Votre identité professionnelle devient :</p>
                  <p className="flex items-center gap-2"><Check size={13} className="text-[#10B981]" /> Vos réalisations</p>
                  <p className="flex items-center gap-2"><Check size={13} className="text-[#10B981]" /> Vos impacts mesurés</p>
                  <p className="flex items-center gap-2"><Check size={13} className="text-[#10B981]" /> Vos validations certifiées</p>
                  <p className="flex items-center gap-2"><Check size={13} className="text-[#10B981]" /> Votre évolution continue</p>
                </div>
                <p className="text-[#3B82F6] font-mono text-xs sm:text-sm font-bold pt-1">
                  Un CV montre où vous êtes passé. Une identité Work Proof montre ce que vous avez construit.
                </p>
              </div>
            </div>

            <div className="bg-[#111726] border border-[#1E293B] rounded-2xl p-5 md:p-7 space-y-5">
              <CredibilityScore score={96} proofCount={12} validationCount={34} confidenceIndex={0.98} />
            </div>
          </div>
        </div>
      </section>

      {/* ACTE 6 — COLD START : PERSONNE NE COMMENCE À ZÉRO */}
      <section className="py-14 md:py-20 bg-[#0D121F]/70 border-t border-[#1E293B]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl sm:max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#10B981] bg-[#10B981]/10 border border-[#10B981]/20 px-3 py-1 rounded-full">
              ACTE 6 • Accessibilité Début de Parcours
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-display tracking-tight text-white">
              Le premier jour n'est jamais une page blanche.
            </h2>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
              L'absence d'expérience formelle ne signifie pas absence de valeur. Une carrière ne commence pas avec un titre : elle commence dès votre première réalisation démontrée. Les étudiants, les juniors et les personnes en reconversion peuvent démarrer immédiatement.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5 mt-10">
            <div className="bg-[#111726] border border-[#1E293B] rounded-2xl p-5 space-y-2.5">
              <span className="text-xs font-mono font-bold text-[#3B82F6] uppercase">Étape 01</span>
              <h3 className="text-lg font-bold font-display text-white">Micro-réalisations</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Ancrez des actions concrètes : projets académiques, travaux pratiques, contributions bénévoles ou Open Source.
              </p>
            </div>

            <div className="bg-[#111726] border border-[#1E293B] rounded-2xl p-5 space-y-2.5">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase">Étape 02</span>
              <h3 className="text-lg font-bold font-display text-white">Premières validations</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Obtenez la confirmation simple mais réelle d'un enseignant, d'un encadrant ou d'un tuteur.
              </p>
            </div>

            <div className="bg-[#111726] border border-[#1E293B] rounded-2xl p-5 space-y-2.5">
              <span className="text-xs font-mono font-bold text-[#10B981] uppercase">Étape 03</span>
              <h3 className="text-lg font-bold font-display text-white">Construction progressive</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Bâtissez une crédibilité étape par étape sans attendre la première fiche de paie.
              </p>
            </div>
          </div>

          {/* Cold Start Visual Flow Bar */}
          <div className="mt-8 bg-[#111726] border border-[#1E293B] rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2 text-slate-300">
              <span className="w-6 h-6 rounded-full bg-[#3B82F6]/20 text-[#3B82F6] flex items-center justify-center font-bold text-xs">1</span>
              <span><strong>Micro-action</strong> (Projet / TP)</span>
            </div>
            <ChevronRight size={14} className="text-slate-600 hidden sm:block" />
            <div className="flex items-center gap-2 text-slate-300">
              <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">2</span>
              <span><strong>Validation tuteur</strong> (Sceau d'encadrement)</span>
            </div>
            <ChevronRight size={14} className="text-slate-600 hidden sm:block" />
            <div className="flex items-center gap-2 text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20">
              <CheckCircle2 size={14} />
              <span>Première Brique de Crédibilité</span>
            </div>
          </div>

          <div className="mt-6 text-center">
            <span className="font-mono text-xs sm:text-sm text-slate-300 font-semibold">
              L'expérience ne se possède pas uniquement. Elle se construit.
            </span>
          </div>
        </div>
      </section>

      {/* ACTE 7 — LA NOUVELLE ÈRE DES DÉCISIONS PROFESSIONNELLES */}
      <section className="py-14 md:py-20 bg-[#090D16] border-t border-[#1E293B]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center space-y-3 mb-10">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400 bg-[#1B2438] border border-[#1E293B] px-3 py-1 rounded-full">
              ACTE 7 • Décision & Recrutement
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-display tracking-tight text-white">
              Demain, les décisions ne seront plus basées uniquement sur des profils.
            </h2>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
              Elles seront basées sur des preuves structurées. Les entreprises pourront comprendre rapidement ce qu'une personne a réellement accompli, dans quel contexte, avec quel impact et avec quelles validations.
            </p>
          </div>

          <div className="space-y-4">
            {/* Explainable AI Protocol Visual Header */}
            <div className="bg-[#111726] border border-[#1E293B] rounded-xl p-4 font-mono text-xs text-slate-300 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1E293B] pb-2.5">
                <span className="text-slate-200 font-bold uppercase tracking-wider flex items-center gap-2">
                  <Sparkles size={14} className="text-[#3B82F6]" />
                  Protocole de Matching Explicable
                </span>
                <span className="text-[10px] bg-blue-500/10 border border-blue-500/20 text-[#3B82F6] px-2.5 py-0.5 rounded font-bold">
                  AI_NO_SCORING • L'IA assiste, l'Humain décide
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[11px]">
                <div className="bg-[#1B2438]/60 p-2.5 rounded-lg border border-[#1E293B]">
                  <span className="text-[#3B82F6] font-bold block mb-0.5">1. Preuves Vérifiées</span>
                  <span className="text-slate-400 text-[10px]">Actifs réels</span>
                </div>
                <div className="bg-[#1B2438]/60 p-2.5 rounded-lg border border-[#1E293B]">
                  <span className="text-amber-400 font-bold block mb-0.5">2. Analyse Sémantique</span>
                  <span className="text-slate-400 text-[10px]">Contexte métier</span>
                </div>
                <div className="bg-[#1B2438]/60 p-2.5 rounded-lg border border-[#1E293B]">
                  <span className="text-emerald-400 font-bold block mb-0.5">3. Justification</span>
                  <span className="text-slate-400 text-[10px]">Critères factuels</span>
                </div>
                <div className="bg-[#3B82F6]/10 p-2.5 rounded-lg border border-[#3B82F6]/30 text-white font-bold">
                  <span className="text-blue-400 block mb-0.5">4. Décision Humaine</span>
                  <span className="text-slate-300 text-[10px]">Souveraineté</span>
                </div>
              </div>
            </div>

            <OpportunityMatchCard 
              roleTitle="Lead Cloud Architect (Production Systems)"
              companyName="Tech Infrastructure Corp"
              matchPercentage={94}
              requiredSkills={['Cloud Run', 'Docker', 'CI/CD Pipelines', 'Redis Infrastructure', 'PostgreSQL']}
              verifiedSkills={['Cloud Run', 'Docker', 'CI/CD Pipelines', 'Redis Infrastructure']}
              matchingProofs={[heroDemoProof]}
              onApplyOrInspect={() => handleStart()}
            />
          </div>
        </div>
      </section>

      {/* ACTE 8 — UNE INFRASTRUCTURE POUR TOUS */}
      <section className="py-14 md:py-20 bg-[#0D121F]/50 border-t border-[#1E293B]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl sm:max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#3B82F6] bg-[#3B82F6]/10 border border-[#3B82F6]/20 px-3 py-1 rounded-full">
              ACTE 8 • Écosystème Global
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-display tracking-tight text-white">
              Une infrastructure pour tous
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mt-8">
            {ecosystemPersonas.map((p, idx) => (
              <button
                key={idx}
                onClick={() => setActivePersonaTab(idx)}
                className={`text-left p-3.5 rounded-xl border transition-all ${
                  activePersonaTab === idx 
                    ? 'bg-[#1B2438] border-[#3B82F6] text-white shadow-md' 
                    : 'bg-[#111726] border-[#1E293B] text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <p.icon size={15} className={activePersonaTab === idx ? 'text-[#3B82F6]' : 'text-slate-500'} />
                  <span className="font-mono text-xs font-bold truncate">{p.role}</span>
                </div>
                <p className="text-[11px] font-mono text-slate-400 line-clamp-2">{p.tagline}</p>
              </button>
            ))}
          </div>

          <div className="mt-5 bg-[#111726] border border-[#1E293B] rounded-2xl p-5 md:p-6 flex flex-col md:flex-row items-center justify-between gap-5">
            <div className="space-y-2 max-w-2xl">
              <span className="text-xs font-mono font-bold text-[#3B82F6] uppercase tracking-wider">
                {ecosystemPersonas[activePersonaTab].role}
              </span>
              <h3 className="text-xl font-bold font-display text-white">
                {ecosystemPersonas[activePersonaTab].tagline}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {ecosystemPersonas[activePersonaTab].detail}
              </p>
            </div>
            <button
              onClick={handleStart}
              className="bg-[#3B82F6] hover:bg-[#2563EB] text-white font-mono font-bold text-xs px-5 py-2.5 rounded-xl transition-all shrink-0 flex items-center gap-2"
            >
              <span>Activer mon profil</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* MANIFESTE FINAL */}
      <section className="py-14 md:py-20 bg-[#0D121F] border-t border-[#1E293B] text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 relative z-10 space-y-5">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#10B981] bg-[#10B981]/10 border border-[#10B981]/20 px-3 py-1 rounded-full">
            MANIFESTE FINAL WORK PROOF
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black font-display tracking-tight text-white leading-tight">
            "Le futur du travail ne récompensera pas uniquement ceux qui savent raconter leur valeur.<br />
            Il récompensera ceux dont la valeur peut être démontrée."
          </h2>
          <div className="text-slate-300 text-sm md:text-base leading-relaxed max-w-3xl mx-auto space-y-3 font-normal">
            <p>Pendant trop longtemps, la visibilité a remplacé la preuve.</p>
            <p className="text-white font-medium">
              Nous construisons une nouvelle infrastructure où chaque contribution réelle peut devenir un actif professionnel reconnu.
            </p>
            <p className="text-slate-400">
              Votre histoire professionnelle existe déjà. Il est temps de la transformer en preuve.
            </p>
          </div>

          <div className="pt-4">
            <button 
              onClick={handleStart}
              className="bg-[#3B82F6] hover:bg-[#2563EB] text-white font-mono font-bold text-xs sm:text-sm px-7 py-3.5 rounded-xl shadow-lg shadow-[#3B82F6]/20 transition-all inline-flex items-center justify-center gap-2.5 border border-blue-400/30"
            >
              <Fingerprint size={16} />
              <span>Construire mon identité de preuve</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-[#1E293B]/80 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-slate-500 font-mono">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-[#3B82F6]/10 border border-[#3B82F6]/30 flex items-center justify-center text-[#3B82F6]">
            <Fingerprint size={16} />
          </div>
          <span className="font-bold text-slate-300">WORK PROOF OS v2.0</span>
          <span>•</span>
          <span>Infrastructure de Crédibilité Professionnelle</span>
        </div>

        <div className="flex flex-wrap justify-center gap-6 text-slate-400">
          <button onClick={handleStart} className="hover:text-white transition-colors">Construire mon identité</button>
          <a href="#demo" className="hover:text-white transition-colors">Découvrir les preuves</a>
          <Link to="/recruiter" className="hover:text-white transition-colors">Console Recruteur</Link>
          <Link to="/test-mode" className="hover:text-white transition-colors">Terrain Testing</Link>
          <span className="text-slate-600">|</span>
          <span>&copy; 2026 WORK PROOF OS</span>
        </div>
      </footer>
    </div>
  );
}
