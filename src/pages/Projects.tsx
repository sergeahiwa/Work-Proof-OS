import { Plus, CheckCircle, Clock, TrendingUp, User as UserIcon, ExternalLink, GitBranch, Network, ShieldCheck, X, Loader2, Activity, Filter, BarChart3, Briefcase, AlertTriangle, Info, FolderKanban, CheckCircle2, FileText, Zap } from 'lucide-react';
import { mockProjects, mockContributions, mockUser } from '../store/mockData';
import { useAuth } from '../components/FirebaseProvider';
import { useEffect, useState, useMemo } from 'react';
import { collection, query, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { translateKPI, getImpactLabel } from '../translation';
import { Industry, ValueImpact, Contribution, Project } from '../types';
import { calculateProjectMetrics } from '../core/projectImpact';
import { calculateMarketValueSignature } from '../core/impact';
import { ProofCard } from '../components/ui';

export default function Projects() {
  const { user, profile } = useAuth();
  const [realProjects, setRealProjects] = useState<Project[]>([]);
  const [realContributions, setRealContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [filterIndustry, setFilterIndustry] = useState<string>('all');
  const [filterImpact, setFilterImpact] = useState<string>('all');
  
  const [newProject, setNewProject] = useState({
    title: '',
    role: '',
    description: '',
    impact: '',
    status: 'completed' as 'completed' | 'ongoing',
    industry: 'logistics' as Industry,
    contributionIds: [] as string[],
    date: new Date().getFullYear().toString()
  });

  useEffect(() => {
    if (user) {
      setLoading(true);
      const pq = query(collection(db, `users/${user.uid}/projects`));
      const cq = query(collection(db, `users/${user.uid}/contributions`));
      
      const unsubProjects = onSnapshot(pq, (snapshot) => {
        setRealProjects(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project)));
      }, (err) => {
        console.warn("Firestore projects listener notice:", err);
      });

      const unsubContribs = onSnapshot(cq, (snapshot) => {
        setRealContributions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Contribution)));
        setLoading(false);
      }, (err) => {
        console.warn("Firestore contributions listener notice:", err);
        setLoading(false);
      });

      return () => {
        unsubProjects();
        unsubContribs();
      };
    }
  }, [user]);

  const allContributions = useMemo(() => {
    return user ? realContributions : mockContributions;
  }, [user, realContributions]);

  const userSignature = useMemo(() => {
    return calculateMarketValueSignature(allContributions);
  }, [allContributions]);

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const linkedContribs = allContributions.filter(c => newProject.contributionIds.includes(c.id));
      
      // Derive metrics from impact engine
      const metrics = calculateProjectMetrics(
        { ...newProject, id: 'temp', proofs: [] } as any,
        linkedContribs,
        userSignature
      );

      await addDoc(collection(db, `users/${user.uid}/projects`), {
        ...newProject,
        ...metrics,
        proofs: [],
        userId: user.uid,
        createdAt: serverTimestamp(),
        metadata: {
          auditLog: [{
            timestamp: new Date().toISOString(),
            action: 'create_project',
            details: `Mission créée initialement. Impact cible: ${newProject.impact}`
          }]
        }
      });

      setShowModal(false);
      setNewProject({
        title: '',
        role: '',
        description: '',
        impact: '',
        status: 'completed',
        industry: 'tech',
        contributionIds: [],
        date: new Date().getFullYear().toString()
      });
    } catch (error) {
      console.error("Error adding project:", error);
    }
  };

  const displayProjects = (realProjects.length > 0 ? realProjects : mockProjects)
    .filter(p => filterIndustry === 'all' || p.industry === filterIndustry)
    .filter(p => filterImpact === 'all' || p.impactLevel === filterImpact);

  const industries: Industry[] = ['tech', 'finance', 'logistics', 'healthcare', 'retail', 'energy', 'other'];
  const impactLevels: ValueImpact[] = ['low', 'medium', 'high'];

  return (
    <div className="space-y-10 animate-in fade-in duration-300 pb-20">
      {/* HEADER SECTION */}
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-surface-border">
        <div>
          <div className="flex items-center gap-2.5 mb-1 text-blue-500 font-mono text-xs font-bold uppercase tracking-wider">
            <FolderKanban size={16} />
            <span>PROOF WORKSPACE v1.5</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold font-display tracking-tight text-text">
            Missions & Workspace de Preuves
          </h1>
          <p className="text-text-muted mt-1.5 text-sm md:text-base max-w-2xl">
            Espace d'ancrage et de vérification continue des projets, réalisations et impacts produits sur le terrain.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 bg-surface px-3 py-2 rounded-xl border border-surface-border">
            <Filter size={14} className="text-text-muted" />
            <select 
              value={filterIndustry}
              onChange={e => setFilterIndustry(e.target.value)}
              className="bg-transparent text-xs font-mono font-bold uppercase text-text outline-none cursor-pointer"
            >
              <option value="all" className="bg-surface text-text">Tous Secteurs</option>
              {industries.map(ind => (
                <option key={ind} value={ind} className="bg-surface text-text">{ind}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 bg-surface px-3 py-2 rounded-xl border border-surface-border">
            <BarChart3 size={14} className="text-text-muted" />
            <select 
              value={filterImpact}
              onChange={e => setFilterImpact(e.target.value)}
              className="bg-transparent text-xs font-mono font-bold uppercase text-text outline-none cursor-pointer"
            >
              <option value="all" className="bg-surface text-text">Tous Impacts</option>
              {impactLevels.map(lvl => (
                <option key={lvl} value={lvl} className="bg-surface text-text">{lvl}</option>
              ))}
            </select>
          </div>

          <button 
            onClick={() => setShowModal(true)}
            className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-bold uppercase rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
          >
            <Plus size={16} /> Déclarer une mission
          </button>
        </div>
      </header>

      {/* DEMO MODE BANNER */}
      {(!user || realProjects.length === 0) && (
        <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-xl flex items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-3">
            <span className="bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/40 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
              Mode Démonstration
            </span>
            <span className="text-text-muted">
              Les missions affichées ci-dessous sont issues du registre de démonstration Work Proof OS.
            </span>
          </div>
        </div>
      )}

      {/* MODAL: DECLARE A MISSION */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-2xl p-6 md:p-8 bg-surface border border-surface-border rounded-2xl shadow-2xl space-y-6 animate-in zoom-in duration-200">
            <div className="flex justify-between items-center border-b border-surface-border pb-4">
              <div className="flex items-center gap-2">
                <FolderKanban size={20} className="text-blue-500" />
                <h2 className="text-xl font-bold font-display text-text">Déclarer une Nouvelle Mission</h2>
              </div>
              <button 
                onClick={() => setShowModal(false)} 
                className="text-text-muted hover:text-text p-1 rounded-lg hover:bg-surface-hover transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddProject} className="space-y-5 font-mono text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-text-muted font-bold uppercase">Nom de la mission / du projet</label>
                  <input 
                    required
                    type="text" 
                    value={newProject.title}
                    onChange={e => setNewProject({...newProject, title: e.target.value})}
                    className="w-full bg-surface-section border border-surface-border p-3 rounded-xl focus:border-blue-500 outline-none text-text font-medium"
                    placeholder="ex: Modernisation du Hub logistique"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-text-muted font-bold uppercase">Votre Poste / Rôle</label>
                  <input 
                    required
                    type="text" 
                    value={newProject.role}
                    onChange={e => setNewProject({...newProject, role: e.target.value})}
                    className="w-full bg-surface-section border border-surface-border p-3 rounded-xl focus:border-blue-500 outline-none text-text font-medium"
                    placeholder="ex: Lead Architect / Chef d'équipe"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-text-muted font-bold uppercase">Description & Formule 4-Part (Avant → Action → Après → Preuve)</label>
                <textarea 
                  required
                  value={newProject.description}
                  onChange={e => setNewProject({...newProject, description: e.target.value})}
                  className="w-full bg-surface-section border border-surface-border p-3 rounded-xl focus:border-blue-500 outline-none text-text font-medium h-28"
                  placeholder="Contexte initial → Action spécifique réalisée → Résultat mesurable obtenu → Source de vérification"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-text-muted font-bold uppercase">Secteur d'activité</label>
                  <select 
                    value={newProject.industry}
                    onChange={e => setNewProject({...newProject, industry: e.target.value as Industry})}
                    className="w-full bg-surface-section border border-surface-border p-3 rounded-xl focus:border-blue-500 outline-none text-text font-medium"
                  >
                    {industries.map(ind => (
                      <option key={ind} value={ind} className="bg-surface text-text">{ind}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-text-muted font-bold uppercase">Impact Estimé</label>
                  <div className="w-full bg-surface-section border border-surface-border p-3 rounded-xl text-blue-500 font-bold flex items-center gap-2">
                    <TrendingUp size={16} /> Calcul automatique via moteur d'impact
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-text-muted font-bold uppercase">Lier des actions enregistrées</label>
                <div className="max-h-36 overflow-y-auto border border-surface-border bg-surface-section p-2 rounded-xl space-y-1.5">
                  {allContributions.map(c => (
                    <label key={c.id} className="flex items-center gap-3 p-2 hover:bg-surface-hover rounded-lg cursor-pointer transition-colors border border-transparent hover:border-surface-border">
                      <input 
                        type="checkbox"
                        checked={newProject.contributionIds.includes(c.id)}
                        onChange={(e) => {
                          const ids = e.target.checked 
                            ? [...newProject.contributionIds, c.id]
                            : newProject.contributionIds.filter(id => id !== c.id);
                          setNewProject({...newProject, contributionIds: ids});
                        }}
                        className="w-4 h-4 accent-blue-500 rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-text truncate">{c.title}</div>
                        <div className="text-[10px] text-text-muted">{translateKPI(c.type)} | {c.impactScore}% Impact</div>
                      </div>
                    </label>
                  ))}
                  {allContributions.length === 0 && (
                    <p className="text-text-muted p-3 text-center">Aucune action enregistrée disponible.</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-text-muted font-bold uppercase">Résultat chiffré (ex: +25%)</label>
                  <input 
                    type="text" 
                    value={newProject.impact}
                    onChange={e => setNewProject({...newProject, impact: e.target.value})}
                    className="w-full bg-surface-section border border-surface-border p-3 rounded-xl focus:border-blue-500 outline-none text-emerald-500 font-bold"
                    placeholder="ex: +25% de performance"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-text-muted font-bold uppercase">Statut</label>
                  <select 
                    value={newProject.status}
                    onChange={e => setNewProject({...newProject, status: e.target.value as 'completed' | 'ongoing'})}
                    className="w-full bg-surface-section border border-surface-border p-3 rounded-xl focus:border-blue-500 outline-none text-text font-medium"
                  >
                    <option value="completed" className="bg-surface text-text">Terminée</option>
                    <option value="ongoing" className="bg-surface text-text">En cours</option>
                  </select>
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-display font-bold text-sm rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/20 uppercase tracking-wide mt-2"
              >
                Enregistrer la mission sur le registre
              </button>
            </form>
          </div>
        </div>
      )}

      {/* PROJECTS / WORKSPACE LIST */}
      <section className="space-y-8">
        {loading && (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="animate-spin text-blue-500" size={48} />
          </div>
        )}
        
        {displayProjects.map(project => {
          const projectContributions = allContributions.filter(c => c.projectId === project.id);
          const parts = project.description.split('→').map(p => p.trim());
          
          // Handle 4-part formula: AVANT → ACTION → APRÈS → PREUVE
          const avant = parts.length >= 4 ? parts[0] : "Contexte initial";
          const action = parts.length >= 4 ? parts[1] : (parts[0] || project.description);
          const apres = parts.length >= 4 ? parts[2] : (parts[1] || project.impact);
          const proof = parts.length >= 4 ? parts[3] : (parts[2] || "Preuve validée par le terrain.");
          
          return (
            <div 
              key={project.id} 
              className="rounded-2xl bg-surface border border-surface-border shadow-xl overflow-hidden space-y-0 transition-all duration-200 hover:border-surface-hover"
            >
              {/* MISSION HEADER BAR */}
              <div className="p-6 md:p-8 border-b border-surface-border space-y-6">
                <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
                  <div className="flex-1 space-y-6 w-full">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-2xl md:text-3xl font-bold font-display text-text tracking-tight">
                        {project.title}
                      </h2>
                      
                      <div className="flex flex-wrap gap-2">
                        {project.status === 'completed' ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 font-mono text-xs font-bold uppercase">
                            <CheckCircle size={12} /> Terminée
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-500 font-mono text-xs font-bold uppercase">
                            <Clock size={12} /> En cours
                          </span>
                        )}

                        {project.industry && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-section border border-surface-border text-text font-mono text-xs font-bold uppercase">
                            <Briefcase size={12} /> {project.industry}
                          </span>
                        )}

                        {project.impactLevel && (
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-mono text-xs font-bold uppercase ${
                            project.impactLevel === 'high' ? 'bg-purple-500/10 text-purple-500 border border-purple-500/30' :
                            project.impactLevel === 'medium' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/30' :
                            'bg-surface-section text-text-muted border border-surface-border'
                          }`}>
                            <TrendingUp size={12} /> Impact {project.impactLevel}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* 4-PART FORMULA CARDS GRID */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                      {/* 1. AVANT */}
                      <div className="p-4 rounded-xl bg-surface-section border border-surface-border space-y-2">
                        <div className="flex items-center gap-1.5 text-text-muted font-mono text-[10px] font-bold uppercase tracking-wider">
                          <Clock size={12} />
                          <span>1. CONTEXTE / AVANT</span>
                        </div>
                        <p className="text-xs text-text-muted font-mono italic leading-relaxed">"{avant}"</p>
                      </div>

                      {/* 2. ACTION */}
                      <div className="p-4 rounded-xl bg-surface-section border border-surface-border space-y-2">
                        <div className="flex items-center gap-1.5 text-blue-500 font-mono text-[10px] font-bold uppercase tracking-wider">
                          <Activity size={12} />
                          <span>2. ACTION RÉALISÉE</span>
                        </div>
                        <p className="text-xs text-text font-medium leading-relaxed">{action}</p>
                      </div>

                      {/* 3. VALEUR / APRÈS */}
                      <div className="p-4 rounded-xl bg-surface-section border border-surface-border space-y-2">
                        <div className="flex items-center gap-1.5 text-emerald-500 font-mono text-[10px] font-bold uppercase tracking-wider">
                          <TrendingUp size={12} />
                          <span>3. RÉSULTAT OBTENU</span>
                        </div>
                        <p className="text-sm font-mono font-bold text-emerald-600 dark:text-emerald-300 leading-snug">{apres}</p>
                      </div>

                      {/* 4. PREUVE */}
                      <div className="p-4 rounded-xl bg-surface-section border border-surface-border space-y-2">
                        <div className="flex items-center gap-1.5 text-purple-500 font-mono text-[10px] font-bold uppercase tracking-wider">
                          <ShieldCheck size={12} />
                          <span>4. PREUVE / ANCRAGE</span>
                        </div>
                        <p className="text-xs text-text-muted font-mono italic leading-relaxed">{proof}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* SIDE STATS */}
                  <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-start gap-4 w-full lg:w-auto shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-surface-border font-mono">
                    <div className="text-left lg:text-right">
                      <span className="block text-xs uppercase tracking-wider text-text-muted font-bold mb-1">PROOFS ANCRÉES</span>
                      <span className="text-3xl md:text-4xl font-extrabold text-blue-500">{project.proofs?.length || 0}</span>
                    </div>
                    <span className="text-xs text-text-muted font-bold">{project.date}</span>
                  </div>
                </div>
              </div>

              {/* ACTION JOURNAL SECTION */}
              {projectContributions.length > 0 && (
                <div className="p-6 md:p-8 bg-surface-section/50 border-b border-surface-border space-y-4">
                  <div className="flex items-center gap-2 text-text font-display font-bold text-lg">
                    <Activity size={18} className="text-blue-500" />
                    <h3>Journal d'Actions & Contributions Associées</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {projectContributions.map(contrib => {
                      const cParts = contrib.description.split('→').map(p => p.trim());
                      const cAvant = cParts.length >= 4 ? cParts[0] : "Contexte";
                      const cAction = cParts.length >= 4 ? cParts[1] : (cParts[0] || contrib.description);
                      const cApres = cParts.length >= 4 ? cParts[2] : (cParts[1] || "Impact significatif");
                      const cProof = cParts.length >= 4 ? cParts[3] : (cParts[2] || "Validé");

                      return (
                        <div 
                          key={contrib.id} 
                          className="p-4 bg-surface border border-surface-border rounded-xl space-y-3 transition-all hover:border-surface-hover"
                        >
                          <div className="flex justify-between items-center font-mono">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              contrib.type === 'decision' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                              contrib.type === 'execution' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                              'bg-purple-500/10 text-purple-500 border border-purple-500/20'
                            }`}>
                              {translateKPI(contrib.type)}
                            </span>
                            <span className="text-xs font-bold text-blue-500">{contrib.impactScore}% Impact</span>
                          </div>

                          <h4 className="font-display font-bold text-sm text-text">{contrib.title}</h4>

                          <div className="space-y-1.5 font-mono text-xs">
                            <p className="text-text-muted line-clamp-1 italic"><span className="text-text-dim font-bold">AVANT:</span> {cAvant}</p>
                            <p className="text-text line-clamp-1"><span className="text-blue-500 font-bold">FAIT:</span> {cAction}</p>
                            <p className="text-emerald-500 font-bold line-clamp-1"><span className="text-emerald-500 font-bold">VALEUR:</span> {cApres}</p>
                            <p className="text-text-muted line-clamp-1 italic"><span className="text-text-dim font-bold">PREUVE:</span> {cProof}</p>
                          </div>
                          
                          {contrib.causalDependencies && contrib.causalDependencies.length > 0 && (
                            <div className="pt-2 border-t border-surface-border flex flex-wrap gap-2 font-mono text-[10px]">
                              {contrib.causalDependencies.map(depId => {
                                const dep = projectContributions.find(pc => pc.id === depId);
                                return (
                                  <div key={depId} className="flex items-center gap-1 text-emerald-500 uppercase">
                                    <GitBranch size={10} /> Lié: {dep?.title.split(' ')[0] || depId}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              
              {/* DOCUMENTS & PROOF CARDS */}
              <div className="p-6 md:p-8 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold font-display text-text flex items-center gap-2">
                    <ShieldCheck size={18} className="text-emerald-500" />
                    <span>Preuves & Artefacts Ancrés</span>
                  </h3>
                  <button className="text-xs font-mono font-bold uppercase text-blue-500 hover:text-blue-600 dark:hover:text-blue-300 transition-colors flex items-center gap-1">
                    <Plus size={14} /> Ajouter Artefact
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {project.proofs?.map((proof: any) => (
                    <ProofCard key={proof.id} proof={proof} />
                  ))}
                  {(!project.proofs || project.proofs.length === 0) && (
                    <div className="col-span-full p-6 border border-dashed border-surface-border rounded-xl text-center font-mono text-xs text-text-muted">
                      Aucune réalisation certifiée associée
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}

