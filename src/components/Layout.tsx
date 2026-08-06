import { ReactNode, useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, User, FolderKanban, Briefcase, Users, LogOut, Moon, Sun, UserCheck, Zap, Activity, Loader2, LogIn, Building2, Terminal } from 'lucide-react';
import { mockUser } from '../store/mockData';
import GlobalSearch from './GlobalSearch';
import { useAuth } from './FirebaseProvider';
import AbstractAvatar from './AbstractAvatar';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, profile, loading, logout, signIn, tenantId } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => true);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const navItems = [
    { path: '/dashboard', label: 'Sur le terrain', icon: LayoutDashboard },
    { path: '/profile', label: 'Mon Profil', icon: User },
    { path: '/projects', label: 'Mes Missions', icon: FolderKanban },
    { path: '/opportunities', label: 'Opportunités', icon: Briefcase },
    { path: '/network', label: 'Mon Réseau', icon: Users },
    { path: '/recruiter', label: 'Vérification', icon: UserCheck },
    { path: '/test-mode', label: 'Mode Test', icon: Zap },
    { path: '/admin', label: 'Administration', icon: Activity },
  ];

  const activeUser = profile || mockUser;

  return (
    <div className="min-h-screen flex bg-bg text-text relative font-sans">
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-surface flex flex-col border-r border-surface-border
        transition-transform duration-300 lg:translate-x-0 lg:static
        ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-8 pb-4 flex items-center justify-between">
          <Link to="/" className="block">
            <h1 className="text-xl font-black tracking-tighter text-primary">Work Proof</h1>
            <p className="text-[10px] text-text-muted font-medium uppercase tracking-widest mt-1">Journal d'impact</p>
          </Link>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            const label = item.path === '/recruiter' ? 'Recrutement' : item.label;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 text-sm font-bold transition-all rounded-lg ${
                  isActive 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-text-muted hover:text-text hover:bg-surface-hover'
                }`}
              >
                <Icon size={18} />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-surface-border">
          {loading ? (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="animate-spin text-primary" size={20} />
            </div>
          ) : user ? (
            <div className="flex items-center gap-3 p-3 bg-surface-section rounded-lg border border-surface-border">
              <img src={activeUser.avatar} alt={activeUser.name} className="w-8 h-8 rounded-full" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold truncate">{activeUser.name}</p>
                <p className="text-[10px] text-text-dim truncate">{activeUser.role}</p>
              </div>
              <button 
                onClick={() => logout()}
                className="text-text-dim hover:text-error transition-colors"
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => signIn()}
              className="w-full flex items-center justify-center gap-2 p-3 bg-primary text-white rounded-lg font-bold text-sm hover:opacity-90"
            >
              <LogIn size={16} />
              Se connecter
            </button>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden w-full">
        {/* Topbar */}
        <header className="h-16 bg-surface flex items-center justify-between px-6 border-b border-surface-border z-30">
          <div className="flex items-center gap-4">
             <button 
               onClick={() => setIsMenuOpen(true)}
               className="lg:hidden p-2 text-text-muted hover:text-cyan transition-colors"
             >
               <Terminal size={20} />
             </button>
             <div className="flex flex-col">
               <span className="text-[8px] text-text-dim uppercase tracking-[0.2em] font-mono">Passeport Actifs</span>
               <div className="flex items-center gap-2">
                 <span className="text-xs font-headline font-bold text-text">Souverain Ancré</span>
                 <span className="text-[9px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 border border-emerald-500/20 rounded">Certifié</span>
               </div>
             </div>
          </div>

          <div className="hidden lg:flex flex-1 justify-center px-10">
            <GlobalSearch />
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsDark(!isDark)}
              className="text-text-dim hover:text-primary p-2"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            
            <Link to="/profile" className="hidden sm:block btn-primary text-sm">
              Mon Profil
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto bg-bg p-6 md:p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
