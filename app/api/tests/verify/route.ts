import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/lib/db';
import { testSessions } from '@/db/schema';
import { validateSupabaseToken, extractTokenFromHeader } from '@/app/lib/auth';
import { eq, and } from 'drizzle-orm';

export async function POST(req: NextRequest) {
  const token = extractTokenFromHeader(req.headers.get('Authorization'));
  
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { isValid, userId } = await validateSupabaseToken(token);
  
  if (!isValid || !userId) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  try {
    const { accessCode } = await req.json();

    if (!accessCode) {
      return NextResponse.json({ error: 'Access code is required' }, { status: 400 });
    }

    // Just find the session, do not create participant yet
    const session = await db.query.testSessions.findFirst({
      where: and(
        eq(testSessions.accessCode, accessCode),
        eq(testSessions.isActive, true)
      ),
    });

    if (!session) {
      return NextResponse.json({ error: 'Invalid or inactive access code' }, { status: 404 });
    }

    return NextResponse.json({ 
      message: 'Code is valid', 
      sessionTitle: session.title,
      testType: session.testType
    });

  } catch (error) {
    console.error('Verify Test Code Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
