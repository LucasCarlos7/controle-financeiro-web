import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import {
  AUTH_UNAUTHORIZED_EVENT,
  clearStoredAuth,
  getStoredAuth,
  isTokenExpired,
  setStoredAuth,
  type StoredAuth,
} from '../../../shared/lib/authStorage';

interface AuthContextValue {
  user: StoredAuth | null;
  isAuthenticated: boolean;
  signIn: (auth: StoredAuth) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function readInitialAuth(): StoredAuth | null {
  const stored = getStoredAuth();
  if (!stored) return null;
  if (isTokenExpired(stored.token)) {
    clearStoredAuth();
    return null;
  }
  return stored;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<StoredAuth | null>(readInitialAuth);

  useEffect(() => {
    function handleUnauthorized() {
      setUser(null);
    }
    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);
    return () => window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);
  }, []);

  function signIn(auth: StoredAuth) {
    setStoredAuth(auth);
    setUser(auth);
  }

  function signOut() {
    clearStoredAuth();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: user !== null, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return context;
}
