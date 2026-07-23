'use client';

import { useState } from 'react';
import { registerAdmin } from './actions';
import { Loader2 } from "lucide-react";

export default function RegisterForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    const result = await registerAdmin(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <form action={handleSubmit} className="p-8 pt-0 space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl text-center">
          {error}
        </div>
      )}
      
      <div className="space-y-2">
        <label className="text-sm font-semibold text-purple-900 ml-1">Nama Lengkap</label>
        <input 
          name="fullName"
          type="text" 
          placeholder="John Doe"
          required
          className="w-full px-4 py-3 rounded-xl border border-purple-100 bg-purple-50/30 focus:bg-white focus:border-purple-300 focus:ring-4 focus:ring-purple-100 outline-none transition-all text-purple-900 placeholder:text-purple-300"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-purple-900 ml-1">Alamat Email</label>
        <input 
          name="email"
          type="email" 
          placeholder="admin@mascons.com"
          required
          className="w-full px-4 py-3 rounded-xl border border-purple-100 bg-purple-50/30 focus:bg-white focus:border-purple-300 focus:ring-4 focus:ring-purple-100 outline-none transition-all text-purple-900 placeholder:text-purple-300"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-purple-900 ml-1">Kata Sandi</label>
        <input 
          name="password"
          type="password" 
          placeholder="••••••••"
          required
          minLength={6}
          className="w-full px-4 py-3 rounded-xl border border-purple-100 bg-purple-50/30 focus:bg-white focus:border-purple-300 focus:ring-4 focus:ring-purple-100 outline-none transition-all text-purple-900 placeholder:text-purple-300"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-red-600 ml-1">Kode Rahasia (Secret Code)</label>
        <input 
          name="secretCode"
          type="password" 
          placeholder="Masukkan kode rahasia..."
          required
          className="w-full px-4 py-3 rounded-xl border border-red-200 bg-red-50/50 focus:ring-2 focus:ring-red-500 outline-none transition-all text-red-900 placeholder:text-red-300"
        />
        <p className="text-xs text-purple-500 ml-1">Diperlukan untuk mengotorisasi pendaftaran peran admin Anda.</p>
      </div>

      <button 
        disabled={loading}
        className="w-full py-4 bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white rounded-xl font-bold text-lg shadow-lg shadow-purple-200 transition-all mt-6 flex items-center justify-center hover:-translate-y-0.5"
      >
        {loading ? <Loader2 className="animate-spin" /> : "Daftar sebagai Admin"}
      </button>
    </form>
  );
}
