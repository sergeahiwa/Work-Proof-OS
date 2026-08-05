import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { tracker } from '../lib/internal-tracking';
import { ensureTrustFactors, DEFAULT_TRUST_FACTORS } from '../core/dataIntegrity';

interface AuthContextType {
  user: User | null;
  profile: any | null;
  tenantId: string | null;
  loading: boolean;
  signIn: () => Promise<void>;
  logout: () => Promise<void>;
  switchTenant: (tid: string) => Promise<void>;
  createTenant: (name: string) => Promise<string>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const switchTenant = async (tid: string) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, 'users', user.uid), { tenantId: tid });
      setTenantId(tid);
      tracker.setTenant(tid);
    } catch (error) {
      console.error("Error switching tenant:", error);
    }
  };

  const createTenant = async (name: string): Promise<string> => {
    if (!user) throw new Error("User not authenticated");
    const tid = `tenant_${Date.now()}`;
    const tenantData = {
      id: tid,
      name,
      ownerId: user.uid,
      createdAt: new Date().toISOString()
    };
    await setDoc(doc(db, 'tenants', tid), tenantData);
    await setDoc(doc(db, 'tenants', tid, 'members', user.uid), {
      role: 'owner',
      joinedAt: new Date().toISOString()
    });
    await switchTenant(tid);
    return tid;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        setUser(user);
        if (user) {
          let userDoc = null;
          try {
            userDoc = await getDoc(doc(db, 'users', user.uid));
          } catch (docError) {
            console.warn("Could not fetch user profile from Firestore (offline or network error):", docError);
          }

          if (userDoc && userDoc.exists()) {
            const data = userDoc.data();
            const normalized = ensureTrustFactors({ ...data, id: user.uid });
            
            // If normalization changed something, update Firestore (lazy migration)
            if (JSON.stringify(normalized.trustFactors) !== JSON.stringify(data.trustFactors)) {
              try {
                await updateDoc(doc(db, 'users', user.uid), {
                  trustFactors: normalized.trustFactors,
                  isNormalized: true
                });
              } catch (updateErr) {
                console.warn("Unable to sync normalized trust factors to Firestore (offline):", updateErr);
              }
            }

            setProfile(normalized);
            const tid = data.tenantId || 'default_tenant';
            setTenantId(tid);
            tracker.setTenant(tid);
          } else if (userDoc && !userDoc.exists()) {
            // User doc explicitly does not exist in Firestore -> Create initial profile
            const tid = 'default_tenant';
            const initialProfile = {
              uid: user.uid,
              tenantId: tid,
              name: user.displayName || 'Utilisateur',
              email: user.email,
              role: 'Utilisateur',
              avatar: user.photoURL || `https://i.pravatar.cc/150?u=${user.uid}`,
              impactScore: 0,
              marketTrustIndex: 0,
              identityStatus: 'unverified',
              trustFactors: { ...DEFAULT_TRUST_FACTORS },
              isNormalized: true,
              createdAt: new Date().toISOString()
            };
            try {
              await setDoc(doc(db, 'users', user.uid), initialProfile);
            } catch (setErr) {
              console.warn("Unable to save initial profile to Firestore (offline):", setErr);
            }
            setProfile(initialProfile);
            setTenantId(tid);
            tracker.setTenant(tid);
          } else {
            // Offline/Network fallback: profile could not be loaded from Firestore
            const tid = 'default_tenant';
            const fallbackProfile = {
              uid: user.uid,
              tenantId: tid,
              name: user.displayName || 'Utilisateur',
              email: user.email,
              role: 'Utilisateur',
              avatar: user.photoURL || `https://i.pravatar.cc/150?u=${user.uid}`,
              impactScore: 0,
              marketTrustIndex: 0,
              identityStatus: 'unverified',
              trustFactors: { ...DEFAULT_TRUST_FACTORS },
              isNormalized: true,
              createdAt: new Date().toISOString()
            };
            setProfile(fallbackProfile);
            setTenantId(tid);
            tracker.setTenant(tid);
          }
        } else {
          setProfile(null);
          setTenantId(null);
        }
      } catch (error) {
        console.error("Error in auth state change handler:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, tenantId, loading, signIn, logout, switchTenant, createTenant }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a FirebaseProvider');
  }
  return context;
};
