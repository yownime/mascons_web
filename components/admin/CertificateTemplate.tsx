'use client';

import React, { forwardRef } from 'react';
import { Playfair_Display, Inter } from 'next/font/google';

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400', '600', '700'] });
const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600'] });

interface CertificateTemplateProps {
  userName: string;
  category: string;
  date: Date;
}

const CertificateTemplate = forwardRef<HTMLDivElement, CertificateTemplateProps>(
  ({ userName, category, date }, ref) => {
    
    // Format date in Indonesian
    const formattedDate = new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);

    return (
      <div 
        ref={ref}
        className={`relative bg-white w-[1123px] h-[794px] print:w-[1123px] print:h-[794px] flex items-center justify-center overflow-hidden ${inter.className}`}
        style={{ boxSizing: 'border-box' }}
      >
        {/* Background Patterns & Borders */}
        <div className="absolute inset-0 m-4 border-2 border-indigo-900/10 rounded-sm"></div>
        <div className="absolute inset-0 m-6 border-8 border-double border-indigo-900/30 rounded-sm"></div>
        
        {/* Corner Ornaments */}
        <div className="absolute top-8 left-8 w-16 h-16 border-t-4 border-l-4 border-amber-500"></div>
        <div className="absolute top-8 right-8 w-16 h-16 border-t-4 border-r-4 border-amber-500"></div>
        <div className="absolute bottom-8 left-8 w-16 h-16 border-b-4 border-l-4 border-amber-500"></div>
        <div className="absolute bottom-8 right-8 w-16 h-16 border-b-4 border-r-4 border-amber-500"></div>

        {/* Subtle background gradient and watermark */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/40 via-white to-amber-50/40 pointer-events-none"></div>
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none">
           <svg width="600" height="600" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 22h20L12 2zm0 3.8l6.8 14.2H5.2L12 5.8z"/>
           </svg>
        </div>

        {/* Content Container */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full px-24 py-16 text-center">
          
          {/* Logo Area */}
          <div className="mb-8 flex flex-col items-center justify-center gap-2">
            <div className="w-16 h-16 bg-gradient-to-tr from-indigo-800 to-purple-600 rounded-xl flex items-center justify-center shadow-lg transform rotate-45 mb-2">
              <span className="text-white font-bold text-3xl -rotate-45 block">M</span>
            </div>
            <div className="text-2xl font-bold tracking-[0.2em] text-indigo-950 uppercase">
              MASCONS
            </div>
            <div className="text-xs tracking-[0.3em] text-amber-600 uppercase font-semibold">
              Assessment Center
            </div>
          </div>

          <p className="text-slate-500 font-semibold tracking-[0.3em] uppercase text-sm mb-4">
            Dengan Bangga Memberikan
          </p>

          <h1 className={`text-[64px] text-indigo-950 mb-10 leading-none ${playfair.className}`}>
            Sertifikat Penyelesaian
          </h1>

          <p className="text-slate-600 text-lg mb-6">
            Sertifikat ini dianugerahkan kepada:
          </p>

          {/* Name */}
          <div className="relative w-full flex justify-center mb-8">
            <h2 className={`text-[56px] text-indigo-900 font-bold border-b-2 border-amber-500 pb-2 px-12 inline-block leading-tight ${playfair.className}`}>
              {userName}
            </h2>
          </div>

          <p className="text-slate-600 text-xl max-w-3xl leading-relaxed mb-12">
            Atas partisipasi dan keberhasilannya dalam menyelesaikan 
            <br />
            <span className="font-bold text-indigo-800 text-2xl block mt-4">{category}</span>
          </p>

          {/* Bottom Section: Date & Signature */}
          <div className="w-full flex justify-between items-end mt-auto px-16">
            <div className="flex flex-col items-center">
              <div className="text-slate-500 text-sm mb-2 uppercase tracking-wider font-semibold">Diberikan pada tanggal</div>
              <div className="font-semibold text-indigo-950 text-xl">{formattedDate}</div>
            </div>

            {/* Seal / Badge */}
            <div className="w-28 h-28 bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 rounded-full flex items-center justify-center shadow-lg border-4 border-white outline outline-2 outline-amber-200 relative">
               <div className="w-24 h-24 border border-amber-200/50 rounded-full flex items-center justify-center">
                  <div className="text-white flex flex-col items-center justify-center">
                    <span className="font-bold text-[10px] tracking-[0.2em] mb-1">MASCONS</span>
                    <span className="text-[20px]">★</span>
                    <span className="font-bold text-[10px] tracking-[0.2em] mt-1">OFFICIAL</span>
                  </div>
               </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-56 h-16 border-b-2 border-slate-300 mb-3 relative">
                {/* Simulated Signature */}
                <span className={`absolute bottom-2 left-6 text-5xl text-indigo-900/60 transform -rotate-6 ${playfair.className}`}>
                  M. Mascons
                </span>
              </div>
              <div className="font-bold text-indigo-950 text-lg">Direktur Mascons</div>
              <div className="text-slate-500 text-sm">Head of Assessment Center</div>
            </div>
          </div>
          
        </div>
      </div>
    );
  }
);

CertificateTemplate.displayName = 'CertificateTemplate';

export default CertificateTemplate;
