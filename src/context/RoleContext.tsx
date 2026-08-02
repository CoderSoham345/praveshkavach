import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'RESIDENT' | 'SECURITY_GUARD' | 'ADMIN';

export interface DemoUser {
  id: string;
  name: string;
  role: UserRole;
  avatar: string;
  building?: string;
  flatNumber?: string;
}

interface RoleContextType {
  user: DemoUser | null;
  role: UserRole | null;
  setRole: (role: UserRole, userName: string) => void;
  logout: () => void;
  isInitialized: boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

// Demo users for each role
const DEMO_USERS: Record<UserRole, DemoUser> = {
  SECURITY_GUARD: {
    id: 'guard-1',
    name: 'Rajesh Patil',
    role: 'SECURITY_GUARD',
    avatar: '👮',
    building: 'Tower A',
  },
  RESIDENT: {
    id: 'resident-1',
    name: 'Soham Gonbhare',
    role: 'RESIDENT',
    avatar: '👨',
    building: 'Pravesh Residency',
    flatNumber: 'A-702',
  },
  ADMIN: {
    id: 'admin-1',
    name: 'System Administrator',
    role: 'ADMIN',
    avatar: '👔',
    building: 'All Buildings',
  },
};

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<DemoUser | null>(null);
  const [role, setRoleState] = useState<UserRole | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load role from localStorage on mount
  useEffect(() => {
    const storedRole = localStorage.getItem('selectedRole') as UserRole | null;
    const storedUserName = localStorage.getItem('userName');

    if (storedRole && storedUserName && DEMO_USERS[storedRole]) {
      const demoUser = { ...DEMO_USERS[storedRole], name: storedUserName };
      setUser(demoUser);
      setRoleState(storedRole);
      console.log('[v0] Role loaded from localStorage:', storedRole, 'User:', storedUserName);
    }

    setIsInitialized(true);
  }, []);

  const setRole = (newRole: UserRole, userName: string) => {
    const demoUser = { ...DEMO_USERS[newRole], name: userName };
    setUser(demoUser);
    setRoleState(newRole);
    localStorage.setItem('selectedRole', newRole);
    localStorage.setItem('userName', userName);
    console.log('[v0] Role set to:', newRole, 'User:', userName);
  };

  const logout = () => {
    setUser(null);
    setRoleState(null);
    localStorage.removeItem('selectedRole');
    localStorage.removeItem('userName');
    console.log('[v0] Logged out - role cleared');
  };

  return (
    <RoleContext.Provider
      value={{
        user,
        role,
        setRole,
        logout,
        isInitialized,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within RoleProvider');
  }
  return context;
}
