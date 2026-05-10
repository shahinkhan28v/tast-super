import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  User, 
  signInWithPopup, 
  GoogleAuthProvider,
  signOut
} from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { auth, db } from './firebase';
import { UserProfile, AdminRecord, AdminPermission } from '../types';
import { processReferralOnSignup, getAdminByEmail } from './dataService';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  adminRecord: AdminRecord | null;
  loading: boolean;
  signIn: () => Promise<void>;
  logout: () => Promise<void>;
  hasPermission: (permission: AdminPermission) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [adminRecord, setAdminRecord] = useState<AdminRecord | null>(null);
  const [loading, setLoading] = useState(true);

  const SUPER_ADMIN_EMAIL = 'shahinkhan28v@gmail.com';

  useEffect(() => {
    let unsubProfile: (() => void) | null = null;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (unsubProfile) {
          unsubProfile();
          unsubProfile = null;
        }

        setUser(user);
        if (user) {
          const userRef = doc(db, 'users', user.uid);
          let userDoc;
          try {
            userDoc = await getDoc(userRef);
          } catch (err) {
            // If fetching profile fails (e.g. security rules), we still set user
            console.error("Profile fetch error:", err);
            setLoading(false);
            return;
          }
          
          // Check admin status
          const adminRec = await getAdminByEmail(user.email!);
          setAdminRecord(adminRec);

          const isSuperAdmin = user.email === SUPER_ADMIN_EMAIL;
          const isAdmin = isSuperAdmin || !!adminRec;
          
          if (!userDoc.exists()) {
            const newProfile: UserProfile = {
              uid: user.uid,
              name: user.displayName || 'User',
              email: user.email || '',
              points: 0,
              totalEarnings: 0,
              referralCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
              referredBy: null,
              joinedAt: new Date().toISOString(),
              profilePic: user.photoURL,
              paymentInfo: { method: '', details: '' },
              streak: 0,
              lastCheckIn: null,
              spins: 0,
              isAdmin: isAdmin,
              role: isSuperAdmin ? 'super_admin' : (adminRec ? 'admin' : 'user')
            };
            await setDoc(userRef, newProfile);

            // Process Referral
            const pendingReferral = sessionStorage.getItem('referralCode');
            if (pendingReferral) {
              await processReferralOnSignup(user.uid, pendingReferral);
              sessionStorage.removeItem('referralCode');
            }

            setProfile(newProfile);
          } else {
            const currentData = userDoc.data() as UserProfile;
            const targetRole = isSuperAdmin ? 'super_admin' : (adminRec ? 'admin' : 'user');
            
            if ((isAdmin && !currentData.isAdmin) || currentData.role !== targetRole) {
               const { updateDoc } = await import('firebase/firestore');
               await updateDoc(userRef, { 
                 isAdmin: true, 
                 role: targetRole
               });
            }
          }

          // Start profile listener
          unsubProfile = onSnapshot(userRef, (doc) => {
            if (doc.exists()) {
              setProfile(doc.data() as UserProfile);
            }
          }, (err) => console.error("Profile snapshot error:", err));
        } else {
          setProfile(null);
        }
      } catch (err) {
        console.error("Auth sync error:", err);
      } finally {
        setLoading(false);
      }
    });

    return () => {
      unsubscribe();
      if (unsubProfile) unsubProfile();
    };
  }, []);

  const signIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      // Force account selection to avoid issues with multiple accounts
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, provider);
      console.log("Sign in success:", result.user.email);
    } catch (err: any) {
      console.error("Sign in error detailed:", err);
      if (err.code === 'auth/popup-blocked') {
        throw new Error('Popup blocked by browser. Please enable popups for this site.');
      } else if (err.code === 'auth/unauthorized-domain') {
        throw new Error(`This domain (${window.location.hostname}) is not authorized. Please add "${window.location.hostname}" to "Authorized domains" in Firebase Console > Authentication > Settings.`);
      } else {
        throw err;
      }
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  const hasPermission = (permission: AdminPermission): boolean => {
    if (user?.email === SUPER_ADMIN_EMAIL) return true;
    if (!adminRecord) return false;
    if (adminRecord.role === 'super_admin') return true;
    return adminRecord.permissions.includes(permission);
  };

  return (
    <AuthContext.Provider value={{ user, profile, adminRecord, loading, signIn, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
