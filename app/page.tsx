import Link from "next/link";
import { ArrowRight, ShieldCheck, BarChart3, Users2 } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <header className="px-8 h-20 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
            <ShieldCheck className="text-white" size={24} />
          </div>
          <span className="text-2xl font-bold text-slate-900 dark:text-white">Mascons</span>
        </div>
        <Link 
          href="/admin" 
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-medium transition-all shadow-lg shadow-indigo-200 dark:shadow-none"
        >
          Go to Admin Dashboard
        </Link>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="py-24 px-8 text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6">
            Psychological Testing <span className="text-indigo-600">Simplified.</span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed">
            The unified ecosystem for managing CFIT, EPPS, Kraepelin, and more. 
            From mobile testing to automated PDF report generation.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/admin/sessions" 
              className="w-full sm:w-auto px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold text-lg flex items-center justify-center group transition-all"
            >
              Manage Test Sessions
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 px-8 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
            <FeatureCard 
              icon={<BarChart3 className="text-indigo-600" size={32} />}
              title="Advanced Analytics"
              description="Real-time monitoring of test participation and automated score calculation."
            />
            <FeatureCard 
              icon={<Users2 className="text-indigo-600" size={32} />}
              title="Multi-Role Support"
              description="Secure access for participants via Flutter app and full control for administrators."
            />
            <FeatureCard 
              icon={<ShieldCheck className="text-indigo-600" size={32} />}
              title="Secure Reports"
              description="Generated professional PDF reports stored securely and accessible on demand."
            />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 px-8 text-center text-slate-500 text-sm border-t border-slate-200 dark:border-slate-800">
        <p>&copy; 2026 Mascons Ecosystem. All rights reserved.</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="space-y-4">
      <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h3>
      <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{description}</p>
    </div>
  );
}
