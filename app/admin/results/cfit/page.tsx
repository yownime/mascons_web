import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Brain } from 'lucide-react';
import CfitSkalaTab from '@/components/admin/CfitSkalaTab';

export default function CfitRecapPage({
  searchParams,
}: {
  searchParams?: { skala?: string };
}) {
  const defaultScale = searchParams?.skala === '3' ? 3 : 2;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <Link href="/admin/results" className="text-blue-600 hover:text-blue-800 transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <h2 className="text-2xl font-bold">CFIT Master Recap</h2>
          </div>
          <p className="text-slate-500">Lihat hasil tes CFIT berdasarkan skala — Skala 2 (Test 1–4) dan Skala 3 (Test 5–8).</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold" style={{ background: 'rgba(37,99,235,0.08)', color: '#1d4ed8' }}>
          <Brain size={16} />
          Culture Fair Intelligence Test
        </div>
      </div>

      {/* Tabs */}
      <CfitSkalaTab defaultScale={defaultScale} />
    </div>
  );
}
