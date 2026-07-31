import React, { useState } from 'react';
import { 
  Settings, 
  Building2, 
  ShieldCheck, 
  KeyRound, 
  Sliders, 
  FileText, 
  Users, 
  CheckCircle2, 
  Zap,
  Save,
  Server
} from 'lucide-react';
import { SystemBuilding, AuditLogItem } from '../types';

interface AdminSettingsProps {
  buildings: SystemBuilding[];
  auditLogs: AuditLogItem[];
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({ buildings, auditLogs }) => {
  const [autoApproveCourier, setAutoApproveCourier] = useState<boolean>(true);
  const [cameraAutoScan, setCameraAutoScan] = useState<boolean>(true);
  const [livenessThreshold, setLivenessThreshold] = useState<number>(85);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleSaveSettings = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Settings className="w-6 h-6 text-cyan-400" />
            <span>AegisPass Platform Administration</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure buildings, security rules, AI OCR parameters, and view system audit trails
          </p>
        </div>

        <button
          onClick={handleSaveSettings}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-xs shadow-lg flex items-center gap-2"
          id="btn-save-admin-settings"
        >
          <Save className="w-4 h-4" />
          <span>{savedSuccess ? 'Settings Saved! ✓' : 'Save Configuration'}</span>
        </button>
      </div>

      {/* Grid: Rules & AI Camera (Left) vs Buildings & Audit (Right) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Left Column: Gate Rules & AI Parameters */}
        <div className="md:col-span-6 space-y-6">
          
          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Visitor Approval Policy Rules</span>
            </h3>

            <div className="space-y-3 text-xs">
              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
                <div>
                  <p className="font-bold text-white">Auto-Approve Verified Couriers</p>
                  <p className="text-[11px] text-slate-400">Allow instant pass generation for trusted courier deliveries</p>
                </div>
                <input
                  type="checkbox"
                  checked={autoApproveCourier}
                  onChange={(e) => setAutoApproveCourier(e.target.checked)}
                  className="w-4 h-4 accent-cyan-400"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
                <div>
                  <p className="font-bold text-white">Camera Auto Capture & Edge Align</p>
                  <p className="text-[11px] text-slate-400">Automatically trigger countdown when ID card enters bounding box</p>
                </div>
                <input
                  type="checkbox"
                  checked={cameraAutoScan}
                  onChange={(e) => setCameraAutoScan(e.target.checked)}
                  className="w-4 h-4 accent-cyan-400"
                />
              </label>
            </div>
          </div>

          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
              <Sliders className="w-4 h-4 text-amber-400" />
              <span>Biometric & OCR Thresholds</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between font-bold text-slate-300 mb-1">
                  <span>Face Liveness Strictness Threshold</span>
                  <span className="text-cyan-400">{livenessThreshold}%</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="98"
                  value={livenessThreshold}
                  onChange={(e) => setLivenessThreshold(Number(e.target.value))}
                  className="w-full accent-cyan-400"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Buildings & Audit Logs */}
        <div className="md:col-span-6 space-y-6">
          
          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
              <Building2 className="w-4 h-4 text-cyan-400" />
              <span>Registered Buildings & Towers</span>
            </h3>

            <div className="space-y-2 text-xs">
              {buildings.map((b) => (
                <div key={b.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-white">{b.name} ({b.code})</p>
                    <p className="text-[11px] text-slate-400">Total Units: {b.totalUnits} • Manager: {b.managerName}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 font-bold text-[10px]">
                    {b.occupancyRate}% Occupied
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3 shadow-xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
              <FileText className="w-4 h-4 text-purple-400" />
              <span>Security Audit Logs</span>
            </h3>

            <div className="max-h-48 overflow-y-auto space-y-2 pr-1 custom-scrollbar text-xs">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                  <div className="flex justify-between font-mono text-[10px] text-slate-400">
                    <span className="text-cyan-400 font-bold">{log.action}</span>
                    <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-slate-200 text-[11px]">{log.details}</p>
                  <p className="text-[10px] text-slate-500">By: {log.performedBy} ({log.role})</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
