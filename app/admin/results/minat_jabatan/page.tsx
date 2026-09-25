import React from 'react';
import { db } from '@/app/lib/db';
import { testResults, testParticipants, users } from '@/db/schema';
import { desc, eq, inArray, like } from 'drizzle-orm';
import ExportExcelButton from '@/components/admin/ExportExcelButton';
import { ArrowLeft, Trash2, FileDown } from 'lucide-react';
import Link from 'next/link';
import { revalidatePath } from 'next/cache';

export default async function MinatJabatanRecapPage() {
  async function deleteDummyData() {
    'use server';
    // Delete all simulated users
    await db.delete(users).where(like(users.email, 'simulasi%@example.com'));
    revalidatePath('/admin/results/minat_jabatan');
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
    .where(inArray(testResults.category, ['MINAT_JABATAN', 'minat_jabatan']))
    .orderBy(desc(testResults.createdAt));

  // Process data for the table and export
  const processedData = results.map((result) => {
    const reportData = result.reportData as any;
    const resultData = reportData?.bagian_1?.result;
    
    const getBidang = (key: string) => {
        return {
            score: resultData?.bidangMinatScore?.[key] || 0,
            category: resultData?.bidangMinatKategori?.[key] || '-',
        }
    };
    
    const getTipe = (key: string) => {
        return {
            score: resultData?.tipeMinatScore?.[key] || 0,
            category: resultData?.tipeMinatKategori?.[key] || '-',
        }
    };
    
    const tingkat = {
        score: resultData?.tingkatMinatScore?.['Total'] || 0,
        category: resultData?.tingkatMinatKategori?.['Total'] || '-',
    };

    return {
      id: result.id,
      userName: result.userName,
      bidang: {
          pribadiSosial: getBidang('Pribadi Sosial'),
          natural: getBidang('Natural'),
          mekanik: getBidang('Mekanik'),
          bisnis: getBidang('Bisnis'),
          seni: getBidang('Seni'),
          sains: getBidang('Sains'),
      },
      tipe: {
          verbal: getTipe('Verbal'),
          komputatif: getTipe('Komputatif'),
          manipulatif: getTipe('Manipulatif'),
      },
      tingkat,
    };
  });

  // Helper for Exporting to Excel (Flattening the nested object)
  const flattenDataForExcel = processedData.map(item => ({
      id: item.id,
      'Nama Lengkap': item.userName,
      'B. Pribadi Sosial (Skor)': item.bidang.pribadiSosial.score,
      'B. Pribadi Sosial (Kat)': item.bidang.pribadiSosial.category,
      'B. Natural (Skor)': item.bidang.natural.score,
      'B. Natural (Kat)': item.bidang.natural.category,
      'B. Mekanik (Skor)': item.bidang.mekanik.score,
      'B. Mekanik (Kat)': item.bidang.mekanik.category,
      'B. Bisnis (Skor)': item.bidang.bisnis.score,
      'B. Bisnis (Kat)': item.bidang.bisnis.category,
      'B. Seni (Skor)': item.bidang.seni.score,
      'B. Seni (Kat)': item.bidang.seni.category,
      'B. Sains (Skor)': item.bidang.sains.score,
      'B. Sains (Kat)': item.bidang.sains.category,
      'T. Verbal (Skor)': item.tipe.verbal.score,
      'T. Verbal (Kat)': item.tipe.verbal.category,
      'T. Komputatif (Skor)': item.tipe.komputatif.score,
      'T. Komputatif (Kat)': item.tipe.komputatif.category,
      'T. Manipulatif (Skor)': item.tipe.manipulatif.score,
      'T. Manipulatif (Kat)': item.tipe.manipulatif.category,
      'Tingkat (Skor)': item.tingkat.score,
      'Tingkat (Kat)': item.tingkat.category,
  }));

  const CategoryBadge = ({ category }: { category: string }) => {
    let colorClass = 'bg-slate-100 text-slate-700';
    const lower = category.toLowerCase();
    
    // Bidang / Tipe Categories
    if (lower === 'sangat menyukai') colorClass = 'bg-emerald-100 text-emerald-800';
    else if (lower === 'menyukai') colorClass = 'bg-blue-100 text-blue-800';
    else if (lower === 'tidak menyukai') colorClass = 'bg-amber-100 text-amber-800';
    else if (lower === 'sangat tidak menyukai') colorClass = 'bg-rose-100 text-rose-800';
    
    // Tingkat Categories
    if (lower === 'profesional') colorClass = 'bg-emerald-100 text-emerald-800';
    else if (lower === 'terampil') colorClass = 'bg-blue-100 text-blue-800';
    else if (lower === 'rutin') colorClass = 'bg-amber-100 text-amber-800';

    return (
      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase whitespace-nowrap ${colorClass}`}>
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
            <h2 className="text-2xl font-extrabold tracking-tight" style={{ color: '#0a1628' }}>Minat Jabatan Master Recap</h2>
          </div>
          <p className="text-sm" style={{ color: '#64748b' }}>View detailed Minat Jabatan results (Bidang, Tipe, & Tingkat) and export to Excel.</p>
        </div>
        
        <div className="flex gap-3">
          <form action={deleteDummyData}>
            <button type="submit" className="inline-flex items-center px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 hover:-translate-y-0.5" style={{ background: 'rgba(239,68,68,0.08)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.15)' }}>
              <Trash2 size={16} className="mr-2" />
              Hapus Dummy
            </button>
          </form>
          <ExportExcelButton data={flattenDataForExcel} />
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: '#fff', border: '1px solid rgba(29,78,216,0.08)', boxShadow: '0 2px 20px rgba(29,78,216,0.04)' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead style={{ background: 'rgba(29,78,216,0.03)', borderBottom: '1px solid rgba(29,78,216,0.06)' }}>
              {/* LEVEL 1: Group Headers */}
              <tr>
                <th rowSpan={2} className="px-4 py-3 text-sm font-semibold text-slate-800 border-r border-slate-100 align-middle text-center">NO</th>
                <th rowSpan={2} className="px-4 py-3 text-sm font-semibold text-slate-800 border-r border-slate-100 align-middle">NAMA LENGKAP</th>
                
                <th colSpan={12} className="px-2 py-2 text-sm font-bold text-white bg-purple-700 border-r border-purple-800 text-center uppercase tracking-wider">BIDANG MINAT</th>
                <th colSpan={6} className="px-2 py-2 text-sm font-bold text-white bg-blue-600 border-r border-blue-700 text-center uppercase tracking-wider">TIPE MINAT</th>
                <th colSpan={2} className="px-2 py-2 text-sm font-bold text-white bg-emerald-600 border-r border-emerald-700 text-center uppercase tracking-wider">TINGKAT MINAT</th>
                
                <th rowSpan={2} className="px-4 py-3 text-sm font-semibold text-slate-800 align-middle text-center">AKSI</th>
              </tr>

              {/* LEVEL 2: Sub-Component Headers */}
              <tr className="bg-blue-50/50/80">
                {/* Bidang Minat Sub-Headers */}
                <th colSpan={2} className="px-2 py-2 text-xs font-semibold text-slate-800 border-r border-b border-slate-100 text-center bg-purple-100/50">Pribadi Sosial</th>
                <th colSpan={2} className="px-2 py-2 text-xs font-semibold text-slate-800 border-r border-b border-slate-100 text-center bg-purple-100/50">Natural</th>
                <th colSpan={2} className="px-2 py-2 text-xs font-semibold text-slate-800 border-r border-b border-slate-100 text-center bg-purple-100/50">Mekanik</th>
                <th colSpan={2} className="px-2 py-2 text-xs font-semibold text-slate-800 border-r border-b border-slate-100 text-center bg-purple-100/50">Bisnis</th>
                <th colSpan={2} className="px-2 py-2 text-xs font-semibold text-slate-800 border-r border-b border-slate-100 text-center bg-purple-100/50">Seni</th>
                <th colSpan={2} className="px-2 py-2 text-xs font-semibold text-slate-800 border-r border-b border-slate-100 text-center bg-purple-100/50">Sains</th>
                
                {/* Tipe Minat Sub-Headers */}
                <th colSpan={2} className="px-2 py-2 text-xs font-semibold text-blue-900 border-r border-b border-blue-100 text-center bg-blue-50">Verbal</th>
                <th colSpan={2} className="px-2 py-2 text-xs font-semibold text-blue-900 border-r border-b border-blue-100 text-center bg-blue-50">Komputatif</th>
                <th colSpan={2} className="px-2 py-2 text-xs font-semibold text-blue-900 border-r border-b border-blue-100 text-center bg-blue-50">Manipulatif</th>

                {/* Tingkat Minat Sub-Headers */}
                <th colSpan={2} className="px-2 py-2 text-xs font-semibold text-emerald-900 border-r border-b border-emerald-100 text-center bg-emerald-50">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {processedData.length === 0 ? (
                <tr>
                  <td colSpan={24} className="px-6 py-12 text-center text-slate-600/70 italic">
                    Belum ada data hasil tes Minat Jabatan.
                  </td>
                </tr>
              ) : processedData.map((item, index) => (
                <tr key={item.id} className="transition-colors duration-150">
                  <td className="px-4 py-3 font-medium border-r border-slate-100 text-center">{index + 1}</td>
                  <td className="px-4 py-3 font-medium border-r border-slate-100 sticky left-0 bg-white/90 backdrop-blur-sm z-10">{item.userName}</td>
                  
                  {/* Bidang: Pribadi Sosial */}
                  <td className="px-2 py-3 text-center border-r border-purple-50 text-slate-700 bg-blue-50/50/10 font-mono text-xs">{item.bidang.pribadiSosial.score}</td>
                  <td className="px-2 py-3 text-center border-r border-slate-100 bg-blue-50/50/10"><CategoryBadge category={item.bidang.pribadiSosial.category} /></td>
                  {/* Bidang: Natural */}
                  <td className="px-2 py-3 text-center border-r border-purple-50 text-slate-700 bg-blue-50/50/30 font-mono text-xs">{item.bidang.natural.score}</td>
                  <td className="px-2 py-3 text-center border-r border-slate-100 bg-blue-50/50/30"><CategoryBadge category={item.bidang.natural.category} /></td>
                  {/* Bidang: Mekanik */}
                  <td className="px-2 py-3 text-center border-r border-purple-50 text-slate-700 bg-blue-50/50/10 font-mono text-xs">{item.bidang.mekanik.score}</td>
                  <td className="px-2 py-3 text-center border-r border-slate-100 bg-blue-50/50/10"><CategoryBadge category={item.bidang.mekanik.category} /></td>
                  {/* Bidang: Bisnis */}
                  <td className="px-2 py-3 text-center border-r border-purple-50 text-slate-700 bg-blue-50/50/30 font-mono text-xs">{item.bidang.bisnis.score}</td>
                  <td className="px-2 py-3 text-center border-r border-slate-100 bg-blue-50/50/30"><CategoryBadge category={item.bidang.bisnis.category} /></td>
                  {/* Bidang: Seni */}
                  <td className="px-2 py-3 text-center border-r border-purple-50 text-slate-700 bg-blue-50/50/10 font-mono text-xs">{item.bidang.seni.score}</td>
                  <td className="px-2 py-3 text-center border-r border-slate-100 bg-blue-50/50/10"><CategoryBadge category={item.bidang.seni.category} /></td>
                  {/* Bidang: Sains */}
                  <td className="px-2 py-3 text-center border-r border-purple-50 text-slate-700 bg-blue-50/50/30 font-mono text-xs">{item.bidang.sains.score}</td>
                  <td className="px-2 py-3 text-center border-r border-slate-100 border-r-2 border-r-purple-300 bg-blue-50/50/30"><CategoryBadge category={item.bidang.sains.category} /></td>

                  {/* Tipe: Verbal */}
                  <td className="px-2 py-3 text-center border-r border-blue-50 text-slate-700 bg-blue-50/10 font-mono text-xs">{item.tipe.verbal.score}</td>
                  <td className="px-2 py-3 text-center border-r border-blue-100 bg-blue-50/10"><CategoryBadge category={item.tipe.verbal.category} /></td>
                  {/* Tipe: Komputatif */}
                  <td className="px-2 py-3 text-center border-r border-blue-50 text-slate-700 bg-blue-50/30 font-mono text-xs">{item.tipe.komputatif.score}</td>
                  <td className="px-2 py-3 text-center border-r border-blue-100 bg-blue-50/30"><CategoryBadge category={item.tipe.komputatif.category} /></td>
                  {/* Tipe: Manipulatif */}
                  <td className="px-2 py-3 text-center border-r border-blue-50 text-slate-700 bg-blue-50/10 font-mono text-xs">{item.tipe.manipulatif.score}</td>
                  <td className="px-2 py-3 text-center border-r border-blue-100 border-r-2 border-r-blue-300 bg-blue-50/10"><CategoryBadge category={item.tipe.manipulatif.category} /></td>

                  {/* Tingkat: Total */}
                  <td className="px-2 py-3 text-center border-r border-emerald-50 text-slate-700 bg-emerald-50/20 font-mono font-bold">{item.tingkat.score}</td>
                  <td className="px-2 py-3 text-center border-r border-emerald-100 border-r-2 border-r-emerald-300 bg-emerald-50/20"><CategoryBadge category={item.tingkat.category} /></td>

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
