import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/lib/db';
import { testSessions, testParticipants, users } from '@/db/schema';
import { validateSupabaseToken, extractTokenFromHeader } from '@/app/lib/auth';
import { eq, and } from 'drizzle-orm';

export async function POST(req: NextRequest) {
  const token = extractTokenFromHeader(req.headers.get('Authorization'));
  
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { userId, email, fullName, isValid } = await validateSupabaseToken(token);
  
  if (!isValid || !userId) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  try {
    const { accessCode, personalData, testCategory } = await req.json();

    if (!accessCode || typeof accessCode !== 'string' || !accessCode.trim()) {
      return NextResponse.json({ error: 'Kode akses wajib diisi' }, { status: 400 });
    }

    const trimmedCode = accessCode.trim().toUpperCase();

    // 1. Ensure user exists in our local users table (mirrored from Supabase)
    // In a real app, you might want to sync this on login, but we'll do an upsert here for safety
    await db.insert(users).values({
      id: userId,
      email: email || '',
      fullName: fullName || 'User',
    }).onConflictDoNothing();

    // 2. Find the session
    const session = await db.query.testSessions.findFirst({
      where: and(
        eq(testSessions.accessCode, trimmedCode),
        eq(testSessions.isActive, true)
      ),
    });

    if (!session) {
      return NextResponse.json({ error: 'Kode akses tidak valid atau sesi sudah tidak aktif' }, { status: 404 });
    }

    // 2b. Verify testCategory compatibility
    if (testCategory && session.testType && session.testType.toLowerCase() !== 'all') {
      const sType = session.testType.toLowerCase().trim();
      const cType = String(testCategory).toLowerCase().trim();
      const isMatch = sType === cType ||
        (sType === 'tiu' && cType === 'inteligensi_umum') ||
        (sType === 'inteligensi_umum' && cType === 'tiu');

      if (!isMatch) {
        return NextResponse.json({
          error: `Kode akses ini khusus untuk tes ${session.testType.toUpperCase()}, bukan untuk tes ${testCategory.toUpperCase()}.`
        }, { status: 400 });
      }
    }

    // 3. Register or find existing participation
    const existingParticipant = await db.query.testParticipants.findFirst({
      where: and(
        eq(testParticipants.sessionId, session.id),
        eq(testParticipants.userId, userId)
      ),
    });

    if (existingParticipant) {
      return NextResponse.json({ 
        message: 'Already joined', 
        participantId: existingParticipant.id,
        sessionTitle: session.title,
        testType: session.testType
      });
    }

    const [newParticipant] = await db.insert(testParticipants).values({
      sessionId: session.id,
      userId: userId,
      personalData: personalData || null,
      status: 'joined',
      startedAt: new Date(),
    }).returning();

    return NextResponse.json({ 
      message: 'Successfully joined', 
      participantId: newParticipant.id,
      sessionTitle: session.title,
      testType: session.testType
    });

  } catch (error) {
    console.error('Join Test Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
