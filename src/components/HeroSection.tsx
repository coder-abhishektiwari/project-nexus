import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Code, Zap, ShieldCheck, Star, Users, CheckCircle2 } from "lucide-react";

const HeroSection = () => {
  return (
    <div className="relative min-h-screen bg-[#fafafa] overflow-hidden">
      
      {/* --- PREMIUM BACKGROUND ELEMENTS --- */}
      <div className="absolute inset-0 z-0">
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        
        {/* Animated Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-200/40 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[10%] right-[-10%] w-[30%] h-[30%] bg-blue-200/30 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <section className="relative z-10 pt-32 pb-20 lg:pt-48 lg:pb-32">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto text-center">
            
            {/* --- TRUST BADGE --- */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm mb-8 animate-fade-in">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-6 w-6 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="user" />
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-1 ml-2">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                <span className="text-xs font-bold text-slate-700">4.9/5 by 2,000+ Students</span>
              </div>
            </div>

            {/* --- MAIN HEADLINE --- */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-[1.05] tracking-tight text-slate-900">
              Your Shortcut to <br />
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Project Excellence
              </span>
            </h1>

            {/* --- SUB-HEADLINE --- */}
            <p className="text-lg md:text-xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Why struggle with bugs when you can start with a <b>perfect foundation</b>? 
              Get industry-standard source code, documentation, and diagrams for your Final Year 
              Submission. 100% Guaranteed Approval.
            </p>

            {/* --- CTAs --- */}
            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center mb-20">
              <Button asChild size="lg" className="h-14 px-10 text-lg font-bold rounded-2xl bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all hover:-translate-y-1 group">
                <Link to="/projects" className="flex items-center">
                  Browse Store
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              
              <Button asChild size="lg" variant="outline" className="h-14 px-10 text-lg font-bold rounded-2xl bg-white/50 backdrop-blur-sm border-slate-200 hover:bg-white hover:border-indigo-300 transition-all hover:-translate-y-1">
                <Link to="/request">
                  Request Custom Build
                </Link>
              </Button>
            </div>

            {/* --- FEATURE HIGHLIGHTS --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left max-w-4xl mx-auto border-t border-slate-200 pt-16">
              <div className="flex gap-4">
                <div className="h-12 w-12 shrink-0 rounded-2xl bg-indigo-50 flex items-center justify-center">
                  <Code className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 uppercase text-xs tracking-widest mb-1">Clean Code</h3>
                  <p className="text-sm text-slate-500 leading-snug">Fully commented & modular source code ready for viva.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="h-12 w-12 shrink-0 rounded-2xl bg-emerald-50 flex items-center justify-center">
                  <ShieldCheck className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 uppercase text-xs tracking-widest mb-1">Full Support</h3>
                  <p className="text-sm text-slate-500 leading-snug">Includes Synposis, Diagrams, and PPT for submission.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="h-12 w-12 shrink-0 rounded-2xl bg-amber-50 flex items-center justify-center">
                  <Zap className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 uppercase text-xs tracking-widest mb-1">Instant Delivery</h3>
                  <p className="text-sm text-slate-500 leading-snug">Buy once, get instant access to files and future updates.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FLOATING SUCCESS TOAST (Marketing Trick) --- */}
      <div className="hidden lg:flex absolute bottom-10 left-10 animate-bounce-slow items-center gap-3 bg-white p-4 rounded-2xl shadow-2xl border border-slate-100 z-20">
        <div className="h-10 w-10 bg-emerald-500 rounded-full flex items-center justify-center">
          <CheckCircle2 className="h-6 w-6 text-white" />
        </div>
        <div>
          <p className="text-xs font-bold text-slate-900">Aryan just bought</p>
          <p className="text-[10px] text-slate-500">AI Health Assistant Project</p>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;