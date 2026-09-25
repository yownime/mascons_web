import React from 'react';
import { db } from '@/app/lib/db';
import { testResults, testParticipants, users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import CertificateViewer from '@/components/admin/CertificateViewer';
import { notFound } from 'next/navigation';
import { ArrowLeft, Award } from 'lucide-react';
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
      {/* Header */}
      <div className="flex items-center gap-4 mb-2">
        <Link 
          href={`/admin/results/${certificateData.category.toLowerCase().replace(' ', '_')}`}
          className="p-2.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5"
          style={{
            background: '#fff',
            border: '1px solid rgba(29,78,216,0.1)',
            boxShadow: '0 2px 10px rgba(29,78,216,0.04)',
          }}
          title="Kembali ke Hasil"
        >
          <ArrowLeft size={18} style={{ color: '#2563eb' }} />
        </Link>
        <div className="flex-1">
          <h2 className="text-2xl font-extrabold tracking-tight" style={{ color: '#0a1628' }}>
            Sertifikat: {certificateData.userName}
          </h2>
          <p className="text-sm mt-0.5" style={{ color: '#64748b' }}>
            {getCategoryName(certificateData.category)}
          </p>
        </div>
        <div
          className="hidden md:flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
          style={{
            background: 'rgba(37,99,235,0.06)',
            border: '1px solid rgba(37,99,235,0.1)',
            color: '#2563eb',
          }}
        >
          <Award size={16} />
          Sertifikat
        </div>
      </div>
      
      {/* Certificate Container */}
      <div
        className="rounded-2xl p-4 md:p-8 overflow-x-auto min-h-[80vh] flex flex-col items-center justify-center"
        style={{
          background: 'rgba(29,78,216,0.02)',
          border: '1px solid rgba(29,78,216,0.08)',
          boxShadow: 'inset 0 2px 20px rgba(29,78,216,0.04)',
        }}
      >
        <CertificateViewer 
          userName={certificateData.userName} 
          category={getCategoryName(certificateData.category)}
          date={certificateData.createdAt}
        />
      </div>
    </div>
  );
}
