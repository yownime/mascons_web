import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/lib/db';
import { testResults, testParticipants, users } from '@/db/schema';
import { desc, eq, inArray } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const scale = parseInt(searchParams.get('scale') ?? '2', 10) as 2 | 3;

  // Categories stored in DB for each scale
  const categories =
    scale === 2
      ? ['CFIT_SKALA2', 'cfit_skala2']
      : ['CFIT_SKALA3', 'cfit_skala3'];

  const results = await db
    .select({
      id: testResults.id,
      reportData: testResults.reportData,
      userName: users.fullName,
    })
    .from(testResults)
    .innerJoin(testParticipants, eq(testResults.participantId, testParticipants.id))
    .innerJoin(users, eq(testParticipants.userId, users.id))
    .where(inArray(testResults.category, categories))
    .orderBy(desc(testResults.createdAt));

  const getScore = (reportData: any, testKey: string): number => {
    if (reportData?.[testKey]?.score?.correct !== undefined) {
      return Number(reportData[testKey].score.correct) || 0;
    }
    return 0;
  };

  // For Skala 2: test_1 to test_4; for Skala 3: test_5 to test_8
  const testKeys =
    scale === 2
      ? ['test_1', 'test_2', 'test_3', 'test_4']
      : ['test_5', 'test_6', 'test_7', 'test_8'];

  const processed = results.map((r) => {
    const scores = testKeys.map((k) => getScore(r.reportData, k));
    return {
      id: r.id,
      userName: r.userName ?? 'Unknown',
      scores,
      total: scores.reduce((a, b) => a + b, 0),
    };
  });

  return NextResponse.json(processed);
}
