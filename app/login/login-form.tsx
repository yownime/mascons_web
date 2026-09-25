'use client';

import { useState } from 'react';
import { login } from './actions';
import { Loader2 } from "lucide-react";

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
        <div
          className="p-3 text-sm rounded-xl text-center"
          style={{
            background: 'rgba(239,68,68,0.06)',
            border: '1px solid rgba(239,68,68,0.15)',
            color: '#ef4444',
          }}
        >
          {error}
        </div>
      )}
      <div className="space-y-2">
        <label className="text-sm font-semibold ml-1" style={{ color: '#0a1628' }}>
          Alamat Email
        </label>
        <input 
          name="email"
          type="email" 
          placeholder="admin@mascons.com"
          required
          className="w-full px-4 py-3 rounded-xl text-sm transition-all duration-200"
          style={{
            background: 'rgba(29,78,216,0.03)',
            border: '1px solid rgba(29,78,216,0.1)',
            color: '#0a1628',
            outline: 'none',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'rgba(37,99,235,0.3)';
            e.currentTarget.style.boxShadow = '0 0 0 4px rgba(37,99,235,0.08)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'rgba(29,78,216,0.1)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-semibold ml-1" style={{ color: '#0a1628' }}>
          Kata Sandi
        </label>
        <input 
          name="password"
          type="password" 
          placeholder="••••••••"
          required
          className="w-full px-4 py-3 rounded-xl text-sm transition-all duration-200"
          style={{
            background: 'rgba(29,78,216,0.03)',
            border: '1px solid rgba(29,78,216,0.1)',
            color: '#0a1628',
            outline: 'none',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'rgba(37,99,235,0.3)';
            e.currentTarget.style.boxShadow = '0 0 0 4px rgba(37,99,235,0.08)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'rgba(29,78,216,0.1)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        />
      </div>
      <button 
        disabled={loading}
        className="w-full py-4 rounded-xl font-bold text-base text-white transition-all duration-200 mt-6 flex items-center justify-center hover:-translate-y-0.5 disabled:opacity-50"
        style={{
          background: 'linear-gradient(135deg, #1d4ed8, #0ea5e9)',
          boxShadow: '0 8px 25px rgba(29,78,216,0.3)',
        }}
      >
        {loading ? <Loader2 className="animate-spin" /> : "Masuk"}
      </button>
    </form>
  );
}
