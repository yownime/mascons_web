'use client';

import React from 'react';

interface EppsRadarChartProps {
  scores: { [dim: string]: number };
  consistencyScore?: number;
  userName?: string;
}

const DIMENSION_LABELS: { [key: string]: { label: string; desc: string } } = {
  ACH: { label: 'Achievement', desc: 'Dorongan berprestasi & menyelesaikan tugas sulit' },
  DEF: { label: 'Deference', desc: 'Kecenderungan menghormati aturan & arahan figur otoritas' },
  ORD: { label: 'Order', desc: 'Kebutuhan akan keteraturan, rencana kerja rapi, dan sistematis' },
  EXH: { label: 'Exhibition', desc: 'Dorongan menonjolkan diri, berbicara di depan umum, & pusat perhatian' },
  AUT: { label: 'Autonomy', desc: 'Keinginan mandiri, bebas dari kekangan, & mengambil keputusan sendiri' },
  AFF: { label: 'Affiliation', desc: 'Kebutuhan menjalin relasi persahabatan & kehangatan sosial' },
  INT: { label: 'Intraception', desc: 'Kemampuan menganalisis motif perilaku diri dan orang lain' },
  SUC: { label: 'Succorance', desc: 'Kebutuhan mencari dukungan moral, simpati, & bantuan sesama' },
  DOM: { label: 'Dominance', desc: 'Kecenderungan memimpin, mempengaruhi, & mengarahkan kelompok' },
  ABA: { label: 'Abasement', desc: 'Sikap mengalah, rendah hati, & mengakui kesalahan diri' },
  NUR: { label: 'Nurturance', desc: 'Dorongan menolong, merawat, bersikap simpatik terhadap orang lain' },
  CHG: { label: 'Change', desc: 'Menyukai variasi, adaptif terhadap inovasi & tantangan baru' },
  END: { label: 'Endurance', desc: 'Ketekunan, daya tahan kerja berjam-jam, & tidak mudah menyerah' },
  HET: { label: 'Heterosexuality', desc: 'Kemudahan berinteraksi secara sehat dan ramah dengan lawan jenis' },
  AGG: { label: 'Aggression', desc: 'Ketegasan menyatakan kritik, argumen kuat, & membela pendirian' },
};

export default function EppsRadarChart({ scores, consistencyScore, userName }: EppsRadarChartProps) {
  const dimensions = [
    'ACH', 'DEF', 'ORD', 'EXH', 'AUT', 'AFF', 'INT', 'SUC',
    'DOM', 'ABA', 'NUR', 'CHG', 'END', 'HET', 'AGG',
  ];

  const maxVal = 28; // Standard maximum score in EPPS grid
  const size = 380;
  const center = size / 2;
  const radius = center - 55;

  // Compute angles for each of the 15 dimensions
  const totalAxes = dimensions.length;
  const angleStep = (Math.PI * 2) / totalAxes;

  // Generate grid levels (20%, 40%, 60%, 80%, 100%)
  const gridLevels = [0.25, 0.5, 0.75, 1.0];

  // Calculate polygon points for student's score
  const points = dimensions.map((dim, i) => {
    const raw = scores[dim] || 0;
    const normVal = Math.min(Math.max(raw / maxVal, 0), 1);
    const angle = i * angleStep - Math.PI / 2;
    const x = center + radius * normVal * Math.cos(angle);
    const y = center + radius * normVal * Math.sin(angle);
    return { x, y, dim, raw };
  });

  const polygonPointsStr = points.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');

  // Identify top 3 traits
  const sortedTraits = [...dimensions]
    .map((d) => ({ dim: d, score: scores[d] || 0 }))
    .sort((a, b) => b.score - a.score);

  const top3 = sortedTraits.slice(0, 3);
  const isValid = consistencyScore === undefined || consistencyScore >= 9;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 mb-4 border-b border-slate-100">
        <div>
          <h3 className="text-lg font-bold text-slate-900">
            Profil Kepribadian EPPS {userName ? `· ${userName}` : ''}
          </h3>
          <p className="text-xs text-slate-500">
            Visualisasi 15 Dimensi Kepribadian & Edwards Personal Preference Schedule
          </p>
        </div>
        {consistencyScore !== undefined && (
          <div>
            {isValid ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                ✓ Konsistensi: {consistencyScore}/15 (VALID)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                ⚠️ Konsistensi: {consistencyScore}/15 (TIDAK VALID)
              </span>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Radar SVG */}
        <div className="lg:col-span-7 flex justify-center">
          <svg width={size} height={size} className="overflow-visible select-none max-w-full">
            <defs>
              <linearGradient id="eppsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.25" />
              </linearGradient>
            </defs>

            {/* Background concentric polygons */}
            {gridLevels.map((lvl, idx) => {
              const polyPoints = dimensions
                .map((_, i) => {
                  const angle = i * angleStep - Math.PI / 2;
                  const x = center + radius * lvl * Math.cos(angle);
                  const y = center + radius * lvl * Math.sin(angle);
                  return `${x.toFixed(1)},${y.toFixed(1)}`;
                })
                .join(' ');

              return (
                <polygon
                  key={idx}
                  points={polyPoints}
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth={idx === gridLevels.length - 1 ? '1.5' : '1'}
                  strokeDasharray={idx < gridLevels.length - 1 ? '3 3' : 'none'}
                />
              );
            })}

            {/* Axis Lines and Labels */}
            {dimensions.map((dim, i) => {
              const angle = i * angleStep - Math.PI / 2;
              const x2 = center + radius * Math.cos(angle);
              const y2 = center + radius * Math.sin(angle);

              const labelDist = radius + 22;
              const lx = center + labelDist * Math.cos(angle);
              const ly = center + labelDist * Math.sin(angle);

              const isTop = top3.some((t) => t.dim === dim);

              return (
                <g key={dim}>
                  <line x1={center} y1={center} x2={x2} y2={y2} stroke="#cbd5e1" strokeWidth="1" />
                  <text
                    x={lx}
                    y={ly + 3}
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight={isTop ? '800' : '600'}
                    fill={isTop ? '#4338ca' : '#64748b'}
                  >
                    {dim}
                  </text>
                </g>
              );
            })}

            {/* Data Polygon Fill */}
            <polygon
              points={polygonPointsStr}
              fill="url(#eppsGradient)"
              stroke="#4f46e5"
              strokeWidth="2.5"
            />

            {/* Data Points */}
            {points.map((p, i) => {
              const isTop = top3.some((t) => t.dim === p.dim);
              return (
                <g key={i}>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={isTop ? 5 : 3.5}
                    fill={isTop ? '#4338ca' : '#ffffff'}
                    stroke="#4f46e5"
                    strokeWidth={isTop ? 2.5 : 1.5}
                  />
                  <text
                    x={p.x}
                    y={p.y - 8}
                    textAnchor="middle"
                    fontSize="9"
                    fontWeight="700"
                    fill="#312e81"
                  >
                    {p.raw}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Narrative / Top Strengths Card */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-xl p-4 bg-indigo-50/60 border border-indigo-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-900 mb-2 flex items-center gap-1.5">
              <span>🌟</span> Kebutuhan Dominan (Top 3 Needs)
            </h4>
            <div className="space-y-2.5">
              {top3.map((trait, idx) => {
                const info = DIMENSION_LABELS[trait.dim] || { label: trait.dim, desc: '' };
                return (
                  <div key={trait.dim} className="bg-white p-2.5 rounded-lg border border-indigo-50 shadow-2xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-800">
                        {idx + 1}. {info.label} ({trait.dim})
                      </span>
                      <span className="text-xs font-extrabold px-2 py-0.5 rounded bg-indigo-100 text-indigo-700">
                        Skor: {trait.score}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">{info.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-xl p-4 bg-slate-50 border border-slate-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Catatan Interpretasi Konselor:
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {isValid
                ? `Hasil tes memiliki konsistensi yang valid (${consistencyScore ?? 15}/15). Profil menunjukkan dorongan kuat pada aspek ${top3.map((t) => DIMENSION_LABELS[t.dim]?.label || t.dim).join(', ')}.`
                : `PERINGATAN: Konsistensi tes rendah (${consistencyScore}/15). Respon siswa terindikasi kurang cermat atau asal jawab. Disarankan untuk melakukan verifikasi wawancara atau pengulangan tes.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
