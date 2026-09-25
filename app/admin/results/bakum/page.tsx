import React from 'react';
import { db } from '@/app/lib/db';
import { testResults, testParticipants, users } from '@/db/schema';
import { desc, eq, inArray, like } from 'drizzle-orm';
import ExportExcelButton from '@/components/admin/ExportExcelButton';
import { ArrowLeft, Trash2, FileDown } from 'lucide-react';
import Link from 'next/link';
import { revalidatePath } from 'next/cache';

export default async function BakumRecapPage() {
  async function deleteDummyData() {
    'use server';
    // Delete all simulated users
    await db.delete(users).where(like(users.email, 'simulasi%@example.com'));
    revalidatePath('/admin/results/bakum');
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
    .where(inArray(testResults.category, ['BAKUM', 'bakum']))
    .orderBy(desc(testResults.createdAt));

  // Process data for the table and export
  const processedData = results.map((result) => {
    const reportData = result.reportData as any;
    
    // Extract BAKUM scores and dynamically recalculate category based on new norms
    const getPersoalan = (key: string, maxScore: number) => {
      let correct = 0;
      if (reportData && reportData[key] && reportData[key].score) {
        correct = reportData[key].score.correct || 0;
      }
      
      let category = 'Rendah';
      if (maxScore === 20) {
        if (correct >= 16) category = 'Tinggi';
        else if (correct >= 8) category = 'Sedang';
      } else if (maxScore === 30) {
        if (correct >= 21) category = 'Tinggi';
        else if (correct >= 11) category = 'Sedang';
      } else if (maxScore === 40) {
        if (correct >= 31) category = 'Tinggi';
        else if (correct >= 16) category = 'Sedang';
      } else if (maxScore === 80) {
        if (correct >= 51) category = 'Tinggi';
        else if (correct >= 31) category = 'Sedang';
      }

      return { correct, category };
    };

    const p2 = getPersoalan('persoalan_2', 40);
    const p3 = getPersoalan('persoalan_3', 20);
    const p4 = getPersoalan('persoalan_4', 40);
    const p5 = getPersoalan('persoalan_5', 20);
    const p6 = getPersoalan('persoalan_6', 30);
    const p7 = getPersoalan('persoalan_7', 20);
    const p8 = getPersoalan('persoalan_8', 20);
    const p9 = getPersoalan('persoalan_9', 20);
    const p10 = getPersoalan('persoalan_10', 80);

    const totalRawScore = 
      p2.correct + p3.correct + p4.correct + p5.correct + 
      p6.correct + p7.correct + p8.correct + p9.correct + p10.correct;

    return {
      id: result.id,
      userName: result.userName,
      p2, p3, p4, p5, p6, p7, p8, p9, p10,
      totalRawScore,
    };
  });

  const CategoryBadge = ({ category }: { category: string }) => {
    let colorClass = 'bg-slate-100 text-slate-700';
    if (category.toLowerCase() === 'tinggi') colorClass = 'bg-emerald-100 text-emerald-800';
    if (category.toLowerCase() === 'sedang') colorClass = 'bg-amber-100 text-amber-800';
    if (category.toLowerCase() === 'rendah') colorClass = 'bg-rose-100 text-rose-800';

    return (
      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${colorClass}`}>
        {category}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link href="/admin/results" className="p-2.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5" style={{ background: '#fff', border: '1px solid rgba(29,78,216,0.1)', boxShadow: '0 2px 10px rgba(29,78,216,0.04)' }}>
              <ArrowLeft size={20} />
            </Link>
            <h2 className="text-2xl font-extrabold tracking-tight" style={{ color: '#0a1628' }}>BAKUM Master Recap</h2>
          </div>
          <p className="text-sm" style={{ color: '#64748b' }}>View detailed BAKUM (Tes Bakat Umum) results per section and export to Excel.</p>
        </div>
        
        <div className="flex gap-3">
          <form action={deleteDummyData}>
            <button type="submit" className="inline-flex items-center px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 hover:-translate-y-0.5" style={{ background: 'rgba(239,68,68,0.08)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.15)' }}>
              <Trash2 size={16} className="mr-2" />
              Hapus Dummy
            </button>
          </form>
          <ExportExcelButton data={processedData} />
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: '#fff', border: '1px solid rgba(29,78,216,0.08)', boxShadow: '0 2px 20px rgba(29,78,216,0.04)' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead style={{ background: 'rgba(29,78,216,0.03)', borderBottom: '1px solid rgba(29,78,216,0.06)' }}>
              <tr>
                <th rowSpan={2} className="px-4 py-3 text-sm font-semibold text-slate-800 border-r border-slate-100 align-middle text-center">NO</th>
                <th rowSpan={2} className="px-4 py-3 text-sm font-semibold text-slate-800 border-r border-slate-100 align-middle">NAMA LENGKAP</th>
                <th colSpan={2} className="px-2 py-2 text-xs font-semibold text-slate-800 border-r border-b border-slate-100 text-center">P2 (Max 40)</th>
                <th colSpan={2} className="px-2 py-2 text-xs font-semibold text-slate-800 border-r border-b border-slate-100 text-center">P3 (Max 20)</th>
                <th colSpan={2} className="px-2 py-2 text-xs font-semibold text-slate-800 border-r border-b border-slate-100 text-center">P4 (Max 40)</th>
                <th colSpan={2} className="px-2 py-2 text-xs font-semibold text-slate-800 border-r border-b border-slate-100 text-center">P5 (Max 20)</th>
                <th colSpan={2} className="px-2 py-2 text-xs font-semibold text-slate-800 border-r border-b border-slate-100 text-center">P6 (Max 30)</th>
                <th colSpan={2} className="px-2 py-2 text-xs font-semibold text-slate-800 border-r border-b border-slate-100 text-center">P7 (Max 20)</th>
                <th colSpan={2} className="px-2 py-2 text-xs font-semibold text-slate-800 border-r border-b border-slate-100 text-center">P8 (Max 20)</th>
                <th colSpan={2} className="px-2 py-2 text-xs font-semibold text-slate-800 border-r border-b border-slate-100 text-center">P9 (Max 20)</th>
                <th colSpan={2} className="px-2 py-2 text-xs font-semibold text-slate-800 border-r border-b border-slate-100 text-center">P10 (Max 80)</th>
                <th rowSpan={2} className="px-4 py-3 text-sm font-bold text-slate-800 border-r border-slate-100 align-middle text-center">TOTAL<br/><span className="text-xs font-normal">(Max 290)</span></th>
                <th rowSpan={2} className="px-4 py-3 text-sm font-semibold text-slate-800 align-middle text-center">AKSI</th>
              </tr>
              <tr className="bg-blue-50/50/50">
                {[...Array(9)].map((_, i) => (
                  <React.Fragment key={i}>
                    <th className="px-2 py-2 text-[10px] font-semibold text-blue-700 border-r border-slate-100 text-center">B</th>
                    <th className="px-2 py-2 text-[10px] font-semibold text-blue-700 border-r border-slate-100 text-center">KAT</th>
                  </React.Fragment>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {processedData.length === 0 ? (
                <tr>
                  <td colSpan={23} className="px-6 py-12 text-center text-slate-600/70 italic">
                    Belum ada data hasil tes BAKUM.
                  </td>
                </tr>
              ) : processedData.map((item, index) => (
                <tr key={item.id} className="transition-colors duration-150">
                  <td className="px-4 py-3 font-medium border-r border-slate-100 text-center">{index + 1}</td>
                  <td className="px-4 py-3 font-medium border-r border-slate-100">{item.userName}</td>
                  
                  {/* P2 */}
                  <td className="px-2 py-3 text-center border-r border-purple-50 text-slate-700">{item.p2.correct}</td>
                  <td className="px-2 py-3 text-center border-r border-slate-100"><CategoryBadge category={item.p2.category} /></td>
                  
                  {/* P3 */}
                  <td className="px-2 py-3 text-center border-r border-purple-50 text-slate-700">{item.p3.correct}</td>
                  <td className="px-2 py-3 text-center border-r border-slate-100"><CategoryBadge category={item.p3.category} /></td>
                  
                  {/* P4 */}
                  <td className="px-2 py-3 text-center border-r border-purple-50 text-slate-700">{item.p4.correct}</td>
                  <td className="px-2 py-3 text-center border-r border-slate-100"><CategoryBadge category={item.p4.category} /></td>
                  
                  {/* P5 */}
                  <td className="px-2 py-3 text-center border-r border-purple-50 text-slate-700">{item.p5.correct}</td>
                  <td className="px-2 py-3 text-center border-r border-slate-100"><CategoryBadge category={item.p5.category} /></td>
                  
                  {/* P6 */}
                  <td className="px-2 py-3 text-center border-r border-purple-50 text-slate-700">{item.p6.correct}</td>
                  <td className="px-2 py-3 text-center border-r border-slate-100"><CategoryBadge category={item.p6.category} /></td>
                  
                  {/* P7 */}
                  <td className="px-2 py-3 text-center border-r border-purple-50 text-slate-700">{item.p7.correct}</td>
                  <td className="px-2 py-3 text-center border-r border-slate-100"><CategoryBadge category={item.p7.category} /></td>
                  
                  {/* P8 */}
                  <td className="px-2 py-3 text-center border-r border-purple-50 text-slate-700">{item.p8.correct}</td>
                  <td className="px-2 py-3 text-center border-r border-slate-100"><CategoryBadge category={item.p8.category} /></td>
                  
                  {/* P9 */}
                  <td className="px-2 py-3 text-center border-r border-purple-50 text-slate-700">{item.p9.correct}</td>
                  <td className="px-2 py-3 text-center border-r border-slate-100"><CategoryBadge category={item.p9.category} /></td>
                  
                  {/* P10 */}
                  <td className="px-2 py-3 text-center border-r border-purple-50 text-slate-700">{item.p10.correct}</td>
                  <td className="px-2 py-3 text-center border-r border-slate-100"><CategoryBadge category={item.p10.category} /></td>

                  {/* Total */}
                  <td className="px-4 py-3 text-center font-bold text-slate-800 border-r border-slate-100 bg-blue-50/50/30">{item.totalRawScore}</td>
                  
                  <td className="px-4 py-3 text-center">
                    <Link 
                      href={`/admin/results/${item.id}`}
                      className="inline-flex items-center justify-center p-2 rounded-lg transition-all duration-200 hover:-translate-y-0.5" style={{ background: 'rgba(29,78,216,0.06)', color: '#2563eb' }}
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
