import { ShieldCheck } from "lucide-react";
import LoginForm from "./login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-50 selection:bg-purple-200 p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-60 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30rem] h-[30rem] bg-fuchsia-50 rounded-full blur-3xl opacity-60 pointer-events-none" />
      
      <div className="w-full max-w-md bg-white rounded-3xl border border-purple-100 shadow-xl shadow-purple-200/50 overflow-hidden relative z-10">
        <div className="p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-700 rounded-2xl mb-6 shadow-lg shadow-purple-200">
            <ShieldCheck className="text-white" size={32} />
          </div>
          <h1 className="text-2xl font-extrabold text-purple-950">Dasbor Admin</h1>
          <p className="text-purple-800/70 mt-2">Masuk untuk mengakses Mascons</p>
        </div>
        
        <LoginForm />
        
        <div className="p-6 bg-purple-50/50 text-center border-t border-purple-50">
          <p className="text-xs text-purple-400">
            Khusus Personel Terotorisasi. Semua akses dicatat.
          </p>
        </div>
      </div>
    </div>
  );
}
