import Image from "next/image";
import { ShieldCheck } from "lucide-react";
import LoginForm from "./login-form";

export default function LoginPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden"
      style={{ background: '#f0f6ff' }}
    >
      {/* Decorative blobs */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '-15%',
          left: '-10%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(29,78,216,0.1) 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: '-15%',
          right: '-10%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(14,165,233,0.1) 0%, transparent 70%)',
        }}
      />
      {/* Grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: 'linear-gradient(rgba(37,99,235,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.04) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      
      <div
        className="w-full max-w-md overflow-hidden relative z-10"
        style={{
          background: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: '1.5rem',
          border: '1px solid rgba(29,78,216,0.1)',
          boxShadow: '0 20px 60px rgba(29,78,216,0.1)',
        }}
      >
        <div className="p-8 text-center">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6"
            style={{
              background: 'linear-gradient(135deg, #1d4ed8, #0ea5e9)',
              boxShadow: '0 8px 25px rgba(29,78,216,0.3)',
            }}
          >
            <ShieldCheck className="text-white" size={32} />
          </div>
          <h1 className="text-2xl font-extrabold" style={{ color: '#0a1628' }}>
            Dasbor Admin
          </h1>
          <p className="mt-2 text-sm" style={{ color: '#64748b' }}>
            Masuk untuk mengakses Mascons
          </p>
        </div>
        
        <LoginForm />
        
        <div
          className="p-6 text-center"
          style={{
            background: 'rgba(29,78,216,0.02)',
            borderTop: '1px solid rgba(29,78,216,0.06)',
          }}
        >
          <p className="text-xs" style={{ color: '#94a3b8' }}>
            Khusus Personel Terotorisasi. Semua akses dicatat.
          </p>
        </div>
      </div>
    </div>
  );
}
