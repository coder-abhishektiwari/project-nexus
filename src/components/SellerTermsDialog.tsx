import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Zap, ShieldCheck, Rocket, 
  IndianRupee, Terminal, Lock, 
  CheckCircle2, TrendingUp, Users 
} from "lucide-react";

const SellerTermsDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="lg"
          className="group h-16 px-10 text-lg font-bold rounded-2xl border-2 border-indigo-100 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all duration-500 shadow-xl shadow-indigo-100/20"
        >
          Start Selling Your Projects 🚀
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-4xl overflow-y-auto max-h-[90vh] rounded-[2.5rem] p-0 border-none shadow-[0_0_50px_-12px_rgba(79,70,229,0.25)]">
        {/* TOP BANNER: THE HOOK */}
        <div className="bg-[#0F172A] p-10 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-10">
            <Terminal size={200} />
          </div>
          
          <DialogHeader className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-indigo-500 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Verified Creator Program</span>
            </div>
            <DialogTitle className="text-4xl md:text-5xl font-[1000] tracking-tighter leading-none mb-4">
              Stop Coding for Free. <br />
              <span className="text-indigo-400">Build Your Empire.</span>
            </DialogTitle>
            <p className="text-slate-400 max-w-xl text-lg font-medium leading-tight">
              Project Nexus turns your college assignments and side-projects into a 24/7 passive income stream. Join 180+ developers today.
            </p>
          </DialogHeader>
        </div>

        {/* BODY: THE VALUE PROPOSITION */}
        <div className="p-10 space-y-12 bg-white">

          {/* QUICK STATS BAR */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Partner Share", val: "80%", icon: <IndianRupee className="h-4 w-4 text-emerald-500" /> },
              { label: "Approval Time", val: "24h", icon: <Zap className="h-4 w-4 text-orange-500" /> },
              { label: "Active Buyers", val: "85k+", icon: <Users className="h-4 w-4 text-indigo-500" /> },
              { label: "Active Sellers", val: "200+", icon: <ShieldCheck className="h-4 w-4 text-blue-500" /> },
            ].map((stat, i) => (
              <div key={i} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                <div className="flex justify-center mb-1">{stat.icon}</div>
                <div className="text-xl font-black text-slate-900">{stat.val}</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* THE 3-STEP FAST TRACK */}
          <div className="space-y-6">
            <h3 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
              <Rocket className="text-indigo-600" /> Your Path to First Sale
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-3 p-6 rounded-3xl bg-indigo-50/50 border border-indigo-100">
                <div className="h-10 w-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-black">01</div>
                <h4 className="font-bold text-slate-900">Apply & Review</h4>
                <p className="text-xs text-slate-500 leading-relaxed">Fill the form and submit 1 sample project. We review code quality, folder structure, and UI standards.</p>
              </div>

              <div className="space-y-3 p-6 rounded-3xl bg-emerald-50/50 border border-emerald-100">
                <div className="h-10 w-10 bg-emerald-600 text-white rounded-xl flex items-center justify-center font-black">02</div>
                <h4 className="font-bold text-slate-900">List Your Assets</h4>
                <p className="text-xs text-slate-500 leading-relaxed">Once approved, upload your projects. We handle the SEO, Marketing, and global hosting for you.</p>
              </div>

              <div className="space-y-3 p-6 rounded-3xl bg-orange-50/50 border border-orange-100">
                <div className="h-10 w-10 bg-orange-600 text-white rounded-xl flex items-center justify-center font-black">03</div>
                <h4 className="font-bold text-slate-900">Earn On Autopilot</h4>
                <p className="text-xs text-slate-500 leading-relaxed">Collect 80% of every sale. Request payouts directly to your UPI or Bank Account every month.</p>
              </div>
            </div>
          </div>

          {/* THE "WHY JOIN" CHECKLIST */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
            <div className="space-y-6">
              <h3 className="text-xl font-black text-slate-900">Why Developers Love Us</h3>
              <ul className="space-y-4">
                {[
                  "Total Intellectual Property Protection",
                  "Advanced Code Obfuscation (Anti-Leak)",
                  "Automatic Documentation Generation",
                  "Dedicated Admin Support for Code Debugging",
                  "Global Reach (Sell across 12+ Countries)"
                ].map((text, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-semibold text-slate-600">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" /> {text}
                  </li>
                ))}
              </ul>
            </div>

            {/* REVENUE MODEL CARD */}
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600 blur-[80px] opacity-30 group-hover:opacity-50 transition-opacity" />
              <div className="relative z-10 space-y-4">
                <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Highest Revenue Share</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-6xl font-[1000]">80%</span>
                  <span className="text-lg text-slate-400">Commission</span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed italic">
                  "Most platforms take 40-50%. We take only 20% to cover servers and ads. The rest is yours."
                </p>
                <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Instant Approvals</div>
                  <TrendingUp className="h-5 w-5 text-emerald-400" />
                </div>
              </div>
            </div>
          </div>

          {/* COMPLIANCE WARNING */}
          <div className="p-6 bg-rose-50 rounded-3xl border border-rose-100 flex gap-4 items-center">
            <div className="h-12 w-12 bg-rose-100 rounded-2xl flex items-center justify-center text-rose-600 shrink-0 text-xl">⚠️</div>
            <div>
              <p className="font-black text-rose-900 text-sm">Strict Quality Policy</p>
              <p className="text-xs text-rose-700 leading-tight">We have zero tolerance for plagiarized code. Every project is checked for uniqueness. Fake projects = Permanent Ban.</p>
            </div>
          </div>

          {/* FINAL CTA */}
          <div className="space-y-4">
            <Button
              className="w-full h-20 bg-indigo-600 hover:bg-indigo-700 text-white text-2xl font-black rounded-3xl shadow-[0_20px_40px_-15px_rgba(79,70,229,0.4)] transition-all hover:-translate-y-1 active:scale-95"
              onClick={() => (window.location.href = "/become-seller")}
            >
              Secure My Seller Spot Now →
            </Button>
            <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest">Approval takes less than 24 hours</p>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SellerTermsDialog;