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
    <div className="flex flex-col items-center gap-6 w-full max-w-full">
      <div className="flex flex-col items-center gap-2">
        <button
          onClick={() => handlePrint()}
          className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-base rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform active:scale-95 hover:-translate-y-0.5 cursor-pointer"
        >
          <Printer size={20} />
          Cetak / Download PDF
        </button>
        <p className="text-xs text-slate-400 text-center max-w-sm">
          💡 <strong>Tips di HP:</strong> Pilih opsi <em>"Simpan sebagai PDF"</em> (Save as PDF) pada menu cetak untuk langsung mengunduh file sertifikat.
        </p>
      </div>

      {/* Wrapping in a scrollable/scalable container for viewing on mobile and desktop without affecting print size */}
      <div className="w-full overflow-x-auto flex justify-start md:justify-center p-2 rounded-xl">
        <div className="shadow-2xl overflow-hidden rounded-sm min-w-[1123px]">
          <CertificateTemplate 
            ref={certificateRef}
            userName={userName}
            category={category}
            date={date}
          />
        </div>
      </div>
    </div>
  );
}
