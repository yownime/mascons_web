import { ShieldCheck } from "lucide-react";
import RegisterForm from "./register-form";
import Link from "next/link";

export default function RegisterAdminPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-50 selection:bg-purple-200 p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-60 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30rem] h-[30rem] bg-fuchsia-50 rounded-full blur-3xl opacity-60 pointer-events-none" />

      <div className="w-full max-w-md bg-white rounded-3xl border border-purple-100 shadow-xl shadow-purple-200/50 overflow-hidden mt-8 mb-8 relative z-10">
        <div className="p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-700 rounded-2xl mb-6 shadow-lg shadow-purple-200">
            <ShieldCheck className="text-white" size={32} />
          </div>
          <h1 className="text-2xl font-extrabold text-purple-950">Setup Akun Admin</h1>
          <p className="text-purple-800/70 mt-2">Buat akun super-admin baru untuk Mascons</p>
        </div>
        
        <RegisterForm />
        
        <div className="p-6 bg-purple-50/50 text-center flex flex-col gap-2 border-t border-purple-50">
          <p className="text-xs text-purple-400">
            Upaya pendaftaran yang tidak sah akan diblokir.
          </p>
          <Link href="/login" className="text-sm font-semibold text-purple-700 hover:text-purple-800 transition-colors">
            Sudah punya akun? Masuk
          </Link>
        </div>
      </div>
    </div>
  );
}
