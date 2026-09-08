import React from 'react';
import { db } from '@/app/lib/db';
import { testResults, testParticipants, users } from '@/db/schema';
import { desc, eq, inArray, like } from 'drizzle-orm';
import ExportExcelButton from '@/components/admin/ExportExcelButton';
import { ArrowLeft, Trash2, FileDown } from 'lucide-react';
import Link from 'next/link';
import { revalidatePath } from 'next/cache';

export default async function EppsRecapPage() {
  async function deleteDummyData() {
    'use server';
    // Delete all simulated users
    await db.delete(users).where(like(users.email, 'simulasi%@example.com'));
    revalidatePath('/admin/results/epps');
  }

  const results = await db
    .select({
      id: testResults.id,
      participantId: testResults.participantId,
      reportData: testResults.reportData,
      createdAt: testResults.createdAt,
      userName: users.fullName,
    })
    .from(testResults)
    .innerJoin(testParticipants, eq(testResults.participantId, testParticipants.id))
    .innerJoin(users, eq(testParticipants.userId, users.id))
    .where(inArray(testResults.category, ['EPPS', 'epps']))
    .orderBy(desc(testResults.createdAt));

  // Process data for the table and export
  const processedData = results.map((result) => {
    const reportData = result.reportData as any;
    
    // Extract EPPS raw scores. Fallback to 0 if not found.
    const eppsDimensions = [
      'ACH', 'DEF', 'ORD', 'EXH', 'AUT', 'AFF', 'INT', 'SUC', 
      'DOM', 'ABA', 'NUR', 'CHG', 'END', 'HET', 'AGG'
    ];
    
    const epps_scores = eppsDimensions.map(dim => {
      // First try to get from mobile's exact payload: reportData.rawScores[dim]
      if (reportData?.rawScores && reportData.rawScores[dim] !== undefined) {
        return reportData.rawScores[dim];
      }
      // Fallback 1: if it's nested in dimensionScores
      if (reportData?.dimensionScores && reportData.dimensionScores[dim]) {
        return reportData.dimensionScores[dim].total || 0;
      }
      // Fallback 2: for the mockData structure
      if (reportData?.normaResults && reportData.normaResults[dim] !== undefined) {
        return reportData.normaResults[dim];
      }
      return 0;
    });

    // Mobile sends: reportData.consistency.consistentPairs
    // Mock sends: reportData.consistencyCheck.consistentPairs
    const epps_consistency = reportData?.consistency?.consistentPairs || reportData?.consistencyCheck?.consistentPairs || 0;

    // For IQ and Kraepelin, they might not be in the EPPS result. 
    // They usually come from other test submissions. 
    // For now, we will leave them blank or extract if available in personalData/reportData.
    const iq = ''; 
    const kraepelin_kecepatan = '';
    const kraepelin_ketelitian = '';
    const kraepelin_keajegan = '';

    return {
      id: result.id,
      userName: result.userName,
      iq,
      kraepelin_kecepatan,
      kraepelin_ketelitian,
      kraepelin_keajegan,
      epps_scores,
      epps_consistency,
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <Link href="/admin/results" className="text-purple-600 hover:text-purple-800 transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <h2 className="text-2xl font-bold">EPPS Master Recap</h2>
          </div>
          <p className="text-purple-800/70">View all EPPS test results and export to Excel (TO 1 Format).</p>
        </div>
        
        <div className="flex gap-3">
          <form action={deleteDummyData}>
            <button type="submit" className="inline-flex items-center px-4 py-2 bg-rose-100 text-rose-700 text-sm font-semibold rounded-xl hover:bg-rose-200 transition-colors shadow-sm">
              <Trash2 size={16} className="mr-2" />
              Hapus Dummy
            </button>
          </form>
          <ExportExcelButton data={processedData} />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-purple-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-purple-50 border-b border-purple-100">
              <tr>
                <th className="px-4 py-3 text-sm font-semibold text-purple-900 border-r border-purple-100">NO</th>
                <th className="px-4 py-3 text-sm font-semibold text-purple-900 border-r border-purple-100">NAMA LENGKAP</th>
                <th className="px-4 py-3 text-sm font-semibold text-purple-900 border-r border-purple-100" colSpan={15} style={{textAlign: 'center'}}>EPP65 (Skor Mentah)</th>
                <th className="px-4 py-3 text-sm font-semibold text-purple-900 border-r border-purple-100">KONSISTENSI</th>
                <th className="px-4 py-3 text-sm font-semibold text-purple-900">AKSI</th>
              </tr>
              <tr className="bg-purple-50/50 border-b border-purple-100">
                <th className="border-r border-purple-100"></th>
                <th className="border-r border-purple-100"></th>
                {['ACH', 'DEF', 'ORD', 'EXH', 'AUT', 'AFF', 'INT', 'SUC', 'DOM', 'ABA', 'NUR', 'CHG', 'END', 'HET', 'AGG'].map(dim => (
                  <th key={dim} className="px-2 py-2 text-xs font-semibold text-purple-700 border-r border-purple-100">{dim}</th>
                ))}
                <th className="border-r border-purple-100"></th>
                <th></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-100">
              {processedData.length === 0 ? (
                <tr>
                  <td colSpan={18} className="px-6 py-12 text-center text-purple-800/70 italic">
                    Belum ada data hasil tes EPPS.
                  </td>
                </tr>
              ) : processedData.map((item, index) => (
                <tr key={item.id} className="hover:bg-purple-50/50 transition-colors">
                  <td className="px-4 py-3 font-medium border-r border-purple-100">{index + 1}</td>
                  <td className="px-4 py-3 font-medium border-r border-purple-100">{item.userName}</td>
                  {item.epps_scores.map((score, i) => (
                    <td key={i} className="px-2 py-3 text-center border-r border-purple-50 text-slate-700">{score}</td>
                  ))}
                  <td className="px-4 py-3 text-center font-semibold text-purple-900 border-r border-purple-100">{item.epps_consistency}</td>
                  <td className="px-4 py-3 text-center">
                    <Link 
                      href={`/admin/results/${item.id}`}
                      className="inline-flex items-center justify-center p-2 text-purple-600 bg-purple-50 hover:bg-purple-100 hover:text-purple-800 rounded-lg transition-colors"
                      title="Download Sertifikat"
                    >
                      <FileDown size={18} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
