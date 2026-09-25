import React from 'react';
import { db } from '@/app/lib/db';
import { testResults, testParticipants, users } from '@/db/schema';
import { desc, eq, inArray, like } from 'drizzle-orm';
import ExportExcelButton from '@/components/admin/ExportExcelButton';
import { ArrowLeft, Trash2, FileDown, Lightbulb } from 'lucide-react';
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link
              href="/admin/results"
              className="p-2.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5"
              style={{
                background: '#fff',
                border: '1px solid rgba(29,78,216,0.1)',
                boxShadow: '0 2px 10px rgba(29,78,216,0.04)',
              }}
            >
              <ArrowLeft size={18} style={{ color: '#2563eb' }} />
            </Link>
            <h2 className="text-2xl font-extrabold tracking-tight" style={{ color: '#0a1628' }}>
              TIU Master Recap
            </h2>
          </div>
          <p className="text-sm" style={{ color: '#64748b' }}>
            Lihat semua hasil tes TIU (Tes Inteligensi Umum) dan ekspor ke Excel.
          </p>
        </div>
        
        <div className="flex gap-3">
          <form action={deleteDummyData}>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 hover:-translate-y-0.5"
              style={{
                background: 'rgba(239,68,68,0.08)',
                color: '#ef4444',
                border: '1px solid rgba(239,68,68,0.15)',
              }}
            >
              <Trash2 size={15} className="mr-2" />
              Hapus Dummy
            </button>
          </form>
          <ExportExcelButton data={processedData} />
        </div>
      </div>

      {/* Table */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: '#fff',
          border: '1px solid rgba(29,78,216,0.08)',
          boxShadow: '0 2px 20px rgba(29,78,216,0.04)',
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr style={{ background: 'rgba(29,78,216,0.03)', borderBottom: '1px solid rgba(29,78,216,0.06)' }}>
                <th className="px-4 py-3.5 text-[11px] font-bold uppercase tracking-wider" style={{ color: '#64748b', borderRight: '1px solid rgba(29,78,216,0.06)' }}>NO</th>
                <th className="px-4 py-3.5 text-[11px] font-bold uppercase tracking-wider" style={{ color: '#64748b', borderRight: '1px solid rgba(29,78,216,0.06)' }}>NAMA LENGKAP</th>
                <th className="px-4 py-3.5 text-[11px] font-bold uppercase tracking-wider text-center" style={{ color: '#2563eb', borderRight: '1px solid rgba(29,78,216,0.06)' }}>
                  BENAR<br/><span className="text-[10px] font-normal" style={{ color: '#94a3b8' }}>(Max 30)</span>
                </th>
                <th className="px-4 py-3.5 text-[11px] font-bold uppercase tracking-wider text-center" style={{ color: '#64748b', borderRight: '1px solid rgba(29,78,216,0.06)' }}>SALAH</th>
                <th className="px-4 py-3.5 text-[11px] font-bold uppercase tracking-wider text-center" style={{ color: '#64748b', borderRight: '1px solid rgba(29,78,216,0.06)' }}>KOSONG</th>
                <th className="px-4 py-3.5 text-[11px] font-bold uppercase tracking-wider text-center" style={{ color: '#64748b', borderRight: '1px solid rgba(29,78,216,0.06)' }}>PERSENTASE</th>
                <th className="px-4 py-3.5 text-[11px] font-bold uppercase tracking-wider text-center" style={{ color: '#64748b' }}>AKSI</th>
              </tr>
            </thead>
            <tbody>
              {processedData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'rgba(29,78,216,0.06)' }}>
                        <Lightbulb size={24} style={{ color: '#94a3b8' }} />
                      </div>
                      <p className="text-sm font-medium" style={{ color: '#94a3b8' }}>Belum ada data hasil tes TIU</p>
                    </div>
                  </td>
                </tr>
              ) : processedData.map((item, index) => (
                <tr
                  key={item.id}
                  className="transition-colors duration-150"
                  style={{ borderBottom: index < processedData.length - 1 ? '1px solid rgba(29,78,216,0.04)' : 'none' }}
                >
                  <td className="px-4 py-3 text-sm font-medium" style={{ color: '#0a1628', borderRight: '1px solid rgba(29,78,216,0.04)' }}>{index + 1}</td>
                  <td className="px-4 py-3 text-sm font-semibold" style={{ color: '#0a1628', borderRight: '1px solid rgba(29,78,216,0.04)' }}>{item.userName}</td>
                  <td className="px-4 py-3 text-center text-sm font-bold" style={{ color: '#2563eb', borderRight: '1px solid rgba(29,78,216,0.04)', background: 'rgba(37,99,235,0.03)' }}>{item.correct}</td>
                  <td className="px-4 py-3 text-center text-sm" style={{ color: '#475569', borderRight: '1px solid rgba(29,78,216,0.04)' }}>{item.wrong}</td>
                  <td className="px-4 py-3 text-center text-sm" style={{ color: '#475569', borderRight: '1px solid rgba(29,78,216,0.04)' }}>{item.unanswered}</td>
                  <td className="px-4 py-3 text-center text-sm" style={{ color: '#475569', borderRight: '1px solid rgba(29,78,216,0.04)' }}>{item.percentage}</td>
                  <td className="px-4 py-3 text-center">
                    <Link 
                      href={`/admin/results/${item.id}`}
                      className="inline-flex items-center justify-center p-2 rounded-lg transition-all duration-200 hover:-translate-y-0.5"
                      style={{
                        background: 'rgba(29,78,216,0.06)',
                        color: '#2563eb',
                      }}
                      title="Lihat Detail / Download Laporan"
                    >
                      <FileDown size={16} />
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
