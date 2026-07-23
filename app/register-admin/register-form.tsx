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
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 text-sm rounded-xl text-center">
          {error}
        </div>
      )}
      
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Full Name</label>
        <input 
          name="fullName"
          type="text" 
          placeholder="John Doe"
          required
          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Email Address</label>
        <input 
          name="email"
          type="email" 
          placeholder="admin@mascons.com"
          required
          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Password</label>
        <input 
          name="password"
          type="password" 
          placeholder="••••••••"
          required
          minLength={6}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-red-600 dark:text-red-400 ml-1">Setup Secret Code</label>
        <input 
          name="secretCode"
          type="password" 
          placeholder="Enter the secret code..."
          required
          className="w-full px-4 py-3 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-900/10 focus:ring-2 focus:ring-red-500 outline-none transition-all"
        />
        <p className="text-xs text-slate-500 ml-1">Required to authorize your admin role registration.</p>
      </div>

      <button 
        disabled={loading}
        className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl font-bold text-lg shadow-lg shadow-indigo-200 dark:shadow-none transition-all mt-4 flex items-center justify-center"
      >
        {loading ? <Loader2 className="animate-spin" /> : "Register as Admin"}
      </button>
    </form>
  );
}
