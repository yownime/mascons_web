import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/lib/db';
import { testParticipants, testResults, testSessions, users } from '@/db/schema';
import { validateSupabaseToken, extractTokenFromHeader } from '@/app/lib/auth';
import { eq, desc } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  const token = extractTokenFromHeader(req.headers.get('Authorization'));

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { userId, isValid } = await validateSupabaseToken(token);

  if (!isValid || !userId) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  try {
    const history = await db
      .select({
        id: testResults.id,
        participantId: testResults.participantId,
        category: testResults.category,
        scoreSummary: testResults.scoreSummary,
        createdAt: testResults.createdAt,
        sessionTitle: testSessions.title,
        userName: users.fullName,
      })
      .from(testResults)
      .innerJoin(testParticipants, eq(testResults.participantId, testParticipants.id))
      .innerJoin(users, eq(testParticipants.userId, users.id))
      .leftJoin(testSessions, eq(testParticipants.sessionId, testSessions.id))
      .where(eq(testParticipants.userId, userId))
      .orderBy(desc(testResults.createdAt));

    const formattedHistory = history.map((item) => {
      const cat = item.category.toUpperCase();
      let testName = `Tes ${cat}`;
      if (cat === 'CFIT') testName = 'CFIT (Culture Fair Intelligence Test)';
      else if (cat === 'CPM') testName = 'CPM (Coloured Progressive Matrices)';
      else if (cat === 'BAKUM') testName = 'BAKUM (Bakat Umum)';
      else if (cat === 'EPPS') testName = 'EPPS (Edwards Personal Preference Schedule)';
      else if (cat === 'TIU' || cat === 'INTELIGENSI_UMUM') testName = 'TIU (Tes Inteligensi Umum)';
      else if (cat === 'KRAEPELIN') testName = 'Tes Kraepelin';
      else if (cat.includes('MINAT')) testName = 'Tes Minat Jabatan';

      return {
        id: item.id,
        participantId: item.participantId,
        category: item.category,
        testName,
        sessionTitle: item.sessionTitle || testName,
        scoreSummary: item.scoreSummary || 'Selesai',
        createdAt: item.createdAt,
        certificateUrl: `https://mascons-web.vercel.app/certificate/${item.id}`,
      };
    });

    return NextResponse.json({ success: true, history: formattedHistory });
  } catch (error) {
    console.error('Fetch My History Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
