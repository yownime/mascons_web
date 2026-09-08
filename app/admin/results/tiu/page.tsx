import React from 'react';
import { db } from '@/app/lib/db';
import { testResults, testParticipants, users } from '@/db/schema';
import { desc, eq, inArray, like } from 'drizzle-orm';
import ExportExcelButton from '@/components/admin/ExportExcelButton';
import { ArrowLeft, Trash2, FileDown } from 'lucide-react';
import Link from 'next/link';
import { revalidatePath } from 'next/cache';

export default async function TiuRecapPage() {
  async function deleteDummyData() {
    'use server';
    // Delete all simulated users
    await db.delete(users).where(like(users.email, 'simulasi%@example.com'));
    revalidatePath('/admin/results/tiu');
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
    .where(inArray(testResults.category, ['TIU', 'tiu']))
    .orderBy(desc(testResults.createdAt));

  // Process data for the table and export
  const processedData = results.map((result) => {
    const reportData = result.reportData as any;
    
    // Extract TIU score
    let correct = 0;
    let wrong = 0;
    let unanswered = 0;
    let percentage = 0;

    if (reportData && reportData.score) {
      correct = reportData.score.correct || 0;
      wrong = reportData.score.wrong || 0;
      unanswered = reportData.score.unanswered || 0;
      percentage = reportData.score.percentage || 0;
    }

    return {
      id: result.id,
      userName: result.userName,
      correct,
      wrong,
      unanswered,
      percentage: percentage.toFixed(1) + '%',
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
            <h2 className="text-2xl font-bold">TIU Master Recap</h2>
          </div>
          <p className="text-purple-800/70">View all TIU (Tes Inteligensi Umum) test results and export to Excel.</p>
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
                <th className="px-4 py-3 text-sm font-bold text-purple-900 border-r border-purple-100 text-center">BENAR<br/><span className="text-xs font-normal">(Max 30)</span></th>
                <th className="px-4 py-3 text-sm font-semibold text-purple-900 border-r border-purple-100 text-center">SALAH</th>
                <th className="px-4 py-3 text-sm font-semibold text-purple-900 border-r border-purple-100 text-center">KOSONG</th>
                <th className="px-4 py-3 text-sm font-semibold text-purple-900 border-r border-purple-100 text-center">PERSENTASE</th>
                <th className="px-4 py-3 text-sm font-semibold text-purple-900">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-100">
              {processedData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-purple-800/70 italic">
                    Belum ada data hasil tes TIU.
                  </td>
                </tr>
              ) : processedData.map((item, index) => (
                <tr key={item.id} className="hover:bg-purple-50/50 transition-colors">
                  <td className="px-4 py-3 font-medium border-r border-purple-100">{index + 1}</td>
                  <td className="px-4 py-3 font-medium border-r border-purple-100">{item.userName}</td>
                  <td className="px-4 py-3 text-center font-bold text-purple-900 border-r border-purple-100 bg-purple-50/30">{item.correct}</td>
                  <td className="px-4 py-3 text-center border-r border-purple-100 text-slate-700">{item.wrong}</td>
                  <td className="px-4 py-3 text-center border-r border-purple-100 text-slate-700">{item.unanswered}</td>
                  <td className="px-4 py-3 text-center border-r border-purple-100 text-slate-700">{item.percentage}</td>
                  <td className="px-4 py-3 text-center">
                    <Link 
                      href={`/admin/results/${item.id}`}
                      className="inline-flex items-center justify-center p-2 text-purple-600 bg-purple-50 hover:bg-purple-100 hover:text-purple-800 rounded-lg transition-colors"
                      title="Lihat Detail / Download Laporan"
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
