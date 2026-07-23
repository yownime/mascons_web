'use client';

import React, { useState } from 'react';
import { Eye, Clock, User as UserIcon, X, Calendar, Mail, Fingerprint, Search } from 'lucide-react';

type Participant = {
  id: number;
  status: string;
  startedAt: Date | null;
  personalData: any;
  sessionTitle: string;
  userName: string;
  userEmail: string;
};

export default function ParticipantsList({ participants }: { participants: Participant[] }) {
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredParticipants = participants.filter(p => {
    const pd = p.personalData as any;
    const name = (pd?.name || p.userName).toLowerCase();
    const email = p.userEmail.toLowerCase();
    const query = searchQuery.toLowerCase();
    return name.includes(query) || email.includes(query);
  });

  return (
    <>
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Cari nama atau email partisipan..."
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredParticipants.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
            <UserIcon size={48} className="mx-auto text-slate-300 mb-4" />
            <p className="text-slate-500 font-medium text-lg">Tidak ada partisipan ditemukan.</p>
          </div>
        ) : filteredParticipants.map((p) => {
          const pd = p.personalData as any;
          const displayName = pd?.name || p.userName;

          return (
            <div 
              key={p.id} 
              className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 flex items-center justify-center font-bold text-lg mr-4">
                      {displayName[0].toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 transition-colors">
                        {displayName}
                      </h4>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <Mail size={12} /> {p.userEmail}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={p.status} />
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                    <Fingerprint size={14} className="mr-2 text-slate-400" />
                    <span className="font-medium mr-1">Session:</span> {p.sessionTitle}
                  </div>
                  <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                    <Clock size={14} className="mr-2 text-slate-400" />
                    <span className="font-medium mr-1">Mulai:</span> 
                    {p.startedAt ? new Date(p.startedAt).toLocaleTimeString() : 'Belum dimulai'}
                  </div>
                  {pd?.age && (
                    <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                      <Calendar size={14} className="mr-2 text-slate-400" />
                      <span className="font-medium mr-1">Usia:</span> {pd.age} Tahun
                    </div>
                  )}
                </div>
              </div>

              <button 
                onClick={() => setSelectedParticipant(p)}
                className="w-full py-3 bg-slate-50 dark:bg-slate-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold rounded-xl transition-all flex items-center justify-center gap-2 border border-transparent hover:border-indigo-100 dark:hover:border-indigo-900"
              >
                <Eye size={18} />
                Lihat Detail
              </button>
            </div>
          );
        })}
      </div>

      {/* Modal Detail Data Diri */}
      {selectedParticipant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md transition-opacity">
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-8 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Profil Partisipan</h3>
              <button 
                onClick={() => setSelectedParticipant(null)}
                className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-8 overflow-y-auto">
              <div className="flex items-center gap-6 mb-8 p-6 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-2xl">
                <div className="w-20 h-20 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-3xl font-bold shadow-lg shadow-indigo-200 dark:shadow-none">
                  {(selectedParticipant.personalData?.name?.[0] || selectedParticipant.userName[0]).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-bold text-2xl text-slate-800 dark:text-slate-100 leading-tight">
                    {selectedParticipant.personalData?.name || selectedParticipant.userName}
                  </h4>
                  <p className="text-indigo-600 dark:text-indigo-400 font-medium">{selectedParticipant.userEmail}</p>
                </div>
              </div>

              <div className="space-y-1">
                <DetailRow label="ID Partisipan" value={`#${selectedParticipant.id}`} />
                <DetailRow label="Nama Input" value={selectedParticipant.personalData?.name || '-'} />
                <DetailRow label="Usia" value={selectedParticipant.personalData?.age ? `${selectedParticipant.personalData.age} Tahun` : '-'} />
                <DetailRow label="Jenis Kelamin" value={selectedParticipant.personalData?.gender || '-'} />
                <DetailRow label="Sesi" value={selectedParticipant.sessionTitle} />
                <DetailRow label="Tanggal Mulai" value={selectedParticipant.startedAt ? new Date(selectedParticipant.startedAt).toLocaleString() : '-'} />
                
                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 block">Status Tes</span>
                  <StatusBadge status={selectedParticipant.status} size="lg" />
                </div>
              </div>
            </div>
            
            <div className="p-6 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 flex gap-3">
              <button 
                onClick={() => setSelectedParticipant(null)}
                className="flex-1 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl hover:bg-slate-50 transition-colors"
              >
                Tutup
              </button>
              <button 
                className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 dark:shadow-none"
              >
                Lihat Hasil Lengkap
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function DetailRow({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex justify-between items-center py-3 border-b border-slate-50 dark:border-slate-800/50 last:border-0">
      <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">{label}</span>
      <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">{value}</span>
    </div>
  );
}

function StatusBadge({ status, size = 'sm' }: { status: string, size?: 'sm' | 'lg' }) {
  const configs: Record<string, string> = {
    joined: 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800',
    in_progress: 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800',
    completed: 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800',
  };

  const labels: Record<string, string> = {
    joined: 'Tergabung',
    in_progress: 'Mengerjakan',
    completed: 'Selesai',
  };

  return (
    <span className={`inline-flex items-center ${size === 'lg' ? 'px-4 py-1.5 text-sm' : 'px-2.5 py-1 text-[10px]'} rounded-full font-bold border ${configs[status] || configs.joined}`}>
      {status === 'in_progress' && (
        <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-1.5 animate-pulse" />
      )}
      {labels[status] || status}
    </span>
  );
}
