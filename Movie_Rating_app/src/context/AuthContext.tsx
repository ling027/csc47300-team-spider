import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface User {
  username: string;
  email: string;
  fullName: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Dummy account
const DUMMY_ACCOUNT = {
  username: 'demo',
  password: 'demo123',
  email: 'demo@example.com',
  fullName: 'Demo User'
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    // Check localStorage for persisted user
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch {
        return null;
      }
    }
    return null;
  });

  useEffect(() => {
    // Persist user to localStorage when it changes
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = (username: string, password: string): boolean => {
    if (username.toLowerCase() === DUMMY_ACCOUNT.username.toLowerCase() && password === DUMMY_ACCOUNT.password) {
      const userData: User = {
        username: DUMMY_ACCOUNT.username,
        email: DUMMY_ACCOUNT.email,
        fullName: DUMMY_ACCOUNT.fullName
      };
      setUser(userData);
      return true;
    }
    return false;
  };

  const logout = (): void => {
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

