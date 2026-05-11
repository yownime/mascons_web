import { ShieldCheck } from "lucide-react";
import RegisterForm from "./register-form";
import Link from "next/link";

export default function RegisterAdminPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden mt-8 mb-8">
        <div className="p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl mb-6 shadow-lg shadow-indigo-200 dark:shadow-none">
            <ShieldCheck className="text-white" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Setup Admin Account</h1>
          <p className="text-slate-500 mt-2">Create a new super-admin account for Mascons</p>
        </div>
        
        <RegisterForm />
        
        <div className="p-6 bg-slate-50 dark:bg-slate-800/50 text-center flex flex-col gap-2">
          <p className="text-xs text-slate-400">
            Unauthorized registration attempts will be blocked.
          </p>
          <Link href="/login" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
            Already have an account? Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
