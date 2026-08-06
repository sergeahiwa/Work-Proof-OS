import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  TrendingUp, 
  Target, 
  Zap, 
  Briefcase, 
  CheckCircle, 
  AlertTriangle, 
  ExternalLink, 
  ShieldCheck, 
  Star, 
  History, 
  Lock, 
  Search, 
  Fingerprint, 
  Shield, 
  Database, 
  Users, 
  Globe, 
  CheckCircle2, 
  Clock, 
  MessageSquare,
  Info,
  Scale,
  Building2,
  XCircle,
  ChevronDown,
  ChevronUp,
  Eye,
  FileText,
  Activity,
  Loader2,
  Filter,
  BarChart3,
  Award
} from 'lucide-react';
import { mockOpportunities, mockUser, mockProjects, mockOutcomes } from '../store/mockData';
import { RecruitmentOutcome, Message, TruthState, OutcomeStatus, ValidationSource, ReliabilityLevel } from '../types';
import RecruitmentChat from '../components/RecruitmentChat';
import { motion, AnimatePresence } from 'motion/react';
import { calculateAttributionScore, detectFraudSignals, calculatePenalty, getTruthState, getDetailedScoreExplanation, calculateReliability, captureProofEvent } from '../lib/attribution';
import { useAuth } from '../components/FirebaseProvider';

import { opportunitiesCopy } from '../content/copy';
import { getImpactLabel, getConfidenceLabel, translateKPI, getTruthStateLabel, getDetailedConfidenceExplanation } from '../translation';
import { OpportunityMatchCard } from '../components/ui';

const VerdictBadge = ({ verdict }: { verdict: ReliabilityLevel }) => {
  const configs = {
    highly_reliable: { color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30', label: getConfidenceLabel('highly_reliable'), icon: ShieldCheck },
    reliable: { color: 'text-blue-400 bg-blue-500/10 border-blue-500/30', label: getConfidenceLabel('reliable'), icon: CheckCircle2 },
    uncertain: { color: 'text-amber-400 bg-amber-500/10 border-amber-500/30', label: getConfidenceLabel('uncertain'), icon: Zap },
    risky: { color: 'text-rose-400 bg-rose-500/10 border-rose-500/30', label: getConfidenceLabel('risky'), icon: AlertTriangle }
  };
  const config = configs[verdict];
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border font-mono text-[10px] font-bold uppercase tracking-wider ${config.color}`}>
      <Icon size={12} />
      <span>{config.label}</span>
    </div>
  );
};

const TruthStateBadge = ({ state }: { state: TruthState }) => {
  const configs = {
    verified: { color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30', label: getTruthStateLabel('verified'), icon: ShieldCheck },
    probable: { color: 'text-blue-400 bg-blue-500/10 border-blue-500/30', label: getTruthStateLabel('probable'), icon: Zap },
    disputed: { color: 'text-rose-400 bg-rose-500/10 border-rose-500/30', label: getTruthStateLabel('disputed'), icon: AlertTriangle },
    unverified: { color: 'text-slate-400 bg-[#1B2438] border-[#1E293B]', label: getTruthStateLabel('unverified'), icon: History }
  };
  const config = configs[state];
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border font-mono text-[10px] font-bold uppercase tracking-wider ${config.color}`}>
      <Icon size={10} />
      <span>{config.label}</span>
    </div>
  );
};

const ExplainabilityPanel = ({ outcome }: { outcome: RecruitmentOutcome }) => {
  const [isOpen, setIsOpen] = useState(false);
  const factors = getDetailedConfidenceExplanation(outcome);

  return (
    <div className="bg-surface border border-surface-border rounded-2xl overflow-hidden font-mono text-xs">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between hover:bg-surface-hover transition-colors"
      >
        <div className="flex items-center gap-2 font-bold uppercase text-text">
          <Info size={14} className="text-blue-500" />
          <span>Analyse de Causalité & Facteurs de Match ({factors.length})</span>
        </div>
        {isOpen ? <ChevronUp size={16} className="text-text-muted" /> : <ChevronDown size={16} className="text-text-muted" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-4 pb-4 space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {factors.map((f, idx) => (
                <div key={idx} className="p-3 bg-surface-section border border-surface-border rounded-xl space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-text">{f.label}</span>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                      f.status === 'verified' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 
                      f.status === 'pending' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                    }`}>
                      {f.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-surface border border-surface-border rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: `${f.percentage}%` }} />
                    </div>
                    <span className="font-bold text-text">{f.percentage}%</span>
                  </div>
                  <div className="text-[10px] text-text-muted font-bold uppercase">
                    Poids dans la fiabilité : {f.weight}%
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl space-y-2">
              <div className="text-xs font-bold uppercase text-blue-500 flex items-center gap-2">
                <Activity size={14} />
                <span>Données Sources Utilisées pour l'Attribution</span>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  Sessions tracées : {outcome.contactSessions.length} enregistrées
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  Messages sécurisés : {outcome.contactSessions.reduce((acc, s) => acc + (s.messages?.length || 0), 0)} échanges
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  Preuves liées : {outcome.linkedProofIds.length} artefacts
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  Signaux externes : {outcome.externalSignals?.length || 0} sources
                </li>
              </ul>
            </div>

            {outcome.commitment && (
              <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl space-y-2">
                <div className="flex justify-between items-center">
                  <div className="text-xs font-bold uppercase text-emerald-400 flex items-center gap-2">
                    <ShieldCheck size={14} />
                    <span>Engagement Ancré sur le Registre</span>
                  </div>
                  <div className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                    outcome.commitment.metadata?.confidenceWeight === 'critical' ? 'bg-rose-500 text-white' :
                    outcome.commitment.metadata?.confidenceWeight === 'high' ? 'bg-emerald-500 text-white' :
                    'bg-amber-500 text-white'
                  }`}>
                    Poids: {outcome.commitment.metadata?.confidenceWeight}
                  </div>
                </div>
                <div className="space-y-1 text-slate-300">
                  <div>
                    Type de preuve : <span className="text-emerald-400 font-bold">{outcome.commitment.type.replace(/_/g, ' ')}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 break-all font-mono">
                    HASH: {outcome.commitment.hash}
                  </div>
                  <div className="text-[10px] text-slate-500 italic">
                    Source: {outcome.commitment.metadata?.source} | Causalité: {outcome.commitment.metadata?.causalityVerified ? 'Certifiée' : 'Non-vérifiée'}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function Opportunities() {
  const { user, profile, loading: authLoading } = useAuth();
  const [outcomes, setOutcomes] = useState<RecruitmentOutcome[]>(mockOutcomes);
  const [selectedOutcome, setSelectedOutcome] = useState<RecruitmentOutcome | null>(null);
  const [disputeReason, setDisputeReason] = useState('');
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Filters & Sorting State
  const [filterSector, setFilterSector] = useState<string>('all');
  const [filterExperience, setFilterExperience] = useState<string>('all');
  const [filterLocation, setFilterLocation] = useState<string>('all');
  const [sortBy, setBy] = useState<'matchScore' | 'date'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Skills Search State
  const [skillSearchQuery, setSkillSearchQuery] = useState('');
  const [filteredMarketOpportunities, setFilteredMarketOpportunities] = useState(mockOpportunities);

  useEffect(() => {
    if (!skillSearchQuery.trim()) {
      setFilteredMarketOpportunities(mockOpportunities);
      return;
    }
    const query = skillSearchQuery.toLowerCase();
    const filtered = mockOpportunities.filter(o => 
      o.requiredSkills.some(s => s.toLowerCase().includes(query)) ||
      o.matchedSkills.some(s => s.toLowerCase().includes(query)) ||
      o.skillGap.some(s => s.toLowerCase().includes(query)) ||
      o.title.toLowerCase().includes(query)
    );
    setFilteredMarketOpportunities(filtered);
  }, [skillSearchQuery]);

  if (authLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 font-mono">
        <Loader2 className="animate-spin text-blue-500" size={48} />
        <p className="text-slate-400 font-bold uppercase tracking-wider text-xs">Chargement du moteur de décision...</p>
      </div>
    );
  }

  const activeUser = profile || mockUser;

  const sectors = Array.from(new Set(mockOutcomes.map(o => o.sector).filter(Boolean)));
  const locations = Array.from(new Set(mockOutcomes.map(o => o.location).filter(Boolean)));

  const filteredOutcomes = outcomes
    .filter(o => {
      const matchSector = filterSector === 'all' || o.sector === filterSector;
      const matchExperience = filterExperience === 'all' || o.experienceLevel === filterExperience;
      const matchLocation = filterLocation === 'all' || o.location === filterLocation;
      return matchSector && matchExperience && matchLocation;
    })
    .sort((a, b) => {
      if (sortBy === 'matchScore') {
        const scoreA = a.attributionConfidenceScore || 0;
        const scoreB = b.attributionConfidenceScore || 0;
        return sortOrder === 'desc' ? scoreB - scoreA : scoreA - scoreB;
      } else {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
      }
    });

  const handleConfirmHire = (outcomeId: string) => {
    const updated = outcomes.map(o => {
      if (o.id === outcomeId) {
        const candidateConfirmed = true;
        const confirmationTimestamp = new Date().toISOString();

        const tempOutcome = { 
          ...o, 
          candidateConfirmed, 
          confirmationTimestamp,
          status: 'hired' as OutcomeStatus,
          updatedAt: confirmationTimestamp
        };

        const attributionConfidenceScore = calculateAttributionScore(tempOutcome);
        const riskFlags = detectFraudSignals(tempOutcome);
        const penalty = calculatePenalty(tempOutcome);
        const truthState = getTruthState(tempOutcome);

        const commitment = captureProofEvent(
          tempOutcome,
          'mutual_commitment_signal',
          activeUser.id
        );

        const finalOutcome = { 
          ...tempOutcome,
          commitment,
          attributionConfidenceScore,
          riskFlags,
          truthState
        };

        const verdict = calculateReliability(finalOutcome);
        
        if (penalty > 0) {
          mockUser.penaltyScore = (mockUser.penaltyScore || 0) + penalty;
          mockUser.reputationScore = Math.max(0, mockUser.reputationScore - penalty);
          
          mockUser.auditLog.push({
            id: `log_penalty_${Date.now()}`,
            timestamp: new Date().toISOString(),
            actorId: 'system',
            actorType: 'system',
            action: 'anomaly_detected',
            details: `Pénalité de réputation appliquée: -${penalty} pts. Raisons: ${riskFlags.join(', ')}`,
            targetId: o.id,
            hash: Math.random().toString(36).substring(7),
            previousHash: mockUser.auditLog[mockUser.auditLog.length - 1]?.hash || '0'
          });
        }

        return { ...finalOutcome, verdict };
      }
      return o;
    });
    setOutcomes(updated);
  };

  const handleDispute = (outcomeId: string) => {
    const updated = outcomes.map(o => {
      if (o.id === outcomeId) {
        const newDispute = {
          id: `disp-${Date.now()}`,
          timestamp: new Date().toISOString(),
          actorId: activeUser.id,
          reason: disputeReason,
          status: 'open' as const
        };
        const tempOutcome = {
          ...o,
          disputeStatus: 'open' as const,
          truthState: 'disputed' as const,
          disputeHistory: [...(o.disputeHistory || []), newDispute]
        };
        const verdict = calculateReliability(tempOutcome);
        return { ...tempOutcome, verdict };
      }
      return o;
    });
    setOutcomes(updated);
    setShowDisputeModal(false);
    setDisputeReason('');
  };

  const avgConfidence = Math.round(outcomes.reduce((acc, o) => acc + o.attributionConfidenceScore, 0) / (outcomes.length || 1));

  return (
    <div className="space-y-10 animate-in fade-in duration-300 pb-20">
      {/* HEADER SECTION */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#1E293B]">
        <div>
          <div className="flex items-center gap-2.5 mb-1 text-blue-400 font-mono text-xs font-bold uppercase tracking-wider">
            <Target size={16} />
            <span>DECISION MATCHING ENGINE v1.5</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold font-display tracking-tight text-slate-100">
            {opportunitiesCopy.header.title} {opportunitiesCopy.header.highlight}
          </h1>
          <p className="text-slate-400 mt-1.5 text-sm md:text-base max-w-2xl leading-relaxed">
            {opportunitiesCopy.header.description}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-blue-400 bg-blue-500/10 px-3 py-2 rounded-xl border border-blue-500/20 shrink-0">
          <Sparkles size={16} />
          <span>MATCHING ALIGNED WITH VERIFIED PROOFS</span>
        </div>
      </header>

      {/* STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
        <div className="rounded-2xl bg-surface border border-surface-border p-6 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-text-muted text-xs font-bold uppercase">
            <span>{opportunitiesCopy.stats.verified}</span>
            <ShieldCheck size={18} className="text-emerald-500" />
          </div>
          <div className="text-4xl font-extrabold text-text">
            {outcomes.filter(o => o.truthState === 'verified').length}
          </div>
          <p className="text-[10px] text-text-muted">Recrutements certifiés par preuves directes</p>
        </div>

        <div className="rounded-2xl bg-surface border border-surface-border p-6 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-text-muted text-xs font-bold uppercase">
            <span>{opportunitiesCopy.stats.arbitration}</span>
            <AlertTriangle size={18} className="text-amber-500" />
          </div>
          <div className="text-4xl font-extrabold text-amber-500">
            {outcomes.filter(o => o.truthState === 'disputed').length}
          </div>
          <p className="text-[10px] text-text-muted">Dossiers en cours d'examen de cohérence</p>
        </div>

        <div className="rounded-2xl bg-surface border border-surface-border p-6 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-text-muted text-xs font-bold uppercase">
            <span>{opportunitiesCopy.stats.confidence}</span>
            <TrendingUp size={18} className="text-blue-500" />
          </div>
          <div className="text-4xl font-extrabold text-blue-500">
            {avgConfidence}%
          </div>
          <p className="text-[10px] text-text-muted">Moyenne de causalité et d'attribution</p>
        </div>
      </div>

      {/* MARKET OPPORTUNITIES DECISION MATCHING */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-surface-border pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-blue-500/10 text-blue-500 border border-blue-500/30 rounded font-mono text-[10px] font-bold uppercase mb-1">
              <Target size={12} /> {opportunitiesCopy.sections.market}
            </div>
            <h2 className="text-2xl font-bold font-display text-text">
              {opportunitiesCopy.search.title} <span className="text-blue-500">{opportunitiesCopy.search.highlight}</span>
            </h2>
            <p className="text-xs font-mono text-text-muted mt-0.5 max-w-xl">
              {opportunitiesCopy.search.description}
            </p>
          </div>
          
          <div className="relative w-full md:w-80 font-mono text-xs">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
            <input 
              type="text"
              value={skillSearchQuery}
              onChange={(e) => setSkillSearchQuery(e.target.value)}
              placeholder={opportunitiesCopy.search.placeholder}
              className="w-full bg-surface border border-surface-border py-2.5 pl-10 pr-4 rounded-xl text-text placeholder:text-text-dim focus:outline-none focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AnimatePresence mode='popLayout'>
            {filteredMarketOpportunities.slice(0, 6).map((opportunity) => (
              <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                key={opportunity.id}
              >
                <OpportunityMatchCard
                  roleTitle={opportunity.title}
                  companyName={opportunity.company}
                  matchPercentage={opportunity.matchScore}
                  requiredSkills={[...opportunity.matchedSkills, ...opportunity.skillGap]}
                  verifiedSkills={opportunity.matchedSkills}
                  matchingProofs={mockProjects[0]?.proofs || []}
                  onApplyOrInspect={() => {}}
                />
              </motion.div>
            ))}
          </AnimatePresence>
          
          {filteredMarketOpportunities.length === 0 && (
            <div className="col-span-full py-12 text-center space-y-3 bg-surface border border-dashed border-surface-border rounded-2xl font-mono text-xs">
              <Search size={36} className="mx-auto text-text-muted" />
              <div className="space-y-1">
                <p className="font-bold text-text uppercase">Aucune opportunité trouvée</p>
                <p className="text-text-muted">Essayez une autre compétence ou réinitialisez la recherche.</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* RECRUITMENT OUTCOMES & HISTORY */}
      <section className="space-y-6 pt-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-surface-border pb-4 gap-4">
          <h2 className="text-2xl font-bold font-display text-text">
            {opportunitiesCopy.sections.history}
          </h2>
          
          <div className="flex items-center gap-3 font-mono text-xs">
            <div className="flex items-center gap-1.5 text-emerald-500">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <span>Vérifié</span>
            </div>
            <div className="flex items-center gap-1.5 text-amber-500">
              <div className="w-2 h-2 rounded-full bg-amber-500"></div>
              <span>Contesté</span>
            </div>
          </div>
        </div>

        {/* FILTERS & SORTING BAR */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 p-4 bg-surface border border-surface-border rounded-2xl font-mono text-xs">
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-text-muted">Secteur</label>
            <select 
              value={filterSector}
              onChange={(e) => setFilterSector(e.target.value)}
              className="w-full bg-surface-section border border-surface-border p-2.5 rounded-xl text-text outline-none focus:border-blue-500"
            >
              <option value="all" className="bg-surface text-text">Tous les secteurs</option>
              {sectors.map(s => <option key={s} value={s} className="bg-surface text-text">{s}</option>)}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-text-muted">Expérience</label>
            <select 
              value={filterExperience}
              onChange={(e) => setFilterExperience(e.target.value)}
              className="w-full bg-surface-section border border-surface-border p-2.5 rounded-xl text-text outline-none focus:border-blue-500"
            >
              <option value="all" className="bg-surface text-text">Tous les niveaux</option>
              <option value="junior" className="bg-surface text-text">Junior</option>
              <option value="intermediate" className="bg-surface text-text">Intermediate</option>
              <option value="senior" className="bg-surface text-text">Senior</option>
              <option value="lead" className="bg-surface text-text">Lead</option>
              <option value="staff" className="bg-surface text-text">Staff</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-text-muted">Localisation</label>
            <select 
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
              className="w-full bg-surface-section border border-surface-border p-2.5 rounded-xl text-text outline-none focus:border-blue-500"
            >
              <option value="all" className="bg-surface text-text">Toutes les zones</option>
              {locations.map(l => <option key={l} value={l} className="bg-surface text-text">{l}</option>)}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-text-muted">Trier par</label>
            <select 
              value={sortBy}
              onChange={(e) => setBy(e.target.value as any)}
              className="w-full bg-surface-section border border-surface-border p-2.5 rounded-xl text-text outline-none focus:border-blue-500"
            >
              <option value="matchScore" className="bg-surface text-text">Match Score</option>
              <option value="date" className="bg-surface text-text">Date d'application</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-text-muted">Ordre</label>
            <button 
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="w-full flex items-center justify-between bg-surface-section border border-surface-border p-2.5 rounded-xl text-text hover:border-blue-500 transition-colors"
            >
              <span>{sortOrder === 'desc' ? 'Décroissant' : 'Croissant'}</span>
              <TrendingUp size={14} className={sortOrder === 'asc' ? 'rotate-180 text-blue-500' : 'text-blue-500'} />
            </button>
          </div>
        </div>

        {/* OUTCOMES TABLE */}
        <div className="overflow-x-auto -mx-4 px-4">
          <table className="w-full min-w-[900px] border-separate border-spacing-y-3 font-mono text-xs">
            <thead>
              <tr className="text-left text-slate-500 uppercase">
                <th className="px-5 py-3 font-bold">{opportunitiesCopy.table.company}</th>
                <th className="px-5 py-3 font-bold">{opportunitiesCopy.table.role}</th>
                <th className="px-5 py-3 font-bold text-center">{opportunitiesCopy.table.confidence}</th>
                <th className="px-5 py-3 font-bold">{opportunitiesCopy.table.status}</th>
                <th className="px-5 py-3 font-bold text-right">{opportunitiesCopy.table.actions}</th>
              </tr>
            </thead>
            <tbody>
              {filteredOutcomes.map((outcome) => (
                <React.Fragment key={outcome.id}>
                  <tr 
                    onClick={() => setExpandedId(expandedId === outcome.id ? null : outcome.id)}
                    className={`group cursor-pointer transition-all ${
                      outcome.truthState === 'disputed' 
                        ? 'bg-rose-500/5 hover:bg-rose-500/10' 
                        : 'bg-surface hover:bg-surface-hover'
                    }`}
                  >
                    <td className={`px-5 py-4 border-y border-l border-surface-border first:rounded-l-xl ${expandedId === outcome.id ? 'border-b-0 rounded-bl-none' : ''}`}>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-surface-section rounded-lg text-blue-500 border border-surface-border">
                          <Building2 size={18} />
                        </div>
                        <span className="font-bold text-text">{outcome.companyName}</span>
                      </div>
                    </td>

                    <td className={`px-5 py-4 border-y border-surface-border ${expandedId === outcome.id ? 'border-b-0' : ''}`}>
                      <div className="space-y-1.5">
                        <div className="font-bold text-sm text-text font-display">{outcome.role}</div>
                        <div className="flex flex-wrap items-center gap-2">
                          <VerdictBadge verdict={outcome.verdict} />
                          <div className="inline-flex items-center gap-1 text-[10px] text-text-muted bg-surface-section px-2 py-0.5 rounded border border-surface-border">
                            <Clock size={10} />
                            <span>{new Date(outcome.createdAt).toLocaleDateString()}</span>
                          </div>
                          {outcome.isLockedToPlatform && (
                            <div className="inline-flex items-center gap-1 text-[10px] text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                              <ShieldCheck size={10} />
                              <span>PLATEFORME</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className={`px-5 py-4 border-y border-surface-border text-center ${expandedId === outcome.id ? 'border-b-0' : ''}`}>
                      <div className="text-2xl font-extrabold text-blue-500">
                        {outcome.attributionConfidenceScore}%
                      </div>
                    </td>

                    <td className={`px-5 py-4 border-y border-surface-border ${expandedId === outcome.id ? 'border-b-0' : ''}`}>
                      {outcome.status === 'hired' ? (
                        <div className="inline-flex items-center gap-1.5 text-emerald-500 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-full font-bold uppercase">
                          <CheckCircle2 size={12} />
                          <span>{opportunitiesCopy.status.hired}</span>
                        </div>
                      ) : outcome.status === 'rejected' ? (
                        <div className="inline-flex items-center gap-1.5 text-rose-500 bg-rose-500/10 border border-rose-500/30 px-2.5 py-1 rounded-full font-bold uppercase">
                          <XCircle size={12} />
                          <span>{opportunitiesCopy.status.rejected}</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 text-amber-500 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-full font-bold uppercase">
                          <Clock size={12} />
                          <span>{opportunitiesCopy.status.pending}</span>
                        </div>
                      )}
                    </td>

                    <td className={`px-5 py-4 border-y border-r border-surface-border last:rounded-r-xl text-right ${expandedId === outcome.id ? 'border-b-0 rounded-br-none' : ''}`}>
                      <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center justify-end gap-2">
                          {outcome.status !== 'hired' && outcome.status !== 'rejected' && (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleConfirmHire(outcome.id);
                              }}
                              className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors shadow-md shadow-blue-500/20"
                              title="Confirmer Embauche"
                            >
                              <CheckCircle2 size={16} />
                            </button>
                          )}
                          {outcome.truthState !== 'disputed' && (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedOutcome(outcome);
                                setShowDisputeModal(true);
                              }}
                              className="p-2 bg-surface-section text-text-muted hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors border border-surface-border"
                              title="Signaler / Contester"
                            >
                              <AlertTriangle size={16} />
                            </button>
                          )}
                          <div className="p-2 text-text-muted">
                            {expandedId === outcome.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </div>
                        </div>
                        {outcome.disputeStatus === 'open' && (
                          <div className="text-[10px] font-bold text-rose-500 flex items-center gap-1 uppercase">
                            <MessageSquare size={10} />
                            <span>Arbitrage Ouvert</span>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>

                  {expandedId === outcome.id && (
                    <tr>
                      <td colSpan={5} className="px-5 pb-5 border-x border-b border-surface-border rounded-b-xl bg-surface">
                        <div className="pt-3 border-t border-surface-border space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="p-3 bg-surface-section rounded-xl border border-surface-border">
                              <div className="text-[10px] text-text-muted uppercase font-bold mb-0.5">Secteur</div>
                              <div className="font-bold text-text flex items-center gap-1.5">
                                <Building2 size={14} className="text-blue-500" />
                                <span>{outcome.sector || 'N/A'}</span>
                              </div>
                            </div>

                            <div className="p-3 bg-surface-section rounded-xl border border-surface-border">
                              <div className="text-[10px] text-text-muted uppercase font-bold mb-0.5">Niveau d'Expérience</div>
                              <div className="font-bold text-blue-500 flex items-center gap-1.5 uppercase">
                                <Zap size={14} />
                                <span>{outcome.experienceLevel || 'N/A'}</span>
                              </div>
                            </div>

                            <div className="p-3 bg-surface-section rounded-xl border border-surface-border">
                              <div className="text-[10px] text-text-muted uppercase font-bold mb-0.5">Localisation</div>
                              <div className="font-bold text-text flex items-center gap-1.5">
                                <Globe size={14} className="text-blue-500" />
                                <span>{outcome.location || 'N/A'}</span>
                              </div>
                            </div>
                          </div>

                          <ExplainabilityPanel outcome={outcome} />
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* DISPUTE MODAL */}
      <AnimatePresence>
        {showDisputeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-surface border border-surface-border p-6 max-w-lg w-full rounded-2xl space-y-5 shadow-2xl font-mono text-xs"
            >
              <div className="flex items-center gap-3 border-b border-surface-border pb-4">
                <div className="p-2.5 bg-rose-500/10 text-rose-500 rounded-xl border border-rose-500/20">
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-display text-text">Signaler une Incohérence</h3>
                  <p className="text-[10px] text-text-muted">Ouverture d'une procédure d'arbitrage de preuve</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <p className="text-text leading-relaxed">
                  Vous contestez la réalité déclarée pour cette opportunité. Décrivez le motif d'incohérence pour le registre de vérité.
                </p>
                <textarea 
                  value={disputeReason}
                  onChange={(e) => setDisputeReason(e.target.value)}
                  placeholder="Expliquez la nature du désaccord (ex: engagement non honoré, mauvaise attribution)..."
                  className="w-full h-28 bg-surface-section border border-surface-border p-3 rounded-xl text-text placeholder:text-text-dim focus:border-blue-500 outline-none"
                />
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => setShowDisputeModal(false)}
                  className="flex-1 py-3 bg-surface-section hover:bg-surface-hover text-text font-bold uppercase rounded-xl transition-colors border border-surface-border"
                >
                  Annuler
                </button>
                <button 
                  onClick={() => selectedOutcome && handleDispute(selectedOutcome.id)}
                  disabled={!disputeReason.trim()}
                  className="flex-1 py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold uppercase rounded-xl transition-colors disabled:opacity-50 shadow-lg shadow-rose-500/20"
                >
                  Soumettre au Registre
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* TRUTH STANDARD FOOTER */}
      <footer className="p-8 border border-dashed border-surface-border rounded-2xl text-center space-y-3 font-mono text-xs">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-surface text-blue-500 rounded-full border border-surface-border">
          <ShieldCheck size={14} />
          <span className="font-bold uppercase tracking-wider text-[10px]">Standard de Vérité Économique v2.1</span>
        </div>
        <p className="text-text-muted max-w-lg mx-auto leading-relaxed">
          Arbitrage prédictif et décisionnel du marché du travail : alignement algorithmique strict entre preuves d'impact vérifiées, compétences attestées et interactions certifiées.
        </p>
      </footer>
    </div>
  );
}
