import React from 'react';
import { db } from '@/app/lib/db';
import { testResults, testParticipants, users } from '@/db/schema';
import { desc, eq, inArray, like } from 'drizzle-orm';
import ExportExcelButton from '@/components/admin/ExportExcelButton';
import { ArrowLeft, Trash2, FileDown } from 'lucide-react';
import Link from 'next/link';
import { revalidatePath } from 'next/cache';

export default async function CpmRecapPage() {
  async function deleteDummyData() {
    'use server';
    // Delete all simulated users
    await db.delete(users).where(like(users.email, 'simulasi%@example.com'));
    revalidatePath('/admin/results/cpm');
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
    .where(inArray(testResults.category, ['CPM', 'cpm']))
    .orderBy(desc(testResults.createdAt));

  // Process data for the table and export
  const processedData = results.map((result) => {
    const reportData = result.reportData as any;
    
    // Extract CPM score
    let correctA = 0;
    let correctB = 0;
    let correctAB = 0;
    let totalCorrect = 0;
    let totalWrong = 0;
    let accuracy = 0;

    if (reportData) {
      if (reportData.scoreByType) {
        correctA = reportData.scoreByType['A'] || 0;
        correctB = reportData.scoreByType['B'] || 0;
        correctAB = reportData.scoreByType['AB'] || 0;
      }
      totalCorrect = reportData.correctCount || 0;
      totalWrong = reportData.incorrectCount || 0;
      accuracy = reportData.accuracy || 0;
    }

    return {
      id: result.id,
      userName: result.userName,
      correctA,
      correctB,
      correctAB,
      totalCorrect,
      totalWrong,
      percentage: (accuracy * 100).toFixed(1) + '%',
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
            <h2 className="text-2xl font-bold">CPM Master Recap</h2>
          </div>
          <p className="text-purple-800/70">View all CPM (Coloured Progressive Matrices) test results and export to Excel.</p>
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
                <th className="px-4 py-3 text-sm font-semibold text-purple-900 border-r border-purple-100 text-center">BENAR TIPE A<br/><span className="text-xs font-normal">(Max 12)</span></th>
                <th className="px-4 py-3 text-sm font-semibold text-purple-900 border-r border-purple-100 text-center">BENAR TIPE B<br/><span className="text-xs font-normal">(Max 12)</span></th>
                <th className="px-4 py-3 text-sm font-semibold text-purple-900 border-r border-purple-100 text-center">BENAR TIPE AB<br/><span className="text-xs font-normal">(Max 12)</span></th>
                <th className="px-4 py-3 text-sm font-bold text-purple-900 border-r border-purple-100 text-center">TOTAL BENAR<br/><span className="text-xs font-normal">(Max 36)</span></th>
                <th className="px-4 py-3 text-sm font-semibold text-purple-900 border-r border-purple-100 text-center">TOTAL SALAH</th>
                <th className="px-4 py-3 text-sm font-semibold text-purple-900 border-r border-purple-100 text-center">PERSENTASE</th>
                <th className="px-4 py-3 text-sm font-semibold text-purple-900">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-100">
              {processedData.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-purple-800/70 italic">
                    Belum ada data hasil tes CPM.
                  </td>
                </tr>
              ) : processedData.map((item, index) => (
                <tr key={item.id} className="hover:bg-purple-50/50 transition-colors">
                  <td className="px-4 py-3 font-medium border-r border-purple-100">{index + 1}</td>
                  <td className="px-4 py-3 font-medium border-r border-purple-100">{item.userName}</td>
                  <td className="px-4 py-3 text-center border-r border-purple-100 text-slate-700">{item.correctA}</td>
                  <td className="px-4 py-3 text-center border-r border-purple-100 text-slate-700">{item.correctB}</td>
                  <td className="px-4 py-3 text-center border-r border-purple-100 text-slate-700">{item.correctAB}</td>
                  <td className="px-4 py-3 text-center font-bold text-purple-900 border-r border-purple-100 bg-purple-50/30">{item.totalCorrect}</td>
                  <td className="px-4 py-3 text-center border-r border-purple-100 text-slate-700">{item.totalWrong}</td>
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
