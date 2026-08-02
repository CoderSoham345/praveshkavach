import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'RESIDENT' | 'SECURITY_GUARD' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  residencyId?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  sessionToken: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionToken, setSessionToken] = useState<string | null>(null);

  // Load session from sessionStorage on mount (sessionStorage is more secure than localStorage)
  useEffect(() => {
    const storedUser = sessionStorage.getItem('praveshkavach_user');
    const storedToken = sessionStorage.getItem('praveshkavach_token');
    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setSessionToken(storedToken);
      } catch (error) {
        console.error('[v0] Failed to restore session:', error);
        sessionStorage.removeItem('praveshkavach_user');
        sessionStorage.removeItem('praveshkavach_token');
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Make API call to backend for authentication
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      
      if (!data.success || !data.user || !data.token) {
        throw new Error('Invalid response from server');
      }

      const newUser: User = {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        role: data.user.role,
        avatar: data.user.avatar,
        residencyId: data.user.residencyId,
      };

      setUser(newUser);
      setSessionToken(data.token);
      
      // Store in sessionStorage (not localStorage for better security)
      sessionStorage.setItem('praveshkavach_user', JSON.stringify(newUser));
      sessionStorage.setItem('praveshkavach_token', data.token);
      
      // Also set auth header for future API calls
      (window as any).__authToken = data.token;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setSessionToken(null);
    sessionStorage.removeItem('praveshkavach_user');
    sessionStorage.removeItem('praveshkavach_token');
    delete (window as any).__authToken;
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login,
      logout,
      isAuthenticated: !!user,
      sessionToken,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
