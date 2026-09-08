'use client';

import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Printer } from 'lucide-react';
import CertificateTemplate from './CertificateTemplate';

interface CertificateViewerProps {
  userName: string;
  category: string;
  date: Date;
}

export default function CertificateViewer({ userName, category, date }: CertificateViewerProps) {
  const certificateRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: certificateRef,
    documentTitle: `Sertifikat_${userName.replace(/\s+/g, '_')}_${category.split(' ')[1]}`,
    pageStyle: `
      @page { size: A4 landscape; margin: 0; }
      @media print {
        body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      }
    `,
  });

  return (
    <div className="flex flex-col items-center gap-6">
      <button
        onClick={() => handlePrint()}
        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
      >
        <Printer size={20} />
        Cetak / Download PDF
      </button>

      {/* Wrapping in a scaled container for viewing on screen without affecting print size */}
      <div className="shadow-2xl overflow-hidden rounded-sm" style={{ transform: 'scale(0.9)', transformOrigin: 'top center' }}>
        <CertificateTemplate 
          ref={certificateRef}
          userName={userName}
          category={category}
          date={date}
        />
      </div>
    </div>
  );
}
