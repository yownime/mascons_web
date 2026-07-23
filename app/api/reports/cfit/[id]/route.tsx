import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/lib/db';
import { testResults, testParticipants, users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { CFITReport } from '@/app/lib/reports/cfit';
import { renderToStream } from '@react-pdf/renderer';
import { createClient } from '@/app/lib/supabase';

export async function GET(
  req: NextRequest,
<<<<<<< HEAD
  { params }: { params: { id: string } }
) {
  const { id } = params;
=======
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
>>>>>>> refs/rewritten/origin-main

  // 1. Verify Authentication
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();

  if (!authUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 2. Fetch Result Data
    const result = await db.query.testResults.findFirst({
      where: eq(testResults.id, parseInt(id)),
      with: {
        participant: {
          with: {
            user: true,
          }
        }
      }
    });

    if (!result) {
      return NextResponse.json({ error: 'Result not found' }, { status: 404 });
    }

    // @ts-ignore - Assuming drizzle relation or manually join if needed
    // If relations are not set up in schema yet, I'll do a join manually below for safety
    const fullData = await db
      .select({
        result: testResults,
        user: users,
      })
      .from(testResults)
      .innerJoin(testParticipants, eq(testResults.participantId, testParticipants.id))
      .innerJoin(users, eq(testParticipants.userId, users.id))
      .where(eq(testResults.id, parseInt(id)))
      .then(res => res[0]);

    if (!fullData) {
      return NextResponse.json({ error: 'Result not found' }, { status: 404 });
    }

    // 3. Generate PDF Stream
    const stream = await renderToStream(
      <CFITReport 
        data={ fullData.result.reportData } 
        user = { fullData.user }
      />
    );

    // 4. Return as PDF
    return new NextResponse(stream as any, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Mascons-Report-${fullData.user.fullName}.pdf"`,
      },
    });

  } catch (error) {
    console.error('PDF Generation Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
