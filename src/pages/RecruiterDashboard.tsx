import { useState } from 'react';
import { 
  Search, 
  ShieldCheck, 
  TrendingUp, 
  UserCheck, 
  Zap, 
  BarChart3, 
  Globe, 
  Mail, 
  CheckCircle, 
  AlertTriangle, 
  Fingerprint, 
  History, 
  Lock, 
  Users,
  Phone,
  Calendar,
  FileText,
  CheckCircle2,
  Clock,
  ArrowRight,
  Gavel,
  ExternalLink,
  Award,
  Briefcase
} from 'lucide-react';
import { mockUsers, mockRecruiter, mockProjects, mockOutcomes, mockContributions } from '../store/mockData';
import { 
  User, 
  Recruiter, 
  RecruitmentOutcome, 
  OutcomeStatus, 
  ContactSession, 
  Message, 
  AuditLogEntry, 
  TruthState, 
  ReliabilityLevel, 
  CommitmentType, 
  Proof, 
  ProofValidation 
} from '../types';
import { motion, AnimatePresence } from 'motion/react';
import RecruitmentChat from '../components/RecruitmentChat';
import { 
  calculateAttributionScore, 
  detectFraudSignals, 
  calculatePenalty, 
  getTruthState, 
  generateValidationSources, 
  calculateReliability, 
  captureProofEvent 
} from '../lib/attribution';
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
    highly_reliable: { color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30', label: terminologyMap.verdict.getLabel('Highly Reliable'), icon: ShieldCheck },
    reliable: { color: 'text-blue-400 bg-blue-500/10 border-blue-500/30', label: terminologyMap.verdict.getLabel('Reliable'), icon: CheckCircle2 },
    uncertain: { color: 'text-amber-400 bg-amber-500/10 border-amber-500/30', label: 'Incertain', icon: Zap },
    risky: { color: 'text-rose-400 bg-rose-500/10 border-rose-500/30', label: 'Risqué', icon: AlertTriangle }
  };
  const config = configs[verdict] || configs.reliable;
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-mono font-bold uppercase tracking-widest ${config.color}`}>
      <Icon size={12} />
      {config.label}
    </div>
  );
};

const TruthStateBadge = ({ state }: { state: TruthState }) => {
  const configs = {
    verified: { color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30', label: 'Vérifié', icon: ShieldCheck },
    probable: { color: 'text-blue-400 bg-blue-500/10 border-blue-500/30', label: 'Probable', icon: Zap },
    disputed: { color: 'text-rose-400 bg-rose-500/10 border-rose-500/30', label: 'Contesté', icon: AlertTriangle },
    unverified: { color: 'text-slate-400 bg-slate-800 border-slate-700', label: 'Non Vérifié', icon: History }
  };
  const config = configs[state] || configs.unverified;
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-mono font-bold uppercase tracking-widest ${config.color}`}>
      <Icon size={12} />
      {config.label}
    </div>
  );
};

export default function RecruiterDashboard() {
  const { user, profile } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [outcomes, setOutcomes] = useState<RecruitmentOutcome[]>(mockOutcomes);

  const userOutcome = selectedUser ? outcomes.find(o => o.userId === selectedUser.id) : null;

  const handleUpdateStatus = (newStatus: OutcomeStatus) => {
    if (!selectedUser) return;
    
    const statusToSignal: Partial<Record<OutcomeStatus, CommitmentType>> = {
      'contacted': 'intent_signal',
      'interview_scheduled': 'engagement_signal',
      'offer_sent': 'engagement_signal',
      'hired': 'mutual_commitment_signal'
    };

    const signalType = statusToSignal[newStatus];

    const updatedOutcomes = outcomes.map(o => {
      if (o.userId === selectedUser.id) {
        const isHired = newStatus === 'hired';
        let tempOutcome = { 
          ...o, 
          status: newStatus, 
          updatedAt: new Date().toISOString(),
          isVerifiedAttribution: isHired ? (o.candidateConfirmed && o.recruiterConfirmed) : false
        };

        if (signalType) {
          tempOutcome.commitment = captureProofEvent(tempOutcome, signalType, 'rec-current');
        }

        tempOutcome.attributionConfidenceScore = calculateAttributionScore(tempOutcome);
        tempOutcome.truthState = getTruthState(tempOutcome);
        tempOutcome.verdict = calculateReliability(tempOutcome);
        
        return tempOutcome;
      }
      return o;
    });
    
    if (!userOutcome) {
        const baseOutcome: any = {
          id: `ro-${Date.now()}`,
          userId: selectedUser.id,
          recruiterId: 'rec-current',
          status: newStatus,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          companyName: 'My Company',
          role: selectedUser.role,
          linkedProofIds: [],
          contactSessions: [],
          isLockedToPlatform: false,
          candidateConfirmed: false,
          recruiterConfirmed: false,
          attributionConfidenceScore: 0,
          truthState: 'unverified',
          validationSources: [],
          marketFeedback: [],
          isVerifiedAttribution: false
        };

        if (signalType) {
          baseOutcome.commitment = captureProofEvent(baseOutcome, signalType, 'rec-current');
        }

        baseOutcome.attributionConfidenceScore = calculateAttributionScore(baseOutcome);
        baseOutcome.truthState = getTruthState(baseOutcome);
        baseOutcome.verdict = calculateReliability(baseOutcome);

        setOutcomes([...outcomes, baseOutcome]);
    } else {
      setOutcomes(updatedOutcomes);
    }
  };

  const handleContact = (method: 'email' | 'whatsapp') => {
    if (!selectedUser) return;
    
    const sessionId = `sess_${Math.random().toString(36).substr(2, 9)}`;
    const trackingUrl = `https://workproof.os/t/${sessionId}`;
    const newSession: ContactSession = {
      id: sessionId,
      method,
      timestamp: new Date().toISOString(),
      trackingUrl,
      messages: []
    };

    if (!userOutcome) {
      const baseOutcome: any = {
        id: `ro-${Date.now()}`,
        userId: selectedUser.id,
        recruiterId: 'rec-current',
        status: 'contacted',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        companyName: 'My Company',
        role: selectedUser.role,
        linkedProofIds: [],
        contactSessions: [newSession],
        isLockedToPlatform: false,
        candidateConfirmed: false,
        recruiterConfirmed: false,
        marketFeedback: [],
        isVerifiedAttribution: false
      };

      const validationSources = generateValidationSources(baseOutcome);
      const tempWithSources = { ...baseOutcome, validationSources };
      
      const commitment = captureProofEvent(
        tempWithSources,
        'intent_signal',
        'rec-current'
      );

      const finalWithCommitment = { ...tempWithSources, commitment };
      
      const attributionConfidenceScore = calculateAttributionScore(finalWithCommitment);
      const truthState = getTruthState(finalWithCommitment);
      const verdict = calculateReliability(finalWithCommitment);

      const newOutcome: RecruitmentOutcome = {
        ...finalWithCommitment,
        attributionConfidenceScore,
        truthState,
        verdict
      };
      setOutcomes([...outcomes, newOutcome]);
    } else {
      const updatedOutcomes = outcomes.map(o => {
        if (o.userId === selectedUser.id) {
          const tempOutcome = { 
            ...o, 
            contactSessions: [...o.contactSessions, newSession],
            status: o.status === 'rejected' ? 'contacted' : o.status,
            updatedAt: new Date().toISOString()
          };
          const attributionConfidenceScore = calculateAttributionScore(tempOutcome);
          const truthState = getTruthState(tempOutcome);
          const verdict = calculateReliability(tempOutcome);
          return { ...tempOutcome, attributionConfidenceScore, truthState, verdict };
        }
        return o;
      });
      setOutcomes(updatedOutcomes);
    }
    
    console.log(`[ATTRIBUTION] Initiating contact via ${method}. Session: ${sessionId}`);
    alert(`LIEN DE TRACKING GÉNÉRÉ : ${trackingUrl}\n\nAction : Ouverture de ${method} avec ID de session unique pour attribution forcée.`);
  };

  const handleConfirmAttribution = () => {
    if (!userOutcome) return;
    
    const updatedOutcomes = outcomes.map(o => {
      if (o.id === userOutcome.id) {
        const recruiterConfirmed = true;
        const confirmationTimestamp = new Date().toISOString();
        
        const tempOutcome = { 
          ...o, 
          recruiterConfirmed, 
          confirmationTimestamp,
          updatedAt: confirmationTimestamp
        };

        const attributionConfidenceScore = calculateAttributionScore(tempOutcome);
        const riskFlags = detectFraudSignals(tempOutcome);
        const penalty = calculatePenalty(tempOutcome);
        const truthState = getTruthState(tempOutcome);
        
        if (selectedUser && penalty > 0) {
          selectedUser.penaltyScore = (selectedUser.penaltyScore || 0) + penalty;
          selectedUser.reputationScore = Math.max(0, selectedUser.reputationScore - penalty);
          
          const newLog: AuditLogEntry = {
            id: `log_penalty_${Date.now()}`,
            timestamp: new Date().toISOString(),
            actorId: 'system',
            actorType: 'system',
            action: 'anomaly_detected',
            details: `Pénalité de réputation appliquée: -${penalty} pts. Raisons: ${riskFlags.join(', ')}`,
            targetId: o.id,
            hash: Math.random().toString(36).substring(7),
            previousHash: selectedUser.auditLog[selectedUser.auditLog.length - 1]?.hash || '0'
          };
          selectedUser.auditLog.push(newLog);
        }
        
        const isVerifiedAttribution = o.isLockedToPlatform && o.candidateConfirmed && recruiterConfirmed && attributionConfidenceScore > 60;
        
        const commitment = captureProofEvent(
          tempOutcome,
          'external_confirmation_signal',
          'rec-current'
        );

        const finalOutcome = { 
          ...tempOutcome,
          commitment,
          attributionConfidenceScore,
          riskFlags,
          isVerifiedAttribution,
          attributionProof: isVerifiedAttribution ? `proof_${Math.random().toString(36).substr(2, 12)}` : o.attributionProof,
          truthState
        };

        const verdict = calculateReliability(finalOutcome);
        
        return { ...finalOutcome, verdict };
      }
      return o;
    });
    setOutcomes(updatedOutcomes);
    alert("PREUVE D'ENGAGEMENT CAPTURÉE : Je certifie que ce recrutement a eu lieu via la plateforme.\n\nLa fiabilité a été mise à jour sur la base de cette preuve.");
  };

  const handleSendMessage = (content: string) => {
    if (!selectedUser) return;

    const newMessage: Message = {
      id: `m-${Date.now()}`,
      senderId: 'rec-current',
      senderType: 'recruiter',
      content,
      timestamp: new Date().toISOString()
    };

    if (!userOutcome) {
      const sessionId = `sess_${Math.random().toString(36).substr(2, 9)}`;
      const baseOutcome: any = {
        id: `ro-${Date.now()}`,
        userId: selectedUser.id,
        recruiterId: 'rec-current',
        status: 'contacted',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        companyName: 'My Company',
        role: selectedUser.role,
        linkedProofIds: [],
        contactSessions: [{
          id: sessionId,
          method: 'platform',
          timestamp: new Date().toISOString(),
          trackingUrl: `https://workproof.os/t/${sessionId}`,
          messages: [newMessage]
        }],
        isLockedToPlatform: true,
        candidateConfirmed: false,
        recruiterConfirmed: false,
        marketFeedback: [],
        isVerifiedAttribution: false
      };

      const validationSources = generateValidationSources(baseOutcome);
      const tempWithSources = { ...baseOutcome, validationSources };
      
      const commitment = captureProofEvent(
        tempWithSources,
        'intent_signal',
        'rec-current'
      );

      const finalWithCommitment = { ...tempWithSources, commitment };
      
      const attributionConfidenceScore = calculateAttributionScore(finalWithCommitment);
      const truthState = getTruthState(finalWithCommitment);
      const verdict = calculateReliability(finalWithCommitment);

      const newOutcome: RecruitmentOutcome = {
        ...finalWithCommitment,
        attributionConfidenceScore,
        truthState,
        verdict
      };
      setOutcomes([...outcomes, newOutcome]);
    } else {
      const updatedOutcomes = outcomes.map(o => {
        if (o.userId === selectedUser.id) {
          const updatedSessions = [...o.contactSessions];
          if (updatedSessions.length === 0) {
            updatedSessions.push({
              id: `sess_${Math.random().toString(36).substr(2, 9)}`,
              method: 'platform',
              timestamp: new Date().toISOString(),
              trackingUrl: '',
              messages: [newMessage]
            });
          } else {
            const lastSession = { ...updatedSessions[updatedSessions.length - 1] };
            lastSession.messages = [...lastSession.messages, newMessage];
            updatedSessions[updatedSessions.length - 1] = lastSession;
          }
          return { 
            ...o, 
            contactSessions: updatedSessions,
            isLockedToPlatform: true,
            updatedAt: new Date().toISOString() 
          };
        }
        return o;
      });
      setOutcomes(updatedOutcomes);
    }
  };

  const filteredUsers = mockUsers.filter(userItem => 
    userItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    userItem.role.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => b.weightedScore - a.weightedScore);

  const activeRecruiter: Recruiter = profile ? {
    id: profile.id,
    name: profile.name,
    company: profile.companyDomain || 'Entreprise vérifiée',
    companyDomain: profile.companyDomain || 'workproof.os',
    emailVerified: true,
    verifiedBadge: true,
    avatar: profile.avatar || 'https://i.pravatar.cc/150?u=r1',
    role: profile.role || 'Recruteur / Décideur'
  } : mockRecruiter;

  // Build proofs array for selected user
  const candidateProofs: Proof[] = selectedUser
    ? (mockProjects.filter(p => p.userId === selectedUser.id).flatMap(p => p.proofs).length > 0
        ? mockProjects.filter(p => p.userId === selectedUser.id).flatMap(p => p.proofs)
        : (mockProjects.flatMap(p => p.proofs).length > 0
            ? mockProjects.flatMap(p => p.proofs).slice(0, 2).map((pr, idx) => ({
                ...pr,
                id: `pr_${selectedUser.id}_${idx}`,
                title: `${selectedUser.topSkills[idx] || 'Savoir-Faire'} — Réalisation Certifiée`,
                description: selectedUser.aiSummary.split('→')[idx + 1] || pr.description,
                verified: true,
                confidenceScore: selectedUser.weightedScore ? Math.min(100, Math.round(selectedUser.weightedScore / 10)) : 92
              }))
            : []))
    : [];

  // Build validation seals array
  const candidateValidations: ProofValidation[] = selectedUser
    ? (userOutcome?.validationSources || generateValidationSources({ id: selectedUser.id } as any)).map((src, idx) => ({
        id: src.id || `val_${idx}`,
        proofId: candidateProofs[0]?.id || 'pr1',
        validatorId: `v_${idx}`,
        validatorType: idx === 0 ? 'manager' : idx === 1 ? 'client' : 'peer',
        status: src.status === 'verified' ? 'approved' : 'pending',
        comment: `Validation de la preuve par ${src.label}. Indice de confiance: ${src.confidence}%.`,
        weight: src.weight || 0.8,
        timestamp: new Date().toISOString(),
        createdAt: new Date().toISOString()
      }))
    : [];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto">
      {/* Demo Banner */}
      {(!user || !profile) && (
        <div className="bg-amber-500/10 border border-amber-500/30 text-amber-300 p-4 rounded-xl flex items-center justify-between gap-4 text-xs font-mono font-semibold">
          <div className="flex items-center gap-2">
            <span className="bg-amber-500 text-slate-950 text-[10px] font-mono font-black px-2 py-0.5 rounded uppercase">Mode Démonstration</span>
            <span>Candidatures et données de démonstration affichées.</span>
          </div>
        </div>
      )}

      {/* Header Authority */}
      <header className="border-b border-surface-border pb-8 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded-full text-xs font-mono font-bold uppercase tracking-widest">
              <ShieldCheck size={14} /> Decision OS v1.5.0
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-extrabold text-text tracking-tight">
              Espace Décision Recruteur
            </h1>
            <p className="text-text-muted text-sm md:text-base max-w-2xl">
              Évaluez les talents selon leurs preuves vérifiées par pairs, leur correspondance d'opportunité et leurs actifs de preuve audités.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:items-center gap-4">
            {/* Recruiter Identity Badge */}
            <div className="flex items-center gap-4 bg-surface p-4 border border-surface-border rounded-2xl">
              <div className="relative shrink-0">
                <img src={activeRecruiter.avatar} alt={activeRecruiter.name} className="w-12 h-12 rounded-full border-2 border-emerald-500/50 object-cover" />
                {activeRecruiter.verifiedBadge && (
                  <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-slate-950 rounded-full p-1 border border-surface">
                    <ShieldCheck size={10} />
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-display font-bold text-text truncate">{activeRecruiter.name}</span>
                  {activeRecruiter.emailVerified && <Mail size={12} className="text-emerald-500" />}
                </div>
                <div className="flex items-center gap-1.5 text-xs font-mono text-text-muted truncate">
                  <Globe size={11} className="text-blue-500" />
                  <span>{activeRecruiter.companyDomain || 'Entreprise vérifiée'}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-surface p-4 border border-surface-border rounded-2xl">
              <div className="p-2.5 bg-blue-500/10 text-blue-500 rounded-xl">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-[10px] font-mono font-bold uppercase tracking-widest text-text-muted">Talents Dispo</span>
                <span className="text-lg font-mono font-extrabold text-text">{mockUsers.length}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-surface p-4 border border-surface-border rounded-2xl">
              <div className="p-2.5 bg-emerald-500/10 text-emerald-500 rounded-xl">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-[10px] font-mono font-bold uppercase tracking-widest text-text-muted">Fiabilité</span>
                <span className="text-lg font-mono font-extrabold text-emerald-500">100% Auditable</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Candidates List Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="flex items-center justify-between border-b border-surface-border pb-4">
            <h2 className="text-lg font-display font-bold text-text uppercase tracking-tight flex items-center gap-2">
              <Users size={18} className="text-blue-500" /> Candidats Audités
            </h2>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded-full text-[10px] font-mono font-bold uppercase">
              <Zap size={10} /> Analyse Factuelle
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
            <input 
              type="text" 
              placeholder="Rechercher par rôle ou compétence..."
              className="w-full bg-surface border border-surface-border rounded-xl py-3 pl-12 pr-4 text-sm font-mono text-text focus:outline-none focus:border-blue-500 transition-all placeholder:text-text-dim"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="space-y-3 max-h-[700px] overflow-y-auto pr-1 custom-scrollbar">
            {filteredUsers.map(userItem => {
              const outcome = outcomes.find(o => o.userId === userItem.id);
              const sig = userItem.marketValueSignature;
              const isSelected = selectedUser?.id === userItem.id;
              
              return (
                <div 
                  key={userItem.id}
                  onClick={() => setSelectedUser(userItem)}
                  className={`p-4 rounded-2xl cursor-pointer transition-all border ${
                    isSelected 
                      ? 'bg-surface-section border-blue-500 shadow-lg shadow-blue-500/5' 
                      : 'bg-surface border-surface-border hover:border-surface-hover'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <img src={userItem.avatar} alt={userItem.name} className="w-12 h-12 rounded-full border border-surface-border object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-display font-bold text-text truncate text-sm">{userItem.name}</h4>
                      <p className="text-xs text-text-muted font-mono truncate">{userItem.role}</p>
                      
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${
                          sig?.impactLevel === 'high' 
                            ? 'text-amber-500 border-amber-500/30 bg-amber-500/10' 
                            : 'text-text-muted border-surface-border bg-surface-section'
                        }`}>
                          Impact: {sig?.impactLevel || 'moyen'}
                        </span>
                        <span className="text-[9px] font-mono font-bold text-blue-500">
                          {terminologyMap.leverageScore.getLabel((sig?.leverage || 0) / 10)}
                        </span>
                      </div>
                    </div>

                    <div className="text-right space-y-1 shrink-0">
                      {outcome && <VerdictBadge verdict={outcome.verdict} />}
                      <div className="text-[11px] font-mono font-bold text-emerald-500 flex items-center justify-end gap-1 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        <ShieldCheck size={12} />
                        <span>{mockProjects.filter(p => p.userId === userItem.id).flatMap(p => p.proofs).length || 2} Preuves</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Candidate Detail / Decision View (8 cols) */}
        <div className="lg:col-span-8">
          {selectedUser ? (
            <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
              
              {/* Candidate Hero Header */}
              <div className="rounded-2xl bg-surface border border-surface-border p-6 md:p-8 space-y-6">
                <div className="flex flex-col md:flex-row justify-between gap-6 items-start">
                  <div className="flex flex-col sm:flex-row items-start gap-5">
                    <img src={selectedUser.avatar} alt={selectedUser.name} className="w-20 h-20 md:w-24 md:h-24 rounded-2xl border-2 border-surface-border object-cover shrink-0" />
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <h2 className="text-2xl md:text-3xl font-display font-extrabold text-text">{selectedUser.name}</h2>
                        {selectedUser.identityStatus === 'verified' && (
                          <div className="flex items-center gap-1 text-emerald-500 text-xs font-mono bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                            <ShieldCheck size={12} />
                            <span>Identité Vérifiée</span>
                          </div>
                        )}
                      </div>
                      <p className="text-base text-text-muted font-mono font-semibold">{selectedUser.role}</p>
                      
                      <div className="flex flex-wrap gap-2 pt-1">
                        <VerdictBadge verdict={userOutcome?.verdict || 'reliable'} />
                        {userOutcome?.truthState && <TruthStateBadge state={userOutcome.truthState} />}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-4">
                    <div className="text-left md:text-right">
                      <span className="block text-[10px] font-mono font-bold uppercase tracking-widest text-text-muted">Ancrage Factuel</span>
                      <span className="text-3xl md:text-4xl font-mono font-black text-emerald-500">{selectedUser.confidenceIndex || 94}%</span>
                    </div>

                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleContact('email')} 
                        className="p-3 bg-surface-section hover:bg-surface-hover text-blue-500 transition-colors rounded-xl border border-surface-border"
                        title="Email Tracké"
                      >
                        <Mail className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleContact('whatsapp')} 
                        className="p-3 bg-surface-section hover:bg-surface-hover text-emerald-500 transition-colors rounded-xl border border-surface-border"
                        title="WhatsApp Tracké"
                      >
                        <Phone className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* AI Field Summary Box */}
                <div className="bg-blue-500/5 border-l-4 border-blue-500 p-5 rounded-xl relative overflow-hidden">
                  <Zap className="absolute -right-4 -top-4 text-blue-500/10 w-24 h-24 pointer-events-none" />
                  <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-blue-500 mb-2">
                    <Zap size={14} /> Synthèse Factuelle de Terrain
                  </div>
                  <p className="text-sm md:text-base font-display text-text italic leading-relaxed relative z-10">
                    "{selectedUser.aiSummary.split('\n')[0]}"
                  </p>
                </div>
              </div>

              {/* Credibility Score Component */}
              <CredibilityScore
                score={selectedUser.weightedScore}
                proofCount={candidateProofs.length || 3}
                validationCount={selectedUser.skills?.reduce((acc, s) => acc + s.proofsCount, 0) || 5}
                confidenceIndex={selectedUser.confidenceIndex ? selectedUser.confidenceIndex / 100 : 0.94}
              />

              {/* Opportunity Match Card */}
              <OpportunityMatchCard
                roleTitle={userOutcome?.role || selectedUser.role}
                companyName={userOutcome?.companyName || activeRecruiter.company || 'Entreprise Recruteuse'}
                matchPercentage={selectedUser.weightedScore}
                requiredSkills={['Management & Direction', 'Analyse d\'Impact', 'Optimisation Opérationnelle', 'Preuves Causales']}
                verifiedSkills={selectedUser.topSkills}
                matchingProofs={candidateProofs.slice(0, 2)}
                onApplyOrInspect={() => {
                  const element = document.getElementById('candidate-proofs-section');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
              />

              {/* Top Verified Realizations & Proof Cards */}
              <div id="candidate-proofs-section" className="space-y-4">
                <div className="flex justify-between items-center border-b border-surface-border pb-3">
                  <h3 className="text-base font-display font-bold text-text uppercase tracking-tight flex items-center gap-2">
                    <ShieldCheck size={18} className="text-emerald-500" /> Réalisations Vérifiées & Preuves Ancrées
                  </h3>
                  <span className="text-xs font-mono font-bold text-emerald-500 flex items-center gap-1 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                    <Users size={12} /> {candidateProofs.length} Preuve(s) Certifiée(s)
                  </span>
                </div>

                <div className="space-y-4">
                  {candidateProofs.map((proof) => (
                    <ProofCard 
                      key={proof.id} 
                      proof={proof} 
                    />
                  ))}
                </div>
              </div>

              {/* Validation Seals & Consensus Signals */}
              <div className="rounded-2xl bg-surface border border-surface-border p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-surface-border pb-3">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-text-muted flex items-center gap-2">
                    <Award size={16} className="text-amber-500" /> Sceaux de Validation & Signaux de Consensus
                  </h4>
                  <span className="text-xs font-mono text-emerald-500">Non-Collusion Confirmée</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {candidateValidations.map((val) => (
                    <ValidationSeal 
                      key={val.id} 
                      validation={val} 
                      validatorName={val.validatorType === 'manager' ? 'Jean-Marc Durand' : val.validatorType === 'client' ? 'Audit Client Externe' : 'Validateur Pair'}
                      validatorRole={val.validatorType === 'manager' ? 'Superviseur Hiérarchique' : val.validatorType === 'client' ? 'Client Certifié' : 'Pair Réseau'}
                    />
                  ))}
                </div>

                <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
                  <p className="text-xs font-mono text-emerald-400 italic">
                    ✓ Ce profil respecte les standards stricts de non-collusion : les validateurs appartiennent à des domaines d'organisation distincts.
                  </p>
                </div>
              </div>

              {/* Recruitment Lifecycle & Attribution Tracking */}
              <div className="rounded-2xl bg-surface border border-surface-border p-6 space-y-6">
                <div className="flex justify-between items-center border-b border-surface-border pb-3">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-text-muted flex items-center gap-2">
                    <Clock size={16} className="text-blue-500" /> Parcours de Recrutement & Attribution
                  </h4>
                  {userOutcome && (
                    <span className="text-xs font-mono text-blue-500 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20">
                      Mise à jour: {new Date(userOutcome.updatedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>

                {/* Progress Stepper */}
                <div className="flex items-center justify-between relative py-4">
                  <div className="absolute top-1/2 left-0 w-full h-0.5 bg-surface-border -translate-y-1/2 z-0" />
                  
                  {[
                    { status: 'contacted', label: 'Contacté', icon: Mail },
                    { status: 'interview_scheduled', label: 'Entretien', icon: Calendar },
                    { status: 'offer_sent', label: 'Offre', icon: FileText },
                    { status: 'hired', label: 'Embauché', icon: CheckCircle2 },
                  ].map((step) => {
                    const isCompleted = userOutcome && (
                      step.status === userOutcome.status || 
                      (userOutcome.status === 'hired') ||
                      (userOutcome.status === 'offer_sent' && ['contacted', 'interview_scheduled'].includes(step.status)) ||
                      (userOutcome.status === 'interview_scheduled' && step.status === 'contacted')
                    );
                    const isActive = userOutcome?.status === step.status;

                    return (
                      <button
                        key={step.status}
                        onClick={() => handleUpdateStatus(step.status as OutcomeStatus)}
                        className="relative z-10 flex flex-col items-center gap-2 group focus:outline-none"
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                          isCompleted ? 'bg-blue-500 border-blue-500 text-white' : 'bg-surface border-surface-border text-text-muted hover:border-blue-500'
                        } ${isActive ? 'ring-4 ring-blue-500/20 scale-110' : ''}`}>
                          <step.icon size={18} />
                        </div>
                        <span className={`text-[10px] font-mono font-bold uppercase tracking-wider transition-colors ${
                          isCompleted ? 'text-blue-500' : 'text-text-muted'
                        }`}>
                          {step.label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Economic Enforcement Status */}
                {userOutcome?.status === 'hired' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4 pt-2"
                  >
                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center">
                          <Zap size={20} />
                        </div>
                        <div>
                          <span className="block text-xs font-mono font-bold uppercase text-emerald-500">Succès Ancré</span>
                          <p className="text-sm font-display font-bold text-emerald-600 dark:text-emerald-300">Candidat recruté via Work Proof OS</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="block text-[10px] font-mono text-emerald-500/70 uppercase">Timeline Décision</span>
                        <span className="text-xs font-mono font-bold text-emerald-500">18 jours (Top 5% Marché)</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-surface-section p-4 border border-surface-border rounded-xl space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-mono font-bold uppercase text-text-muted">Fiabilité de l'embauche</span>
                          <div className="flex items-center gap-2">
                            <TruthStateBadge state={userOutcome.truthState || 'unverified'} />
                            <span className={`text-xs font-mono font-bold ${
                              (userOutcome.attributionConfidenceScore || 0) > 80 ? 'text-emerald-500' : 
                              (userOutcome.attributionConfidenceScore || 0) > 50 ? 'text-amber-500' : 'text-rose-500'
                            }`}>
                              {userOutcome.attributionConfidenceScore || 0}%
                            </span>
                          </div>
                        </div>

                        <div className="h-2 bg-surface-border overflow-hidden rounded-full">
                          <div 
                            className={`h-full transition-all duration-1000 ${
                              (userOutcome.attributionConfidenceScore || 0) > 80 ? 'bg-emerald-500' : 
                              (userOutcome.attributionConfidenceScore || 0) > 50 ? 'bg-amber-500' : 'bg-rose-500'
                            }`}
                            style={{ width: `${userOutcome.attributionConfidenceScore || 0}%` }}
                          />
                        </div>

                        {!userOutcome.recruiterConfirmed && (
                          <button 
                            onClick={handleConfirmAttribution}
                            className="w-full bg-amber-500 text-slate-950 py-2.5 rounded-lg text-xs font-mono font-bold uppercase hover:bg-amber-400 transition-colors"
                          >
                            Confirmer le recrutement via la plateforme
                          </button>
                        )}
                      </div>

                      <div className="bg-surface-section p-4 border border-surface-border rounded-xl space-y-3">
                        <span className="block text-xs font-mono font-bold uppercase text-text-muted">Alertes de Cohérence</span>
                        <div className="space-y-2">
                          {userOutcome.riskFlags && userOutcome.riskFlags.length > 0 ? (
                            userOutcome.riskFlags.map((flag, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-rose-500 text-xs font-mono">
                                <AlertTriangle size={12} />
                                <span>{flag}</span>
                              </div>
                            ))
                          ) : (
                            <div className="flex items-center gap-2 text-emerald-500 text-xs font-mono">
                              <CheckCircle2 size={12} />
                              <span>Aucune anomalie détectée</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Messaging & Action Footer */}
              <div className="rounded-2xl bg-surface border border-surface-border p-6 space-y-6">
                <div>
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-text-muted mb-4 flex items-center gap-2">
                    <Mail size={14} className="text-blue-500" /> Messagerie Trackée & Traçabilité
                  </h4>
                  <RecruitmentChat 
                    recipientName={selectedUser.name}
                    isLocked={userOutcome?.isLockedToPlatform || false}
                    messages={userOutcome?.contactSessions?.flatMap(s => s.messages) || []}
                    onSendMessage={handleSendMessage}
                  />
                </div>

                {/* Decision Action Buttons */}
                <div className="space-y-3 pt-4 border-t border-surface-border">
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => handleContact('email')}
                      className="bg-surface-section text-text py-3 rounded-xl font-mono text-xs font-bold uppercase hover:bg-surface-hover transition-colors flex items-center justify-center gap-2 border border-surface-border"
                    >
                      <Mail size={16} className="text-blue-500" /> Email Tracké
                    </button>
                    <button 
                      onClick={() => handleContact('whatsapp')}
                      className="bg-surface-section text-text py-3 rounded-xl font-mono text-xs font-bold uppercase hover:bg-surface-hover transition-colors flex items-center justify-center gap-2 border border-surface-border"
                    >
                      <Phone size={16} className="text-emerald-500" /> WhatsApp Tracké
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <button 
                      onClick={() => handleUpdateStatus('interview_scheduled')}
                      className="bg-surface-section text-text py-3.5 rounded-xl font-mono text-xs font-bold uppercase hover:bg-surface-hover transition-colors border border-surface-border"
                    >
                      Entretien
                    </button>
                    <button 
                      onClick={() => handleUpdateStatus('hired')}
                      className="bg-emerald-500 text-white py-3.5 rounded-xl font-mono text-xs font-bold uppercase hover:bg-emerald-600 transition-colors"
                    >
                      Embaucher
                    </button>
                    <button 
                      onClick={() => handleUpdateStatus('rejected')}
                      className="bg-rose-500/10 text-rose-500 border border-rose-500/30 py-3.5 rounded-xl font-mono text-xs font-bold uppercase hover:bg-rose-500/20 transition-colors"
                    >
                      Refuser
                    </button>
                  </div>

                  <button 
                    onClick={() => console.log('[TRACKING] Recruiter Action: make_decision', { candidateId: selectedUser.id })}
                    className="w-full bg-blue-500 text-white py-4 rounded-xl font-mono font-bold text-sm uppercase tracking-wider hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10"
                  >
                    Prendre une Décision Basée sur la Preuve <ArrowRight size={18} />
                  </button>
                </div>
              </div>

            </div>
          ) : (
            <div className="h-full min-h-[500px] flex flex-col items-center justify-center text-center p-12 rounded-2xl bg-surface border-2 border-dashed border-surface-border">
              <UserCheck size={64} className="text-text-muted mb-6 opacity-40" />
              <h3 className="text-2xl font-display font-bold text-text">Sélectionnez un candidat</h3>
              <p className="text-text-muted font-mono text-sm mt-2 max-w-sm">
                Analysez les preuves vérifiées par pairs et prenez des décisions basées sur la confiance factuelle.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
