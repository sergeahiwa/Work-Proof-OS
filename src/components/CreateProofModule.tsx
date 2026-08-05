import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Check, AlertCircle, Sparkles, Send, Loader2, Edit2, Wand2, Paperclip, History, Shield, X, FileText, Image as ImageIcon, Plus, Clock, Briefcase, GraduationCap, Users, Zap, Layers, ChevronRight, HelpCircle } from 'lucide-react';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { PROOF_STARTER_TEMPLATES, ProofStarterTemplate } from '../data/proofTemplates';
import { 
  buildProof, 
  getNextQuestion, 
  isVague, 
  computeProofStrength,
  validateGlobalConsistency,
  reformulateText, 
  validateProof, 
  publishProof, 
  attachFileToProof,
  requestVerification,
  ProofData,
  ProofAttachment
} from '../services/proofService';
import { useAuth } from './FirebaseProvider';
import { useLocation } from 'react-router-dom';

export const CreateProofModule: React.FC = () => {
  const { user, tenantId } = useAuth();
  const location = useLocation();
  const [step, setStep] = useState<'input' | 'template_select' | 'guidance' | 'soft_skills' | 'preview'>('input');
  const [userProjects, setUserProjects] = useState<{id: string, title: string}[]>([]);
  const [selectedPersona, setSelectedPersona] = useState<'all' | 'student' | 'freelance' | 'employee' | 'entrepreneur'>('all');
  const [selectedTemplate, setSelectedTemplate] = useState<ProofStarterTemplate | null>(null);
  
  // State for the proof being built
  const [proof, setProof] = useState<Partial<ProofData>>({
    projectId: '',
    before: '',
    action: '',
    result: '',
    causality: '',
    softSkills: [],
    status: 'preuve_structuree',
    strength: 'faible'
  });

  useEffect(() => {
    if (location.state?.draft) {
      const d = location.state.draft;
      setProof(prev => ({
        ...prev,
        before: d.before || '',
        action: d.action || '',
        result: d.result || '',
        causality: d.causality || '',
        status: 'preuve_structuree',
        strength: computeProofStrength({ before: d.before, action: d.action, result: d.result, causality: d.causality }).strength
      }));
      setStep('preview');
    }
  }, [location.state]);

  useEffect(() => {
    if (user) {
      const fetchProjects = async () => {
        const q = query(collection(db, `users/${user.uid}/projects`));
        const snapshot = await getDocs(q);
        setUserProjects(snapshot.docs.map(doc => ({ id: doc.id, title: doc.data().title })));
      };
      fetchProjects();
    }
  }, [user]);

  const [currentAnswer, setCurrentAnswer] = useState('');
  const [vagueWarning, setVagueWarning] = useState<string | null>(null);
  const [isReformulating, setIsReformulating] = useState<string | null>(null); // field name being reformulated
  const [isPublishing, setIsPublishing] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);
  const [publishedId, setPublishedId] = useState<string | null>(null);
  
  const [attachments, setAttachments] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isRequestingVerification, setIsRequestingVerification] = useState(false);
  const [verificationRequested, setVerificationRequested] = useState(false);

  const [coherenceResult, setCoherenceResult] = useState<{ coherent: boolean; reason?: string } | null>(null);
  const [isValidatingCoherence, setIsValidatingCoherence] = useState(false);

  // Bloc 4 — Détection d’incohérence globale
  React.useEffect(() => {
    if (step === 'preview') {
      const validate = async () => {
        setIsValidatingCoherence(true);
        const result = await validateGlobalConsistency(proof);
        setCoherenceResult(result);
        setIsValidatingCoherence(false);
      };
      validate();
    }
  }, [step, proof.before, proof.action, proof.result, proof.causality]);

  // Bloc 2 — Guidage dynamique
  const currentQuestion = getNextQuestion(proof);

  const handleAnswerSubmit = () => {
    if (!currentAnswer.trim()) return;

    // Bloc 2 — Détection de flou avancée
    const vagueCheck = isVague(currentAnswer);
    if (vagueCheck.vague && !vagueWarning) {
      setVagueWarning(vagueCheck.reason || "Peux-tu être plus précis ?");
      return;
    }

    // Update proof based on missing fields
    const updatedProof = { ...proof };
    if (!proof.before) updatedProof.before = currentAnswer;
    else if (!proof.action) updatedProof.action = currentAnswer;
    else if (!proof.result) updatedProof.result = currentAnswer;
    else if (!proof.causality) updatedProof.causality = currentAnswer;

    setProof(updatedProof);
    setCurrentAnswer('');
    setVagueWarning(null);

    // If no more questions, go to soft skills
    if (!getNextQuestion(updatedProof)) {
      setStep('soft_skills');
    }
  };

  const toggleSoftSkill = (skill: string) => {
    setProof(prev => {
      const current = prev.softSkills || [];
      if (current.includes(skill)) {
        return { ...prev, softSkills: current.filter(s => s !== skill) };
      }
      return { ...prev, softSkills: [...current, skill] };
    });
  };

  const handleReformulate = async (field: keyof ProofData) => {
    const text = proof[field];
    if (!text || typeof text !== 'string') return;

    setIsReformulating(field);
    try {
      const improved = await reformulateText(text);
      setProof(prev => ({ ...prev, [field]: improved }));
    } catch (err) {
      console.error("Reformulation failed", err);
    } finally {
      setIsReformulating(null);
    }
  };

  const handlePublish = async () => {
    if (!user || !tenantId) return;
    
    // Bloc 6 — Validation explicite
    const validationErrors = validateProof(proof);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (coherenceResult && !coherenceResult.coherent) {
      setErrors([coherenceResult.reason || "La preuve est incohérente."]);
      return;
    }

    setIsPublishing(true);
    setErrors([]);
    try {
      const id = await publishProof(user.uid, tenantId, proof as ProofData);
      setPublishedId(id);
      setSuccess(true);
    } catch (err: any) {
      setErrors([err.message || "Impossible de publier la preuve."]);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !user || !publishedId) return;
    
    const file = e.target.files[0];
    setIsUploading(true);
    
    try {
      // Simulate upload
      const mockUrl = `https://storage.googleapis.com/work-proof-os/${user.uid}/${file.name}`;
      await attachFileToProof(user.uid, publishedId, {
        name: file.name,
        type: file.type,
        size: file.size,
        url: mockUrl
      });
      
      setAttachments(prev => [...prev, { name: file.name, url: mockUrl, type: file.type }]);
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRequestVerification = async () => {
    if (!user || !publishedId) return;
    setIsRequestingVerification(true);
    try {
      await requestVerification(user.uid, publishedId, proof);
      setVerificationRequested(true);
    } catch (err) {
      console.error("Verification request failed", err);
    } finally {
      setIsRequestingVerification(false);
    }
  };

  const strengthData = computeProofStrength(proof, coherenceResult || undefined);

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center space-y-6 min-h-[400px]">
        <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center border border-emerald-500/20">
          <Check size={32} />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-100">Succès enregistré !</h2>
          <p className="text-slate-400">Votre réussite a été ajoutée à votre journal.</p>
        </div>

        {/* Bloc 3 — Interface d'upload */}
        <div className="w-full max-w-sm bg-surface p-6 rounded-2xl border-2 border-dashed border-surface-border space-y-4">
          <div className="flex flex-col items-center gap-2">
            <Paperclip className="text-text-muted" size={24} />
            <p className="text-sm font-bold text-text">Joindre un document ou une photo</p>
            <p className="text-xs text-text-muted">PDF, Capture d'écran, Preuve visuelle</p>
          </div>
          
          <input 
            type="file" 
            id="file-upload" 
            className="hidden" 
            onChange={handleFileUpload}
            disabled={isUploading}
          />
          <label 
            htmlFor="file-upload"
            className="w-full flex items-center justify-center gap-2 bg-surface-section border border-surface-border text-text py-3 rounded-xl text-sm font-bold cursor-pointer hover:bg-surface-hover transition-colors"
          >
            {isUploading ? <Loader2 className="animate-spin text-blue-500" size={16} /> : <Plus size={16} className="text-blue-500" />}
            <span>{isUploading ? 'Envoi en cours...' : 'Ajouter un fichier'}</span>
          </label>
        </div>

        <div className="flex flex-col gap-3 w-full max-w-sm">
          {!verificationRequested ? (
            <button 
              onClick={handleRequestVerification}
              disabled={isRequestingVerification}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-primary text-white rounded-xl font-bold shadow-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isRequestingVerification ? <Loader2 className="animate-spin" size={20} /> : <Shield size={20} />}
              Partager pour confirmation
            </button>
          ) : (
            <div className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-success/10 text-success rounded-xl font-bold border border-success/10">
              <Clock size={20} />
              En attente de confirmation...
            </div>
          )}
          <button 
            onClick={() => window.location.reload()}
            className="w-full px-6 py-4 bg-gray-900 text-white rounded-xl font-bold shadow-lg"
          >
            Terminer
          </button>
        </div>
      </div>
    );
  }

  const applyTemplate = (tmpl: ProofStarterTemplate, prefillExample: boolean = true) => {
    setSelectedTemplate(tmpl);
    if (prefillExample) {
      setProof({
        projectId: '',
        before: tmpl.example.before,
        action: tmpl.example.action,
        result: tmpl.example.result,
        causality: tmpl.example.causality,
        softSkills: tmpl.defaultSoftSkills,
        status: 'preuve_structuree',
        strength: 'credible'
      });
      setStep('preview');
    } else {
      setProof({
        projectId: '',
        before: '',
        action: '',
        result: '',
        causality: '',
        softSkills: tmpl.defaultSoftSkills,
        status: 'preuve_structuree',
        strength: 'faible'
      });
      setCurrentAnswer('');
      setStep('guidance');
    }
  };

  const filteredTemplates = selectedPersona === 'all' 
    ? PROOF_STARTER_TEMPLATES 
    : PROOF_STARTER_TEMPLATES.filter(t => t.persona === selectedPersona);

  return (
    <div className="max-w-xl md:max-w-2xl mx-auto p-4 md:p-6 space-y-6">
      <header className="space-y-1 text-center md:text-left">
        <div className="flex items-center gap-2 justify-center md:justify-start text-xs font-mono font-bold text-primary uppercase tracking-widest">
          <Sparkles size={14} />
          <span>Work Proof OS v2.9 — Activation</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-text font-display">Créer un actif de preuve</h1>
        <p className="text-sm text-text-muted">Transformez votre réalisation réelle en un actif vérifiable en moins de 5 minutes.</p>
      </header>

      <AnimatePresence mode="wait">
        {step === 'input' && (
          <motion.div 
            key="input"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Starter Box: Guided vs Free */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div 
                onClick={() => setStep('template_select')}
                className="group relative bg-surface hover:bg-surface-hover p-6 rounded-2xl border-2 border-primary/20 hover:border-primary/60 transition-all cursor-pointer shadow-sm hover:shadow-md space-y-3"
              >
                <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center font-bold">
                  <Sparkles size={20} />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-black uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded">
                    Recommandé (P0)
                  </span>
                  <h3 className="text-base font-bold text-text mt-1 group-hover:text-primary transition-colors">
                    Modèles Guidés par Persona
                  </h3>
                  <p className="text-xs text-text-muted mt-1 leading-relaxed">
                    Partez d'une trame adaptée à votre statut (Étudiant, Freelance, Salarié, Entrepreneur) pour ne jamais faire face à la page blanche.
                  </p>
                </div>
                <div className="pt-2 flex items-center text-xs font-bold text-primary gap-1">
                  <span>Explorer les trames</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              <div 
                onClick={() => {
                  setSelectedTemplate(null);
                  setStep('guidance');
                }}
                className="group relative bg-surface hover:bg-surface-hover p-6 rounded-2xl border-2 border-surface-border hover:border-text-muted transition-all cursor-pointer shadow-sm hover:shadow-md space-y-3"
              >
                <div className="w-10 h-10 bg-surface-section text-text-muted rounded-xl flex items-center justify-center font-bold">
                  <Edit2 size={20} />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-text-muted bg-surface-section px-2 py-0.5 rounded">
                    Saisie Libre
                  </span>
                  <h3 className="text-base font-bold text-text mt-1 group-hover:text-primary transition-colors">
                    Guider Étape par Étape
                  </h3>
                  <p className="text-xs text-text-muted mt-1 leading-relaxed">
                    Répondez directement aux questions guidées : Contexte → Action → Résultat → Impact pour structurer votre récit.
                  </p>
                </div>
                <div className="pt-2 flex items-center text-xs font-bold text-text-muted gap-1">
                  <span>Démarrer en libre</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>

            {/* Quick Preview of Starters */}
            <div className="bg-surface border border-surface-border text-text p-5 rounded-2xl space-y-3 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-primary flex items-center gap-1.5">
                  <Zap size={14} />
                  <span>Exemples de preuves prêtes à l'emploi</span>
                </span>
                <button 
                  onClick={() => setStep('template_select')}
                  className="text-xs text-text-muted hover:text-text underline font-mono"
                >
                  Tout voir ({PROOF_STARTER_TEMPLATES.length})
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {PROOF_STARTER_TEMPLATES.slice(0, 4).map(tmpl => (
                  <div 
                    key={tmpl.id}
                    onClick={() => applyTemplate(tmpl, true)}
                    className="p-3 bg-surface-section hover:bg-surface-hover border border-surface-border hover:border-primary/50 rounded-xl cursor-pointer transition-all space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-text truncate">{tmpl.title}</span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-surface text-text-muted border border-surface-border">
                        {tmpl.personaLabel.split(' ')[0]}
                      </span>
                    </div>
                    <p className="text-[11px] text-text-muted line-clamp-1">{tmpl.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {step === 'template_select' && (
          <motion.div 
            key="template_select"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <button 
                onClick={() => setStep('input')}
                className="text-xs font-bold text-slate-400 hover:text-slate-100 flex items-center gap-1"
              >
                ← Retour au choix initial
              </button>
              <span className="text-xs font-mono text-slate-400">Sélectionnez la trame adaptée</span>
            </div>

            {/* Persona Tabs */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'all', label: 'Tous les modèles' },
                { id: 'student', label: 'Étudiant & Junior' },
                { id: 'freelance', label: 'Freelance & Consultant' },
                { id: 'employee', label: 'Talent Salarié' },
                { id: 'entrepreneur', label: 'Entrepreneur & Founder' },
              ].map(p => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPersona(p.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedPersona === p.id 
                      ? 'bg-blue-600 text-white shadow' 
                      : 'bg-surface-section text-text-muted hover:bg-surface-hover border border-surface-border'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Template Cards */}
            <div className="grid grid-cols-1 gap-4">
              {filteredTemplates.map(tmpl => (
                <div 
                  key={tmpl.id}
                  className="bg-surface border-2 border-surface-border hover:border-primary/40 rounded-2xl p-5 space-y-4 transition-all shadow-sm hover:shadow-md"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-surface-border pb-3">
                    <div>
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border ${tmpl.badgeColor}`}>
                        {tmpl.personaLabel} • {tmpl.category}
                      </span>
                      <h3 className="text-base font-bold text-text mt-1">{tmpl.title}</h3>
                    </div>
                    <span className="text-[11px] font-mono text-text-muted bg-surface-section px-2.5 py-1 rounded-lg border border-surface-border">
                      Validation conseillée : {tmpl.suggestedValidationType}
                    </span>
                  </div>

                  <p className="text-xs text-text-muted leading-relaxed">{tmpl.description}</p>

                  {/* Causal Chain Preview */}
                  <div className="bg-surface-section p-3.5 rounded-xl border border-surface-border space-y-2 text-xs font-mono">
                    <div className="text-[10px] font-bold text-primary uppercase tracking-wider">Aperçu du schéma de preuve :</div>
                    <div className="space-y-1.5 text-text-muted text-[11px]">
                      <div><strong className="text-text">Contexte :</strong> {tmpl.example.before}</div>
                      <div><strong className="text-blue-500">Action :</strong> {tmpl.example.action}</div>
                      <div><strong className="text-emerald-500">Résultat :</strong> {tmpl.example.result}</div>
                      <div><strong className="text-amber-500">Impact :</strong> {tmpl.example.causality}</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-2 pt-1">
                    <button
                      onClick={() => applyTemplate(tmpl, true)}
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-bold text-xs shadow-md transition-colors"
                    >
                      <span>Utiliser comme trame de départ</span>
                      <ArrowRight size={14} />
                    </button>
                    <button
                      onClick={() => applyTemplate(tmpl, false)}
                      className="px-4 py-3 bg-surface-section hover:bg-surface-hover text-text rounded-xl font-bold text-xs transition-colors border border-surface-border"
                    >
                      Guider ma saisie pas-à-pas
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {step === 'guidance' && currentQuestion && (
          <motion.div 
            key="guidance"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-text">{currentQuestion}</h2>
              
              <textarea
                autoFocus
                value={currentAnswer}
                onChange={(e) => {
                  setCurrentAnswer(e.target.value);
                  setVagueWarning(null);
                }}
                placeholder="Réponds simplement ici..."
                className="w-full h-32 p-4 bg-surface-section border border-surface-border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none text-text placeholder:text-text-dim"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleAnswerSubmit();
                  }
                }}
              />

              {vagueWarning && (
                <div className="flex items-center gap-2 text-amber-500 text-sm bg-amber-500/10 p-3 rounded-lg border border-amber-500/20">
                  <AlertCircle size={16} />
                  <span>{vagueWarning}</span>
                </div>
              )}
              
              <button
                onClick={handleAnswerSubmit}
                disabled={!currentAnswer.trim()}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-500 transition-colors disabled:opacity-50"
              >
                <span>Suivant</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </motion.div>
        )}

        {step === 'soft_skills' && (
          <motion.div 
            key="soft_skills"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-text">Quelles Soft Skills as-tu mobilisées ?</h2>
              <p className="text-xs text-text-muted">Sélectionne celles qui décrivent le mieux ton approche.</p>
              
              <div className="grid grid-cols-2 gap-2">
                {['Communication', 'Leadership', 'Adaptabilité', 'Esprit Critique', 'Collaboration', 'Gestion du Stress', 'Empathie', 'Créativité'].map((skill) => (
                  <button
                    key={skill}
                    onClick={() => toggleSoftSkill(skill)}
                    className={`p-3 rounded-xl text-xs font-bold border transition-all ${
                      proof.softSkills?.includes(skill)
                        ? 'bg-blue-600 text-white border-blue-500 shadow-md'
                        : 'bg-surface-section text-text-muted border-surface-border hover:border-blue-500/50'
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setStep('preview')}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-500 transition-colors"
              >
                <span>Voir l'aperçu final</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </motion.div>
        )}

        {step === 'preview' && (
          <motion.div 
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-text-muted uppercase tracking-widest">Finalisez votre récit</span>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setShowHistory(!showHistory)}
                    className={`p-2 rounded-lg transition-colors ${showHistory ? 'bg-blue-600 text-white' : 'bg-surface-section text-text-muted hover:text-text border border-surface-border'}`}
                    title="Historique"
                  >
                    <History size={16} />
                  </button>
                  {isValidatingCoherence && <Loader2 size={12} className="animate-spin text-text-muted" />}
                  <span className={`px-2 py-1 text-[10px] font-bold rounded uppercase border ${
                    strengthData.strength === 'credible' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                    strengthData.strength === 'moyenne' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                    strengthData.strength === 'incoherente' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' :
                    'bg-surface-section text-text-muted border-surface-border'
                   }`}>
                    {strengthData.strength === 'incoherente' ? 'Besoin de précisions' :
                     strengthData.strength === 'faible' ? 'Impact faible' :
                     strengthData.strength === 'moyenne' ? 'Impact moyen' : 'Impact réel'}
                  </span>
                </div>
              </div>

              {showHistory && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-surface text-text p-4 rounded-xl space-y-3 border border-surface-border overflow-hidden"
                >
                  <div className="flex justify-between items-center">
                    <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Historique</p>
                    <button onClick={() => setShowHistory(false)}><X size={14} className="text-text-muted hover:text-text" /></button>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs border-l-2 border-emerald-500 pl-3 py-1">
                      <div>
                        <p className="font-bold text-text">Version Actuelle</p>
                        <p className="text-text-muted text-[10px]">À l'instant</p>
                      </div>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-500 px-2 py-0.5 rounded">Actif</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Recommendations */}
              {strengthData.recommendations.length > 0 && (
                <div className="bg-surface p-4 rounded-xl border border-surface-border space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Conseils pour renforcer ta preuve</p>
                  <ul className="space-y-1">
                    {strengthData.recommendations.map((rec, i) => (
                      <li key={i} className="text-xs text-text-muted flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Mission Selection */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest flex items-center gap-2">
                  <Briefcase size={12} /> Mission associée
                </label>
                <select
                  value={proof.projectId}
                  onChange={(e) => setProof(prev => ({ ...prev, projectId: e.target.value }))}
                  className="w-full p-3 bg-surface-section border border-surface-border rounded-xl text-sm font-bold text-text outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Sélectionner une mission --</option>
                  {userProjects.map(p => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                  <option value="new">+ Déclarer une nouvelle mission</option>
                </select>
                {proof.projectId === 'new' && (
                   <p className="text-[10px] text-blue-500 italic font-bold">Enregistrez cette preuve d'abord, vous pourrez créer la mission ensuite.</p>
                )}
              </div>

              {/* Editable Sections */}
              {(['before', 'action', 'result', 'causality'] as const).map((field) => (
                <div key={field} className="space-y-2 group">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
                      {field === 'before' ? 'Avant (Contexte)' : 
                       field === 'action' ? 'Votre Action' : 
                       field === 'result' ? 'Votre Résultat' : 'Pourquoi ça a marché ?'}
                    </label>
                    <button 
                      onClick={() => handleReformulate(field)}
                      disabled={isReformulating === field}
                      className="text-[10px] font-bold text-blue-500 flex items-center gap-1 hover:text-blue-600 transition-colors disabled:opacity-50"
                    >
                      {isReformulating === field ? <Loader2 size={12} className="animate-spin" /> : <Wand2 size={12} />}
                      Mieux formuler
                    </button>
                  </div>
                  <textarea
                    value={proof[field] || ''}
                    onChange={(e) => setProof(prev => ({ ...prev, [field]: e.target.value }))}
                    className="w-full p-3 bg-surface-section border border-surface-border rounded-xl text-sm text-text focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    rows={2}
                  />
                </div>
              ))}
            </div>

            {errors.length > 0 && (
              <div className="space-y-2">
                {errors.map((err, i) => (
                  <div key={i} className="flex items-center gap-2 text-rose-500 text-sm bg-rose-500/10 p-3 rounded-lg border border-rose-500/20">
                    <AlertCircle size={16} />
                    <span>{err}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 gap-3">
              <button
                onClick={handlePublish}
                disabled={isPublishing || isValidatingCoherence || (coherenceResult && !coherenceResult.coherent)}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-500 transition-colors disabled:opacity-50"
              >
                {isPublishing ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <>
                    <Send size={18} />
                    <span>Enregistrer dans mon journal</span>
                  </>
                )}
              </button>
              
              <button
                onClick={() => {
                  setStep('guidance');
                  setProof({ before: '', action: '', result: '', status: 'preuve_structuree' });
                }}
                className="w-full py-2 text-text-muted font-bold text-xs hover:text-text transition-colors"
              >
                Recommencer à zéro
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
