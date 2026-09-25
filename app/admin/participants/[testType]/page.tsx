import React from 'react';
import { db } from '@/app/lib/db';
import { testParticipants, testSessions, users } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';
import { ChevronLeft, Users as UsersIcon } from 'lucide-react';
import Link from 'next/link';
import ParticipantsList from './ParticipantsList';

const TEST_TITLES: Record<string, string> = {
  cpm: 'CPM (Coloured Progressive Matrices)',
  cfit: 'CFIT (Culture Fair Intelligence Test)',
  tiu: 'TIU (Tes Inteligensi Umum)',
  bakum: 'BAKUM (Bakat Umum)',
  epps: 'TEST EPPS',
  minat_jabatan: 'Test Minat Jabatan',
  kraepelin: 'Kraepelin Test',
  lee_thorpee: 'Lee Thorpee (Minat Jabatan)',
  inteligensi_umum: 'Tes Inteligensi Umum',
};

export default async function TestCategoryPage({ params }: { params: Promise<{ testType: string }> }) {
  const resolvedParams = await params;
  const testType = resolvedParams?.testType || '';
  const testTitle = TEST_TITLES[testType] || (testType ? testType.toUpperCase() : 'Unknown Test');

  const participants = await db
    .select({
      id: testParticipants.id,
      status: testParticipants.status,
      startedAt: testParticipants.startedAt,
      personalData: testParticipants.personalData,
      sessionTitle: testSessions.title,
      userName: users.fullName,
      userEmail: users.email,
    })
    .from(testParticipants)
    .innerJoin(testSessions, eq(testParticipants.sessionId, testSessions.id))
    .innerJoin(users, eq(testParticipants.userId, users.id))
    .where(eq(testSessions.testType, resolvedParams.testType))
    .orderBy(desc(testParticipants.id));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-2">
        <Link
          href="/admin/participants"
          className="p-2.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5"
          style={{
            background: '#fff',
            border: '1px solid rgba(29,78,216,0.1)',
            boxShadow: '0 2px 10px rgba(29,78,216,0.04)',
          }}
        >
          <ChevronLeft size={18} style={{ color: '#2563eb' }} />
        </Link>
        <div className="flex-1">
          <h2 className="text-2xl font-extrabold tracking-tight" style={{ color: '#0a1628' }}>
            Partisipan: {testTitle}
          </h2>
          <p className="text-sm mt-0.5" style={{ color: '#64748b' }}>
            Menampilkan <strong style={{ color: '#2563eb' }}>{participants.length}</strong> partisipan terdaftar.
          </p>
        </div>
        <div
          className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl"
          style={{
            background: 'rgba(29,78,216,0.05)',
            border: '1px solid rgba(29,78,216,0.1)',
          }}
        >
          <UsersIcon size={15} style={{ color: '#2563eb' }} />
          <span className="text-sm font-semibold" style={{ color: '#2563eb' }}>{participants.length}</span>
        </div>
      </div>

      <ParticipantsList participants={participants} />
    </div>
  );
}
