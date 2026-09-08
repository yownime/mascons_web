import React from 'react';
import { db } from '@/app/lib/db';
import { testResults, testParticipants, testSessions } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';
import Link from 'next/link';
import { Brain, Users, Lightbulb, Activity, Target, Network } from 'lucide-react';

const TEST_INFO: Record<string, { title: string; category: string; icon: React.FC<any>; color: string }> = {
  cpm: { title: 'CPM', category: 'Tes IQ', icon: Target, color: 'bg-emerald-500' },
  cfit: { title: 'CFIT', category: 'Tes IQ', icon: Brain, color: 'bg-purple-500' },
  tiu: { title: 'TIU', category: 'Tes IQ', icon: Lightbulb, color: 'bg-amber-500' },
  bakum: { title: 'BAKUM', category: 'Tes Bakat', icon: Activity, color: 'bg-rose-500' },
  epps: { title: 'EPPS', category: 'Tes Minat', icon: Users, color: 'bg-purple-500' },
  minat_jabatan: { title: 'Minat Jabatan', category: 'Tes Minat', icon: Network, color: 'bg-blue-500' },
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Hasil Tes</h2>
        <p className="text-purple-800/70">Pilih kategori tes untuk melihat rekapan hasil.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(TEST_INFO).map(([key, info]) => {
          const Icon = info.icon;
          const count = countMap[key] || 0;

          return (
            <Link 
              key={key} 
              href={`/admin/results/${key}`}
              className="group block bg-white rounded-2xl border border-purple-100 p-6 shadow-sm hover:shadow-md transition-all hover:border-purple-400"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${info.color} text-white shadow-sm group-hover:scale-110 transition-transform`}>
                  <Icon size={24} />
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-950">
                  {info.category}
                </span>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-purple-950 mb-1">
                  {info.title}
                </h3>
                <p className="text-sm text-purple-800/70">
                  {count} Hasil Tes
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
