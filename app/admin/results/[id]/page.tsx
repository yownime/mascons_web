import React from 'react';
import { db } from '@/app/lib/db';
import { testResults, testParticipants, users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import CertificateViewer from '@/components/admin/CertificateViewer';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
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

  // Helper to map category enum/string to proper readable name
  const getCategoryName = (cat: string) => {
    const c = cat.toUpperCase();
    if (c === 'EPPS') return 'Tes EPPS (Edwards Personal Preference Schedule)';
    if (c === 'CFIT') return 'Tes CFIT (Culture Fair Intelligence Test)';
    if (c === 'CPM') return 'Tes CPM (Coloured Progressive Matrices)';
    if (c === 'BAKUM') return 'Tes BAKUM (Bakat Umum)';
    if (c === 'TIU') return 'Tes TIU (Tes Inteligensi Umum)';
    if (c === 'MINAT_JABATAN' || c === 'MINAT JABATAN') return 'Tes Minat Jabatan';
    if (c === 'KRAEPELIN') return 'Tes Kraepelin';
    return `Tes ${c}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4 mb-4">
        <Link 
          href={`/admin/results/${certificateData.category.toLowerCase().replace(' ', '_')}`}
          className="p-2 text-purple-600 bg-purple-50 hover:bg-purple-100 hover:text-purple-800 rounded-full transition-colors"
          title="Kembali ke Hasil"
        >
          <ArrowLeft size={20} />
        </Link>
        <h2 className="text-2xl font-bold text-slate-800">Sertifikat: {certificateData.userName}</h2>
      </div>
      
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 md:p-8 overflow-x-auto shadow-inner min-h-[80vh] flex flex-col items-center justify-center">
        <CertificateViewer 
          userName={certificateData.userName} 
          category={getCategoryName(certificateData.category)}
          date={certificateData.createdAt}
        />
      </div>
    </div>
  );
}
