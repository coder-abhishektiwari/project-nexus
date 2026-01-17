import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import ProjectCard from "@/components/ProjectCard";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Handshake, Code2, DollarSign, GraduationCap, Lightbulb,
  TrendingUp, Zap, Rocket, ShieldCheck, Wallet, Sparkles,
  ArrowRight, CheckCircle2, ChevronRight, MessageSquare,
  Globe, Layout, Smartphone, Database, Cpu
} from "lucide-react";
import SellerTermsDialog from "@/components/SellerTermsDialog";


const Index = () => {
  const { data: featuredProjects = [], isLoading } = useQuery({
    queryKey: ["featured-projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("downloads_count", { ascending: false })
        .limit(3);
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="min-h-screen bg-[#FAFAFB] text-slate-900 font-inter overflow-x-hidden">
      <Navbar />
      <HeroSection />

      {/* --- SECTION 1: TRUST LOGOS (Social Proof) --- */}
      <div className="bg-white py-10 border-y border-slate-100">
        <div className="container mx-auto px-6">
          <p className="text-center text-slate-400 text-xs font-bold uppercase tracking-[0.2em] mb-8">Trusted by Students From</p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all">
            {['IIT Delhi', 'VIT Vellore', 'SRM University', 'Amity', 'LPU'].map((uni) => (
              <span key={uni} className="text-xl md:text-2xl font-black text-slate-400">{uni}</span>
            ))}
          </div>
        </div>
      </div>

      {/* --- SECTION 2: CATEGORIES (Quick Navigation) --- */}
      <section className="py-24 container mx-auto px-6">
        <h2 className="text-2xl font-black text-center mb-12">Search Projects by <span className="text-indigo-600">Technology</span></h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[
            { n: "Web App", i: <Globe /> },
            { n: "Mobile App", i: <Smartphone /> },
            { n: "Machine Learning", i: <Cpu /> },
            { n: "Blockchain", i: <Database /> },
            { n: "Frontend", i: <Layout /> },
            { n: "Admin Panel", i: <CheckCircle2 /> },
          ].map(cat => (
            <Link key={cat.n} to="/projects" className="p-6 bg-white border border-slate-200 rounded-3xl text-center hover:border-indigo-600 hover:shadow-lg transition-all group">
              <div className="h-12 w-12 mx-auto mb-4 text-slate-400 group-hover:text-indigo-600 transition-colors">{cat.i}</div>
              <p className="text-sm font-bold text-slate-700">{cat.n}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* --- SECTION 3: TRENDING PROJECTS --- */}
      <section className="container mx-auto px-6 py-20 lg:py-32">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl text-center md:text-left">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900">
              Most Downloaded <span className="text-indigo-600 underline decoration-indigo-100 underline-offset-8">Projects</span>
            </h2>
          </div>
          <Button asChild variant="outline" className="rounded-full border-indigo-200 text-indigo-600 bg-indigo-20 hover:bg-indigo-50">
            <Link to="/projects">View All Library <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? [1, 2, 3].map(i => <div key={i} className="h-80 bg-slate-100 animate-pulse rounded-3xl" />) :
            featuredProjects.map((p) => <ProjectCard key={p.id} project={p} />)}
        </div>
      </section>

      {/* --- SECTION 4: HOW IT WORKS (Mobile Friendly Steps) --- */}
      <section className="bg-white py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black">Get Your Project in <span className="text-indigo-600">3 Steps</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Desktop Connector Line */}
            <div className="hidden md:block absolute top-12 left-1/4 right-1/4 h-0.5 border-t-2 border-dashed border-slate-200 z-0" />

            {[
              { step: "01", title: "Select Project", desc: "Choose from 500+ verified academic projects." },
              { step: "02", title: "Instant Payment", desc: "Secure UPI checkout with automated delivery." },
              { step: "03", title: "Download & Deploy", desc: "Get Source code, Docs & PPT in your dashboard." },
            ].map((item, i) => (
              <div key={i} className="relative z-10 text-center flex flex-col items-center group">
                <div className="h-20 w-20 rounded-full bg-indigo-600 text-white flex items-center justify-center text-2xl font-black mb-6 shadow-xl shadow-indigo-100 group-hover:scale-110 transition-transform">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-slate-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- SECTION 5: THE VALUE PROP (Dark Mode Focus) --- */}
      <section className="bg-slate-900 py-24 text-white overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">Everything You Need for <span className="text-indigo-400">Submission.</span></h2>
              <div className="space-y-6">
                {[
                  "Industry Standard Documentation",
                  "Full Database Schema & ER Diagrams",
                  "Professional PPT Templates",
                  "1-on-1 Setup Support (Premium Only)",
                  "Free Future Updates"
                ].map(text => (
                  <div key={text} className="flex items-center gap-3">
                    <div className="h-6 w-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    </div>
                    <span className="text-lg text-slate-300 font-medium">{text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="bg-indigo-600/20 absolute inset-0 blur-[100px] rounded-full" />
              <div className="relative bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
                <div className="flex gap-2 mb-6 text-indigo-400"><Sparkles className="h-5 w-5" /><Sparkles className="h-5 w-5" /><Sparkles className="h-5 w-5" /></div>
                <p className="text-2xl font-medium italic text-slate-200 leading-relaxed mb-6">
                  "Nexus projects are not just code, they are complete educational packages. I presented my project and the professors were shocked by the quality!"
                </p>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-slate-700" />
                  <div>
                    <p className="font-bold">Rahul Verma</p>
                    <p className="text-sm text-slate-500">Final Year BCA Student</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECTION 6: DEVELOPER ECOSYSTEM (SELL & EARN) --- */}
      <section className="py-24 bg-white border-y border-slate-100 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">

            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-600 text-sm font-bold border border-indigo-100">
                <Globe className="h-4 w-4" /> Global Marketplace for Developers
              </div>

              <h2 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight tracking-tighter">
                Monetize Your Code. <br />
                <span className="text-indigo-600 text-[35pt]">Earn Passive Income.</span>
              </h2>

              <p className="text-slate-600 text-xl leading-relaxed max-w-xl">
                Turn your high-quality projects into a recurring revenue stream. Project Nexus provides the platform where you can sell your projects and earn a great passive income.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-6 rounded-3xl border border-slate-100 bg-slate-50/50">
                  <div className="h-10 w-10 bg-white rounded-xl shadow-sm flex items-center justify-center mb-4">
                    <TrendingUp className="h-5 w-5 text-indigo-600" />
                  </div>
                  <h4 className="font-bold text-slate-900">80% Revenue Share</h4>
                  <p className="text-sm text-slate-500 mt-1">Industry-leading payout structure with zero hidden maintenance fees.</p>
                </div>

                <div className="p-6 rounded-3xl border border-slate-100 bg-slate-50/50">
                  <div className="h-10 w-10 bg-white rounded-xl shadow-sm flex items-center justify-center mb-4">
                    <ShieldCheck className="h-5 w-5 text-emerald-600" />
                  </div>
                  <h4 className="font-bold text-slate-900">Verified Security</h4>
                  <p className="text-sm text-slate-500 mt-1">Advanced IP protection ensuring your source code is never compromised.</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button asChild size="lg" className="h-16 px-10 text-lg font-bold rounded-2xl bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-100">
                  <Link to="/others-revneue"> Other's Revenue</Link>
                </Button>

                <SellerTermsDialog />
              </div>
            </div>

            {/* Right Side: Professional Analytics Preview */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 blur-[100px] rounded-full" />
              <div className="relative bg-slate-950 rounded-[2.5rem] p-10 shadow-2xl border border-slate-800">
                <div className="flex justify-between items-center mb-10">
                  <div>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Global Sales Volume</p>
                    <h3 className="text-4xl font-black text-white mt-1">$4,850.00</h3>
                  </div>
                  <div className="h-14 w-14 bg-indigo-500/20 rounded-2xl flex items-center justify-center border border-indigo-500/30">
                    <Wallet className="h-6 w-6 text-indigo-400" />
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Real-time Activity</p>
                  {[
                    { p: "E-Commerce Microservices", c: "USA", a: "+$89.00" },
                    { p: "AI Portfolio Template", c: "Germany", a: "+$45.00" },
                    { p: "Banking Smart Contract", c: "India", a: "+$120.00" }
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                      <div>
                        <p className="text-sm font-bold text-slate-200">{item.p}</p>
                        <p className="text-[10px] text-slate-500 font-medium tracking-wide italic">Purchased from {item.c}</p>
                      </div>
                      <span className="text-emerald-400 font-mono font-bold">{item.a}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* --- SECTION 7: FINAL CTA (Large Banner) --- */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="bg-indigo-600 rounded-[3rem] p-12 md:p-24 text-center text-white relative overflow-hidden">
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight italic">Ready to make your move?</h2>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-white text-indigo-600 hover:bg-slate-50 font-black h-16 px-10 rounded-2xl text-xl">
                  <Link to="/projects">Start Exploring</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-white/40 text-white hover:bg-white/10 font-black h-16 px-10 rounded-2xl text-xl">
                  <Link to="/request">Get Custom Help</Link>
                </Button>
              </div>
            </div>
            {/* Background Decorative Rings */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/10 rounded-full" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/10 rounded-full" />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;

