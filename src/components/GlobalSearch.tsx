import { useState, useEffect, useRef } from 'react';
import { Search, User, FolderKanban, Briefcase, X, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mockUsers, mockProjects, mockOpportunities } from '../store/mockData';
import { motion, AnimatePresence } from 'motion/react';

export default function GlobalSearch() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<{
    users: typeof mockUsers;
    projects: typeof mockProjects;
    opportunities: typeof mockOpportunities;
  }>({ users: [], projects: [], opportunities: [] });
  
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.length < 2) {
      setResults({ users: [], projects: [], opportunities: [] });
      return;
    }

    const lowerQuery = query.toLowerCase();
    
    const filteredUsers = mockUsers.filter(u => 
      u.name.toLowerCase().includes(lowerQuery) || 
      u.role.toLowerCase().includes(lowerQuery) ||
      u.topSkills?.some(s => s.toLowerCase().includes(lowerQuery))
    ).slice(0, 5);

    const filteredProjects = mockProjects.filter(p => 
      p.title.toLowerCase().includes(lowerQuery) || 
      p.description.toLowerCase().includes(lowerQuery)
    ).slice(0, 5);

    const filteredOpportunities = mockOpportunities.filter(o => 
      o.title.toLowerCase().includes(lowerQuery) || 
      o.company.toLowerCase().includes(lowerQuery)
    ).slice(0, 5);

    setResults({
      users: filteredUsers,
      projects: filteredProjects,
      opportunities: filteredOpportunities
    });
  }, [query]);

  const handleSelect = (path: string) => {
    navigate(path);
    setIsOpen(false);
    setQuery('');
  };

  const hasResults = results.users.length > 0 || results.projects.length > 0 || results.opportunities.length > 0;

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={18} />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Rechercher (Profils, Projets, Opportunités)..."
          className="w-full bg-surface-section border-2 border-transparent focus:border-primary/30 py-2.5 pl-12 pr-10 text-sm font-bold placeholder:text-text-muted/50 outline-none transition-all rounded-xl"
        />
        {query && (
          <button 
            onClick={() => setQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && query.length >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-surface border-2 border-surface-border shadow-2xl rounded-2xl overflow-hidden z-50 max-h-[80vh] overflow-y-auto"
          >
            {!hasResults ? (
              <div className="p-8 text-center space-y-2">
                <Search className="mx-auto text-text-muted/20" size={48} />
                <p className="text-sm font-bold text-text-muted uppercase tracking-widest">Aucun résultat pour "{query}"</p>
              </div>
            ) : (
              <div className="p-2 space-y-4">
                {results.users.length > 0 && (
                  <div>
                    <div className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-text-muted flex items-center gap-2">
                      <User size={12} /> Profils
                    </div>
                    <div className="space-y-1">
                      {results.users.map(u => (
                        <button
                          key={u.id}
                          onClick={() => handleSelect(`/network?id=${u.id}`)}
                          className="w-full flex items-center gap-3 p-3 hover:bg-surface-section rounded-xl transition-colors text-left group"
                        >
                          <img src={u.avatar} alt={u.name} className="w-10 h-10 rounded-lg grayscale group-hover:grayscale-0 transition-all" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold truncate">{u.name}</p>
                            <p className="text-xs text-text-muted truncate">{u.role}</p>
                          </div>
                          <ArrowRight size={14} className="text-text-muted opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {results.projects.length > 0 && (
                  <div>
                    <div className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-text-muted flex items-center gap-2">
                      <FolderKanban size={12} /> Projets & Preuves
                    </div>
                    <div className="space-y-1">
                      {results.projects.map(p => (
                        <button
                          key={p.id}
                          onClick={() => handleSelect(`/projects?id=${p.id}`)}
                          className="w-full flex items-center gap-3 p-3 hover:bg-surface-section rounded-xl transition-colors text-left group"
                        >
                          <div className="w-10 h-10 bg-primary/10 flex items-center justify-center rounded-lg text-primary">
                            <FolderKanban size={20} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold truncate">{p.title}</p>
                            <p className="text-xs text-text-muted truncate">{p.description}</p>
                          </div>
                          <ArrowRight size={14} className="text-text-muted opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {results.opportunities.length > 0 && (
                  <div>
                    <div className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-text-muted flex items-center gap-2">
                      <Briefcase size={12} /> Opportunités
                    </div>
                    <div className="space-y-1">
                      {results.opportunities.map(o => (
                        <button
                          key={o.id}
                          onClick={() => handleSelect(`/opportunities?id=${o.id}`)}
                          className="w-full flex items-center gap-3 p-3 hover:bg-surface-section rounded-xl transition-colors text-left group"
                        >
                          <div className="w-10 h-10 bg-success/10 flex items-center justify-center rounded-lg text-success">
                            <Briefcase size={20} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold truncate">{o.title}</p>
                            <p className="text-xs text-text-muted truncate">{o.company}</p>
                          </div>
                          <ArrowRight size={14} className="text-text-muted opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
