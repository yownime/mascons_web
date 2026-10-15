'use client';

import React from 'react';

interface BakumBarChartProps {
  scores: {
    p2: number;
    p3: number;
    p4: number;
    p5: number;
    p6: number;
    p7: number;
    p8: number;
    p9: number;
    p10: number;
  };
  userName?: string;
}

const BAKUM_SUBTESTS = [
  { key: 'p2', label: 'Persoalan 2: Informasi Umum', max: 40, category: 'Verbal' },
  { key: 'p3', label: 'Persoalan 3: Analogi Verbal', max: 20, category: 'Verbal' },
  { key: 'p4', label: 'Persoalan 4: Penalaran Logis', max: 40, category: 'Skolastik' },
  { key: 'p5', label: 'Persoalan 5: Hitungan Praktis', max: 20, category: 'Numerik' },
  { key: 'p6', label: 'Persoalan 6: Deret Angka', max: 30, category: 'Numerik' },
  { key: 'p7', label: 'Persoalan 7: Spasial 2D (Bentuk)', max: 20, category: 'Spasial' },
  { key: 'p8', label: 'Persoalan 8: Spasial 3D (Kubus)', max: 20, category: 'Spasial' },
  { key: 'p9', label: 'Persoalan 9: Potongan Pola', max: 20, category: 'Mekanik' },
  { key: 'p10', label: 'Persoalan 10: Ketelitian Simbol', max: 80, category: 'Ketelitian' },
];

export default function BakumBarChart({ scores, userName }: BakumBarChartProps) {
  // Compute percentage for each
  const items = BAKUM_SUBTESTS.map((sub) => {
    const raw = (scores as any)[sub.key] || 0;
    const pct = Math.min(Math.round((raw / sub.max) * 100), 100);
    return {
      ...sub,
      raw,
      pct,
    };
  });

  // Determine top 3 strengths by percentage
  const topKeys = [...items]
    .sort((a, b) => b.pct - a.pct)
    .slice(0, 3)
    .map((i) => i.key);

  const topItems = items.filter((i) => topKeys.includes(i.key));

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-lg font-bold text-slate-900">
            Grafik Profil Bakat Umum (BAKUM) {userName ? `· ${userName}` : ''}
          </h3>
          <p className="text-xs text-slate-500">
            Distribusi perolehan skor per subtes dan penyorotan bakat paling dominan
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            🏆 Top 3 Bakat Disorot Hijau
          </span>
        </div>
      </div>

      {/* Top 3 Strengths Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {topItems.map((item, idx) => (
          <div
            key={item.key}
            className="p-3.5 rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50/80 to-teal-50/40 relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800">
                Peringkat {idx + 1}
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                {item.pct}%
              </span>
            </div>
            <div className="font-bold text-sm text-slate-800 truncate">{item.label}</div>
            <div className="text-xs text-slate-500 mt-0.5">
              Skor: <span className="font-semibold text-slate-700">{item.raw}</span> dari {item.max} ({item.category})
            </div>
          </div>
        ))}
      </div>

      {/* Dynamic Bar List */}
      <div className="space-y-3 pt-2">
        {items.map((item) => {
          const isTop = topKeys.includes(item.key);
          return (
            <div key={item.key} className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <span className={`font-semibold ${isTop ? 'text-emerald-800 font-bold' : 'text-slate-700'}`}>
                    {item.label}
                  </span>
                  {isTop && (
                    <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      Top Bakat
                    </span>
                  )}
                </div>
                <div className="text-slate-500">
                  <span className="font-bold text-slate-800">{item.raw}</span>/{item.max} ({item.pct}%)
                </div>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden relative">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isTop
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-sm'
                      : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                  }`}
                  style={{ width: `${Math.max(item.pct, 3)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
