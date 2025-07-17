
'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getAuth, onAuthStateChanged, User, signOut } from 'firebase/auth';
import { app } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

const ADMIN_EMAIL = "admin@gmail.com";

// Username mapping for emails
const EMAIL_TO_USERNAME: { [key: string]: string } = {
  "admin@gmail.com": "Admin",
  "tce@gmail.com": "TCE",
  "tca@gmail.com": "TCARTS",
  "tmill@gmail.com": "TMILLS"
};

// Helper function to get username from email
export const getUsernameFromEmail = (email: string | null | undefined): string => {
  if (!email) return "Unknown";
  return EMAIL_TO_USERNAME[email] || "Unknown";
};

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  logout: () => void;
  username: string;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  loading: true,
  logout: () => {},
  username: "Unknown",
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth(app);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  const logout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  const isAdmin = user?.email === ADMIN_EMAIL;
  const username = getUsernameFromEmail(user?.email);

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, logout, username }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: { adminOnly?: boolean } = {}
) {
  const WithAuthComponent = (props: P) => {
    const { user, loading, isAdmin } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (loading) return;

      if (!user) {
        router.replace('/login');
        return;
      }

      if (options.adminOnly && !isAdmin) {
        router.replace('/'); 
      }
    }, [user, loading, isAdmin, router]);

    if (loading || !user || (options.adminOnly && !isAdmin)) {
      return (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };

  WithAuthComponent.displayName = `WithAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return WithAuthComponent;
}
