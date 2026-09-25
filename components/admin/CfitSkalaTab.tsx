'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Trash2, FileDown, FileSpreadsheet } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────
interface CfitRow {
  id: number;
  userName: string;
  scores: number[]; // 4 scores for each scale
  total: number;
}

// ─── Fetch helper (client-side) ───────────────────────────
async function fetchCfitData(scale: 2 | 3): Promise<CfitRow[]> {
  const res = await fetch(`/api/cfit-recap?scale=${scale}`, { cache: 'no-store' });
  if (!res.ok) return [];
  return res.json();
}

// ─── Table Component ──────────────────────────────────────
function CfitTable({ scale }: { scale: 2 | 3 }) {
  const [data, setData] = useState<CfitRow[]>([]);
  const [loading, setLoading] = useState(true);

  const isSkala2 = scale === 2;
  const testLabels = isSkala2
    ? ['SUBTES 1\n(Max 12)', 'SUBTES 2\n(Max 14)', 'SUBTES 3\n(Max 12)', 'SUBTES 4\n(Max 8)']
    : ['SUBTES 5\n(Max 13)', 'SUBTES 6\n(Max 14)', 'SUBTES 7\n(Max 13)', 'SUBTES 8\n(Max 10)'];
  const maxTotal = isSkala2 ? 46 : 50;

  useEffect(() => {
    fetchCfitData(scale).then((d) => {
      setData(d);
      setLoading(false);
    });
  }, [scale]);

  const handleExport = async () => {
    const ExcelJS = (await import('exceljs')).default;
    const { saveAs } = await import('file-saver');
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet(`CFIT Skala ${scale}`);

    ws.addRow([`REKAPITULASI CFIT SKALA ${scale} (TEST ${isSkala2 ? '1–4' : '5–8'})`]);
    ws.addRow(['Tanggal: ' + new Date().toLocaleDateString('id-ID')]);
    ws.addRow([]);

    const offset = isSkala2 ? 0 : 4;
    const headers = ['NO', 'NAMA LENGKAP',
      ...Array.from({ length: 4 }, (_, i) => `SUBTES ${i + 1 + offset}`),
      'TOTAL',
    ];
    const hr = ws.addRow(headers);
    hr.eachCell(c => {
      c.font = { bold: true };
      c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1D4ED8' } };
      c.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      c.alignment = { horizontal: 'center' };
    });

    data.forEach((row, i) => {
      ws.addRow([i + 1, row.userName, ...row.scores, row.total]);
    });

    const buf = await wb.xlsx.writeBuffer();
    saveAs(new Blob([buf]), `cfit-skala${scale}-${Date.now()}.xlsx`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-slate-400">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-3" />
        Memuat data...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-slate-500">
          {data.length} peserta · CFIT Skala {scale} (Test {isSkala2 ? '1–4' : '5–8'}) · Max {maxTotal} poin
        </p>
        <button
          onClick={handleExport}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:-translate-y-0.5"
          style={{ background: 'linear-gradient(135deg,#1d4ed8,#0ea5e9)', color: 'white', boxShadow: '0 4px 12px rgba(29,78,216,0.3)' }}
        >
          <FileSpreadsheet size={15} />
          Export Excel
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap text-sm">
            <thead>
              <tr style={{ background: 'linear-gradient(135deg,#0a1628,#1e3a8a)', color: 'white' }}>
                <th className="px-4 py-3 text-center font-semibold">NO</th>
                <th className="px-4 py-3 font-semibold">NAMA LENGKAP</th>
                {testLabels.map((lbl, i) => (
                  <th key={i} className="px-3 py-3 text-center font-semibold" style={{ fontSize: '11px', lineHeight: '1.3' }}>
                    {lbl.split('\n').map((l, j) => (
                      <span key={j} className="block">{l}</span>
                    ))}
                  </th>
                ))}
                <th className="px-4 py-3 text-center font-semibold" style={{ background: 'rgba(255,255,255,0.12)' }}>
                  TOTAL<br /><span style={{ fontSize: '10px', fontWeight: 'normal' }}>(Max {maxTotal})</span>
                </th>
                <th className="px-3 py-3 text-center font-semibold">AKSI</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 italic">
                    Belum ada data hasil CFIT Skala {scale}.
                  </td>
                </tr>
              ) : (
                data.map((row, idx) => (
                  <tr
                    key={row.id}
                    className="border-t border-slate-100 hover:bg-blue-50/30 transition-colors"
                  >
                    <td className="px-4 py-3 text-center text-slate-500 font-medium">{idx + 1}</td>
                    <td className="px-4 py-3 font-semibold text-slate-800">{row.userName}</td>
                    {row.scores.map((s, i) => (
                      <td key={i} className="px-3 py-3 text-center text-slate-700">{s}</td>
                    ))}
                    <td className="px-4 py-3 text-center font-bold" style={{ color: '#1d4ed8' }}>{row.total}</td>
                    <td className="px-3 py-3 text-center">
                      <Link
                        href={`/admin/results/${row.id}`}
                        className="inline-flex items-center justify-center p-2 rounded-lg transition-colors hover:bg-blue-100"
                        style={{ color: '#2563eb' }}
                        title="Lihat Detail / Download Laporan"
                      >
                        <FileDown size={16} />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Main Tab Component ───────────────────────────────────
export default function CfitSkalaTab({ defaultScale = 2 }: { defaultScale?: 2 | 3 }) {
  const [activeTab, setActiveTab] = useState<2 | 3>(defaultScale as 2 | 3);

  const tabs: { scale: 2 | 3; label: string; sub: string }[] = [
    { scale: 2, label: 'CFIT Skala 2', sub: 'Test 1 – 4' },
    { scale: 3, label: 'CFIT Skala 3', sub: 'Test 5 – 8' },
  ];

  return (
    <div className="space-y-5">
      {/* Tab buttons */}
      <div className="flex gap-3">
        {tabs.map(({ scale, label, sub }) => {
          const active = activeTab === scale;
          return (
            <button
              key={scale}
              onClick={() => setActiveTab(scale)}
              className="flex flex-col items-start px-5 py-3 rounded-2xl border-2 transition-all duration-200"
              style={{
                borderColor: active ? '#1d4ed8' : '#e2e8f0',
                background: active ? 'linear-gradient(135deg,rgba(29,78,216,0.08),rgba(14,165,233,0.06))' : 'white',
                boxShadow: active ? '0 4px 20px rgba(29,78,216,0.12)' : '0 1px 4px rgba(0,0,0,0.04)',
              }}
            >
              <span className="font-bold text-sm" style={{ color: active ? '#1d4ed8' : '#334155' }}>
                {label}
              </span>
              <span className="text-xs mt-0.5" style={{ color: active ? '#3b82f6' : '#94a3b8' }}>
                {sub}
              </span>
            </button>
          );
        })}
      </div>

      {/* Table for active tab */}
      <CfitTable key={activeTab} scale={activeTab} />
    </div>
  );
}
