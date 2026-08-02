import React from 'react';
import { useRole } from './context/RoleContext';
import { RoleSelectionPage } from './pages/RoleSelectionPage';
import { SecurityGuardWorkflow } from './pages/SecurityGuardWorkflow';
import { ResidentDashboardPage } from './pages/ResidentDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

export default function App() {
  const { role, user, isInitialized, setRole } = useRole();

  // Still initializing
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading...</p>
        </div>
      </div>
    );
  }

  // No role selected - show role selection
  if (!role || !user) {
    return <RoleSelectionPage onRoleSelected={(selection) => setRole(selection.role, selection.userName)} />;
  }

  console.log('[v0] App routing - user role:', role, 'name:', user.name);

  // Route based on role
  switch (role) {
    case 'SECURITY_GUARD':
      return <SecurityGuardWorkflow />;
    
    case 'RESIDENT':
      return <ResidentDashboardPage />;
    
    case 'ADMIN':
      return <AdminDashboardPage />;
    
    default:
      return <RoleSelectionPage onRoleSelected={(selection) => setRole(selection.role, selection.userName)} />;
  }
}
