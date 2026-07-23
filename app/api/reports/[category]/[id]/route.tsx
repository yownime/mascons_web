import React from 'react';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/lib/db';
import { testResults, testParticipants, users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { renderToStream } from '@react-pdf/renderer';
import { createClient } from '@/app/lib/supabase';

// Import all report templates
import { CFITReport } from '@/app/lib/reports/cfit';
import { KraepelinReport } from '@/app/lib/reports/kraepelin';
import { MinatJabatanReport } from '@/app/lib/reports/minat_jabatan';
import { InteligensiUmumReport } from '@/app/lib/reports/inteligensi_umum';
import { CPMReport } from '@/app/lib/reports/cpm';
import { EPPSReport } from '@/app/lib/reports/epps';
import { BakumReport } from '@/app/lib/reports/bakum';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ category: string, id: string }> }
) {
  const { category, id } = await params;
  
  // 1. Verify Authentication
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();

  if (!authUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 2. Fetch Result Data
    const fullData = await db
      .select({
        result: testResults,
        user: users,
      })
      .from(testResults)
      .innerJoin(testParticipants, eq(testResults.participantId, testParticipants.id))
      .innerJoin(users, eq(testParticipants.userId, users.id))
      .where(eq(testResults.participantId, parseInt(id)))
      .then(res => res[0]);

    if (!fullData) {
      return NextResponse.json({ error: 'Result not found' }, { status: 404 });
    }
    
    // We allow mapping or exact match
    const categoryToRender = category.toLowerCase();

    // 3. Select Document Component based on category
    let ReportComponent: React.ReactElement | null = null;
    const reportData = fullData.result.reportData as any;
    const user = fullData.user;

    switch (categoryToRender) {
      case 'cfit':
        ReportComponent = <CFITReport data={reportData} user={user} />;
        break;
      case 'kraepelin':
        ReportComponent = <KraepelinReport data={reportData} user={user} />;
        break;
      case 'minat_jabatan':
      case 'minat-jabatan':
        ReportComponent = <MinatJabatanReport data={reportData} user={user} />;
        break;
      case 'inteligensi_umum':
      case 'inteligensi-umum':
      case 'tiu':
        ReportComponent = <InteligensiUmumReport data={reportData} user={user} />;
        break;
      case 'cpm':
        ReportComponent = <CPMReport data={reportData} user={user} />;
        break;
      case 'epps':
        ReportComponent = <EPPSReport data={reportData} user={user} />;
        break;
      case 'bakum':
        ReportComponent = <BakumReport data={reportData} user={user} />;
        break;
      default:
        // Fallback for unimplemented reports to avoid crashing
        return NextResponse.json({ error: `Report template for category '${category}' is not implemented yet.` }, { status: 501 });
    }

    // 4. Generate PDF Stream
    const stream = await renderToStream(ReportComponent);

    // 5. Return as PDF
    const filename = `Mascons-Report-${category.toUpperCase()}-${fullData.user.fullName.replace(/\s+/g, '_')}.pdf`;
    return new NextResponse(stream as any, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });

  } catch (error) {
    console.error(`PDF Generation Error [${category}]:`, error);
    return NextResponse.json({ error: 'Internal Server Error while generating PDF' }, { status: 500 });
  }
}
