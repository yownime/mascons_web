import React from 'react';
import { db } from '@/app/lib/db';
import { testSessions } from '@/db/schema';
import { desc } from 'drizzle-orm';
import { createSession } from './actions';
import { Plus, Power, Copy, Trash2, ClipboardList, Activity, Search, Filter } from 'lucide-react';

export default async function SessionsPage() {
  const sessions = await db.query.testSessions.findMany({
    orderBy: [desc(testSessions.createdAt)],
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight" style={{ color: '#0a1628' }}>
            Sesi Tes
          </h2>
          <p className="text-sm mt-1" style={{ color: '#64748b' }}>
            Kelola kode akses dan sesi tes untuk partisipan.
          </p>
        </div>
      </div>

      {/* Quick Create Form */}
      <div
        className="p-6 rounded-2xl"
        style={{
          background: '#fff',
          border: '1px solid rgba(29,78,216,0.08)',
          boxShadow: '0 2px 20px rgba(29,78,216,0.04)',
        }}
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 rounded-lg" style={{ background: 'rgba(37,99,235,0.08)' }}>
            <Plus size={16} style={{ color: '#2563eb' }} />
          </div>
          <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: '#64748b' }}>
            Buat Sesi Baru
          </h3>
        </div>
        <form action={createSession} className="flex gap-3 flex-wrap">
          <input 
            name="title" 
            placeholder="Judul Sesi (contoh: Hiring Batch A)" 
            className="flex-1 min-w-[220px] px-4 py-2.5 rounded-xl text-sm transition-all duration-200"
            style={{
              background: 'rgba(29,78,216,0.03)',
              border: '1px solid rgba(29,78,216,0.1)',
              color: '#0a1628',
              outline: 'none',
            }}
            required
          />
          <input 
            name="accessCode" 
            placeholder="Kode Akses (Opsional)" 
            className="w-48 px-4 py-2.5 rounded-xl text-sm transition-all duration-200"
            style={{
              background: 'rgba(29,78,216,0.03)',
              border: '1px solid rgba(29,78,216,0.1)',
              color: '#0a1628',
              outline: 'none',
            }}
          />
          <select 
            name="testType"
            className="px-4 py-2.5 rounded-xl text-sm transition-all duration-200"
            style={{
              background: 'rgba(29,78,216,0.03)',
              border: '1px solid rgba(29,78,216,0.1)',
              color: '#0a1628',
              outline: 'none',
            }}
            required
          >
            <option value="all">Semua Tes (Multi-Test)</option>
            <option value="cpm">CPM (IQ)</option>
            <option value="cfit_skala2">CFIT Skala 2 (Test 1–4)</option>
            <option value="cfit_skala3">CFIT Skala 3 (Test 5–8)</option>
            <option value="tiu">TIU / Inteligensi Umum</option>
            <option value="bakum">BAKUM (Bakat)</option>
            <option value="epps">EPPS (Minat)</option>
            <option value="minat_jabatan">Minat Jabatan</option>
            <option value="kraepelin">Kraepelin</option>
          </select>
          <button 
            type="submit"
            className="px-6 py-2.5 rounded-xl font-semibold text-sm text-white transition-all duration-200 hover:-translate-y-0.5 flex items-center gap-2"
            style={{
              background: 'linear-gradient(135deg, #1d4ed8, #0ea5e9)',
              boxShadow: '0 4px 15px rgba(29,78,216,0.3)',
            }}
          >
            <Plus size={16} />
            Buat Sesi
          </button>
        </form>
      </div>

      {/* Sessions Table */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: '#fff',
          border: '1px solid rgba(29,78,216,0.08)',
          boxShadow: '0 2px 20px rgba(29,78,216,0.04)',
        }}
      >
        {/* Table Header */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: '1px solid rgba(29,78,216,0.06)' }}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ background: 'rgba(37,99,235,0.08)' }}>
              <ClipboardList size={16} style={{ color: '#2563eb' }} />
            </div>
            <h3 className="text-sm font-bold" style={{ color: '#0a1628' }}>
              Daftar Sesi ({sessions.length})
            </h3>
          </div>
        </div>

        <table className="w-full text-left">
          <thead>
            <tr style={{ background: 'rgba(29,78,216,0.03)', borderBottom: '1px solid rgba(29,78,216,0.06)' }}>
              <th className="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider" style={{ color: '#64748b' }}>Judul</th>
              <th className="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider" style={{ color: '#64748b' }}>Kode Akses</th>
              <th className="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider" style={{ color: '#64748b' }}>Tipe Tes</th>
              <th className="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider" style={{ color: '#64748b' }}>Status</th>
              <th className="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider" style={{ color: '#64748b' }}>Dibuat</th>
              <th className="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-right" style={{ color: '#64748b' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((session, idx) => (
              <tr
                key={session.id}
                className="transition-colors duration-150 group"
                style={{
                  borderBottom: idx < sessions.length - 1 ? '1px solid rgba(29,78,216,0.04)' : 'none',
                }}
              >
                <td className="px-6 py-4">
                  <span className="text-sm font-semibold" style={{ color: '#0a1628' }}>
                    {session.title}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <code
                    className="px-2 py-1 rounded-lg text-xs font-mono font-bold"
                    style={{
                      background: 'rgba(29,78,216,0.06)',
                      color: '#2563eb',
                    }}
                  >
                    {session.accessCode}
                  </code>
                </td>
                <td className="px-6 py-4">
                  <span
                    className="inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wide"
                    style={{
                      background: 'rgba(99,102,241,0.06)',
                      color: '#6366f1',
                    }}
                  >
                    {session.testType}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold"
                    style={{
                      background: session.isActive ? 'rgba(16,185,129,0.08)' : 'rgba(100,116,139,0.08)',
                      color: session.isActive ? '#059669' : '#64748b',
                    }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: session.isActive ? '#10b981' : '#94a3b8' }}
                    />
                    {session.isActive ? 'Aktif' : 'Nonaktif'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs" style={{ color: '#94a3b8' }}>
                    {new Date(session.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      title="Salin Kode"
                      className="p-2 rounded-lg transition-all duration-200 hover:-translate-y-0.5"
                      style={{ color: '#94a3b8' }}
                    >
                      <Copy size={15} />
                    </button>
                    <button
                      title="Toggle Status"
                      className="p-2 rounded-lg transition-all duration-200 hover:-translate-y-0.5"
                      style={{ color: '#94a3b8' }}
                    >
                      <Power size={15} />
                    </button>
                    <button
                      title="Hapus"
                      className="p-2 rounded-lg transition-all duration-200 hover:-translate-y-0.5"
                      style={{ color: '#94a3b8' }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {sessions.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                      style={{ background: 'rgba(29,78,216,0.06)' }}
                    >
                      <ClipboardList size={24} style={{ color: '#94a3b8' }} />
                    </div>
                    <p className="text-sm font-medium" style={{ color: '#94a3b8' }}>Belum ada sesi tes</p>
                    <p className="text-xs mt-1" style={{ color: '#cbd5e1' }}>Gunakan form di atas untuk membuat sesi pertama</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
