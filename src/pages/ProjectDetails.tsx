import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useProjectDownload } from "@/hooks/useProjectDownload";
import { Card } from "@/components/ui/card";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { Download, ExternalLink, Check, Code2, Layers, Sparkles, Shield, Zap, Loader2, ArrowLeft } from "lucide-react";

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .single();

      setProject(data);
      setLoading(false);
    };

    fetch();
  }, [id]);

  const {
    hasPurchased,
    handleDownload,
    paymentLoading
  } = useProjectDownload(project);

  if (loading || !project) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Project Not Found</h2>
            <p className="text-slate-500 mb-6">The project you're looking for might have been moved or deleted.</p>
            <Button className="w-full bg-indigo-600 hover:bg-indigo-700" onClick={() => navigate('/projects')}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFB]"> {/* Very light grey background for contrast with white cards */}
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 pt-32 pb-24">
        
        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20 animate-fade-in">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              {project.is_free ? (
                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50 px-3 py-1 text-sm font-medium">
                  Free Access
                </Badge>
              ) : (
                <Badge className="bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-50 px-3 py-1 text-sm font-medium">
                  ₹{project.price}
                </Badge>
              )}
              <Badge variant="outline" className="text-slate-500 border-slate-200 bg-white">
                Production Ready
              </Badge>
              {hasPurchased && (
                <Badge className="bg-blue-50 text-blue-700 border-blue-200">
                  Purchased
                </Badge>
              )}
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
              {project.name}
            </h1>
            
            <p className="text-slate-600 text-lg md:text-xl leading-relaxed max-w-xl">
              {project.description}
            </p>

            <div className="flex flex-wrap gap-2">
              {project.technologies?.map((tech: string, idx: number) => (
                <span key={idx} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200/50">
                  {tech}
                </span>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button size="lg" className="h-14 px-8 text-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-lg shadow-indigo-200" onClick={handleDownload} disabled={paymentLoading} >
                {paymentLoading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <Download className="mr-2 h-5 w-5" />
                )}
                {hasPurchased ? "Download Files" : project.is_free ? "Download Now" : "Unlock Project"}
              </Button>
              
              {project.sandbox_url && (
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-slate-200 hover:bg-slate-50 text-slate-700 shadow-sm" asChild>
                  <a href={project.sandbox_url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-5 w-5" />
                    Live Preview
                  </a>
                </Button>
              )}
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
            <Card className="relative overflow-hidden border-slate-200 shadow-2xl rounded-2xl">
              <img 
                src={project.screenshot_url} 
                className="w-full aspect-video object-cover hover:scale-105 transition-transform duration-700" 
                alt={project.name}
              />
            </Card>
          </div>
        </div>

        {/* Gallery Slider */}
        {project.gallery_urls?.length > 0 && (
          <div className="mb-20">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-6">Visual Overview</h3>
            <Swiper
              modules={[Navigation]}
              navigation
              slidesPerView={1.2}
              spaceBetween={24}
              breakpoints={{
                768: { slidesPerView: 2.2 },
                1024: { slidesPerView: 2.5 }
              }}
              className="rounded-2xl pb-4"
            >
              {project.gallery_urls.map((img: string, idx: number) => (
                <SwiperSlide key={idx}>
                  <Card className="overflow-hidden border-slate-200 shadow-md group">
                    <img
                      src={img}
                      className="w-full aspect-[16/10] object-cover group-hover:scale-105 transition-transform duration-500"
                      alt={`Screenshot ${idx + 1}`}
                    />
                  </Card>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-3 gap-10">

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">

            {/* About */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <div className="p-2 bg-indigo-50 rounded-lg">
                  <Layers className="h-5 w-5 text-indigo-600" />
                </div>
                Project Details
              </h2>
              <Card className="bg-white border-slate-200 p-8 shadow-sm">
                <p className="text-slate-600 leading-relaxed text-lg whitespace-pre-line">
                  {project.long_description}
                </p>
              </Card>
            </section>

            {/* Features */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <div className="p-2 bg-amber-50 rounded-lg">
                  <Sparkles className="h-5 w-5 text-amber-600" />
                </div>
                Key Features
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {project.features?.map((feature: string, idx: number) => (
                  <Card key={idx} className="p-5 border-slate-100 bg-white hover:border-indigo-100 transition-colors shadow-sm flex items-start gap-4">
                    <div className="mt-1 bg-indigo-50 rounded-full p-1">
                      <Check className="h-4 w-4 text-indigo-600" />
                    </div>
                    <span className="text-slate-700 font-medium leading-tight">{feature}</span>
                  </Card>
                ))}
              </div>
            </section>

            {/* Learning Outcomes */}
            <section>
              <Card className="bg-slate-900 text-white p-8 rounded-2xl border-0 shadow-xl overflow-hidden relative">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 opacity-10">
                  <Zap className="h-32 w-32" />
                </div>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 relative z-10">
                   What You'll Learn
                </h2>
                <ul className="grid sm:grid-cols-2 gap-y-4 gap-x-8 relative z-10">
                  {project.learning_outcomes?.map((outcome: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3 text-slate-300">
                      <Check className="h-5 w-5 text-indigo-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{outcome}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </section>

            {/* Setup Guide */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <div className="p-2 bg-slate-100 rounded-lg">
                  <Code2 className="h-5 w-5 text-slate-700" />
                </div>
                Developer Guide
              </h2>
              <Card className="bg-white border-slate-200 p-8 shadow-sm">
                <div className="space-y-8">
                  {project.dependencies?.length > 0 && (
                    <div>
                      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Prerequisites</h3>
                      <div className="flex flex-wrap gap-2">
                        {project.dependencies.map((dep: string, idx: number) => (
                          <span key={idx} className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded text-slate-600 text-sm font-mono">
                            {dep}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {project.setup_steps?.length > 0 && (
                    <div>
                      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Installation Steps</h3>
                      <div className="space-y-4">
                        {project.setup_steps.map((step: string, idx: number) => (
                          <div key={idx} className="flex gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                            <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-sm font-bold shadow-md shadow-indigo-100">
                              {idx + 1}
                            </span>
                            <p className="text-slate-600 pt-1 leading-relaxed">{step}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </section>

          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* CTA Card */}
            <Card className="bg-white border-indigo-100 p-8 shadow-xl shadow-indigo-50/50 sticky top-24 rounded-2xl ring-1 ring-indigo-50">
              <h3 className="font-bold text-2xl text-slate-900 mb-3">Get Started</h3>
              <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                Unlock full access to the source code, documentation, and asset files.
              </p>

              <Button
                className="w-full h-12 text-md font-semibold bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100 mb-6"
                size="lg"
                onClick={handleDownload}
                disabled={paymentLoading}
              >
                {paymentLoading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <Download className="mr-2 h-5 w-5" />
                )}

                {hasPurchased
                  ? "Download Now"
                  : project.is_free
                    ? "Get it Free"
                    : `Buy for ₹${project.price}`}
              </Button>

              <div className="space-y-4 pt-6 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">What's Included</h4>
                <ul className="space-y-3">
                  {[
                    "Complete source code",
                    "Asset files & Resources",
                    "Setup instructions",
                    "Lifetime access"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                      <div className="h-5 w-5 rounded-full bg-emerald-50 flex items-center justify-center">
                        <Check className="h-3 w-3 text-emerald-600" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Card>

            {/* Best For */}
            <Card className="bg-slate-50/50 border-slate-200 p-6 shadow-sm rounded-xl">
              <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Shield className="h-5 w-5 text-indigo-500" />
                Target Audience
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">{project.best_for}</p>
            </Card>

          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
};

export default ProjectDetails;