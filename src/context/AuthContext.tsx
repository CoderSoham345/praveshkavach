import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'RESIDENT' | 'SECURITY_GUARD' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Dummy users for testing
const DUMMY_USERS = {
  'resident@test.com': {
    id: 'resident-1',
    email: 'resident@test.com',
    password: 'Resident@123',
    name: 'Rajesh Sharma',
    role: 'RESIDENT' as UserRole,
    avatar: '👨',
  },
  'guard@test.com': {
    id: 'guard-1',
    email: 'guard@test.com',
    password: 'Guard@123',
    name: 'Priya Patel',
    role: 'SECURITY_GUARD' as UserRole,
    avatar: '👮',
  },
  'admin@test.com': {
    id: 'admin-1',
    email: 'admin@test.com',
    password: 'Admin@123',
    name: 'System Administrator',
    role: 'ADMIN' as UserRole,
    avatar: '👔',
  },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load session from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('praveshkavach_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('[v0] Failed to restore session:', error);
        localStorage.removeItem('praveshkavach_user');
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));

      const dummyUser = DUMMY_USERS[email as keyof typeof DUMMY_USERS];
      if (!dummyUser || dummyUser.password !== password) {
        throw new Error('Invalid email or password');
      }

      const newUser: User = {
        id: dummyUser.id,
        email: dummyUser.email,
        name: dummyUser.name,
        role: dummyUser.role,
        avatar: dummyUser.avatar,
      };

      setUser(newUser);
      localStorage.setItem('praveshkavach_user', JSON.stringify(newUser));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('praveshkavach_user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login,
      logout,
      isAuthenticated: !!user,
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
