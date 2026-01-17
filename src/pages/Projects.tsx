import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProjectCard from "@/components/ProjectCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { Search, Sparkles, ShieldCheck, Zap, Laptop, Filter, XCircle, Loader2, Trophy } from "lucide-react";

const CATEGORIES = [
  { label: "All Masterpieces", value: "all" },
  { label: "Free Resources", value: "free" },
  { label: "Premium Projects", value: "pro" },
];

const PRICE_RANGES = [
  { label: "Under ₹500", min: 0, max: 500 },
  { label: "₹500 - ₹1000", min: 501, max: 1000 },
  { label: "Premium (₹1000+)", min: 1001, max: 5000 },
];

const Projects = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      setLoading(true);
      const { data } = await supabase.from("projects").select("*");
      setProjects(data || []);
      setLoading(false);
    };
    loadProjects();
  }, []);

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat = selectedCategory === "all" ? true :
        selectedCategory === "free" ? p.price === 0 : p.price > 0;
      const matchesPrice = !selectedPrice ? true : (p.price >= selectedPrice.min && p.price <= selectedPrice.max);
      return matchesSearch && matchesCat && matchesPrice;
    });
  }, [projects, searchQuery, selectedCategory, selectedPrice]);

  return (
    <div className="min-h-screen bg-[#FAFAFB]">
      <Navbar />

      <main className="pt-28 pb-24">
        {/* --- PERSUASIVE HERO SECTION --- */}
        <section className="max-w-7xl mx-auto px-6 lg:px-20 mb-16 text-center md:text-left">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="space-y-6 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="h-3.5 w-3.5" /> Trusted by 5000+ Students
              </div>
              <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-[1.1] tracking-tight">
                Stop Coding from <span className="text-indigo-600">Scratch.</span> Build Faster.
              </h1>
              <p className="text-slate-600 text-lg md:text-xl max-w-xl leading-relaxed">
                Skip the boilerplate and focus on learning. Get production-ready, fully documented source code for your final year projects and assignments.
              </p>

              <div className="flex flex-wrap gap-6 pt-4">
                <div className="flex items-center gap-2">
                  <div className="bg-emerald-100 p-1.5 rounded-full"><ShieldCheck className="h-4 w-4 text-emerald-600" /></div>
                  <span className="text-sm font-medium text-slate-700">Verified Code</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-blue-100 p-1.5 rounded-full"><Zap className="h-4 w-4 text-blue-600" /></div>
                  <span className="text-sm font-medium text-slate-700">Instant Download</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-amber-100 p-1.5 rounded-full"><Trophy className="h-4 w-4 text-amber-600" /></div>
                  <span className="text-sm font-medium text-slate-700">A+ Grade Quality</span>
                </div>
              </div>
            </div>

            {/* Floating Stats or Image Placeholder */}
            <div className="hidden md:flex flex-col gap-4">
              <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100 self-end w-64 -rotate-3 hover:rotate-0 transition-transform cursor-default">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Success Rate</p>
                <h4 className="text-3xl font-black text-slate-900">99.2%</h4>
                <p className="text-slate-500 text-sm">Project Submissions Accepted</p>
              </div>
              <div className="bg-indigo-600 p-6 rounded-2xl shadow-xl self-center w-64 rotate-3 hover:rotate-0 transition-transform cursor-default">
                <p className="text-indigo-200 text-xs font-bold uppercase tracking-widest mb-1">Active Users</p>
                <h4 className="text-3xl font-black text-white">12k+</h4>
                <p className="text-indigo-100 text-sm">Students building today</p>
              </div>
            </div>
          </div>
        </section>

        {/* --- FILTER & SEARCH BAR (The Tool) --- */}
        <section className="max-w-7xl mx-auto px-6 lg:px-20 mb-12">
          <div className="sticky top-24 z-30 bg-white/80 backdrop-blur-xl p-5 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Search */}
              <div className="relative flex-grow">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  placeholder="What do you want to build today? (e.g. AI Chatbot, E-commerce...)"
                  className="pl-12 h-14 bg-slate-50/50 border-slate-200 focus:ring-2 focus:ring-indigo-500 rounded-2xl text-base"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Tabs */}
              <div className="flex bg-slate-100 p-1.5 rounded-2xl">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setSelectedCategory(cat.value)}
                    className={`px-8 py-3 text-sm font-bold rounded-xl transition-all ${selectedCategory === cat.value
                        ? "bg-white text-indigo-600 shadow-md"
                        : "text-slate-500 hover:text-slate-800"
                      }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Badges */}
            <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-slate-100">
              <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-widest mr-2">
                <Filter className="h-3 w-3" /> Quick Price Filter:
              </span>
              {PRICE_RANGES.map((range) => (
                <button
                  key={range.label}
                  onClick={() => setSelectedPrice(selectedPrice?.label === range.label ? null : range)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${selectedPrice?.label === range.label
                      ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 shadow-sm"
                    }`}
                >
                  {range.label}
                </button>
              ))}
              {(selectedPrice || searchQuery !== "" || selectedCategory !== "all") && (
                <Button
                  variant="ghost"
                  className="text-xs font-bold text-red-500 hover:bg-red-50 rounded-xl"
                  onClick={() => { setSelectedPrice(null); setSearchQuery(""); setSelectedCategory("all"); }}
                >
                  <XCircle className="h-4 w-4 mr-1.5" /> Reset Filters
                </Button>
              )}
            </div>
          </div>
        </section>

        {/* --- PROJECTS GRID --- */}
        <section className="max-w-7xl mx-auto px-6 lg:px-20">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-40 gap-4">
              <div className="h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="font-bold text-slate-400 animate-pulse tracking-widest uppercase text-xs">Curating Best Projects...</p>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-40 bg-white rounded-[40px] border border-dashed border-slate-200 shadow-inner">
              <div className="bg-indigo-50 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Laptop className="h-10 w-10 text-indigo-300" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">No Matching Projects</h3>
              <p className="text-slate-500">We couldn't find what you're looking for. Try a different keyword!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {filteredProjects.map((project, index) => (
                <div
                  key={project.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.08}s` }}
                >
                  <ProjectCard project={project} />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* --- TRUST BANNER --- */}
        <section className="mt-32 max-w-7xl mx-auto px-6 lg:px-20">
          <div className="bg-indigo-900 rounded-[3rem] p-12 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <div className="absolute top-10 left-10 w-40 h-40 border-4 border-white rounded-full"></div>
              <div className="absolute bottom-10 right-10 w-60 h-60 border-4 border-white rounded-full"></div>
            </div>
            <h2 className="text-3xl md:text-4xl font-black mb-4 relative z-10">Don't See What You Need?</h2>
            <p className="text-indigo-200 text-lg mb-8 max-w-2xl mx-auto relative z-10">
              We take custom project requests! Our developers can build your dream project in less than 7 days.
            </p>
                <Link to="/request">
              <Button size="lg" className="bg-white text-indigo-900 hover:bg-indigo-50 font-bold px-10 h-14 text-lg rounded-2xl relative z-10">
                Request Custom Project
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Projects;