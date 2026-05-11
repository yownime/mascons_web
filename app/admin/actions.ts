'use server';

import { db } from '@/app/lib/db';
import { users, testSessions, testParticipants, testResults } from '@/db/schema';
import { revalidatePath } from 'next/cache';

export async function seedDatabase(formData: FormData) {
  // 1. Create a dummy user
  const userId = "00000000-0000-0000-0000-000000000001";
  await db.insert(users).values({
    id: userId,
    fullName: "John Doe (Sample)",
    email: "sample.user@example.com",
  }).onConflictDoNothing();

  // 2. Create a test session
  const [session] = await db.insert(testSessions).values({
    title: "Beta Testing Batch",
    accessCode: "BETA2026",
    isActive: true,
  }).onConflictDoNothing().returning();

  if (!session) return;

  // 3. Create participants
  const [participant] = await db.insert(testParticipants).values({
    sessionId: session.id,
    userId: userId,
    status: "completed",
    startedAt: new Date(),
    finishedAt: new Date(),
  }).returning();

  // 4. Create results
  await db.insert(testResults).values({
    participantId: participant.id,
    category: "CFIT",
    reportData: {
      iqScore: 124,
      classification: "Superior",
    },
    scoreSummary: "IQ: 124 (High)",
  });

  revalidatePath('/admin');
}
