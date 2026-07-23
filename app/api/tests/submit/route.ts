import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/lib/db';
import { testParticipants, testResults } from '@/db/schema';
import { validateSupabaseToken, extractTokenFromHeader } from '@/app/lib/auth';
import { eq, and } from 'drizzle-orm';

export async function POST(req: NextRequest) {
  const token = extractTokenFromHeader(req.headers.get('Authorization'));
  
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { userId, isValid } = await validateSupabaseToken(token);
  
  if (!isValid || !userId) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  try {
    const { participantId, category, reportData, scoreSummary } = await req.json();

    if (!participantId || !category || !reportData) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Verify participant belongs to this user
    const participant = await db.query.testParticipants.findFirst({
      where: and(
        eq(testParticipants.id, participantId),
        eq(testParticipants.userId, userId)
      ),
    });

    if (!participant) {
      return NextResponse.json({ error: 'Participant not found or unauthorized' }, { status: 404 });
    }

    // 2. Save results
    await db.insert(testResults).values({
      participantId,
      category,
      reportData,
      scoreSummary,
    });

    // 3. Update participant status
    await db.update(testParticipants)
      .set({ 
        status: 'completed',
        finishedAt: new Date(),
      })
      .where(eq(testParticipants.id, participantId));

    return NextResponse.json({ message: 'Results submitted successfully' });

  } catch (error) {
    console.error('Submit Test Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
