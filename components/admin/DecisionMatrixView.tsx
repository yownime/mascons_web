'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Brain, 
  Users, 
  Activity, 
  Network, 
  CheckCircle2, 
  AlertTriangle, 
  Briefcase, 
  GraduationCap, 
  Calendar, 
  Clock, 
  Eye, 
  X, 
  FileDown,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export interface StudentDecisionData {
  userId: string;
  userName: string;
  userEmail: string;
  birthDate?: string;
  chronologicalAge?: {
    years: number;
    months: number;
    days?: number;
    totalMonths?: number;
  };
  cfit?: {
    totalRawScore: number;
    hasFlagRed: boolean;
    scale?: string;
    resultId?: number;
  };
  cpm?: {
    score: number;
    resultId?: number;
  };
  tiu?: {
    score: number;
    resultId?: number;
  };
  epps?: {
    consistencyScore: number;
    isValid: boolean;
    topNeeds: string[];
    resultId?: number;
  };
  bakum?: {
    totalRawScore: number;
    topStrengths: string[];
    resultId?: number;
  };
  minat?: {
    topFields: string[];
    recommendedCareers: string[];
    recommendedMajors: string[];
    resultId?: number;
  };
  completedTestsCount: number;
}

export default function DecisionMatrixView({ students }: { students: StudentDecisionData[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<StudentDecisionData | null>(null);

  // Filter students by search term
  const filteredStudents = students.filter(
    (s) =>
      s.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Stats calculation
  const totalStudents = students.length;
  const eppsValidCount = students.filter((s) => s.epps?.isValid === true).length;
  const eppsInvalidCount = students.filter((s) => s.epps && s.epps.isValid === false).length;
  const withCareerMatches = students.filter((s) => s.minat && s.minat.recommendedCareers.length > 0).length;

  return (
    <div className="space-y-6">
      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Siswa Teruji</span>
            <Users size={18} className="text-blue-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{totalStudents}</div>
          <p className="text-xs text-slate-500 mt-1">Siswa telah menyelesaikan tes</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Validitas EPPS</span>
            <CheckCircle2 size={18} className="text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-600">{eppsValidCount}</span>
            <span className="text-sm text-slate-400 font-semibold">Valid</span>
            {eppsInvalidCount > 0 && (
              <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full ml-auto">
                {eppsInvalidCount} Tidak Valid
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">Pemeriksaan konsistensi 15 pasang soal</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Rekomendasi Karir</span>
            <Briefcase size={18} className="text-indigo-600" />
          </div>
          <div className="text-3xl font-extrabold text-indigo-600">{withCareerMatches}</div>
          <p className="text-xs text-slate-500 mt-1">Siswa memiliki pemetaan studi & profesi</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Sistem Matriks Silang</span>
            <Sparkles size={18} className="text-amber-500" />
          </div>
          <div className="text-sm font-bold text-slate-800 leading-snug">
            Kognitif + Bakat + Karakter + Minat
          </div>
          <p className="text-xs text-slate-500 mt-1">Integrasi keputusan 4 pilar psikotes</p>
        </div>
      </div>

      {/* Search and Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900">
              Matriks Silang Keputusan Siswa (Cross-Analysis)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Menyandingkan seluruh aspek kognitif, bakat, kepribadian, dan minat dalam satu layar terpadu.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama siswa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs font-medium rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        {/* Matrix Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap text-xs">
            <thead>
              <tr style={{ background: 'linear-gradient(135deg, #0a1628, #1e3a8a)', color: '#ffffff' }}>
                <th className="px-4 py-3.5 font-bold uppercase tracking-wider text-center w-12">NO</th>
                <th className="px-4 py-3.5 font-bold uppercase tracking-wider">NAMA & USIA SISWA</th>
                <th className="px-4 py-3.5 font-bold uppercase tracking-wider text-center">
                  KOGNITIF (IQ/TIU)
                </th>
                <th className="px-4 py-3.5 font-bold uppercase tracking-wider">
                  BAKAT DOMINAN (BAKUM)
                </th>
                <th className="px-4 py-3.5 font-bold uppercase tracking-wider text-center">
                  KEPRIBADIAN (EPPS)
                </th>
                <th className="px-4 py-3.5 font-bold uppercase tracking-wider">
                  MINAT & REKOMENDASI KARIR
                </th>
                <th className="px-4 py-3.5 font-bold uppercase tracking-wider text-center">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-14 text-center text-slate-400">
                    Tidak ditemukan data siswa.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s, idx) => (
                  <tr key={s.userId} className="hover:bg-blue-50/20 transition-colors">
                    {/* Index */}
                    <td className="px-4 py-4 text-center text-slate-400 font-bold">{idx + 1}</td>

                    {/* Student Identity */}
                    <td className="px-4 py-4">
                      <div className="font-bold text-sm text-slate-900">{s.userName}</div>
                      <div className="text-[11px] text-slate-500">{s.userEmail}</div>
                      {s.chronologicalAge ? (
                        <div className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-semibold text-[10px]">
                          <Clock size={11} />
                          Usia: {s.chronologicalAge.years} Thn {s.chronologicalAge.months} Bln
                        </div>
                      ) : (
                        <div className="text-[10px] text-slate-400 mt-0.5">Usia belum tercatat</div>
                      )}
                    </td>

                    {/* Cognitive Pillar */}
                    <td className="px-4 py-4 text-center">
                      {s.cfit ? (
                        <div>
                          <div className="font-extrabold text-blue-700 text-sm">
                            {s.cfit.totalRawScore} Benar
                          </div>
                          <div className="text-[10px] text-slate-500">
                            {s.cfit.scale ? `CFIT ${s.cfit.scale}` : 'CFIT'}
                          </div>
                          {s.cfit.hasFlagRed && (
                            <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded-full mt-1">
                              🚩 Cepat
                            </span>
                          )}
                        </div>
                      ) : s.cpm ? (
                        <div className="font-bold text-emerald-700 text-sm">
                          CPM: {s.cpm.score}
                        </div>
                      ) : s.tiu ? (
                        <div className="font-bold text-amber-700 text-sm">
                          TIU: {s.tiu.score}
                        </div>
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">- Belum ada -</span>
                      )}
                    </td>

                    {/* Talent Pillar (BAKUM) */}
                    <td className="px-4 py-4">
                      {s.bakum && s.bakum.topStrengths.length > 0 ? (
                        <div className="space-y-1">
                          {s.bakum.topStrengths.slice(0, 2).map((str, i) => (
                            <div
                              key={i}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-semibold text-[11px] mr-1"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              {str}
                            </div>
                          ))}
                        </div>
                      ) : s.bakum ? (
                        <span className="font-semibold text-slate-700">Skor: {s.bakum.totalRawScore}</span>
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">- Belum ada -</span>
                      )}
                    </td>

                    {/* Personality Pillar (EPPS) */}
                    <td className="px-4 py-4 text-center">
                      {s.epps ? (
                        <div>
                          {s.epps.isValid ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              ✓ {s.epps.consistencyScore}/15 (VALID)
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                              ⚠️ {s.epps.consistencyScore}/15 (TIDAK VALID)
                            </span>
                          )}
                          {s.epps.topNeeds.length > 0 && (
                            <div className="text-[10px] text-slate-500 mt-1 font-semibold">
                              Needs: {s.epps.topNeeds.join(', ')}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">- Belum ada -</span>
                      )}
                    </td>

                    {/* Career & Interest Pillar */}
                    <td className="px-4 py-4">
                      {s.minat ? (
                        <div className="max-w-xs space-y-1">
                          <div className="font-bold text-slate-800 text-[11px] truncate">
                            {s.minat.topFields.slice(0, 2).join(' & ') || 'Minat'}
                          </div>
                          {s.minat.recommendedCareers.length > 0 && (
                            <div className="text-[10px] text-indigo-700 truncate font-medium">
                              🎯 {s.minat.recommendedCareers.slice(0, 2).join(', ')}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">- Belum ada -</span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="px-4 py-4 text-center">
                      <button
                        onClick={() => setSelectedStudent(s)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white transition-all duration-200 shadow-2xs"
                      >
                        <Eye size={13} />
                        Lihat Profil
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Comprehensive Student Detail Modal (Decision Synthesis) */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-5 border-b border-slate-100 flex items-center justify-between z-10">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                  Profil Keputusan Terpadu
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                  {selectedStudent.userName}
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedStudent.userEmail} ·{' '}
                  {selectedStudent.chronologicalAge
                    ? `Usia ${selectedStudent.chronologicalAge.years} Tahun ${selectedStudent.chronologicalAge.months} Bulan`
                    : 'Usia belum tercatat'}
                </p>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body: 4 Pillars of Assessment */}
            <div className="p-6 space-y-6">
              {/* 4 Pillars Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Kognitif */}
                <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-2">
                  <div className="flex items-center justify-between text-blue-900 font-bold text-xs">
                    <span className="flex items-center gap-1.5">
                      <Brain size={16} /> 1. Kognitif & Inteligensi
                    </span>
                    {selectedStudent.cfit?.hasFlagRed && (
                      <span className="text-[10px] font-extrabold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">
                        Flag Merah
                      </span>
                    )}
                  </div>
                  <div className="text-2xl font-black text-blue-800">
                    {selectedStudent.cfit
                      ? `${selectedStudent.cfit.totalRawScore} Skor Benar`
                      : selectedStudent.cpm
                      ? `${selectedStudent.cpm.score} Skor CPM`
                      : selectedStudent.tiu
                      ? `${selectedStudent.tiu.score} Skor TIU`
                      : 'Belum Dikerjakan'}
                  </div>
                  <p className="text-[11px] text-slate-600">
                    {selectedStudent.cfit
                      ? `Telah menyelesaikan tes CFIT. Skor ini menunjukkan penalaran non-verbal dan kemampuan pemecahan pola visual.`
                      : 'Siswa belum memiliki rekam tes kognitif/intelegensi.'}
                  </p>
                </div>

                {/* 2. Bakat Umum */}
                <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-2">
                  <div className="flex items-center justify-between text-emerald-900 font-bold text-xs">
                    <span className="flex items-center gap-1.5">
                      <Activity size={16} /> 2. Bakat Umum (BAKUM)
                    </span>
                  </div>
                  <div className="text-sm font-extrabold text-emerald-800">
                    {selectedStudent.bakum && selectedStudent.bakum.topStrengths.length > 0
                      ? selectedStudent.bakum.topStrengths.join(' · ')
                      : 'Belum Dikerjakan'}
                  </div>
                  <p className="text-[11px] text-slate-600">
                    {selectedStudent.bakum
                      ? `Menunjukkan kecenderungan potensi paling unggul pada area spesifik di atas.`
                      : 'Siswa belum mengerjakan tes bakat umum (BAKUM).'}
                  </p>
                </div>

                {/* 3. Kepribadian */}
                <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-2">
                  <div className="flex items-center justify-between text-purple-900 font-bold text-xs">
                    <span className="flex items-center gap-1.5">
                      <Users size={16} /> 3. Kepribadian (EPPS)
                    </span>
                    {selectedStudent.epps && (
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                          selectedStudent.epps.isValid
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {selectedStudent.epps.isValid ? 'VALID' : 'TIDAK VALID'}
                      </span>
                    )}
                  </div>
                  <div className="text-sm font-bold text-purple-900">
                    {selectedStudent.epps
                      ? `Top Needs: ${selectedStudent.epps.topNeeds.join(', ') || 'Normal'}`
                      : 'Belum Dikerjakan'}
                  </div>
                  <p className="text-[11px] text-slate-600">
                    {selectedStudent.epps
                      ? `Konsistensi pengerjaan: ${selectedStudent.epps.consistencyScore}/15. ${
                          selectedStudent.epps.isValid
                            ? 'Respon konsisten dan dapat dijadikan acuan profil psikologis.'
                            : 'PERINGATAN: Konsistensi rendah, hasil terindikasi asal jawab.'
                        }`
                      : 'Siswa belum memiliki hasil tes kepribadian EPPS.'}
                  </p>
                </div>

                {/* 4. Minat & Karir */}
                <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-2">
                  <div className="flex items-center justify-between text-indigo-900 font-bold text-xs">
                    <span className="flex items-center gap-1.5">
                      <Network size={16} /> 4. Minat Jabatan & Studi
                    </span>
                  </div>
                  <div className="text-sm font-bold text-indigo-900 truncate">
                    {selectedStudent.minat
                      ? selectedStudent.minat.topFields.join(' · ')
                      : 'Belum Dikerjakan'}
                  </div>
                  <p className="text-[11px] text-slate-600">
                    {selectedStudent.minat
                      ? `Siswa menunjukkan ketertarikan tinggi pada bidang-bidang di atas.`
                      : 'Siswa belum menyelesaikan tes minat jabatan.'}
                  </p>
                </div>
              </div>

              {/* Career Matching Recommendations Box */}
              {selectedStudent.minat && selectedStudent.minat.recommendedCareers.length > 0 && (
                <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-300">
                      <Sparkles size={16} className="text-amber-400" />
                      Rekomendasi Pemetaan Karir & Program Studi
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
                    <div className="space-y-1.5">
                      <div className="text-slate-400 font-semibold flex items-center gap-1">
                        <Briefcase size={13} className="text-blue-400" /> Prospek Profesi:
                      </div>
                      <div className="space-y-1">
                        {selectedStudent.minat.recommendedCareers.map((c, i) => (
                          <div key={i} className="font-semibold text-slate-200">
                            • {c}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="text-slate-400 font-semibold flex items-center gap-1">
                        <GraduationCap size={14} className="text-emerald-400" /> Rekomendasi Jurusan Kuliah:
                      </div>
                      <div className="space-y-1">
                        {selectedStudent.minat.recommendedMajors.map((m, i) => (
                          <div key={i} className="font-semibold text-slate-200">
                            • {m}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Synthesis Note for Counselor */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
                <span className="font-bold text-slate-800 block">Sintesis Keputusan Mascons:</span>
                <p className="leading-relaxed">
                  Gunakan matriks silang ini saat sesi Bimbingan Konseling (BK) dengan siswa dan wali murid. 
                  Siswa yang memiliki keselarasan antara <strong>Bakat</strong> (potensi riil) dan <strong>Minat</strong> (keinginan karir) 
                  akan memiliki probabilitas keberhasilan akademik yang lebih tinggi pada jurusan yang direkomendasikan.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-5 py-2.5 rounded-xl font-bold text-xs bg-slate-800 text-white hover:bg-slate-900 transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
