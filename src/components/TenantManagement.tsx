import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  Shield, 
  UserPlus, 
  Settings, 
  LogOut, 
  CheckCircle2,
  AlertCircle,
  Loader2,
  Building2,
  Globe
} from 'lucide-react';
import { useAuth } from './FirebaseProvider';
import { collection, query, getDocs, where, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { motion, AnimatePresence } from 'motion/react';

interface Tenant {
  id: string;
  name: string;
  ownerId: string;
  createdAt: string;
}

export default function TenantManagement() {
  const { user, tenantId, switchTenant, createTenant } = useAuth();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTenantName, setNewTenantName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTenants = async () => {
      if (!user) return;
      setLoading(true);
      try {
        // Find all tenants where user is a member
        const membershipsQuery = query(collection(db, 'tenants')); // In a real app, we'd query a user_tenants collection or similar
        // For this demo, we'll fetch all tenants and filter client-side (not production ready, but works for the prototype)
        // Ideally: query(collectionGroup(db, 'members'), where('userId', '==', user.uid))
        const querySnapshot = await getDocs(collection(db, 'tenants'));
        const tenantList: Tenant[] = [];
        
        for (const tenantDoc of querySnapshot.docs) {
          const memberDoc = await getDoc(doc(db, 'tenants', tenantDoc.id, 'members', user.uid));
          if (memberDoc.exists()) {
            tenantList.push({ id: tenantDoc.id, ...tenantDoc.data() } as Tenant);
          }
        }
        
        setTenants(tenantList);
      } catch (err) {
        console.error("Error fetching tenants:", err);
        setError("Impossible de charger les organisations.");
      } finally {
        setLoading(false);
      }
    };

    fetchTenants();
  }, [user, tenantId]);

  const handleCreateTenant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTenantName.trim()) return;
    
    setIsCreating(true);
    setError(null);
    try {
      await createTenant(newTenantName);
      setNewTenantName('');
      // Refresh will happen via useEffect dependency on tenantId
    } catch (err) {
      setError("Erreur lors de la création de l'organisation.");
    } finally {
      setIsCreating(false);
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b-4 border-surface-section pb-4">
        <h2 className="text-3xl font-headline font-black tracking-tight uppercase flex items-center gap-3">
          <Building2 size={24} className="text-primary" />
          Gestion des Organisations (Tenants)
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Create Tenant */}
        <div className="md:col-span-1">
          <div className="card p-6 border-4 border-surface-border sticky top-24">
            <h3 className="text-lg font-headline font-black uppercase mb-4 flex items-center gap-2">
              <Plus size={18} className="text-primary" />
              Nouvelle Organisation
            </h3>
            <form onSubmit={handleCreateTenant} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-text-muted mb-2">Nom de l'entité</label>
                <input 
                  type="text" 
                  value={newTenantName}
                  onChange={(e) => setNewTenantName(e.target.value)}
                  className="w-full bg-surface-section border-2 border-surface-border p-3 text-sm font-bold focus:outline-none focus:border-primary transition-colors"
                  placeholder="ex: Acme Corp, Freelance Network..."
                  required
                />
              </div>
              <button 
                type="submit" 
                disabled={isCreating || !newTenantName.trim()}
                className="w-full bg-primary text-surface py-3 text-xs font-black uppercase tracking-widest hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isCreating ? <Loader2 className="animate-spin" size={14} /> : <Plus size={14} />}
                Créer l'organisation
              </button>
              {error && (
                <div className="p-3 bg-error/10 border border-error/20 rounded text-[10px] font-bold text-error flex items-center gap-2">
                  <AlertCircle size={14} />
                  {error}
                </div>
              )}
            </form>
            <div className="mt-6 p-4 bg-info/5 border-l-4 border-info rounded-r-xl">
              <p className="text-[10px] font-medium leading-relaxed">
                <Globe size={12} className="inline mr-1 mb-0.5" />
                Les organisations permettent d'isoler vos données. Seuls les membres d'une organisation peuvent voir les profils et réalisations qui y sont rattachés.
              </p>
            </div>
          </div>
        </div>

        {/* Tenant List */}
        <div className="md:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black uppercase tracking-widest text-text-muted">Vos Organisations Actives</h3>
            <span className="badge">{tenants.length} Entités</span>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 space-y-4 card border-4 border-dashed border-surface-section">
              <Loader2 className="animate-spin text-primary" size={40} />
              <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Chargement de l'infrastructure...</p>
            </div>
          ) : tenants.length > 0 ? (
            <div className="grid gap-4">
              <AnimatePresence mode="popLayout">
                {tenants.map((t) => (
                  <motion.div 
                    key={t.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`card p-6 border-2 transition-all group ${
                      tenantId === t.id 
                        ? 'border-primary bg-primary/5 ring-4 ring-primary/5' 
                        : 'border-surface-border hover:border-primary/30'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${tenantId === t.id ? 'bg-primary text-surface' : 'bg-surface-section text-text-muted'}`}>
                          <Building2 size={24} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xl font-headline font-black">{t.name}</h4>
                            {t.ownerId === user.uid && (
                              <span className="text-[8px] font-black uppercase tracking-widest bg-primary/10 text-primary px-1.5 py-0.5 border border-primary/20 rounded">Propriétaire</span>
                            )}
                          </div>
                          <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">ID: {t.id}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        {tenantId === t.id ? (
                          <div className="flex items-center gap-2 px-4 py-2 bg-success/10 text-success border border-success/20 rounded-lg">
                            <CheckCircle2 size={16} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Actif</span>
                          </div>
                        ) : (
                          <button 
                            onClick={() => switchTenant(t.id)}
                            className="px-6 py-2 bg-surface text-primary border-2 border-primary text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-surface transition-all"
                          >
                            Rejoindre
                          </button>
                        )}
                        <button className="p-2 text-text-muted hover:text-primary transition-colors">
                          <Settings size={18} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="p-24 border-4 border-dashed border-surface-section text-center rounded-[2rem]">
              <Users size={48} className="mx-auto text-surface-section mb-4" />
              <p className="text-text-muted font-black uppercase tracking-widest">Vous n'appartenez à aucune organisation</p>
              <p className="text-[10px] font-bold text-text-muted mt-2">Créez votre première entité pour commencer à isoler vos preuves.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
