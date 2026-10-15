import React from 'react';
import { db } from '@/app/lib/db';
import { testResults, testParticipants, users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import CertificateViewer from '@/components/admin/CertificateViewer';
import EppsRadarChart from '@/components/admin/EppsRadarChart';
import BakumBarChart from '@/components/admin/BakumBarChart';
import { matchCareerAndMajors } from '@/app/lib/careerMatching';
import { notFound } from 'next/navigation';
import { ArrowLeft, Award, Calendar, Clock, UserCheck, Briefcase, GraduationCap } from 'lucide-react';
import Link from 'next/link';

export default async function CertificatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const resultId = parseInt(id, 10);
  
  if (isNaN(resultId)) {
    return notFound();
  }

  const data = await db
    .select({
      id: testResults.id,
      category: testResults.category,
      createdAt: testResults.createdAt,
      reportData: testResults.reportData,
      scoreSummary: testResults.scoreSummary,
      userName: users.fullName,
      personalData: testParticipants.personalData,
    })
    .from(testResults)
    .innerJoin(testParticipants, eq(testResults.participantId, testParticipants.id))
    .innerJoin(users, eq(testParticipants.userId, users.id))
    .where(eq(testResults.id, resultId))
    .limit(1);

  if (data.length === 0) {
    return notFound();
  }

  const certificateData = data[0];
  const reportData = (certificateData.reportData || {}) as any;
  const personalData = (certificateData.personalData || {}) as any;
  const categoryUpper = certificateData.category.toUpperCase();

  // Helper to map category enum/string to proper readable name
  const getCategoryName = (cat: string) => {
    const c = cat.toUpperCase();
    if (c === 'EPPS') return 'Tes EPPS (Edwards Personal Preference Schedule)';
    if (c === 'CFIT' || c === 'CFIT_SKALA2' || c === 'CFIT_SKALA3') return 'Tes CFIT (Culture Fair Intelligence Test)';
    if (c === 'CPM') return 'Tes CPM (Coloured Progressive Matrices)';
    if (c === 'BAKUM') return 'Tes BAKUM (Bakat Umum)';
    if (c === 'TIU') return 'Tes TIU (Tes Inteligensi Umum)';
    if (c === 'MINAT_JABATAN' || c === 'MINAT JABATAN') return 'Tes Minat Jabatan';
    if (c === 'KRAEPELIN') return 'Tes Kraepelin';
    return `Tes ${c}`;
  };

  // Extract EPPS scores if EPPS
  const eppsScores: { [dim: string]: number } = {};
  if (categoryUpper === 'EPPS') {
    const dimensions = ['ACH', 'DEF', 'ORD', 'EXH', 'AUT', 'AFF', 'INT', 'SUC', 'DOM', 'ABA', 'NUR', 'CHG', 'END', 'HET', 'AGG'];
    dimensions.forEach((d) => {
      eppsScores[d] =
        reportData?.rawScores?.[d] ??
        reportData?.dimensionScores?.[d]?.total ??
        reportData?.normaResults?.[d] ??
        0;
    });
  }
  const eppsConsistency =
    reportData?.consistency?.score ??
    reportData?.consistency?.consistentPairs ??
    reportData?.consistencyCheck?.consistentPairs;

  // Extract BAKUM scores if BAKUM
  const bakumScores = {
    p2: reportData?.persoalan_2?.score?.correct || 0,
    p3: reportData?.persoalan_3?.score?.correct || 0,
    p4: reportData?.persoalan_4?.score?.correct || 0,
    p5: reportData?.persoalan_5?.score?.correct || 0,
    p6: reportData?.persoalan_6?.score?.correct || 0,
    p7: reportData?.persoalan_7?.score?.correct || 0,
    p8: reportData?.persoalan_8?.score?.correct || 0,
    p9: reportData?.persoalan_9?.score?.correct || 0,
    p10: reportData?.persoalan_10?.score?.correct || 0,
  };

  // Extract Minat Jabatan career match if Minat Jabatan
  let careerMatch: ReturnType<typeof matchCareerAndMajors> | null = null;
  if (categoryUpper.includes('MINAT')) {
    const bScores = reportData?.bagian_1?.result?.bidangMinatScore || {};
    careerMatch = matchCareerAndMajors(bScores);
  }

  // Chronological age display
  const chrono = personalData?.chronologicalAge;
  const birthDate = personalData?.birthDate;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link 
            href={`/admin/results`}
            className="p-2.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5 bg-white border border-slate-200 shadow-xs"
            title="Kembali ke Hasil"
          >
            <ArrowLeft size={18} className="text-blue-600" />
          </Link>
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
              Hasil Tes: {certificateData.userName}
            </h2>
            <p className="text-sm text-slate-500">
              {getCategoryName(certificateData.category)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {chrono && (
            <div className="px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold flex items-center gap-1.5">
              <Clock size={14} />
              Usia: {chrono.years} Thn {chrono.months} Bln
            </div>
          )}
          {birthDate && (
            <div className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium flex items-center gap-1.5">
              <Calendar size={14} />
              Lahir: {birthDate}
            </div>
          )}
        </div>
      </div>

      {/* Special Visualization: EPPS Radar Chart */}
      {categoryUpper === 'EPPS' && (
        <EppsRadarChart
          scores={eppsScores}
          consistencyScore={eppsConsistency}
          userName={certificateData.userName}
        />
      )}

      {/* Special Visualization: BAKUM Bar Chart */}
      {categoryUpper === 'BAKUM' && (
        <BakumBarChart scores={bakumScores} userName={certificateData.userName} />
      )}

      {/* Special Visualization: Minat Jabatan Career Recommendations */}
      {careerMatch && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Rekomendasi Karir & Program Studi (Career Matching)
              </h3>
              <p className="text-xs text-slate-500">
                Pencocokan minat dominan siswa ke bidang profesi dan jurusan perguruan tinggi
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-900 uppercase tracking-wider">
                <Briefcase size={15} />
                Rekomendasi Profesi / Karir
              </div>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {careerMatch.recommendedCareers.map((c, i) => (
                  <li key={i} className="flex items-center gap-2 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 uppercase tracking-wider">
                <GraduationCap size={15} />
                Rekomendasi Program Studi / Kuliah
              </div>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {careerMatch.recommendedMajors.map((m, i) => (
                  <li key={i} className="flex items-center gap-2 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Certificate / PDF Container */}
      <div
        className="rounded-2xl p-4 md:p-8 overflow-x-auto min-h-[70vh] flex flex-col items-center justify-center bg-slate-50/50 border border-slate-200"
      >
        <div className="w-full max-w-4xl mb-4 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Award size={16} className="text-blue-600" />
            Dokumen Sertifikat & Laporan Individual
          </span>
        </div>
        <CertificateViewer 
          userName={certificateData.userName} 
          category={getCategoryName(certificateData.category)}
          date={certificateData.createdAt}
        />
      </div>
    </div>
  );
}
