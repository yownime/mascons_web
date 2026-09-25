import React from 'react';
import Link from 'next/link';
import { db } from '@/app/lib/db';
import { testSessions, testParticipants, testResults } from '@/db/schema';
import { count, eq, desc, sql } from 'drizzle-orm';
import { seedDatabase } from './actions';
import { 
  Users, 
  Activity, 
  CheckCircle2, 
  Clock,
  Database,
  ArrowUpRight,
  TrendingUp,
  Zap,
  BarChart3,
  FileText,
  Plus,
  ClipboardList,
  ArrowRight,
} from 'lucide-react';

export default async function AdminDashboard() {
  // Fetch stats
  const [sessionsCount] = await db.select({ value: count() }).from(testSessions);
  const [participantsCount] = await db.select({ value: count() }).from(testParticipants);
  const [completedCount] = await db.select({ value: count() })
    .from(testParticipants)
    .where(eq(testParticipants.status, 'completed'));
  const [resultsCount] = await db.select({ value: count() }).from(testResults);

  // Calculate completion rate
  const completionRate = participantsCount.value > 0 
    ? Math.round((completedCount.value / participantsCount.value) * 100) 
    : 0;

  // Recent sessions
  const recentSessions = await db.query.testSessions.findMany({
    orderBy: [desc(testSessions.createdAt)],
    limit: 5,
  });

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div
        className="relative overflow-hidden rounded-2xl p-8"
        style={{
          background: 'linear-gradient(135deg, #0a1628 0%, #1e3a8a 50%, #0c4a6e 100%)',
          boxShadow: '0 8px 40px rgba(29,78,216,0.2)',
        }}
      >
        {/* Decorative elements */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: '-30%',
            right: '-5%',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(56,189,248,0.15) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute pointer-events-none"
          style={{
            bottom: '-40%',
            left: '10%',
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        <div className="relative z-10">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-4"
            style={{
              background: 'rgba(56,189,248,0.15)',
              border: '1px solid rgba(56,189,248,0.2)',
              color: '#38bdf8',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#38bdf8' }} />
            Platform Aktif
          </div>
          <h2
            className="text-2xl md:text-3xl font-extrabold tracking-tight mb-2"
            style={{ color: '#f0f6ff' }}
          >
            Selamat Datang di Mascons Admin
          </h2>
          <p className="text-sm max-w-lg leading-relaxed" style={{ color: '#93c5fd' }}>
            Kelola sesi tes psikologi, pantau partisipan, dan hasilkan laporan profesional — semua dari satu dashboard terpadu.
          </p>

          <div className="flex gap-3 mt-6">
            <Link
              href="/admin/sessions"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5"
              style={{
                background: 'linear-gradient(135deg, #2563eb, #0ea5e9)',
                color: '#fff',
                boxShadow: '0 4px 15px rgba(37,99,235,0.4)',
              }}
            >
              <Plus size={16} />
              Buat Sesi Baru
            </Link>
            <Link
              href="/admin/results"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5"
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: '#e2e8f0',
              }}
            >
              <BarChart3 size={16} />
              Lihat Hasil
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard 
          title="Total Sesi" 
          value={sessionsCount.value.toString()} 
          icon={<Activity size={20} />}
          trend="+2 minggu ini"
          accentColor="#2563eb"
          accentBg="rgba(37,99,235,0.08)"
          gradient="linear-gradient(135deg, rgba(37,99,235,0.08), rgba(37,99,235,0.02))"
        />
        <StatCard 
          title="Partisipan" 
          value={participantsCount.value.toString()} 
          icon={<Users size={20} />}
          trend="+12 minggu ini"
          accentColor="#0ea5e9"
          accentBg="rgba(14,165,233,0.08)"
          gradient="linear-gradient(135deg, rgba(14,165,233,0.08), rgba(14,165,233,0.02))"
        />
        <StatCard 
          title="Selesai" 
          value={completedCount.value.toString()} 
          icon={<CheckCircle2 size={20} />}
          trend={`${completionRate}% completion`}
          accentColor="#10b981"
          accentBg="rgba(16,185,129,0.08)"
          gradient="linear-gradient(135deg, rgba(16,185,129,0.08), rgba(16,185,129,0.02))"
        />
        <StatCard 
          title="Total Laporan" 
          value={resultsCount.value.toString()} 
          icon={<FileText size={20} />}
          trend="Auto-generated"
          accentColor="#6366f1"
          accentBg="rgba(99,102,241,0.08)"
          gradient="linear-gradient(135deg, rgba(99,102,241,0.08), rgba(99,102,241,0.02))"
        />
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Sessions - takes 2 columns */}
        <div
          className="lg:col-span-2 rounded-2xl p-6"
          style={{
            background: '#fff',
            border: '1px solid rgba(29,78,216,0.08)',
            boxShadow: '0 2px 20px rgba(29,78,216,0.04)',
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div
                className="p-2 rounded-lg"
                style={{ background: 'rgba(37,99,235,0.08)' }}
              >
                <ClipboardList size={18} style={{ color: '#2563eb' }} />
              </div>
              <h3
                className="text-base font-bold tracking-tight"
                style={{ color: '#0a1628' }}
              >
                Sesi Terbaru
              </h3>
            </div>
            <Link
              href="/admin/sessions"
              className="flex items-center gap-1 text-xs font-semibold transition-colors hover:gap-2"
              style={{ color: '#2563eb' }}
            >
              Lihat Semua
              <ArrowRight size={13} />
            </Link>
          </div>

          {recentSessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: 'rgba(29,78,216,0.06)' }}
              >
                <ClipboardList size={24} style={{ color: '#94a3b8' }} />
              </div>
              <p className="text-sm font-medium" style={{ color: '#94a3b8' }}>Belum ada sesi tes</p>
              <p className="text-xs mt-1" style={{ color: '#cbd5e1' }}>Buat sesi pertama Anda untuk memulai</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentSessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-4 rounded-xl transition-all duration-200 hover:-translate-y-0.5 group"
                  style={{
                    background: 'rgba(29,78,216,0.02)',
                    border: '1px solid rgba(29,78,216,0.06)',
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:scale-110"
                      style={{ background: session.isActive ? 'rgba(16,185,129,0.1)' : 'rgba(100,116,139,0.08)' }}
                    >
                      <Activity
                        size={18}
                        style={{ color: session.isActive ? '#10b981' : '#94a3b8' }}
                      />
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: '#0a1628' }}>
                        {session.title}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <code
                          className="px-1.5 py-0.5 rounded text-[11px] font-mono font-bold"
                          style={{
                            background: 'rgba(29,78,216,0.06)',
                            color: '#2563eb',
                          }}
                        >
                          {session.accessCode}
                        </code>
                        <span className="text-[11px]" style={{ color: '#94a3b8' }}>
                          {session.testType?.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold"
                      style={{
                        background: session.isActive ? 'rgba(16,185,129,0.1)' : 'rgba(100,116,139,0.08)',
                        color: session.isActive ? '#059669' : '#64748b',
                      }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{
                          background: session.isActive ? '#10b981' : '#94a3b8',
                        }}
                      />
                      {session.isActive ? 'Aktif' : 'Nonaktif'}
                    </span>
                    <span className="text-xs" style={{ color: '#94a3b8' }}>
                      {new Date(session.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div
          className="rounded-2xl p-6"
          style={{
            background: '#fff',
            border: '1px solid rgba(29,78,216,0.08)',
            boxShadow: '0 2px 20px rgba(29,78,216,0.04)',
          }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div
              className="p-2 rounded-lg"
              style={{ background: 'rgba(99,102,241,0.08)' }}
            >
              <Zap size={18} style={{ color: '#6366f1' }} />
            </div>
            <h3
              className="text-base font-bold tracking-tight"
              style={{ color: '#0a1628' }}
            >
              Aksi Cepat
            </h3>
          </div>

          <div className="space-y-3">
            <Link
              href="/admin/sessions"
              className="flex items-center gap-3 p-4 rounded-xl transition-all duration-200 hover:-translate-y-0.5 group"
              style={{
                background: 'linear-gradient(135deg, rgba(37,99,235,0.05), rgba(37,99,235,0.02))',
                border: '1px solid rgba(37,99,235,0.1)',
              }}
            >
              <div
                className="p-2.5 rounded-lg transition-transform duration-200 group-hover:scale-110"
                style={{ background: 'rgba(37,99,235,0.1)' }}
              >
                <Plus size={16} style={{ color: '#2563eb' }} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold" style={{ color: '#0a1628' }}>Buat Sesi Baru</p>
                <p className="text-[11px]" style={{ color: '#94a3b8' }}>Siapkan tes untuk partisipan</p>
              </div>
              <ArrowUpRight size={14} style={{ color: '#2563eb' }} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>

            <Link
              href="/admin/results"
              className="flex items-center gap-3 p-4 rounded-xl transition-all duration-200 hover:-translate-y-0.5 group"
              style={{
                background: 'linear-gradient(135deg, rgba(16,185,129,0.05), rgba(16,185,129,0.02))',
                border: '1px solid rgba(16,185,129,0.1)',
              }}
            >
              <div
                className="p-2.5 rounded-lg transition-transform duration-200 group-hover:scale-110"
                style={{ background: 'rgba(16,185,129,0.1)' }}
              >
                <BarChart3 size={16} style={{ color: '#10b981' }} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold" style={{ color: '#0a1628' }}>Ekspor Hasil</p>
                <p className="text-[11px]" style={{ color: '#94a3b8' }}>Download laporan PDF</p>
              </div>
              <ArrowUpRight size={14} style={{ color: '#10b981' }} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>

            <form action={seedDatabase}>
              <button
                type="submit"
                className="flex items-center gap-3 p-4 rounded-xl transition-all duration-200 hover:-translate-y-0.5 group w-full text-left"
                style={{
                  background: 'linear-gradient(135deg, rgba(245,158,11,0.05), rgba(245,158,11,0.02))',
                  border: '1px solid rgba(245,158,11,0.1)',
                }}
              >
                <div
                  className="p-2.5 rounded-lg transition-transform duration-200 group-hover:scale-110"
                  style={{ background: 'rgba(245,158,11,0.1)' }}
                >
                  <Database size={16} style={{ color: '#f59e0b' }} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold" style={{ color: '#0a1628' }}>Seed Data Sampel</p>
                  <p className="text-[11px]" style={{ color: '#94a3b8' }}>Isi database dengan contoh</p>
                </div>
                <ArrowUpRight size={14} style={{ color: '#f59e0b' }} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </form>

            <Link
              href="/admin/participants"
              className="flex items-center gap-3 p-4 rounded-xl transition-all duration-200 hover:-translate-y-0.5 group"
              style={{
                background: 'linear-gradient(135deg, rgba(99,102,241,0.05), rgba(99,102,241,0.02))',
                border: '1px solid rgba(99,102,241,0.1)',
              }}
            >
              <div
                className="p-2.5 rounded-lg transition-transform duration-200 group-hover:scale-110"
                style={{ background: 'rgba(99,102,241,0.1)' }}
              >
                <Users size={16} style={{ color: '#6366f1' }} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold" style={{ color: '#0a1628' }}>Kelola Partisipan</p>
                <p className="text-[11px]" style={{ color: '#94a3b8' }}>Lihat data per kategori tes</p>
              </div>
              <ArrowUpRight size={14} style={{ color: '#6366f1' }} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ 
  title, 
  value, 
  icon, 
  trend,
  accentColor,
  accentBg,
  gradient,
}: { 
  title: string; 
  value: string; 
  icon: React.ReactNode; 
  trend: string;
  accentColor: string;
  accentBg: string;
  gradient: string;
}) {
  return (
    <div
      className="group p-5 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
      style={{
        background: '#fff',
        border: '1px solid rgba(29,78,216,0.08)',
        boxShadow: '0 2px 20px rgba(29,78,216,0.04)',
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="p-2.5 rounded-xl transition-transform duration-300 group-hover:scale-110"
          style={{ background: accentBg }}
        >
          <span style={{ color: accentColor }}>{icon}</span>
        </div>
        <div className="flex items-center gap-1">
          <TrendingUp size={12} style={{ color: accentColor }} />
          <span className="text-[11px] font-medium" style={{ color: accentColor }}>{trend}</span>
        </div>
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#94a3b8' }}>
          {title}
        </p>
        <h4
          className="text-3xl font-extrabold tracking-tight"
          style={{ color: '#0a1628' }}
        >
          {value}
        </h4>
      </div>
      {/* Progress-style accent bar */}
      <div
        className="mt-4 h-1 rounded-full overflow-hidden"
        style={{ background: accentBg }}
      >
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${Math.min(parseInt(value) * 10 + 20, 100)}%`,
            background: `linear-gradient(90deg, ${accentColor}, ${accentColor}88)`,
          }}
        />
      </div>
    </div>
  );
}
