'use client';

import { useState } from 'react';
import { login } from './actions';
import { ShieldCheck, Loader2 } from "lucide-react";

export default function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    const result = await login(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <form action={handleSubmit} className="p-8 pt-0 space-y-5">
      {error && (
        <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl text-center">
          {error}
        </div>
      )}
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
          className="w-full px-4 py-3 rounded-xl border border-purple-100 bg-purple-50/30 focus:bg-white focus:border-purple-300 focus:ring-4 focus:ring-purple-100 outline-none transition-all text-purple-900 placeholder:text-purple-300"
        />
      </div>
      <button 
        disabled={loading}
        className="w-full py-4 bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white rounded-xl font-bold text-lg shadow-lg shadow-purple-200 transition-all mt-6 flex items-center justify-center hover:-translate-y-0.5"
      >
        {loading ? <Loader2 className="animate-spin" /> : "Masuk"}
      </button>
    </form>
  );
}
