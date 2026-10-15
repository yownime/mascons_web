import React from 'react';
import { db } from '@/app/lib/db';
import { testResults, testParticipants, users } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';
import DecisionMatrixView, { StudentDecisionData } from '@/components/admin/DecisionMatrixView';
import { matchCareerAndMajors } from '@/app/lib/careerMatching';
import { Compass, Sparkles } from 'lucide-react';

export default async function DecisionDashboardPage() {
  // Query all results with participant and user data
  const rawResults = await db
    .select({
      resultId: testResults.id,
      category: testResults.category,
      reportData: testResults.reportData,
      scoreSummary: testResults.scoreSummary,
      createdAt: testResults.createdAt,
      participantId: testParticipants.id,
      personalData: testParticipants.personalData,
      userId: users.id,
      userName: users.fullName,
      userEmail: users.email,
    })
    .from(testResults)
    .innerJoin(testParticipants, eq(testResults.participantId, testParticipants.id))
    .innerJoin(users, eq(testParticipants.userId, users.id))
    .orderBy(desc(testResults.createdAt));

  // Group by userId
  const studentMap = new Map<string, StudentDecisionData>();

  for (const row of rawResults) {
    const uId = row.userId;
    const cat = (row.category || '').toUpperCase();
    const reportData = (row.reportData || {}) as any;
    const personalData = (row.personalData || {}) as any;

    if (!studentMap.has(uId)) {
      studentMap.set(uId, {
        userId: uId,
        userName: row.userName,
        userEmail: row.userEmail,
        birthDate: personalData?.birthDate,
        chronologicalAge: personalData?.chronologicalAge,
        completedTestsCount: 0,
      });
    }

    const current = studentMap.get(uId)!;
    current.completedTestsCount += 1;

    // Update personalData if missing
    if (!current.birthDate && personalData?.birthDate) {
      current.birthDate = personalData.birthDate;
    }
    if (!current.chronologicalAge && personalData?.chronologicalAge) {
      current.chronologicalAge = personalData.chronologicalAge;
    }

    // 1. CFIT
    if (cat.includes('CFIT')) {
      let rawScore = 0;
      if (reportData.totalRawScore !== undefined) {
        rawScore = Number(reportData.totalRawScore) || 0;
      } else {
        // Fallback: sum test_1 to test_8
        for (let i = 1; i <= 8; i++) {
          if (reportData[`test_${i}`]?.score?.correct !== undefined) {
            rawScore += Number(reportData[`test_${i}`].score.correct) || 0;
          }
        }
      }

      const hasFlagRed = Boolean(
        reportData.hasFlagRed ||
        Object.keys(reportData).some((k) => reportData[k]?.isSuspicious === true)
      );

      const scale = cat.includes('SKALA3') ? 'Skala 3' : cat.includes('SKALA2') ? 'Skala 2' : 'Full';

      current.cfit = {
        totalRawScore: rawScore,
        hasFlagRed,
        scale,
        resultId: row.resultId,
      };
    }

    // 2. EPPS
    if (cat === 'EPPS') {
      const consistency =
        reportData?.consistency?.score ??
        reportData?.consistency?.consistentPairs ??
        reportData?.consistencyCheck?.consistentPairs ??
        0;

      const isValid = consistency >= 9;

      // Extract top needs if available
      let topNeeds: string[] = [];
      if (Array.isArray(reportData?.summary?.topNeeds)) {
        topNeeds = reportData.summary.topNeeds;
      } else if (reportData?.rawScores) {
        topNeeds = Object.entries(reportData.rawScores)
          .sort((a, b) => (b[1] as number) - (a[1] as number))
          .slice(0, 3)
          .map((e) => e[0]);
      }

      current.epps = {
        consistencyScore: consistency,
        isValid,
        topNeeds,
        resultId: row.resultId,
      };
    }

    // 3. BAKUM
    if (cat === 'BAKUM') {
      let totalRaw = 0;
      const subtestScores: { name: string; pct: number }[] = [];

      const maxList: Record<string, { label: string; max: number }> = {
        persoalan_2: { label: 'Informasi', max: 40 },
        persoalan_3: { label: 'Verbal', max: 20 },
        persoalan_4: { label: 'Logika', max: 40 },
        persoalan_5: { label: 'Numerik', max: 20 },
        persoalan_6: { label: 'Deret', max: 30 },
        persoalan_7: { label: 'Spasial 2D', max: 20 },
        persoalan_8: { label: 'Spasial 3D', max: 20 },
        persoalan_9: { label: 'Pola', max: 20 },
        persoalan_10: { label: 'Ketelitian', max: 80 },
      };

      for (const [key, meta] of Object.entries(maxList)) {
        const correct = reportData[key]?.score?.correct || 0;
        totalRaw += correct;
        subtestScores.push({
          name: meta.label,
          pct: correct / meta.max,
        });
      }

      const topStrengths = subtestScores
        .sort((a, b) => b.pct - a.pct)
        .slice(0, 3)
        .map((s) => s.name);

      current.bakum = {
        totalRawScore: totalRaw,
        topStrengths,
        resultId: row.resultId,
      };
    }

    // 4. MINAT JABATAN
    if (cat.includes('MINAT')) {
      const bScores = reportData?.bagian_1?.result?.bidangMinatScore || {};
      const match = matchCareerAndMajors(bScores);

      current.minat = {
        topFields: match.topRankings.slice(0, 2).map((r) => r.field),
        recommendedCareers: match.recommendedCareers,
        recommendedMajors: match.recommendedMajors,
        resultId: row.resultId,
      };
    }

    // 5. CPM & TIU
    if (cat === 'CPM') {
      current.cpm = {
        score: reportData?.score?.correct || reportData?.totalScore || 0,
        resultId: row.resultId,
      };
    }

    if (cat === 'TIU' || cat === 'INTELIGENSI_UMUM') {
      current.tiu = {
        score: reportData?.score?.correct || reportData?.totalScore || 0,
        resultId: row.resultId,
      };
    }
  }

  const studentsList = Array.from(studentMap.values());

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-blue-100 text-blue-700">
              <Compass size={18} />
            </span>
            <h2 className="text-2xl font-black tracking-tight text-slate-900">
              Decision Dashboard
            </h2>
            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-2xs">
              Sistem Ringkasan Mascons
            </span>
          </div>
          <p className="text-sm text-slate-500">
            Pusat sintesis keputusan & bimbingan karir: Matriks silang Kognitif, Bakat, Karakter, dan Minat per siswa.
          </p>
        </div>
      </div>

      {/* Main Matrix Component */}
      <DecisionMatrixView students={studentsList} />
    </div>
  );
}
