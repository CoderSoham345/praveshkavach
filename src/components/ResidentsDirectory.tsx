import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Building2, 
  Phone, 
  Mail, 
  CheckCircle2, 
  Zap, 
  UserPlus, 
  Home
} from 'lucide-react';
import { Resident } from '../types';

interface ResidentsDirectoryProps {
  residents: Resident[];
  onSelectResidentToInvite?: (resident: Resident) => void;
}

export const ResidentsDirectory: React.FC<ResidentsDirectoryProps> = ({
  residents,
  onSelectResidentToInvite,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedBuilding, setSelectedBuilding] = useState<string>('ALL');

  const filtered = residents.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.flatNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.phone.includes(searchTerm) ||
      r.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesBuilding =
      selectedBuilding === 'ALL' || r.building.includes(selectedBuilding);

    return matchesSearch && matchesBuilding;
  });

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-cyan-400" />
            <span>Residents & Facility Directory</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Search residents across Tower A, Tower B, and Corporate Suites
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-slate-900 p-4 rounded-xl border border-slate-800">
        <div className="sm:col-span-8 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search resident name, flat number, phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
            id="input-search-residents"
          />
        </div>

        <div className="sm:col-span-4">
          <select
            value={selectedBuilding}
            onChange={(e) => setSelectedBuilding(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-semibold text-white focus:border-cyan-400 focus:outline-none"
            id="select-building-filter"
          >
            <option value="ALL">All Towers / Buildings</option>
            <option value="Tower A">Tower A - Apex Heights</option>
            <option value="Tower B">Tower B - Zenith Park</option>
            <option value="Tower C">Tower C - Corporate Suite</option>
          </select>
        </div>
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((res) => (
          <div
            key={res.id}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 transition-all shadow-lg space-y-4 flex flex-col justify-between"
          >
            <div className="flex items-start gap-3.5">
              {res.avatarUrl ? (
                <img src={res.avatarUrl} alt={res.name} className="w-12 h-12 rounded-full object-cover border-2 border-cyan-400 shrink-0" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center font-bold text-cyan-400 text-base shrink-0">
                  {res.name[0]}
                </div>
              )}

              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-base text-white truncate">{res.name}</h3>
                <p className="text-xs font-bold text-cyan-400 flex items-center gap-1 mt-0.5">
                  <Home className="w-3.5 h-3.5" /> {res.flatNumber} • {res.building}
                </p>
                {res.department && (
                  <p className="text-[11px] text-slate-400 mt-1">{res.department}</p>
                )}
              </div>
            </div>

            {/* Contact Details */}
            <div className="space-y-1.5 text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{res.phone}</span>
              </div>
              <div className="flex items-center gap-2 truncate">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{res.email}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-1">
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${
                res.autoApproveGuests 
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-slate-800 text-slate-400'
              }`}>
                <Zap className="w-3 h-3" />
                <span>{res.autoApproveGuests ? 'Auto-Approve Delivery' : 'Standard Security'}</span>
              </span>

              {onSelectResidentToInvite && (
                <button
                  onClick={() => onSelectResidentToInvite(res)}
                  className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-bold border border-cyan-500/30 transition-colors"
                  id={`btn-invite-resident-${res.id}`}
                >
                  Select Host
                </button>
              )}
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
