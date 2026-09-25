import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BarChart3,
  FileText,
  Smartphone,
  Laptop,
  CheckCircle2,
  Brain,
  Zap,
  Lock,
  TrendingUp,
  ChevronRight,
} from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen" style={{ background: "#f0f6ff" }}>
      {/* ── HEADER ── */}
      <header
        className="fixed top-0 w-full z-50 h-[72px] flex items-center justify-between px-6 lg:px-16 glass"
        style={{ boxShadow: "0 1px 30px rgba(37,99,235,0.08)" }}
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0" style={{ boxShadow: "0 2px 10px rgba(29,78,216,0.25)" }}>
            <Image
              src="/logo.jpeg"
              alt="Logo Lembaga Konseling Psiko Paedagogi Indonesia"
              width={40}
              height={40}
              className="object-cover w-full h-full"
            />
          </div>
          <span className="text-xl font-extrabold tracking-tight" style={{ color: "#0a1628" }}>
            Mascons
          </span>
        </div>

        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium" style={{ color: "#334155" }}>
          <a href="#features" className="hover:text-blue-600 transition-colors">Fitur</a>
          <a href="#how-it-works" className="hover:text-blue-600 transition-colors">Cara Kerja</a>
          <a href="#stats" className="hover:text-blue-600 transition-colors">Platform</a>
        </nav>

        <Link
          href="/admin"
          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
          style={{
            background: "linear-gradient(135deg, #1d4ed8, #0ea5e9)",
            boxShadow: "0 4px 15px rgba(29,78,216,0.35)",
          }}
        >
          Dasbor Admin
          <ChevronRight size={15} />
        </Link>
      </header>

      {/* ── HERO ── */}
      <main className="flex-1 pt-[72px]">
        <section
          className="relative overflow-hidden grid-pattern"
          style={{ paddingTop: "100px", paddingBottom: "100px" }}
        >
          {/* decorative blobs */}
          <div
            className="absolute pointer-events-none"
            style={{
              top: "-15%", left: "-10%",
              width: "600px", height: "600px",
              background: "radial-gradient(circle, rgba(29,78,216,0.12) 0%, transparent 70%)",
            }}
          />
          <div
            className="absolute pointer-events-none"
            style={{
              bottom: "-15%", right: "-10%",
              width: "500px", height: "500px",
              background: "radial-gradient(circle, rgba(14,165,233,0.12) 0%, transparent 70%)",
            }}
          />

          <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-12 text-center">
            {/* badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-8"
              style={{
                background: "rgba(29,78,216,0.08)",
                border: "1px solid rgba(29,78,216,0.2)",
                color: "#1d4ed8",
              }}
            >
              <span
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ background: "#1d4ed8" }}
              />
              Platform Psikometri Modern untuk Indonesia
            </div>

            {/* headline */}
            <h1
              className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.08] mb-6"
              style={{ color: "#0a1628" }}
            >
              Kelola Asesmen
              <br />
              <span
                className="animate-gradient"
                style={{
                  background: "linear-gradient(90deg, #1d4ed8, #0ea5e9, #6366f1, #1d4ed8)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  backgroundSize: "300% 100%",
                }}
              >
                Secara Profesional
              </span>
            </h1>

            <p
              className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10"
              style={{ color: "#475569" }}
            >
              Platform terpadu untuk mengelola tes psikologi <strong style={{ color: "#0a1628" }}>CFIT, EPPS, & Kraepelin</strong> — dari pembuatan sesi hingga laporan PDF otomatis, semuanya dalam satu ekosistem.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/admin/sessions"
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-white font-bold text-base transition-all duration-200 hover:-translate-y-1"
                style={{
                  background: "linear-gradient(135deg, #1d4ed8, #0ea5e9)",
                  boxShadow: "0 8px 30px rgba(29,78,216,0.4)",
                }}
              >
                Kelola Sesi Sekarang
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#how-it-works"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-base transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  background: "rgba(255,255,255,0.9)",
                  border: "1.5px solid rgba(29,78,216,0.2)",
                  color: "#1d4ed8",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.06)",
                }}
              >
                Lihat Cara Kerjanya
              </a>
            </div>

            {/* mini trust */}
            <div className="mt-10 flex items-center justify-center gap-6 flex-wrap text-sm" style={{ color: "#64748b" }}>
              {[
                { icon: <Lock size={14} />, text: "Data Aman & Terenkripsi" },
                { icon: <Zap size={14} />, text: "Skor Instan Otomatis" },
                { icon: <CheckCircle2 size={14} />, text: "Laporan PDF Profesional" },
              ].map(({ icon, text }) => (
                <div key={text} className="flex items-center gap-1.5" style={{ color: "#3b82f6" }}>
                  {icon}
                  <span style={{ color: "#475569" }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── STATS ── */}
        <section id="stats" style={{ background: "linear-gradient(135deg, #0a1628 0%, #1e3a8a 50%, #0a1628 100%)" }}>
          <div className="max-w-6xl mx-auto px-6 lg:px-12 py-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: "3+", label: "Jenis Tes Didukung", sub: "CFIT, EPPS, Kraepelin" },
                { value: "100%", label: "Skor Otomatis", sub: "Tanpa hitung manual" },
                { value: "1-Klik", label: "Buat Laporan PDF", sub: "Langsung dari dasbor" },
                { value: "Real-time", label: "Monitoring Peserta", sub: "Live session tracking" },
              ].map(({ value, label, sub }) => (
                <div key={label} className="text-center">
                  <div
                    className="text-3xl md:text-4xl font-extrabold mb-1"
                    style={{ color: "#38bdf8" }}
                  >
                    {value}
                  </div>
                  <div className="font-semibold text-white text-sm mb-0.5">{label}</div>
                  <div className="text-xs" style={{ color: "#94a3b8" }}>{sub}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section
          id="features"
          className="py-24 px-6 lg:px-12"
          style={{ background: "#f8faff" }}
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <span
                className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4"
                style={{ background: "rgba(29,78,216,0.08)", color: "#1d4ed8" }}
              >
                Fitur Unggulan
              </span>
              <h2
                className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight"
                style={{ color: "#0a1628" }}
              >
                Dirancang untuk <span style={{ color: "#2563eb" }}>Efisiensi Maksimal</span>
              </h2>
              <p className="text-base max-w-xl mx-auto" style={{ color: "#64748b" }}>
                Semua yang Anda butuhkan untuk mengelola, memantau, dan menganalisis tes psikologi secara profesional.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: <BarChart3 className="w-7 h-7" style={{ color: "#2563eb" }} />,
                  color: "rgba(37,99,235,0.08)",
                  title: "Analitik Real-Time",
                  desc: "Pantau sesi aktif, progres peserta, dan hasil skor secara instan — semua tersaji dalam dasbor yang bersih dan intuitif.",
                },
                {
                  icon: <Smartphone className="w-7 h-7" style={{ color: "#0ea5e9" }} />,
                  color: "rgba(14,165,233,0.08)",
                  title: "Aplikasi Mobile Terintegrasi",
                  desc: "Peserta mengerjakan tes lewat aplikasi Flutter yang dioptimalkan — pengalaman bersih, fokus, tanpa distraksi.",
                },
                {
                  icon: <FileText className="w-7 h-7" style={{ color: "#6366f1" }} />,
                  color: "rgba(99,102,241,0.08)",
                  title: "Laporan PDF Otomatis",
                  desc: "Hasilkan laporan berformat rapi dan profesional untuk CFIT, EPPS, & Kraepelin dengan sekali klik dari dasbor.",
                },
                {
                  icon: <Brain className="w-7 h-7" style={{ color: "#0ea5e9" }} />,
                  color: "rgba(14,165,233,0.08)",
                  title: "Penilaian Multi-Tes",
                  desc: "Dukung beragam alat asesmen psikologi standar — CFIT, EPPS, Kraepelin — dalam satu platform terpusat.",
                },
                {
                  icon: <Lock className="w-7 h-7" style={{ color: "#2563eb" }} />,
                  color: "rgba(37,99,235,0.08)",
                  title: "Keamanan Sesi",
                  desc: "Kode akses unik tiap sesi memastikan hanya peserta yang terdaftar yang dapat mengikuti tes.",
                },
                {
                  icon: <TrendingUp className="w-7 h-7" style={{ color: "#6366f1" }} />,
                  color: "rgba(99,102,241,0.08)",
                  title: "Skalabel & Andal",
                  desc: "Dari 10 hingga ratusan peserta, platform kami dirancang untuk tetap stabil dan responsif.",
                },
              ].map(({ icon, color, title, desc }) => (
                <FeatureCard key={title} icon={icon} iconBg={color} title={title} description={desc} />
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section
          id="how-it-works"
          className="py-24 px-6 lg:px-12 relative overflow-hidden"
          style={{ background: "linear-gradient(180deg, #f0f6ff 0%, #e8f0fe 100%)" }}
        >
          <div
            className="absolute inset-0 pointer-events-none opacity-30"
            style={{
              backgroundImage: "radial-gradient(circle at 20% 50%, rgba(29,78,216,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(14,165,233,0.1) 0%, transparent 50%)",
            }}
          />
          <div className="relative z-10 max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <span
                className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4"
                style={{ background: "rgba(29,78,216,0.08)", color: "#1d4ed8" }}
              >
                Alur Kerja
              </span>
              <h2
                className="text-3xl md:text-5xl font-extrabold tracking-tight mb-3"
                style={{ color: "#0a1628" }}
              >
                3 Langkah Mudah
              </h2>
              <p style={{ color: "#64748b" }}>
                Dari nol hingga laporan selesai dalam hitungan menit.
              </p>
            </div>

            <div className="space-y-8">
              {[
                {
                  num: "01",
                  icon: <Laptop className="w-6 h-6" />,
                  color: "#1d4ed8",
                  bg: "rgba(29,78,216,0.1)",
                  title: "Buat Sesi Tes",
                  desc: "Administrator menyiapkan sesi baru di dasbor web — pilih tes (CFIT, EPPS, dll.), tentukan durasi, dan dapatkan kode akses unik secara otomatis.",
                },
                {
                  num: "02",
                  icon: <Smartphone className="w-6 h-6" />,
                  color: "#0ea5e9",
                  bg: "rgba(14,165,233,0.1)",
                  title: "Peserta Mengikuti Tes",
                  desc: "Peserta buka aplikasi Mascons di smartphone, masukkan kode sesi, dan kerjakan tes dalam antarmuka yang fokus dan nyaman.",
                },
                {
                  num: "03",
                  icon: <CheckCircle2 className="w-6 h-6" />,
                  color: "#6366f1",
                  bg: "rgba(99,102,241,0.1)",
                  title: "Tinjau Hasil & Ekspor",
                  desc: "Hasil tersinkronisasi otomatis. Tinjau skor yang sudah dihitung dan ekspor laporan PDF profesional dengan satu klik.",
                },
              ].map(({ num, icon, color, bg, title, desc }, i) => (
                <StepCard key={i} number={num} icon={icon} color={color} bg={bg} title={title} description={desc} />
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA BANNER ── */}
        <section
          className="py-24 px-6 lg:px-12 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #0a1628 0%, #1e3a8a 60%, #0c4a6e 100%)",
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none grid-pattern opacity-10"
          />
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <h2
              className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-5"
            >
              Siap Tingkatkan Proses <br className="hidden md:block" />
              Asesmen Anda?
            </h2>
            <p className="text-lg mb-10" style={{ color: "#93c5fd" }}>
              Bergabunglah dengan era modern asesmen psikologi. Mulai kelola sesi pertama Anda hari ini.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/admin"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-base text-blue-900 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
                style={{ background: "#fff", boxShadow: "0 4px 20px rgba(0,0,0,0.2)" }}
              >
                Mulai Sekarang — Gratis
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-base transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  border: "1.5px solid rgba(255,255,255,0.25)",
                  color: "white",
                  background: "rgba(255,255,255,0.08)",
                }}
              >
                Pelajari Lebih Lanjut
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* ── FOOTER ── */}
      <footer
        className="px-6 lg:px-16 py-10"
        style={{ background: "#060e1c", borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0" style={{ boxShadow: "0 2px 8px rgba(255,255,255,0.15)" }}>
              <Image
                src="/logo.jpeg"
                alt="Logo Mascons"
                width={36}
                height={36}
                className="object-cover w-full h-full"
              />
            </div>
            <span className="font-extrabold text-white text-lg tracking-tight">Mascons</span>
          </div>
          <div className="flex items-center gap-6 text-sm" style={{ color: "#64748b" }}>
            <a href="/admin" className="hover:text-blue-400 transition-colors">Admin Portal</a>
            <a href="#features" className="hover:text-blue-400 transition-colors">Fitur</a>
            <a href="#how-it-works" className="hover:text-blue-400 transition-colors">Panduan</a>
          </div>
          <p className="text-sm" style={{ color: "#475569" }}>
            &copy; 2026 <span style={{ color: "#94a3b8" }}>Mascons Ecosystem</span>. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

/* ── Sub-components ── */

function FeatureCard({
  icon,
  iconBg,
  title,
  description,
}: {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  description: string;
}) {
  return (
    <div
      className="feature-card group p-7 rounded-2xl bg-white transition-all duration-300 hover:-translate-y-1"
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
        style={{ background: iconBg }}
      >
        {icon}
      </div>
      <h3 className="text-lg font-bold mb-2" style={{ color: "#0a1628" }}>
        {title}
      </h3>
      <p className="text-sm leading-relaxed" style={{ color: "#64748b" }}>
        {description}
      </p>
    </div>
  );
}

function StepCard({
  number,
  icon,
  color,
  bg,
  title,
  description,
}: {
  number: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
  title: string;
  description: string;
}) {
  return (
    <div
      className="flex items-start gap-6 p-6 rounded-2xl bg-white transition-all duration-300 hover:-translate-y-0.5"
      style={{
        border: "1px solid rgba(29,78,216,0.1)",
        boxShadow: "0 2px 15px rgba(29,78,216,0.05)",
      }}
    >
      <div className="flex-shrink-0 relative">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{ background: bg, color }}
        >
          {icon}
        </div>
        <div
          className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-white font-bold"
          style={{ fontSize: "10px", background: color }}
        >
          {number}
        </div>
      </div>
      <div>
        <h3 className="text-xl font-bold mb-1.5" style={{ color: "#0a1628" }}>
          {title}
        </h3>
        <p className="text-sm leading-relaxed" style={{ color: "#64748b" }}>
          {description}
        </p>
      </div>
    </div>
  );
}
