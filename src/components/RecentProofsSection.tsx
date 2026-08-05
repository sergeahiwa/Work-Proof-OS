import { useState, useMemo } from 'react';
import { ArrowRight, Filter, ChevronDown, ShieldCheck, FileText, Link as LinkIcon, Code, BarChart2, Github, Users, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Proof, ProofType, ImpactLevel } from '../types';
import ProofCard from './ProofCard';
import { mockProjects } from '../store/mockData';

interface RecentProofsSectionProps {
  proofs?: Proof[];
}

type ConfidenceFilter = 'all' | 'high' | 'medium' | 'low';
type ImpactFilter = ImpactLevel | 'all';
type DateSort = 'newest' | 'oldest';

export default function RecentProofsSection({ proofs }: RecentProofsSectionProps) {
  const [typeFilter, setTypeFilter] = useState<ProofType | 'all'>('all');
  const [confidenceFilter, setConfidenceFilter] = useState<ConfidenceFilter>('all');
  const [impactFilter, setImpactFilter] = useState<ImpactFilter>('all');
  const [dateSort, setDateSort] = useState<DateSort>('newest');

  // Base proofs from props or mockProjects
  const baseProofs = useMemo(() => {
    return proofs || mockProjects.flatMap(p => p.proofs);
  }, [proofs]);

  // Filtered and sorted proofs
  const displayProofs = useMemo(() => {
    let filtered = [...baseProofs];

    if (typeFilter !== 'all') {
      filtered = filtered.filter(p => p.type === typeFilter);
    }

    if (confidenceFilter !== 'all') {
      filtered = filtered.filter(p => {
        if (confidenceFilter === 'high') return p.confidenceScore >= 80;
        if (confidenceFilter === 'medium') return p.confidenceScore >= 40 && p.confidenceScore < 80;
        if (confidenceFilter === 'low') return p.confidenceScore < 40;
        return true;
      });
    }

    if (impactFilter !== 'all') {
      filtered = filtered.filter(p => p.impactLevel === impactFilter);
    }

    return filtered
      .sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return dateSort === 'newest' ? dateB - dateA : dateA - dateB;
      })
      .slice(0, 3);
  }, [baseProofs, typeFilter, confidenceFilter, impactFilter, dateSort]);

  const logInteraction = (proofId: string) => {
    console.log(`[TRACKING] RecentProofs: interact_proof`, { proofId });
    console.log(`[ANALYTICS] Signal: proof_engagement`, { proofId, source: 'recent_section' });
  };

  const logFilterChange = (filterType: string, value: string) => {
    console.log(`[TRACKING] RecentProofs: filter_change`, { filterType, value });
    console.log(`[ANALYTICS] Signal: filter_intent`, { filterType, value });
  };

  return (
    <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-surface-section pb-4 gap-6">
        <div className="flex items-center justify-between w-full md:w-auto gap-4">
          <h2 className="text-xl md:text-2xl font-headline font-bold tracking-tight uppercase">Top 3 Preuves Récentes</h2>
          <div className="md:hidden flex items-center gap-2 px-3 py-1 bg-surface-section border border-surface-border rounded-full text-[8px] font-bold text-text-muted uppercase tracking-widest">
            <Filter size={10} />
            <span>Filtres</span>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          {/* Proof Type Filter */}
          <div className="relative group">
            <select 
              value={typeFilter}
              onChange={(e) => {
                const val = e.target.value as ProofType | 'all';
                setTypeFilter(val);
                logFilterChange('type', val);
              }}
              className="appearance-none bg-surface-section border border-surface-border text-text-main text-[9px] md:text-[10px] font-bold uppercase tracking-widest px-3 md:px-4 py-2 pr-7 md:pr-8 rounded-xl focus:outline-none focus:border-primary transition-colors cursor-pointer"
            >
              <option value="all">Tous</option>
              <option value="document">Document</option>
              <option value="link">Lien</option>
              <option value="code">Code</option>
              <option value="metric">Métrique</option>
              <option value="github_commit">GitHub Commit</option>
              <option value="peer_validation">Validation Pair</option>
            </select>
            <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
          </div>

          {/* Confidence Filter */}
          <div className="relative group">
            <select 
              value={confidenceFilter}
              onChange={(e) => {
                const val = e.target.value as ConfidenceFilter;
                setConfidenceFilter(val);
                logFilterChange('confidence', val);
              }}
              className="appearance-none bg-surface-section border border-surface-border text-text-main text-[9px] md:text-[10px] font-bold uppercase tracking-widest px-3 md:px-4 py-2 pr-7 md:pr-8 rounded-xl focus:outline-none focus:border-primary transition-colors cursor-pointer"
            >
              <option value="all">Toutes Confiances</option>
              <option value="high">Haute (80%+)</option>
              <option value="medium">Moyenne (40-80%)</option>
              <option value="low">Basse (&lt;40%)</option>
            </select>
            <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
          </div>

          {/* Impact Filter */}
          <div className="relative group">
            <select 
              value={impactFilter}
              onChange={(e) => {
                const val = e.target.value as ImpactFilter;
                setImpactFilter(val);
                logFilterChange('impact', val);
              }}
              className="appearance-none bg-surface-section border border-surface-border text-text-main text-[9px] md:text-[10px] font-bold uppercase tracking-widest px-3 md:px-4 py-2 pr-7 md:pr-8 rounded-xl focus:outline-none focus:border-primary transition-colors cursor-pointer"
            >
              <option value="all">Tous Impacts</option>
              <option value="high">Élevé</option>
              <option value="medium">Moyen</option>
              <option value="low">Bas</option>
            </select>
            <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
          </div>

          {/* Date Sort */}
          <div className="relative group">
            <select 
              value={dateSort}
              onChange={(e) => {
                const val = e.target.value as DateSort;
                setDateSort(val);
                logFilterChange('dateSort', val);
              }}
              className="appearance-none bg-surface-section border border-surface-border text-text-main text-[9px] md:text-[10px] font-bold uppercase tracking-widest px-3 md:px-4 py-2 pr-7 md:pr-8 rounded-xl focus:outline-none focus:border-primary transition-colors cursor-pointer"
            >
              <option value="newest">Plus Récentes</option>
              <option value="oldest">Plus Anciennes</option>
            </select>
            <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
          </div>

          <Link 
            to="/projects" 
            onClick={() => {
              console.log('[TRACKING] RecentProofs: click_view_all');
              console.log('[ANALYTICS] Signal: view_all_proofs_intent');
            }}
            className="text-sm font-bold uppercase tracking-wider text-text-muted hover:text-primary transition-colors flex items-center gap-2 group ml-auto md:ml-4"
          >
            Toutes <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayProofs.map((proof) => (
          <motion.div 
            key={proof.id} 
            whileHover={{ y: -8, transition: { duration: 0.3, ease: "easeOut" } }}
            onClick={() => logInteraction(proof.id)}
            className="group relative flex flex-col h-full bg-surface-section border border-surface-border hover:border-primary/50 rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-[0_20px_50px_-12px_rgba(var(--color-primary-rgb),0.15)] cursor-pointer"
          >
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-primary/10 transition-colors" />
            
            <div className="p-5 md:p-8 flex flex-col h-full relative z-10">
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 md:p-3 bg-surface-hover text-primary rounded-2xl group-hover:scale-110 transition-transform duration-500">
                    {proof.type === 'code' && <Code size={24} />}
                    {proof.type === 'document' && <FileText size={24} />}
                    {proof.type === 'link' && <LinkIcon size={24} />}
                    {proof.type === 'metric' && <BarChart2 size={24} />}
                    {proof.type === 'github_commit' && <Github size={24} />}
                    {proof.type === 'peer_validation' && <Users size={24} />}
                  </div>
                  {proof.impactLevel === 'high' && (
                    <div className="p-2 bg-primary/10 text-primary rounded-lg" title="Impact Élevé">
                      <Zap size={16} className="fill-primary" />
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-success/10 text-success border border-success/20 rounded-full">
                  <ShieldCheck size={14} className="animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    {proof.confidenceScore}% Confiance
                  </span>
                </div>
              </div>

              <div className="space-y-3 flex-grow">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold font-headline leading-tight group-hover:text-primary transition-colors line-clamp-2">
                    {proof.title}
                  </h3>
                </div>
                <p className="text-sm text-text-muted leading-relaxed line-clamp-3 font-medium">
                  {proof.description}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-surface-border flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[8px] font-black uppercase tracking-[0.2em] text-text-muted mb-1">Ancrage Temporel</span>
                  <span className="text-xs font-bold text-text-main">
                    {new Date(proof.date).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-primary">
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-500">Détails</span>
                  <div className="p-2 bg-primary/10 rounded-xl group-hover:bg-primary group-hover:text-surface transition-all duration-500">
                    <ArrowRight size={16} />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
        {displayProofs.length === 0 && (
          <div className="col-span-full py-16 text-center border-2 border-dashed border-surface-border rounded-2xl bg-surface-section/30">
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 bg-surface-section rounded-full text-text-muted/30">
                <Filter size={40} />
              </div>
              <div className="space-y-1">
                <p className="text-text-main font-bold uppercase tracking-widest">Aucune preuve trouvée</p>
                <p className="text-xs text-text-muted">Essayez d'ajuster vos filtres pour voir plus de résultats.</p>
              </div>
              <button 
                onClick={() => {
                  setTypeFilter('all');
                  setConfidenceFilter('all');
                  setImpactFilter('all');
                  setDateSort('newest');
                }}
                className="mt-2 text-[10px] font-black uppercase tracking-widest text-primary hover:underline"
              >
                Réinitialiser les filtres
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
