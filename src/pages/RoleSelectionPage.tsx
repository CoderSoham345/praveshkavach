import React, { useState } from 'react';
import { Shield, Home, Settings, ArrowRight } from 'lucide-react';

export interface RoleSelection {
  role: 'SECURITY_GUARD' | 'RESIDENT' | 'ADMIN';
  userName: string;
}

interface RoleCard {
  role: 'SECURITY_GUARD' | 'RESIDENT' | 'ADMIN';
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonText: string;
  userName: string;
}

export function RoleSelectionPage({ onRoleSelected }: { onRoleSelected: (role: RoleSelection) => void }) {
  const [selectedRole, setSelectedRole] = useState<RoleSelection | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const roles: RoleCard[] = [
    {
      role: 'SECURITY_GUARD',
      icon: <Shield className="w-12 h-12" />,
      title: 'Security Guard',
      description: 'Manage visitor entry, document scanning, face verification, and visitor check-in.',
      buttonText: 'Enter Security Dashboard',
      userName: 'Rajesh Patil',
    },
    {
      role: 'RESIDENT',
      icon: <Home className="w-12 h-12" />,
      title: 'Resident',
      description: 'Receive visitor approval requests, approve or reject visitors, view visitor history, and manage family members.',
      buttonText: 'Enter Resident Dashboard',
      userName: 'Soham Gonbhare',
    },
    {
      role: 'ADMIN',
      icon: <Settings className="w-12 h-12" />,
      title: 'System Administrator',
      description: 'Manage buildings, residents, security guards, OCR settings, Telegram integration, analytics, chatbot configuration, and system policies.',
      buttonText: 'Enter Admin Dashboard',
      userName: 'System Administrator',
    },
  ];

  const handleRoleSelect = (roleCard: RoleCard) => {
    setIsLoading(true);
    setSelectedRole({
      role: roleCard.role,
      userName: roleCard.userName,
    });
    
    // Store in localStorage
    localStorage.setItem('selectedRole', roleCard.role);
    localStorage.setItem('userName', roleCard.userName);
    
    // Trigger the callback
    setTimeout(() => {
      onRoleSelected({
        role: roleCard.role,
        userName: roleCard.userName,
      });
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center p-4">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
          PraveshKavach™
        </h1>
        <p className="text-xl text-slate-300">
          Enterprise Visitor Management System
        </p>
        <p className="text-slate-400 mt-4">
          Select your role to continue
        </p>
      </div>

      {/* Role Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full mb-8">
        {roles.map((roleCard) => (
          <div
            key={roleCard.role}
            onClick={() => handleRoleSelect(roleCard)}
            className={`
              p-8 rounded-lg border-2 cursor-pointer transition-all duration-300
              ${
                selectedRole?.role === roleCard.role
                  ? 'border-cyan-400 bg-cyan-400/10 shadow-lg shadow-cyan-400/20'
                  : 'border-slate-700 bg-slate-800/50 hover:border-cyan-400/50 hover:bg-slate-800/80'
              }
            `}
          >
            {/* Icon */}
            <div className="text-cyan-400 mb-4">{roleCard.icon}</div>

            {/* Title */}
            <h2 className="text-xl font-bold text-white mb-3">
              {roleCard.title}
            </h2>

            {/* Description */}
            <p className="text-slate-300 text-sm mb-6 leading-relaxed">
              {roleCard.description}
            </p>

            {/* User Name */}
            <p className="text-xs text-slate-400 mb-4 font-mono">
              Demo User: {roleCard.userName}
            </p>

            {/* Button */}
            <button
              disabled={isLoading && selectedRole?.role === roleCard.role}
              className={`
                w-full py-2 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all
                ${
                  selectedRole?.role === roleCard.role && isLoading
                    ? 'bg-cyan-500 text-white opacity-75'
                    : 'bg-cyan-500 text-white hover:bg-cyan-600'
                }
              `}
            >
              {selectedRole?.role === roleCard.role && isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Loading...
                </>
              ) : (
                <>
                  {roleCard.buttonText}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="text-center text-slate-500 text-sm">
        <p>No authentication required for demo • All modules enabled</p>
      </div>
    </div>
  );
}
