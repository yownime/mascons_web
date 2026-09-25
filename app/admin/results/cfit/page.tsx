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
          <div className="flex items-center gap-3 mb-2">
            <Link
              href="/admin/results"
              className="p-2.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5"
              style={{
                background: '#fff',
                border: '1px solid rgba(29,78,216,0.1)',
                boxShadow: '0 2px 10px rgba(29,78,216,0.04)',
              }}
            >
              <ArrowLeft size={18} style={{ color: '#2563eb' }} />
            </Link>
            <h2 className="text-2xl font-extrabold tracking-tight" style={{ color: '#0a1628' }}>
              CFIT Master Recap
            </h2>
          </div>
          <p className="text-sm" style={{ color: '#64748b' }}>
            Lihat hasil tes CFIT berdasarkan skala — Skala 2 (Test 1–4) dan Skala 3 (Test 5–8).
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
          <Brain size={16} />
          Culture Fair Intelligence Test
        </div>
      </div>

      {/* Tabs */}
      <CfitSkalaTab defaultScale={defaultScale} />
    </div>
  );
}
