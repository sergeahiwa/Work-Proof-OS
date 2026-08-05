import { useState } from 'react';
import { ArrowRight, CheckCircle, ArrowLeft, Sparkles, ShieldCheck, TrendingUp, Award, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { onboardingCopy } from '../content/copy';
import { useAuth } from '../components/FirebaseProvider';
import { doc, setDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [skills, setSkills] = useState<string[]>(['Gestion de projet', 'Analyse de données']);
  const [newSkill, setNewSkill] = useState('');
  const [firstProofTitle, setFirstProofTitle] = useState('');
  const [firstProofImpact, setFirstProofImpact] = useState('');

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const saveProfileAndFinish = async () => {
    setIsSaving(true);
    try {
      if (user) {
        // Save user profile to Firestore
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          name: name.trim() || user.displayName || 'Nouvel Utilisateur',
          email: user.email || '',
          role: role.trim() || 'Professionnel',
          skills: skills,
          impactScore: 72,
          marketTrustIndex: 85,
          identityStatus: 'verified',
          updatedAt: serverTimestamp()
        }, { merge: true });

        // Save first project / proof if filled
        if (firstProofTitle.trim()) {
          await addDoc(collection(db, `users/${user.uid}/projects`), {
            title: firstProofTitle.trim(),
            role: role.trim() || 'Responsable',
            description: firstProofImpact.trim(),
            status: 'completed',
            createdAt: serverTimestamp()
          });
        }
      } else {
        // Fallback for non-authenticated session persistence
        localStorage.setItem('wp_onboarding_profile', JSON.stringify({
          name: name.trim() || 'Utilisateur',
          role: role.trim() || 'Professionnel',
          skills,
          firstProofTitle,
          firstProofImpact
        }));
      }
    } catch (err) {
      console.error("Error saving onboarding profile:", err);
    } finally {
      setIsSaving(false);
      navigate('/dashboard');
    }
  };

  const handleNext = async () => {
    if (step < 5) {
      setStep(step + 1);
    } else {
      await saveProfileAndFinish();
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg p-6 animate-in fade-in duration-500">
      <div className="card w-full max-w-2xl p-12">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-headline font-black tracking-tight uppercase text-primary">Work Proof</h1>
          <p className="text-text-muted mt-2 text-lg font-black uppercase tracking-widest italic">"Montrez ce que vous apportez vraiment."</p>
          <p className="text-text-muted mt-4 text-xs font-bold uppercase tracking-widest">Étape {step} sur 5</p>
          <div className="flex justify-center gap-4 mt-8">
            {[1, 2, 3, 4, 5].map(s => (
              <div 
                key={s} 
                className={`h-1.5 w-12 transition-all duration-500 ${s <= step ? 'bg-primary' : 'bg-surface-section'}`}
              />
            ))}
          </div>
        </header>

        <div className="space-y-8 min-h-[350px]">
          {step === 1 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div className="space-y-2">
                <h2 className="text-2xl font-headline font-bold uppercase tracking-tight">{onboardingCopy.steps[0].title}</h2>
                <p className="text-text-muted text-sm font-bold uppercase tracking-widest">{onboardingCopy.steps[0].description}</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-text-muted mb-2">Votre Nom</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-surface border-2 border-surface-section p-4 font-bold focus:outline-none focus:border-primary transition-colors" 
                    placeholder="ex: Marc Lefebvre" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-text-muted mb-2">Votre Métier</label>
                  <input 
                    type="text" 
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-surface border-2 border-surface-section p-4 font-bold focus:outline-none focus:border-primary transition-colors" 
                    placeholder="ex: Responsable Commercial" 
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
              <div className="space-y-2">
                <h2 className="text-2xl font-headline font-bold uppercase tracking-tight">{onboardingCopy.steps[1].title}</h2>
                <p className="text-text-muted text-sm font-bold uppercase tracking-widest">{onboardingCopy.steps[1].description}</p>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                <div className="p-4 bg-surface-section border-l-4 border-l-success flex items-start gap-4">
                  <ShieldCheck className="text-success shrink-0" size={24} />
                  <div>
                    <h4 className="font-black uppercase text-xs text-success mb-1">1. Confiance</h4>
                    <p className="text-sm font-medium">La fin du doute. Vos réalisations sont ancrées dans des faits vérifiables.</p>
                  </div>
                </div>
                <div className="p-4 bg-surface-section border-l-4 border-l-primary flex items-start gap-4">
                  <TrendingUp className="text-primary shrink-0" size={24} />
                  <div>
                    <h4 className="font-black uppercase text-xs text-primary mb-1">2. Impact</h4>
                    <p className="text-sm font-medium">L'effet concret. Quelle valeur réelle débloquez-vous au quotidien ?</p>
                  </div>
                </div>
                <div className="p-4 bg-surface-section border-l-4 border-l-warning flex items-start gap-4">
                  <Award className="text-warning shrink-0" size={24} />
                  <div>
                    <h4 className="font-black uppercase text-xs text-warning mb-1">3. Réalisations</h4>
                    <p className="text-sm font-medium">L'évidence. Pas de longs discours, juste vos meilleurs résultats.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <h2 className="text-2xl font-headline font-bold uppercase tracking-tight">{onboardingCopy.steps[2].title}</h2>
              <p className="text-text-main font-medium leading-relaxed">Identifiez les domaines où vous avez un impact mesurable.</p>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                    className="flex-1 bg-surface border-2 border-surface-section p-4 font-bold focus:outline-none focus:border-primary transition-colors" 
                    placeholder="Ajouter une compétence (ex: Négociation, Stratégie, Design)..." 
                  />
                  <button 
                    type="button"
                    onClick={handleAddSkill}
                    className="bg-primary text-surface px-6 font-bold uppercase tracking-wider text-xs"
                  >
                    Ajouter
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skills.map((s, idx) => (
                    <span key={idx} className="badge bg-primary text-surface flex items-center gap-2 px-4 py-2 font-bold">
                      {s} 
                      <button type="button" onClick={() => handleRemoveSkill(s)} className="hover:text-error transition-colors">&times;</button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <h2 className="text-2xl font-headline font-bold uppercase tracking-tight">{onboardingCopy.steps[3].title}</h2>
              <p className="text-text-main font-medium leading-relaxed">Décrivez un moment où vous avez débloqué une situation ou amélioré un résultat.</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-text-muted mb-2">Titre de la réalisation</label>
                  <input 
                    type="text" 
                    value={firstProofTitle}
                    onChange={(e) => setFirstProofTitle(e.target.value)}
                    className="w-full bg-surface border-2 border-surface-section p-4 font-bold focus:outline-none focus:border-primary transition-colors" 
                    placeholder="ex: Optimisation du tunnel de vente" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-text-muted mb-2">Résultat obtenu</label>
                  <textarea 
                    value={firstProofImpact}
                    onChange={(e) => setFirstProofImpact(e.target.value)}
                    className="w-full bg-surface border-2 border-surface-section p-4 font-bold focus:outline-none focus:border-primary transition-colors resize-none h-32" 
                    placeholder="Décrivez l'impact concret (ex: +20% de croissance en 3 mois)..." 
                  />
                </div>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-8 text-center animate-in zoom-in duration-500">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <CheckCircle size={80} className="text-success" />
                  <Sparkles size={32} className="text-primary absolute -top-4 -right-4 animate-pulse" />
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-4xl font-headline font-black uppercase tracking-tight">{onboardingCopy.steps[4].title}</h2>
                <p className="text-text-muted font-bold uppercase tracking-widest text-sm">Votre impact est maintenant visible.</p>
              </div>
              
              <div className="grid grid-cols-2 gap-6 py-8 border-y border-surface-section">
                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-widest text-text-muted">Profil</span>
                  <div className="text-2xl font-headline font-black text-primary">{name || 'Utilisateur'}</div>
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-widest text-text-muted">Confiance</span>
                  <div className="text-2xl font-headline font-black text-success uppercase">Fiable</div>
                </div>
              </div>

              <div className="bg-surface-section p-6 border-l-4 border-l-primary text-left">
                <h4 className="text-xs font-bold uppercase tracking-widest text-text-muted mb-2 flex items-center gap-2">
                  <Sparkles size={14} className="text-primary" /> Premier Signal de Crédibilité
                </h4>
                <p className="text-text-main font-medium italic leading-relaxed">
                  "Votre profil est maintenant ancré dans la réalité. Chaque nouvelle réalisation augmentera votre niveau d'impact et votre visibilité auprès des décideurs."
                </p>
              </div>
            </div>
          )}
        </div>

        <footer className="mt-12 pt-8 border-t border-surface-section flex items-center justify-between">
          <button 
            onClick={handleBack}
            className={`text-sm font-bold uppercase tracking-wider flex items-center gap-2 transition-colors ${step === 1 ? 'text-surface-section cursor-not-allowed' : 'text-text-muted hover:text-primary'}`}
            disabled={step === 1 || isSaving}
          >
            <ArrowLeft size={16} /> Retour
          </button>
          <button 
            onClick={handleNext}
            disabled={isSaving}
            className="bg-primary text-surface px-8 py-4 text-sm font-bold uppercase tracking-wide hover:bg-primary-container transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="animate-spin" size={16} /> Enregistrement...
              </>
            ) : (
              <>
                {step === 5 ? 'Accéder au Dashboard' : 'Continuer'} <ArrowRight size={16} />
              </>
            )}
          </button>
        </footer>
      </div>
    </div>
  );
}

