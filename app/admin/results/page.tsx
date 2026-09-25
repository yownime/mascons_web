import React from 'react';
import { db } from '@/app/lib/db';
import { testResults, testParticipants, testSessions } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';
import Link from 'next/link';
import { Brain, Users, Lightbulb, Activity, Target, Network, ArrowUpRight, BarChart3 } from 'lucide-react';

const TEST_INFO: Record<string, { title: string; category: string; icon: React.FC<any>; color: string; gradient: string }> = {
  cpm: { title: 'CPM', category: 'Tes IQ', icon: Target, color: '#10b981', gradient: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(16,185,129,0.03))' },
  cfit_skala2: { title: 'CFIT Skala 2', category: 'Tes IQ (Test 1–4)', icon: Brain, color: '#2563eb', gradient: 'linear-gradient(135deg, rgba(37,99,235,0.1), rgba(37,99,235,0.03))' },
  cfit_skala3: { title: 'CFIT Skala 3', category: 'Tes IQ (Test 5–8)', icon: Brain, color: '#6366f1', gradient: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(99,102,241,0.03))' },
  tiu: { title: 'TIU', category: 'Tes IQ', icon: Lightbulb, color: '#f59e0b', gradient: 'linear-gradient(135deg, rgba(245,158,11,0.1), rgba(245,158,11,0.03))' },
  bakum: { title: 'BAKUM', category: 'Tes Bakat', icon: Activity, color: '#ef4444', gradient: 'linear-gradient(135deg, rgba(239,68,68,0.1), rgba(239,68,68,0.03))' },
  epps: { title: 'EPPS', category: 'Tes Minat', icon: Users, color: '#8b5cf6', gradient: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(139,92,246,0.03))' },
  minat_jabatan: { title: 'Minat Jabatan', category: 'Tes Minat', icon: Network, color: '#0ea5e9', gradient: 'linear-gradient(135deg, rgba(14,165,233,0.1), rgba(14,165,233,0.03))' },
};

export default async function ResultsPage() {
  // Aggregate result counts per testType
  const stats = await db
    .select({
      testType: testSessions.testType,
      count: sql<number>`count(${testResults.id})`.mapWith(Number),
    })
    .from(testResults)
    .innerJoin(testParticipants, eq(testResults.participantId, testParticipants.id))
    .innerJoin(testSessions, eq(testParticipants.sessionId, testSessions.id))
    .groupBy(testSessions.testType);

  const countMap = stats.reduce((acc, curr) => {
    acc[curr.testType] = curr.count;
    return acc;
  }, {} as Record<string, number>);

  const totalResults = Object.values(countMap).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight" style={{ color: '#0a1628' }}>
            Hasil Tes
          </h2>
          <p className="text-sm mt-1" style={{ color: '#64748b' }}>
            Pilih kategori tes untuk melihat rekapan hasil. Total <strong style={{ color: '#2563eb' }}>{totalResults}</strong> hasil tes tersedia.
          </p>
        </div>
        <div
          className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl text-sm"
          style={{
            background: 'rgba(29,78,216,0.05)',
            border: '1px solid rgba(29,78,216,0.1)',
          }}
        >
          <BarChart3 size={15} style={{ color: '#2563eb' }} />
          <span className="font-semibold" style={{ color: '#2563eb' }}>{totalResults}</span>
          <span style={{ color: '#64748b' }}>Laporan</span>
        </div>
      </div>

      {/* Test Category Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {Object.entries(TEST_INFO).map(([key, info]) => {
          const Icon = info.icon;
          const count = countMap[key] || 0;

          return (
            <Link 
              key={key} 
              href={key === 'cfit_skala2' ? '/admin/results/cfit' : key === 'cfit_skala3' ? '/admin/results/cfit?skala=3' : `/admin/results/${key}`}
              className="group block rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg relative overflow-hidden"
              style={{
                background: '#fff',
                border: '1px solid rgba(29,78,216,0.08)',
                boxShadow: '0 2px 20px rgba(29,78,216,0.04)',
              }}
            >
              {/* Hover gradient overlay */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ background: info.gradient }}
              />

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-5">
                  <div
                    className="p-3 rounded-xl transition-transform duration-300 group-hover:scale-110"
                    style={{ background: `${info.color}15`, color: info.color }}
                  >
                    <Icon size={22} />
                  </div>
                  <span
                    className="inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold"
                    style={{
                      background: 'rgba(29,78,216,0.05)',
                      color: '#64748b',
                    }}
                  >
                    {info.category}
                  </span>
                </div>
                
                <div>
                  <h3 className="text-lg font-bold mb-1 tracking-tight" style={{ color: '#0a1628' }}>
                    {info.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <p className="text-sm" style={{ color: '#94a3b8' }}>
                      <strong style={{ color: info.color }}>{count}</strong> Hasil Tes
                    </p>
                    <ArrowUpRight
                      size={16}
                      className="opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-1 group-hover:translate-y-0"
                      style={{ color: info.color }}
                    />
                  </div>
                </div>

                {/* Mini progress bar */}
                <div
                  className="mt-4 h-1 rounded-full overflow-hidden"
                  style={{ background: `${info.color}10` }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: count > 0 ? `${Math.min(count * 5 + 15, 100)}%` : '0%',
                      background: `linear-gradient(90deg, ${info.color}, ${info.color}88)`,
                      transition: 'width 0.7s ease',
                    }}
                  />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
