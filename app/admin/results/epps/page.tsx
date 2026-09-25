import React from 'react';
import { db } from '@/app/lib/db';
import { testResults, testParticipants, users } from '@/db/schema';
import { desc, eq, inArray, like } from 'drizzle-orm';
import ExportExcelButton from '@/components/admin/ExportExcelButton';
import { ArrowLeft, Trash2, FileDown, Users } from 'lucide-react';
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
              EPPS Master Recap
            </h2>
          </div>
          <p className="text-sm" style={{ color: '#64748b' }}>
            Lihat semua hasil tes EPPS dan ekspor ke Excel (Format TO 1).
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
                <th className="px-4 py-3.5 text-[11px] font-bold uppercase tracking-wider text-center" colSpan={15} style={{ color: '#2563eb', borderRight: '1px solid rgba(29,78,216,0.06)' }}>EPPS (Skor Mentah)</th>
                <th className="px-4 py-3.5 text-[11px] font-bold uppercase tracking-wider text-center" style={{ color: '#64748b', borderRight: '1px solid rgba(29,78,216,0.06)' }}>KONSISTENSI</th>
                <th className="px-4 py-3.5 text-[11px] font-bold uppercase tracking-wider text-center" style={{ color: '#64748b' }}>AKSI</th>
              </tr>
              <tr style={{ background: 'rgba(29,78,216,0.02)', borderBottom: '1px solid rgba(29,78,216,0.06)' }}>
                <th style={{ borderRight: '1px solid rgba(29,78,216,0.04)' }}></th>
                <th style={{ borderRight: '1px solid rgba(29,78,216,0.04)' }}></th>
                {['ACH', 'DEF', 'ORD', 'EXH', 'AUT', 'AFF', 'INT', 'SUC', 'DOM', 'ABA', 'NUR', 'CHG', 'END', 'HET', 'AGG'].map(dim => (
                  <th
                    key={dim}
                    className="px-2 py-2 text-[10px] font-bold text-center"
                    style={{ color: '#6366f1', borderRight: '1px solid rgba(29,78,216,0.04)' }}
                  >
                    {dim}
                  </th>
                ))}
                <th style={{ borderRight: '1px solid rgba(29,78,216,0.04)' }}></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {processedData.length === 0 ? (
                <tr>
                  <td colSpan={18} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'rgba(29,78,216,0.06)' }}>
                        <Users size={24} style={{ color: '#94a3b8' }} />
                      </div>
                      <p className="text-sm font-medium" style={{ color: '#94a3b8' }}>Belum ada data hasil tes EPPS</p>
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
                  {item.epps_scores.map((score, i) => (
                    <td
                      key={i}
                      className="px-2 py-3 text-center text-sm"
                      style={{ color: '#475569', borderRight: '1px solid rgba(29,78,216,0.03)' }}
                    >
                      {score}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-center text-sm font-bold" style={{ color: '#2563eb', borderRight: '1px solid rgba(29,78,216,0.04)' }}>{item.epps_consistency}</td>
                  <td className="px-4 py-3 text-center">
                    <Link 
                      href={`/admin/results/${item.id}`}
                      className="inline-flex items-center justify-center p-2 rounded-lg transition-all duration-200 hover:-translate-y-0.5"
                      style={{
                        background: 'rgba(29,78,216,0.06)',
                        color: '#2563eb',
                      }}
                      title="Download Sertifikat"
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
