import React, { useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { DashboardLayout } from './pages/DashboardLayout';

/**
 * PraveshKavach™ Phase 2 - Enterprise Application
 * 
 * Features:
 * - Role-based authentication (RESIDENT, SECURITY_GUARD, ADMIN)
 * - Three separate dashboards based on user role
 * - Enterprise AI chatbot with context awareness
 * - Professional glassmorphism UI
 * - Session management and logout
 */
export default function AppPhase2() {
  const { isAuthenticated } = useAuth();

  // Handle session expiry
  useEffect(() => {
    const sessionTimeout = setTimeout(() => {
      // Session timeout after 30 minutes of inactivity
      // This would be implemented with activity tracking
    }, 30 * 60 * 1000);

    return () => clearTimeout(sessionTimeout);
  }, []);

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return <DashboardLayout />;
}
