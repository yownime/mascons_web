import React from 'react';
import { db } from '@/app/lib/db';
import { testResults, testParticipants, users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import CertificateViewer from '@/components/admin/CertificateViewer';
import { notFound } from 'next/navigation';
import { Award, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Sertifikat Penyelesaian Tes - MASCONS',
  description: 'Sertifikat resmi hasil penyelesaian tes psikologi MASCONS Assessment Center',
};

export default async function PublicCertificatePage({ params }: { params: Promise<{ id: string }> }) {
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
      userName: users.fullName,
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

  const getCategoryName = (cat: string) => {
    const c = cat.toUpperCase();
    if (c === 'EPPS') return 'Tes EPPS (Edwards Personal Preference Schedule)';
    if (c === 'CFIT') return 'Tes CFIT (Culture Fair Intelligence Test)';
    if (c === 'CPM') return 'Tes CPM (Coloured Progressive Matrices)';
    if (c === 'BAKUM') return 'Tes BAKUM (Bakat Umum)';
    if (c === 'TIU' || c === 'INTELIGENSI_UMUM') return 'Tes TIU (Tes Inteligensi Umum)';
    if (c === 'MINAT_JABATAN' || c === 'MINAT JABATAN') return 'Tes Minat Jabatan';
    if (c === 'KRAEPELIN') return 'Tes Kraepelin';
    return `Tes ${c}`;
  };

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center py-8 px-4">
      {/* Top Banner */}
      <div className="w-full max-w-4xl flex items-center justify-between mb-8 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center shadow-md">
            <Award className="text-white" size={22} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-wide">MASCONS Assessment Center</h1>
            <p className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
              <CheckCircle2 size={13} /> Sertifikat Terverifikasi Resmi
            </p>
          </div>
        </div>
      </div>

      {/* Certificate Container with zoom/scroll support on small screens */}
      <div className="w-full max-w-5xl flex flex-col items-center">
        <CertificateViewer 
          userName={certificateData.userName} 
          category={getCategoryName(certificateData.category)}
          date={certificateData.createdAt}
        />
      </div>

      {/* Footer Info */}
      <footer className="mt-12 text-center text-xs text-slate-500 max-w-md">
        Dokumen ini diterbitkan secara sah oleh sistem asesmen digital MASCONS.
        Simpan file PDF atau cetak sertifikat ini sebagai bukti penyelesaian asesmen Anda.
      </footer>
    </main>
  );
}
