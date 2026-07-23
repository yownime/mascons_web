import React from 'react';
import { db } from '@/app/lib/db';
import { testParticipants, testSessions, users } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';
import { ChevronLeft } from 'lucide-react';
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
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/participants"
          className="p-2 bg-white  border border-purple-100  rounded-lg hover:bg-purple-50 transition-colors"
        >
          <ChevronLeft size={20} className="text-purple-900" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold">Partisipan: {testTitle}</h2>
          <p className="text-purple-800/70">Menampilkan {participants.length} partisipan terdaftar.</p>
        </div>
      </div>

      <ParticipantsList participants={participants} />
    </div>
  );
}
