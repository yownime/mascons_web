'use client';

import React, { useState } from 'react';
import { Eye, Clock, User as UserIcon, X, Calendar, Mail, Fingerprint, Search } from 'lucide-react';
import { useParams } from 'next/navigation';

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
  const params = useParams();

  const filteredParticipants = participants.filter(p => {
    const pd = p.personalData as any;
    const name = (pd?.name || p.userName).toLowerCase();
    const email = p.userEmail.toLowerCase();
    const query = searchQuery.toLowerCase();
    return name.includes(query) || email.includes(query);
  });

  return (
    <>
      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2"
            size={17}
            style={{ color: '#94a3b8' }}
          />
          <input
            type="text"
            placeholder="Cari nama atau email partisipan..."
            className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm transition-all duration-200"
            style={{
              background: '#fff',
              border: '1px solid rgba(29,78,216,0.1)',
              boxShadow: '0 2px 15px rgba(29,78,216,0.04)',
              color: '#0a1628',
              outline: 'none',
            }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'rgba(37,99,235,0.3)';
              e.currentTarget.style.boxShadow = '0 2px 20px rgba(37,99,235,0.1)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'rgba(29,78,216,0.1)';
              e.currentTarget.style.boxShadow = '0 2px 15px rgba(29,78,216,0.04)';
            }}
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredParticipants.length === 0 ? (
          <div
            className="col-span-full py-20 text-center rounded-2xl"
            style={{
              background: '#fff',
              border: '2px dashed rgba(29,78,216,0.1)',
            }}
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: 'rgba(29,78,216,0.06)' }}
            >
              <UserIcon size={28} style={{ color: '#94a3b8' }} />
            </div>
            <p className="font-semibold text-base" style={{ color: '#94a3b8' }}>Tidak ada partisipan ditemukan.</p>
            <p className="text-xs mt-1" style={{ color: '#cbd5e1' }}>Coba kata kunci pencarian lain</p>
          </div>
        ) : filteredParticipants.map((p) => {
          const pd = p.personalData as any;
          const displayName = pd?.name || p.userName;

          return (
            <div 
              key={p.id} 
              className="group rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex flex-col justify-between"
              style={{
                background: '#fff',
                border: '1px solid rgba(29,78,216,0.08)',
                boxShadow: '0 2px 20px rgba(29,78,216,0.04)',
              }}
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm mr-3 transition-transform duration-300 group-hover:scale-110"
                      style={{
                        background: 'linear-gradient(135deg, #1d4ed8, #0ea5e9)',
                        color: '#fff',
                        boxShadow: '0 4px 12px rgba(29,78,216,0.25)',
                      }}
                    >
                      {displayName[0].toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm" style={{ color: '#0a1628' }}>
                        {displayName}
                      </h4>
                      <p className="text-[11px] flex items-center gap-1" style={{ color: '#94a3b8' }}>
                        <Mail size={11} /> {p.userEmail}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={p.status} />
                </div>

                <div className="space-y-2.5 mb-5">
                  <div className="flex items-center text-sm" style={{ color: '#475569' }}>
                    <Fingerprint size={14} className="mr-2" style={{ color: '#94a3b8' }} />
                    <span className="font-medium mr-1" style={{ color: '#64748b' }}>Sesi:</span> {p.sessionTitle}
                  </div>
                  <div className="flex items-center text-sm" style={{ color: '#475569' }}>
                    <Clock size={14} className="mr-2" style={{ color: '#94a3b8' }} />
                    <span className="font-medium mr-1" style={{ color: '#64748b' }}>Mulai:</span> 
                    {p.startedAt ? new Date(p.startedAt).toLocaleTimeString() : 'Belum dimulai'}
                  </div>
                  {pd?.age && (
                    <div className="flex items-center text-sm" style={{ color: '#475569' }}>
                      <Calendar size={14} className="mr-2" style={{ color: '#94a3b8' }} />
                      <span className="font-medium mr-1" style={{ color: '#64748b' }}>Usia:</span> {pd.age} Tahun
                    </div>
                  )}
                </div>
              </div>

              <button 
                onClick={() => setSelectedParticipant(p)}
                className="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:-translate-y-0.5 flex items-center justify-center gap-2"
                style={{
                  background: 'rgba(29,78,216,0.05)',
                  border: '1px solid rgba(29,78,216,0.1)',
                  color: '#2563eb',
                }}
              >
                <Eye size={16} />
                Lihat Detail
              </button>
            </div>
          );
        })}
      </div>

      {/* Modal Detail Data Diri */}
      {selectedParticipant && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity"
          style={{ background: 'rgba(10,22,40,0.6)', backdropFilter: 'blur(12px)' }}
        >
          <div
            className="w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
            style={{
              background: '#fff',
              borderRadius: '1.5rem',
              boxShadow: '0 25px 80px rgba(29,78,216,0.2)',
              border: '1px solid rgba(29,78,216,0.1)',
            }}
          >
            {/* Modal Header */}
            <div
              className="flex items-center justify-between px-8 py-6"
              style={{ borderBottom: '1px solid rgba(29,78,216,0.08)' }}
            >
              <h3 className="text-xl font-extrabold tracking-tight" style={{ color: '#0a1628' }}>
                Profil Partisipan
              </h3>
              <button 
                onClick={() => setSelectedParticipant(null)}
                className="p-2 rounded-xl transition-all duration-200 hover:scale-110"
                style={{
                  background: 'rgba(29,78,216,0.06)',
                  color: '#64748b',
                }}
              >
                <X size={18} />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="px-8 py-6 overflow-y-auto">
              {/* Profile card */}
              <div
                className="flex items-center gap-5 mb-8 p-5 rounded-2xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(29,78,216,0.04), rgba(14,165,233,0.04))',
                  border: '1px solid rgba(29,78,216,0.08)',
                }}
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold flex-shrink-0"
                  style={{
                    background: 'linear-gradient(135deg, #1d4ed8, #0ea5e9)',
                    color: '#fff',
                    boxShadow: '0 8px 25px rgba(29,78,216,0.3)',
                  }}
                >
                  {(selectedParticipant.personalData?.name?.[0] || selectedParticipant.userName[0]).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-bold text-xl leading-tight" style={{ color: '#0a1628' }}>
                    {selectedParticipant.personalData?.name || selectedParticipant.userName}
                  </h4>
                  <p className="text-sm mt-0.5" style={{ color: '#64748b' }}>
                    {selectedParticipant.userEmail}
                  </p>
                </div>
              </div>

              {/* Detail rows */}
              <div className="space-y-0">
                <DetailRow label="ID Partisipan" value={`#${selectedParticipant.id}`} />
                <DetailRow label="Nama Input" value={selectedParticipant.personalData?.name || '-'} />
                <DetailRow label="Usia" value={selectedParticipant.personalData?.age ? `${selectedParticipant.personalData.age} Tahun` : '-'} />
                <DetailRow label="Jenis Kelamin" value={selectedParticipant.personalData?.gender || '-'} />
                <DetailRow label="Sesi" value={selectedParticipant.sessionTitle} />
                <DetailRow label="Tanggal Mulai" value={selectedParticipant.startedAt ? new Date(selectedParticipant.startedAt).toLocaleString() : '-'} />
                
                <div className="mt-6 pt-5" style={{ borderTop: '1px solid rgba(29,78,216,0.08)' }}>
                  <span
                    className="text-[10px] font-bold uppercase tracking-[0.15em] mb-3 block"
                    style={{ color: '#94a3b8' }}
                  >
                    Status Tes
                  </span>
                  <StatusBadge status={selectedParticipant.status} size="lg" />
                </div>
              </div>
            </div>
            
            {/* Modal Footer */}
            <div
              className="px-8 py-5 flex gap-3"
              style={{
                background: 'rgba(29,78,216,0.02)',
                borderTop: '1px solid rgba(29,78,216,0.06)',
              }}
            >
              <button 
                onClick={() => setSelectedParticipant(null)}
                className="flex-1 py-3 font-bold text-sm rounded-xl transition-all duration-200"
                style={{
                  background: '#fff',
                  border: '1px solid rgba(29,78,216,0.1)',
                  color: '#475569',
                }}
              >
                Tutup
              </button>
              {selectedParticipant.status === 'completed' && (
                <a 
                  href={`/api/reports/${params.testType}/${selectedParticipant.id}`}
                  target="_blank"
                  className="flex-1 py-3 font-bold text-sm rounded-xl transition-all duration-200 text-center flex items-center justify-center hover:-translate-y-0.5"
                  style={{
                    background: 'linear-gradient(135deg, #1d4ed8, #0ea5e9)',
                    color: '#fff',
                    boxShadow: '0 4px 15px rgba(29,78,216,0.3)',
                  }}
                >
                  <Eye size={16} className="mr-2" />
                  Lihat Hasil Lengkap
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function DetailRow({ label, value }: { label: string, value: string }) {
  return (
    <div
      className="flex justify-between items-center py-3"
      style={{ borderBottom: '1px solid rgba(29,78,216,0.04)' }}
    >
      <span className="text-sm font-medium" style={{ color: '#94a3b8' }}>{label}</span>
      <span className="font-bold text-sm" style={{ color: '#0a1628' }}>{value}</span>
    </div>
  );
}

function StatusBadge({ status, size = 'sm' }: { status: string, size?: 'sm' | 'lg' }) {
  const configs: Record<string, { bg: string; color: string; dotColor: string }> = {
    joined: { bg: 'rgba(37,99,235,0.08)', color: '#2563eb', dotColor: '#3b82f6' },
    in_progress: { bg: 'rgba(245,158,11,0.08)', color: '#d97706', dotColor: '#f59e0b' },
    completed: { bg: 'rgba(16,185,129,0.08)', color: '#059669', dotColor: '#10b981' },
  };

  const labels: Record<string, string> = {
    joined: 'Tergabung',
    in_progress: 'Mengerjakan',
    completed: 'Selesai',
  };

  const config = configs[status] || configs.joined;

  return (
    <span
      className={`inline-flex items-center gap-1.5 ${size === 'lg' ? 'px-3.5 py-1.5 text-sm' : 'px-2.5 py-1 text-[10px]'} rounded-full font-bold`}
      style={{ background: config.bg, color: config.color }}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${status === 'in_progress' ? 'animate-pulse' : ''}`}
        style={{ background: config.dotColor }}
      />
      {labels[status] || status}
    </span>
  );
}
