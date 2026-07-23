import Link from "next/link";
import { ArrowRight, ShieldCheck, BarChart3, Users2, FileText, Smartphone, Laptop, CheckCircle2 } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white selection:bg-purple-200">
      {/* Header (Glassmorphic) */}
      <header className="fixed top-0 w-full z-50 h-20 flex items-center justify-between px-6 lg:px-12 bg-white/80 backdrop-blur-md border-b border-purple-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-purple-700 rounded-xl flex items-center justify-center shadow-md shadow-purple-200">
            <ShieldCheck className="text-white" size={24} />
          </div>
          <span className="text-2xl font-extrabold text-purple-950 tracking-tight">Mascons</span>
        </div>
        <Link 
          href="/admin" 
          className="px-6 py-2.5 bg-purple-700 hover:bg-purple-800 text-white rounded-full font-semibold transition-all shadow-lg shadow-purple-200 hover:shadow-purple-300 hover:-translate-y-0.5"
        >
          Admin Dashboard
        </Link>
      </header>

      {/* Hero Section */}
      <main className="flex-1 pt-20">
        <section className="relative overflow-hidden pt-32 pb-24 px-6 lg:px-12 flex flex-col items-center text-center">
          {/* Subtle Background Elements */}
          <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-60 pointer-events-none" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[30rem] h-[30rem] bg-fuchsia-50 rounded-full blur-3xl opacity-60 pointer-events-none" />
          
          <div className="relative z-10 max-w-4xl mx-auto space-y-8">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-purple-50 border border-purple-100 text-purple-700 font-medium text-sm mb-4">
              <span className="flex h-2 w-2 rounded-full bg-purple-600 animate-pulse"></span>
              <span>Modern Psychological Testing Platform</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold text-purple-950 tracking-tight leading-[1.1]">
              Elevate Your <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-fuchsia-600">
                Testing Ecosystem
              </span>
            </h1>
            
            <p className="text-xl text-purple-800/80 max-w-2xl mx-auto leading-relaxed">
              Seamlessly manage CFIT, EPPS, and Kraepelin assessments. Experience the unified platform connecting mobile participants with robust administrative tools.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
              <Link 
                href="/admin/sessions" 
                className="w-full sm:w-auto px-8 py-4 bg-purple-950 hover:bg-purple-900 text-white rounded-full font-bold text-lg flex items-center justify-center group transition-all shadow-xl shadow-purple-950/20"
              >
                Manage Sessions
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a 
                href="#how-it-works" 
                className="w-full sm:w-auto px-8 py-4 bg-purple-50 hover:bg-purple-100 text-purple-900 rounded-full font-bold text-lg flex items-center justify-center transition-colors"
              >
                See How It Works
              </a>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 px-6 lg:px-12 bg-white relative">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-purple-950">Designed for Professionals</h2>
              <p className="text-purple-800/70 max-w-2xl mx-auto">Everything you need to conduct, monitor, and analyze psychological tests efficiently.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard 
                icon={<BarChart3 className="text-purple-600 w-8 h-8" />}
                title="Real-Time Analytics"
                description="Monitor active test sessions, track participant progress, and instantly view calculated scores without delay."
              />
              <FeatureCard 
                icon={<Smartphone className="text-purple-600 w-8 h-8" />}
                title="Mobile-First Testing"
                description="Participants take assessments comfortably via the dedicated Flutter mobile app with a seamless user experience."
              />
              <FeatureCard 
                icon={<FileText className="text-purple-600 w-8 h-8" />}
                title="Automated Reports"
                description="Instantly generate highly detailed, professional PDF reports for CFIT, EPPS, and other tests directly from the dashboard."
              />
            </div>
          </div>
        </section>

        {/* How It Works (Scrollable Steps) */}
        <section id="how-it-works" className="py-24 px-6 lg:px-12 bg-purple-50/50 border-y border-purple-100">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-purple-950 mb-4">A Streamlined Workflow</h2>
              <p className="text-purple-800/70">From session creation to final report delivery.</p>
            </div>

            <div className="space-y-12">
              <Step 
                number="01"
                icon={<Laptop className="w-6 h-6 text-purple-700" />}
                title="Create a Session"
                description="Administrators set up a new test session via the web dashboard, selecting the required test batteries (e.g., CFIT, EPPS) and generating a unique access code."
              />
              <Step 
                number="02"
                icon={<Smartphone className="w-6 h-6 text-purple-700" />}
                title="Participants Join"
                description="Test-takers download the Mascons mobile app, enter the access code, and complete the assessments in a focused, secure environment."
              />
              <Step 
                number="03"
                icon={<CheckCircle2 className="w-6 h-6 text-purple-700" />}
                title="Review & Export"
                description="Results are synced instantly. Administrators can review the computed scores and generate beautifully formatted PDF reports with one click."
              />
            </div>
          </div>
        </section>
      </main>

      {/* CTA / Footer */}
      <footer className="bg-purple-950 pt-20 pb-10 px-6 lg:px-12 text-center text-purple-200">
        <div className="max-w-3xl mx-auto space-y-8 mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
            Ready to transform your testing process?
          </h2>
          <p className="text-purple-300 text-lg">
            Join the modern era of psychological assessments with Mascons.
          </p>
          <div className="pt-4">
            <Link 
              href="/admin" 
              className="inline-flex items-center justify-center px-8 py-4 bg-white hover:bg-purple-50 text-purple-900 rounded-full font-bold text-lg transition-colors shadow-lg shadow-black/20"
            >
              Get Started Now
            </Link>
          </div>
        </div>
        
        <div className="border-t border-purple-800/50 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-purple-400">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <ShieldCheck className="w-5 h-5 text-purple-500" />
            <span className="font-semibold text-white">Mascons Ecosystem</span>
          </div>
          <p>&copy; 2026 Mascons. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="group p-8 rounded-3xl bg-white border border-purple-100 hover:border-purple-300 shadow-sm hover:shadow-xl hover:shadow-purple-200/50 transition-all duration-300 hover:-translate-y-1">
      <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-100 transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-purple-950 mb-3">{title}</h3>
      <p className="text-purple-800/70 leading-relaxed">{description}</p>
    </div>
  );
}

function Step({ number, icon, title, description }: { number: string, icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="flex items-start gap-6 relative">
      {/* Connector Line (hidden on last item via CSS if mapped, but here we just leave it for simplicity or use a subtle border) */}
      <div className="flex-shrink-0 flex flex-col items-center">
        <div className="w-14 h-14 rounded-full bg-white border-2 border-purple-200 flex items-center justify-center shadow-sm text-purple-900 font-bold font-mono">
          {number}
        </div>
        <div className="w-0.5 h-full bg-purple-200 mt-2 absolute top-14 bottom-[-3rem] -z-10 last:hidden" />
      </div>
      <div className="pt-3 pb-8">
        <div className="flex items-center space-x-3 mb-2">
          {icon}
          <h3 className="text-2xl font-bold text-purple-950">{title}</h3>
        </div>
        <p className="text-purple-800/80 text-lg leading-relaxed max-w-2xl">
          {description}
        </p>
      </div>
    </div>
  );
}
