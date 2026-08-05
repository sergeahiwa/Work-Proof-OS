export type UserObjective = 'freelance' | 'employment' | 'entrepreneur';

export type ProofType = 'link' | 'document' | 'code' | 'metric' | 'github_commit' | 'peer_validation' | 'decision_log' | 'knowledge_base' | 'nps_feedback' | 'agility_trace' | 'human_validation';

export type VerificationLevel = 'low' | 'medium' | 'high' | 'verified_by_expert';

export type ValidatorType = 'peer' | 'expert' | 'company' | 'automated' | 'system';

export type OpportunityStatus = 'viewed' | 'applied' | 'contacted' | 'interview' | 'hired' | 'rejected';

export type OutcomeProofType = 'email' | 'contract' | 'linkedin';

export interface ApplicationTimeline {
  appliedAt?: string;
  contactedAt?: string;
  interviewAt?: string;
  decidedAt?: string;
  outcomeAt?: string;
}

export interface Application {
  id: string;
  opportunityId: string;
  candidateId: string;
  status: OpportunityStatus;
  appliedAt: string;
  timeline: ApplicationTimeline;
  candidateConfirmed: boolean;
  recruiterConfirmed: boolean;
  outcomeVerified: boolean;
  outcomeConfidenceScore: number; // 0-100
  outcomeProofUrl?: string;
  outcomeProofType?: OutcomeProofType;
  // External Authority Context
  companyName?: string;
  companyDomain?: string;
  jobTitle?: string;
  externalSignalUrl?: string;
  // Credibility Scores
  internalValidationScore: number; // 0-100 (Candidate + Recruiter match)
  externalSignalScore: number;     // 0-100 (Domain match, LinkedIn proof, etc.)
  credibilityScore: number;        // Global 0-100
}

export interface Recruiter {
  id: string;
  name: string;
  company: string;
  companyDomain?: string;
  emailVerified: boolean;
  verifiedBadge: boolean;
  avatar: string;
  role: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorId: string;
  actorType: 'candidate' | 'recruiter' | 'system';
  action: 'proof_added' | 'outcome_declared' | 'recruiter_confirmed' | 'external_verification_success' | 'anomaly_detected' | 'identity_verified';
  details: string;
  targetId?: string;
  hash: string;
  previousHash: string;
}

export interface TrustFactors {
  reliability: number;
  validatorDiversity: number;
  identityStrength: number;
  sourceQuality: number;
  reputationHistory: number;
  temporalFreshness: number;
  impactWeight: number; // Weight of real-world impact (0-1)
  consistencyScore: number; // 0-1
  anomalyScore: number; // 0-1
}

export interface TrustSnapshot {
  timestamp: string;
  anomalyScore: number;
  consistencyScore: number;
  validatorDiversity: number;
}

export interface User {
  id: string;
  tenantId: string;
  name: string;
  role: string;
  avatar: string;
  rawScore: number;
  weightedScore: number;
  impactScore: number; // 0-100 overall impact
  objective: UserObjective;
  skills: Skill[];
  aiSummary: string;
  opportunityProjection: string;
  confidenceIndex: number;
  reliabilityScore: number;
  reputationScore: number;
  identityStatus: 'unverified' | 'verified';
  identityVerifiedAt?: string;
  trustFactors: TrustFactors;
  topSkills: string[];
  penaltyScore: number; // Accumulated penalties for fraud/inconsistency
  validatorTrustScore?: number; // 0-1 (Credibility as a reviewer)
  lastActivity?: string;
  externalReferences?: {
    linkedInUpdate?: string;
    githubActivity?: string;
  };
  retentionDay1?: boolean;
  retentionDay7?: boolean;
  contactStatus?: 'none' | 'contacted' | 'in_discussion' | 'refused';
  applications?: Application[];
  riskFlags?: string[];
  marketTrustIndex: number; // 0-100 aggregate from recruiters/peers
  impactAggregate?: {
    totalScore: number;
    proofCount: number;
  };
  trustHistory?: TrustSnapshot[];
  auditLog: AuditLogEntry[];
  marketValueSignature?: MarketValueSignature;
  isNormalized?: boolean;
  lastMigrationAt?: string;
}

export interface Tenant {
  id: string;
  name: string;
  ownerId: string;
  createdAt: string;
  settings?: Record<string, any>;
}

export interface RecommendedAction {
  id: string;
  description: string;
  scoreGain: number;
  opportunityImpact: string;
  type: 'proof' | 'skill' | 'application' | 'network';
  priority: 'high' | 'medium' | 'low';
  objectiveContext: UserObjective[];
  isUseful?: boolean; // For feedback loop
}

export interface Skill {
  id: string;
  name: string;
  validated: boolean;
  proofsCount: number;
}

export type Industry = 'tech' | 'finance' | 'logistics' | 'healthcare' | 'retail' | 'energy' | 'other';

export interface Project {
  id: string;
  userId: string;
  title: string;
  description: string;
  impact: string;
  role: string;
  date: string;
  status: 'completed' | 'ongoing';
  proofs: Proof[];
  industry: Industry;
  impactLevel: ValueImpact; // Derived from contributions
  contributionIds: string[]; // Linked contributions (MANDATORY)
  projectImpactScore?: number; // Aggregated score
  projectCredibilityIndex?: number; // 0-100 based on stability/validation
  industryMismatch?: boolean; // Flag for validation
  metadata?: {
    auditLog?: ProjectAuditEntry[];
  };
}

export interface ProjectAuditEntry {
  timestamp: string;
  action: 'link_contribution' | 'recalculate_impact' | 'industry_validation';
  details: string;
}

export type ProofContext = 'real_project' | 'production' | 'freelance' | 'internal';
export type ImpactLevel = 'low' | 'medium' | 'high';
export type ValidatorRole = 'peer' | 'manager' | 'client' | 'system';

export interface Proof {
  id: string;
  title: string;
  description: string;
  type: ProofType;
  url: string;
  rawSourceUrl: string;
  isPubliclyVerifiable: boolean;
  verified: boolean;
  verificationLevel: VerificationLevel;
  validatorId?: string;
  validatorName?: string;
  validatorType?: ValidatorType;
  validatorRole?: ValidatorRole; // peer, manager, client
  validatorAvatar?: string;
  validatorDomain?: string;
  date: string;
  confidenceScore: number;
  impactScore: number; // 0-100 based on usage and context
  impactLevel: ImpactLevel;
  usageCount?: number; // e.g., downloads, users, stars
  context: ProofContext;
  status?: 'preuve_structuree' | 'preuve_declaree' | 'en_verification' | 'preuve_verifiee' | 'rejetee';
  strength?: 'incoherente' | 'faible' | 'moyenne' | 'credible';
  weightedScore?: number;
  scoreAggregate?: {
    totalWeightedScore: number;
    totalWeight: number;
    validationCount: number;
    collusionAdjustment?: number; // Multiplier applied to final score
  };
  softSkills?: string[];
  before?: string;
  action?: string;
  result?: string;
  causality?: string;
  verifierId?: string;
  verificationComment?: string;
  linkedOutcomeId?: string; // Link to an application/hire outcome
  hash?: string;
  authorIdentityLinked: boolean;
  sourceQuality: number;
  externalCheckStatus: 'pending' | 'success' | 'failed';
  externalMetadata?: {
    extractedTitle?: string;
    extractedAuthor?: string;
    lastCheckedAt: string;
  };
}

export interface ProofValidation {
  id: string;
  proofId: string;
  validatorId: string;
  validatorType: 'peer' | 'manager' | 'client' | 'automated';
  source?: string;
  status: 'approved' | 'rejected' | 'pending';
  comment?: string;
  weight: number;
  timestamp: any;
}

export interface Anomaly {
  id: string;
  userId: string;
  proofId?: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  details: string;
  timestamp: any;
}

export interface ProofExport {
  id: string;
  proofId: string;
  userId: string;
  url: string;
  hash: string;
  createdAt: any;
}

export type OutcomeStatus = 'contacted' | 'interview_scheduled' | 'offer_sent' | 'hired' | 'rejected';

export interface Message {
  id: string;
  senderId: string;
  senderType: 'candidate' | 'recruiter';
  content: string;
  timestamp: string;
}

export interface ContactSession {
  id: string;
  method: 'email' | 'whatsapp' | 'platform';
  timestamp: string;
  trackingUrl: string;
  messages: Message[]; // Real interactions traced in the system
}

export type TruthState = 'verified' | 'probable' | 'disputed' | 'unverified';

export type ReliabilityLevel = 'highly_reliable' | 'reliable' | 'uncertain' | 'risky';

export interface DisputeEntry {
  id: string;
  timestamp: string;
  actorId: string;
  reason: string;
  status: 'open' | 'resolved' | 'rejected';
  evidenceUrl?: string;
}

export interface ExternalSignal {
  source: 'linkedin' | 'github' | 'email' | 'contract';
  detected: boolean;
  confidence: number;
  timestamp: string;
  metadata?: any;
}

export type ValidationSourceType = 'causal' | 'human_confirmation' | 'external_signal' | 'peer_validation' | 'manager_validation' | 'ecosystemic_signal';

export interface ValidationSource {
  id: string;
  type: ValidationSourceType;
  label: string;
  weight: number; // 0-1
  confidence: number; // 0-100
  status: 'verified' | 'pending' | 'failed';
  metadata?: any;
}

export interface MarketFeedback {
  id: string;
  actorId: string;
  actorType: 'recruiter' | 'peer';
  targetId: string; // Outcome or Proof ID
  type: 'trust_signal' | 'credibility_check';
  value: boolean; // true = trust, false = doubt
  comment?: string;
  timestamp: string;
}

/**
 * Types of economic signals captured from the real world.
 * - intent_signal: Initial interest or contact initiation.
 * - engagement_signal: Active discussion or interview phase.
 * - mutual_commitment_signal: Mutual agreement or offer acceptance.
 * - external_confirmation_signal: Signal detected from external sources (e.g., LinkedIn, contract scan).
 * - economic_activity_signal: Direct evidence of economic exchange (e.g., payroll, settlement).
 */
export type CommitmentType = 'intent_signal' | 'engagement_signal' | 'mutual_commitment_signal' | 'external_confirmation_signal' | 'economic_activity_signal';

/**
 * Represents a captured proof event that anchors the system to economic reality.
 */
export interface ProofEvent {
  id: string;
  type: CommitmentType;
  timestamp: string;
  actorId: string;
  hash: string; // The immutable cryptographic anchor of the decision
  status: 'pending' | 'active' | 'completed' | 'revoked';
  economicValue?: number;
  currency?: string;
  metadata?: {
    source: string; // e.g., 'platform_signal_capture_layer'
    causalityVerified: boolean;
    confidenceWeight: 'low' | 'medium' | 'high' | 'critical';
    [key: string]: any;
  };
}

export type ContributionType = 'execution' | 'decision' | 'coordination' | 'knowledge' | 'soft_procedure' | 'agility';
export type ValueImpact = 'low' | 'medium' | 'high';

export interface HumanValidation {
  reviewerId: string;
  score: number;
  timestamp: string;
  comment?: string;
  validatorTrustAtTime: number;
}

export interface Contribution {
  id: string;
  projectId: string;
  userId: string;
  type: ContributionType;
  title: string;
  description: string;
  timestamp: string;
  impactScore: number; // 0-100
  leverageScore: number; // 0-100 (Calculated: how much value this unblocked)
  causalDependencies?: string[]; // IDs of contributions this one depends on
  evidenceIds: string[];
  metadata?: {
    technicalCausality?: number; // 0-1
    peerValidation?: number; // 0-1
    economicSignal?: number; // 0-1
    isExperimental?: boolean; // If the metric is still in calibration
    isValidated?: boolean; // If the impact has been confirmed by downstream effects
    antiGamingScore?: number; // 0-1 (1 = no suspicion)
    downstreamImpactScore?: number; // 0-1 (measurable effect on the ecosystem)
    calibration?: {
      rawScore: number;
      weightedScore: number;
      humanScore?: number;
      gap?: number;
      status: 'experimental' | 'validated' | 'disputed' | 'conflict';
      correctedAt?: string;
      correctedBy?: string;
      validations?: HumanValidation[];
      consensusScore?: number; // 0-1 (1 = perfect agreement)
    };
    auditTrail?: {
      origin: string;
      proofType: ProofType;
      humanValidated: boolean;
      timestamp: string;
    }[];
  };
}

export type TrustRegime = 'full_visibility' | 'partial_anonymity' | 'shielded' | 'TRUSTED' | 'UNCERTAIN' | 'RISKY';

export interface DecisionOrchestratorStats {
  performance: number;
  accuracy: number;
  decisionsCount: number;
  totalActions: number;
  pendingActions: number;
  successRate: number;
  avgResponseTime: number;
}

export type NetworkType = 'REAL' | 'SIMULATED';

export type StressScenario = 'anomaly_spike' | 'mass_deviation' | 'fake_user_flood' | 'recovery_test';

export interface StressTestStatus {
  isActive: boolean;
  currentScenario?: StressScenario;
  startTime?: string;
  impactedCount: number;
  totalInterventionsDuringStress: number;
}

export interface GlobalKPI {
  tenantId?: string;
  timestamp: string;
  avgRawScore: Record<TrustRegime, number>;
  avgAdjustedScore: Record<TrustRegime, number>;
  totalInterventions: number;
  avgRegimeChangeProbability: number;
  criticalAnomalyCount: number;
  impactedProfilesPercentage: number;
  systemStabilityScore: number; // 0-100
  activeAlerts: string[];
}

export interface TrustNetwork {
  id: string;
  tenantId?: string;
  name: string;
  type: NetworkType;
  users: User[];
  kpi: GlobalKPI;
}

export interface DecisionAction {
  id: string;
  tenantId?: string;
  timestamp: string;
  networkId: string;
  networkName: string;
  targetId: string; // userId or networkId
  targetName: string;
  type: 'SCORE_ADJUSTMENT' | 'REGIME_LOCK' | 'QUARANTINE' | 'VALIDATION_REQUEST';
  priority: AlertPriority;
  reason: string;
  impact: string;
  status: 'PENDING' | 'EXECUTING' | 'COMPLETED' | 'FAILED';
}

export interface NetworkBenchmark {
  timestamp: string;
  networks: TrustNetwork[];
  topPerformers: string[]; // IDs of networks with highest stability
  atRiskNetworks: string[]; // IDs of networks with stability < 50
}

export type AlertPriority = 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';

export interface ProactiveAlert {
  id: string;
  tenantId?: string;
  timestamp: string;
  networkId: string;
  networkName: string;
  userId?: string;
  userName?: string;
  type: 'ANOMALY_SPIKE' | 'STABILITY_DROP' | 'REGIME_DRIFT' | 'SYSTEM_CRISIS';
  priority: AlertPriority;
  message: string;
  status: 'ACTIVE' | 'RESOLVED' | 'ACKNOWLEDGED';
  actionTaken?: string;
}

export interface PredictiveInsight {
  id: string;
  tenantId?: string;
  timestamp: string;
  networkId: string;
  networkName: string;
  targetId: string; // userId or networkId
  targetName: string;
  type: 'DRIFT_DETECTION' | 'RULE_VALIDATION' | 'PATTERN_RECOGNITION';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  confidence: number; // 0-1
  message: string;
  suggestedAction?: string;
  isSimulatedOnly: boolean; // MUST be true for this module
}

export interface RiskForecast {
  id: string;
  tenantId?: string;
  timestamp: string;
  networkId: string;
  networkName: string;
  targetId: string; // userId or networkId
  targetName: string;
  riskLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  probability: number; // 0-1
  impactScore: number; // 0-100
  timeToImpact: 'IMMEDIATE' | 'SHORT_TERM' | 'MEDIUM_TERM';
  factors: string[];
  status: 'ACTIVE' | 'MITIGATED' | 'IGNORED';
  isSimulated: boolean;
}

export interface RiskForecastStats {
  totalRisks: number;
  criticalRisks: number;
  avgRiskProbability: number;
  mitigationRate: number;
  lastForecastAt: string;
}

export interface DecisionContext {
  id: string;
  tenantId?: string;
  timestamp: string;
  networkId: string;
  networkName: string;
  targetId: string; // userId or networkId
  targetName: string;
  suggestedAction: 'QUARANTINE' | 'REGIME_LOCK' | 'SCORE_ADJUSTMENT' | 'MONITOR' | 'IGNORE';
  confidence: number; // 0-1
  priority: AlertPriority;
  reason: string;
  sources: string[]; // ['RISK_FORECAST', 'PREDICTIVE_INSIGHT', 'PROACTIVE_ALERT']
  isSimulated: boolean;
}

export interface DecisionIntelligenceStats {
  totalDecisions: number;
  avgConfidence: number;
  sourceDistribution: Record<string, number>;
  actionDistribution: Record<string, number>;
  lastDecisionAt: string;
}

export interface DecisionSignal {
  id: string;
  tenantId?: string;
  networkId: string;
  networkName: string;
  networkType: "REAL" | "SIMULATED";

  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  confidence: number; // 0 -> 1

  signals: {
    risk: number;
    predictive: number;
    kpi: number;
    proactive: number;
  };

  recommendedAction:
    | "MONITOR"
    | "INVESTIGATE"
    | "RESTRICT"
    | "ESCALATE";

  explainability: string;

  createdAt: number;
  isSimulatedOnly: boolean;
}

export interface DecisionSignalExtended extends DecisionSignal {
  narrativeExplainability: string; // Explication narrative complète
}

export interface DecisionSignalSummary {
  networkId: string;
  networkName: string;
  avgSeverity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  avgConfidence: number;
  topDrivers: string[];
  narrativeSummary: string;
  criticalCount: number;
  lastUpdated: number;
}

export interface KairosHandshake {
  id: string;
  tenantId?: string;
  signalId: string;
  networkId: string;
  timestamp: number;
  status: 'SENT' | 'ACKNOWLEDGED' | 'FAILED';
  latency: number; // ms
  kairosMetadata?: {
    receivedAt: number;
    processedBy: string;
    validationToken: string;
  };
}

export interface AuditReportEntry {
  signalId: string;
  tenantId?: string;
  networkId: string;
  networkType: "REAL" | "SIMULATED";
  severityCheck: boolean;
  confidenceCheck: boolean;
  recommendedActionCheck: boolean;
  explainabilityCheck: boolean;
  anomalies?: string[];
  timestamp: number;
}

export interface MarketValueSignature {
  execution: number; // percentage
  decision: number; // percentage
  coordination: number; // percentage
  knowledge: number; // percentage (Capitalisation du Savoir)
  softProcedure: number; // percentage (Impact Procédures Molles)
  agility: number; // percentage (Score Désapprentissage & Agilité)
  decisionVelocity: number; // 0-100 (Vélocité Décisionnelle)
  leverage: number; // 0-100 aggregate leverage
  impactLevel: ValueImpact;
  totalValueCreated: number; // Aggregate value units (Raw Score)
  topImpactProjects: string[];
  isExperimental?: boolean; // Global flag for the signature
  stabilityScore?: number; // 0-100 (how reliable are these metrics)
  explanation?: string; // AI-generated explanation of the signature
  calibrationMode?: boolean;
  pendingValidationMetrics?: string[]; // Metrics exceeding 70% without human validation
  calibrationData?: {
    aiHumanGap: number;
    lastCalibrationAt: string;
    metricsPrecision: Record<string, number>;
  };
}

export interface ProjectValueGraph {
  nodes: {
    id: string;
    label: string;
    type: ContributionType;
    weight: number;
  }[];
  edges: {
    from: string;
    to: string;
    label: string;
  }[];
}

export interface RecruitmentOutcome {
  id: string;
  tenantId: string;
  userId: string;
  recruiterId: string;
  status: OutcomeStatus;
  companyName: string;
  role: string;
  linkedProofIds: string[];
  contactSessions: ContactSession[]; // Track all contact initiation events
  isLockedToPlatform: boolean; // True if first interaction happened via platform
  candidateConfirmed: boolean;
  recruiterConfirmed: boolean;
  confirmationTimestamp?: string;
  attributionConfidenceScore: number; // 0-100
  truthState: TruthState;
  verdict: ReliabilityLevel;
  disputeStatus?: 'none' | 'open' | 'resolved';
  disputeHistory?: DisputeEntry[];
  externalSignals?: ExternalSignal[];
  validationSources: ValidationSource[]; // Multi-source validation layer
  marketFeedback: MarketFeedback[]; // Market feedback loop
  commitment?: ProofEvent; // The economic anchor of the decision
  attributionProof?: string; // Hash or reference to mutual validation
  isVerifiedAttribution: boolean; // True only if both confirmed + coherent + interaction traced
  riskFlags?: string[]; // e.g., "Low Causal Confidence", "Fast Confirmation"
  sector?: string;
  experienceLevel?: 'junior' | 'intermediate' | 'senior' | 'lead' | 'staff';
  location?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppMetrics {
  totalActions: number;
  totalReturns: number;
  recruiterConversions: number;
  activeUsers: number;
  marketValidation: {
    totalContacts: number;
    totalContactSessions: number; // Total unique session IDs generated
    totalInterviews: number;
    lockedProcesses: number; // Processes that cannot be bypassed (internal interaction)
    realHires: number; // Total declared
    verifiedHires: number; // Forced attribution only
    highConfidenceHires: number; // Score > 80
    lowConfidenceHires: number; // Score < 40
    fraudSuspicionRate: number;
    attributionRate: number; // verifiedHires / realHires
    avgTimeToHireDays: number;
  };
  systemIntegrity: {
    verifiedOutcomeRatio: number;
    reliableProfileRatio: number;
    anomalyRate: number;
    collusionSuspicionRate: number;
    validatorDiversityIndex: number;
    publicProofRatio: number;
    independentValidationRate: number;
    avgReputationScore: number;
    impactProofRatio: number;
    hireLinkedProofRate: number;
    avgImpactScore: number;
  };
}

export interface Opportunity {
  id: string;
  title: string;
  company: string;
  matchScore: number;
  skillGap: string[];
  matchedSkills: string[];
  requiredSkills: string[];
  description: string;
  aiExplanation: string;
  potentialScoreGain: number;
  relativePosition: number; // e.g., 5 for Top 5%
  successProbability: number; // 0-100
  status?: OpportunityStatus; // Current status for the logged-in user
  sector?: string;
  experienceLevel?: 'junior' | 'intermediate' | 'senior' | 'lead' | 'staff';
  location?: string;
  createdAt?: string;
}
