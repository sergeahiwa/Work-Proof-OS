import React, { useState } from 'react';
import { 
  Users, Search, Filter, ShieldCheck, UserPlus, MessageSquare, 
  TrendingUp, Activity, Zap, Star, GitBranch, Loader2, UserCheck, 
  Award, Lock, CheckCircle2, Share2, Sparkles, Network as NetworkIcon
} from 'lucide-react';
import { mockUsers, mockContributions } from '../store/mockData';
import { useAuth } from '../components/FirebaseProvider';
import { addProofValidation } from '../services/credibilityService';
import { ValidationSeal, CredibilityScore } from '../components/ui';

export default function Network() {
  const { user, profile } = useAuth();
  const connections = mockUsers.slice(1, 7); // Exclude current user
  const suggestions = mockUsers.slice(7, 10);
  
  // Simulate collaborations based on shared project IDs (mock)
  const collaborations = mockUsers.slice(3, 5).map(u => ({
    ...u,
    sharedProject: "Modernisation du Réseau Logistique Sud",
    sharedProofs: 2
  }));

  const [boostedIds, setBoostedIds] = useState<string[]>([]);
  const [myCredibility, setMyCredibility] = useState(profile?.impactScore || 842);
  const [validatingId, setValidatingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleBoost = async (connUser: typeof mockUsers[0]) => {
    if (boostedIds.includes(connUser.id)) return;
    setValidatingId(connUser.id);

    try {
      if (user && connUser.id && !connUser.id.startsWith('u-')) {
        // Real Firestore validation transaction via credibilityService
        const mockProofId = 'proof_' + connUser.id;
        await addProofValidation(connUser.id, mockProofId, {
          proofId: mockProofId,
          validatorId: user.uid,
          validatorType: 'peer',
          status: 'approved',
          comment: 'Validation de la réalisation via le Réseau de Confiance',
          weight: 1.0
        });
      }
      setBoostedIds(prev => [...prev, connUser.id]);
      setMyCredibility(prev => prev + 5);
    } catch (err: any) {
      console.warn("Validation warning / local update:", err?.message || err);
      // Fallback UI boost for demo user
      setBoostedIds(prev => [...prev, connUser.id]);
      setMyCredibility(prev => prev + 5);
    } finally {
      setValidatingId(null);
    }
  };

  const filteredConnections = connections.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-300 pb-20">
      {/* BANDEAU MODE DÉMONSTRATION */}
      {(!user || !profile) && (
        <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-xl flex items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-3">
            <div className="bg-amber-500/20 text-amber-400 p-2 rounded-lg border border-amber-500/40">
              <Lock size={18} />
            </div>
            <div>
              <h4 className="font-bold text-amber-300">Mode Démonstration Actif</h4>
              <p className="text-slate-400 text-xs">Graph de validation et paires de démonstration. Connectez-vous pour émettre et sceller de vraies attestations.</p>
            </div>
          </div>
        </div>
      )}

      {/* HEADER SECTION */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#1E293B]">
        <div>
          <div className="flex items-center gap-2.5 mb-1 text-blue-400 font-mono text-xs font-bold uppercase tracking-wider">
            <NetworkIcon size={16} />
            <span>VALIDATION GRAPH & NETWORK OS v1.5</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold font-display tracking-tight text-slate-100">
            Graph de Validation Professionnelle
          </h1>
          <p className="text-slate-400 mt-1.5 text-sm md:text-base max-w-2xl">
            Réseau de paires certifié et ancré par consensus. Pas de bruit social, uniquement des attestations croisées et des preuves d'impact partagées.
          </p>
        </div>

        {/* SCORE BANNER */}
        <div className="bg-[#111726] border border-[#1E293B] p-4 rounded-2xl flex items-center gap-4 shadow-xl shrink-0">
          <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
            <Users size={24} />
          </div>
          <div>
            <span className="block text-[10px] font-mono font-bold uppercase text-slate-500">Votre Crédibilité Réseau</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-extrabold font-mono text-blue-400">{myCredibility}</span>
              <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                WP-ANCHORED
              </span>
            </div>
            {boostedIds.length > 0 && (
              <span className="text-[10px] font-mono font-bold text-emerald-400 block mt-0.5">
                +{boostedIds.length * 5} pts via validations émises
              </span>
            )}
          </div>
        </div>
      </header>

      {/* VALIDATION LOOP BANNER */}
      <section className="bg-[#111726] border border-blue-500/30 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden shadow-xl">
        <div className="absolute -right-8 -bottom-8 opacity-5 text-blue-500 pointer-events-none">
          <ShieldCheck size={160} />
        </div>

        <div className="flex items-center gap-4 relative z-10">
          <div className="bg-blue-600 text-white p-3 rounded-xl shadow-lg shadow-blue-500/20 shrink-0">
            <Zap size={24} />
          </div>
          <div>
            <h3 className="font-bold font-display text-lg text-slate-100">Mécanique de Consensus et Attestation Croisée</h3>
            <p className="text-xs font-mono text-slate-400 mt-0.5">
              Attester la réalisation effective d'un pair renforce le maillage du registre et augmente la confiance globale.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-blue-400 bg-blue-500/10 px-3 py-1.5 rounded-full border border-blue-500/20 shrink-0 relative z-10">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
          <span>Loop de Confiance Actif</span>
        </div>
      </section>

      {/* SEARCH & FILTER BAR */}
      <section className="flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Rechercher par nom, rôle ou preuve partagée..." 
            className="w-full bg-[#111726] border border-[#1E293B] py-3 pl-11 pr-4 font-mono text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all rounded-xl"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto font-mono text-xs">
          <button className="flex-1 md:flex-none bg-[#111726] border border-[#1E293B] px-4 py-3 text-slate-300 hover:text-white transition-all rounded-xl font-bold uppercase flex items-center justify-center gap-2">
            <Filter size={14} /> Filtrer
          </button>
          <button className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-500 text-white px-4 py-3 font-bold uppercase transition-all rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20">
            <UserPlus size={14} /> Inviter Pair
          </button>
        </div>
      </section>

      {/* MAIN GRAPH LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* COLONNE GAUCHE: CONNECTIONS DE HAUTE VALEUR & COLLABORATIONS */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* HIGH VALUE CONNECTIONS */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
              <h2 className="text-xl font-bold font-display text-slate-100 flex items-center gap-2.5">
                <Star size={20} className="text-amber-400" />
                <span>Paires de Confiance Attestées</span>
              </h2>
              <span className="font-mono text-xs text-slate-500 uppercase font-bold">Trié par Indice d'Impact</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredConnections.map((conn) => {
                const isBoosted = boostedIds.includes(conn.id);
                const isValidating = validatingId === conn.id;

                return (
                  <div 
                    key={conn.id}
                    className="rounded-2xl bg-[#111726] border border-[#1E293B] p-5 relative overflow-hidden transition-all duration-200 hover:border-slate-700 shadow-xl space-y-4 group"
                  >
                    <div className="flex items-start gap-3.5 relative z-10">
                      <img 
                        src={conn.avatar} 
                        alt={conn.name} 
                        className="w-12 h-12 object-cover rounded-xl border border-[#1E293B] shrink-0" 
                        referrerPolicy="no-referrer" 
                      />
                      <div className="flex-1 min-w-0 space-y-1">
                        <h3 className="font-bold font-display text-base text-slate-100 truncate group-hover:text-blue-400 transition-colors">
                          {conn.name}
                        </h3>
                        <p className="text-xs font-mono text-slate-400 truncate">{conn.role}</p>
                        <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-mono text-[10px] font-bold">
                          <ShieldCheck size={10} />
                          <span>IDENTITÉ CERTIFIÉE</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#1E293B] flex items-center justify-between font-mono text-xs">
                      <div>
                        <span className="block text-[10px] uppercase text-slate-500 font-bold">Indice d'Impact</span>
                        <div className="flex items-center gap-1 text-emerald-400 font-extrabold text-sm">
                          <TrendingUp size={14} />
                          <span>{conn.impactScore}%</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleBoost(conn)}
                          disabled={isBoosted || isValidating}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs font-bold uppercase transition-all ${
                            isBoosted
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/20'
                          }`}
                        >
                          {isValidating ? (
                            <Loader2 className="animate-spin" size={14} />
                          ) : (
                            <ShieldCheck size={14} />
                          )}
                          <span>{isBoosted ? 'Sceau Émis' : 'Attester Preuve'}</span>
                        </button>
                        <button className="p-2 bg-[#1B2438] text-slate-400 hover:text-slate-200 hover:bg-slate-700 transition-colors rounded-lg border border-[#1E293B]">
                          <MessageSquare size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* COLLABORATIONS RÉELLES */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
              <h2 className="text-xl font-bold font-display text-slate-100 flex items-center gap-2.5">
                <GitBranch size={20} className="text-blue-400" />
                <span>Collaborations & Projets Partagés</span>
              </h2>
            </div>

            <div className="space-y-3">
              {collaborations.map(collab => (
                <div 
                  key={collab.id} 
                  className="rounded-2xl bg-[#111726] border border-[#1E293B] p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:border-slate-700 shadow-xl"
                >
                  <div className="flex items-center gap-3.5">
                    <img src={collab.avatar} alt={collab.name} className="w-11 h-11 rounded-xl border border-[#1E293B] object-cover" />
                    <div>
                      <h4 className="font-bold font-display text-base text-slate-100">{collab.name}</h4>
                      <p className="text-xs font-mono text-slate-400">
                        Projet Commun: <span className="text-slate-200">{collab.sharedProject}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 font-mono text-xs">
                    <div className="text-right">
                      <span className="block text-[10px] text-slate-500 font-bold uppercase">Preuves Communes</span>
                      <span className="text-base font-extrabold text-blue-400">{collab.sharedProofs} Ancrées</span>
                    </div>
                    <button className="px-3.5 py-2 bg-[#1B2438] hover:bg-slate-700 border border-[#1E293B] text-slate-200 font-bold rounded-xl transition-colors uppercase">
                      Inspecter Artefacts
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* COLONNE DROITE: SCEAUX RÉCENTS & ACTIVITÉ RÉSISTANTE À LA COLLUSION */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* RECENT VALIDATION SEALS */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
              <h3 className="text-lg font-bold font-display text-slate-100 flex items-center gap-2">
                <UserCheck size={18} className="text-emerald-400" />
                <span>Sceaux Récents émis sur le Réseau</span>
              </h3>
            </div>

            <div className="space-y-3">
              <ValidationSeal
                validation={{
                  id: 'val_net_1',
                  proofId: 'proof_u1',
                  validatorId: 'v1',
                  validatorType: 'manager',
                  status: 'approved',
                  weight: 1.5,
                  comment: 'Attestation formelle de la livraison sous contrainte de temps.',
                  timestamp: '2024-03-01'
                }}
                validatorName="Sarah Jenkins"
                validatorRole="VP Operations"
              />
              <ValidationSeal
                validation={{
                  id: 'val_net_2',
                  proofId: 'proof_u2',
                  validatorId: 'v2',
                  validatorType: 'peer',
                  status: 'approved',
                  weight: 1.0,
                  comment: 'Validation croisée de l\'architecture et de l\'impact code.',
                  timestamp: '2024-03-02'
                }}
                validatorName="Marc Lemoine"
                validatorRole="Lead Architect"
              />
            </div>
          </div>

          {/* SUGGESTIONS D'IMPACT */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
              <h3 className="text-lg font-bold font-display text-slate-100 flex items-center gap-2">
                <Zap size={18} className="text-amber-400" />
                <span>Suggestions de Rapprochement</span>
              </h3>
            </div>

            <div className="space-y-3">
              {suggestions.map(sug => (
                <div 
                  key={sug.id} 
                  className="rounded-xl bg-[#111726] border border-[#1E293B] p-3.5 flex items-center gap-3 transition-all hover:border-slate-700"
                >
                  <img src={sug.avatar} alt={sug.name} className="w-10 h-10 rounded-lg border border-[#1E293B] object-cover" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold font-display text-xs text-slate-100 truncate">{sug.name}</h4>
                    <p className="text-[10px] font-mono text-slate-400 truncate">{sug.role}</p>
                    <span className="text-[10px] font-mono text-blue-400 font-bold block mt-0.5">
                      Proximité d'impact: Logistique
                    </span>
                  </div>
                  <button className="p-2 text-blue-400 hover:bg-blue-500/10 transition-colors rounded-lg border border-blue-500/20">
                    <UserPlus size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* ACTIVITÉ DU RÉSEAU DE CONFIANCE */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
              <h3 className="text-lg font-bold font-display text-slate-100 flex items-center gap-2">
                <Activity size={18} className="text-emerald-400" />
                <span>Registre d'Activité Réseau</span>
              </h3>
            </div>

            <div className="space-y-4 font-mono text-xs">
              {[
                { user: "Sarah Jenkins", action: "a émis un sceau de validation pour", target: "Optimisation Flux Logistique", time: "2h" },
                { user: "Marc Lemoine", action: "a certifié la preuve de", target: "Alexandre Dupont", time: "5h" },
                { user: "Elena Rodriguez", action: "a ancré un nouvel artefact sur", target: "Architecture Cloud", time: "1j" }
              ].map((act, i) => (
                <div key={i} className="flex gap-3 relative">
                  {i !== 2 && <div className="absolute left-2 top-5 bottom-0 w-px bg-[#1E293B]" />}
                  <div className="w-4 h-4 rounded-full bg-blue-500 mt-0.5 shrink-0 border-2 border-[#111726]" />
                  <div className="space-y-0.5">
                    <p className="text-slate-300 leading-snug">
                      <span className="font-bold text-slate-100">{act.user}</span> {act.action} <span className="text-blue-400 font-bold">{act.target}</span>
                    </p>
                    <span className="text-[10px] text-slate-500 font-bold block">{act.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* INVITATION CARD */}
          <div className="rounded-2xl bg-gradient-to-br from-blue-950 to-[#111726] border border-blue-500/30 p-6 space-y-4 shadow-xl relative overflow-hidden">
            <Users className="absolute -right-6 -bottom-6 text-blue-500/10 pointer-events-none" size={140} />
            <h3 className="text-lg font-bold font-display text-slate-100 relative z-10">Étendez votre Graph de Confiance</h3>
            <p className="text-xs font-mono text-slate-300 relative z-10 leading-relaxed">
              Invitez vos collaborateurs réels à certifier vos livrables. Plus votre maillage de paires est dense et certifié, plus votre indice d'impact souverain est élevé.
            </p>
            <button className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold text-xs uppercase rounded-xl transition-all shadow-lg shadow-blue-500/20 relative z-10">
              Générer Lien d'Attestation
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

