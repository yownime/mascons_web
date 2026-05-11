'use client';

import { useState, useEffect } from 'react';
import { CheckCircle2, Circle, ListTodo, RefreshCcw } from 'lucide-react';

const TESTING_STEPS = [
  {
    id: 'setup_db',
    title: '1. Setup Database',
    description: 'Jalankan "npx drizzle-kit push" di terminal mascons_web untuk update kolom role.',
  },
  {
    id: 'setup_admin',
    title: '2. Setup Akun Admin (Web)',
    description: 'Buka /register-admin, isi data, masukkan secret code "mascons123", dan pastikan berhasil masuk ke Dashboard.',
  },
  {
    id: 'create_session',
    title: '3. Buat Sesi Ujian (Web Admin)',
    description: 'Di Dashboard, buat Test Session baru, set Access Code (misal: REKRUT-01), dan pastikan statusnya Active.',
  },
  {
    id: 'setup_mobile',
    title: '4. Persiapan Mobile (Flutter)',
    description: 'Buka lib/services/api_service.dart, pastikan baseUrl mengarah ke http://10.0.2.2:3000 (emulator) atau IP laptop (HP fisik).',
  },
  {
    id: 'mobile_login',
    title: '5. Login Peserta (Mobile)',
    description: 'Login di aplikasi mobile menggunakan akun user (bukan admin yang tadi dibuat).',
  },
  {
    id: 'mobile_join',
    title: '6. Gabung Sesi (Mobile)',
    description: 'Di Quiz Screen, masukkan kode akses (REKRUT-01), tekan Gabung. Pastikan muncul notifikasi "Terhubung ke Sesi".',
  },
  {
    id: 'mobile_test',
    title: '7. Kerjakan Test (Mobile)',
    description: 'Pilih CFIT/EPPS, kerjakan sampai selesai, dan tunggu notifikasi "Test Selesai!".',
  },
  {
    id: 'verify_results',
    title: '8. Verifikasi Hasil (Web Admin)',
    description: 'Kembali ke Dashboard Web (/admin), cek menu Results/Participants. Pastikan skor dan status "Completed" muncul.',
  }
];

export default function TestingPage() {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('mascons_testing_progress');
    if (saved) {
      try {
        setCheckedItems(JSON.parse(saved));
      } catch (e) {
        // ignore
      }
    }
  }, []);

  const toggleItem = (id: string) => {
    const newChecked = { ...checkedItems, [id]: !checkedItems[id] };
    setCheckedItems(newChecked);
    localStorage.setItem('mascons_testing_progress', JSON.stringify(newChecked));
  };

  const resetProgress = () => {
    setCheckedItems({});
    localStorage.removeItem('mascons_testing_progress');
  };

  const progress = Math.round((Object.values(checkedItems).filter(Boolean).length / TESTING_STEPS.length) * 100) || 0;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
          
          {/* Header */}
          <div className="bg-indigo-600 px-8 py-8 text-white relative overflow-hidden">
            <div className="relative z-10 flex justify-between items-start">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <ListTodo size={32} className="text-indigo-200" />
                  <h1 className="text-3xl font-bold">Testing Checklist</h1>
                </div>
                <p className="text-indigo-100">Ikuti langkah ini untuk memastikan integrasi Mobile ↔ Web berjalan lancar.</p>
              </div>
              <button 
                onClick={resetProgress}
                className="p-2 bg-indigo-500/50 hover:bg-indigo-500 rounded-lg transition-colors"
                title="Reset Progress"
              >
                <RefreshCcw size={20} />
              </button>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-8">
              <div className="flex justify-between text-sm font-medium mb-2">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <div className="h-3 w-full bg-indigo-900/50 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-400 transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          {/* List */}
          <div className="p-6 sm:p-8 space-y-4">
            {TESTING_STEPS.map((step) => {
              const isChecked = !!checkedItems[step.id];
              return (
                <div 
                  key={step.id}
                  onClick={() => toggleItem(step.id)}
                  className={`flex items-start p-4 rounded-2xl cursor-pointer border transition-all duration-200 ${
                    isChecked 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-white border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {isChecked ? (
                      <CheckCircle2 className="text-green-500" size={24} />
                    ) : (
                      <Circle className="text-slate-300" size={24} />
                    )}
                  </div>
                  <div className="ml-4">
                    <h3 className={`font-semibold text-lg ${isChecked ? 'text-green-800 line-through opacity-70' : 'text-slate-800'}`}>
                      {step.title}
                    </h3>
                    <p className={`mt-1 text-sm ${isChecked ? 'text-green-600/70' : 'text-slate-500'}`}>
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {progress === 100 && (
            <div className="bg-green-500 p-6 text-center text-white font-bold text-xl">
              🎉 Selamat! Semua testing berhasil! 🎉
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
