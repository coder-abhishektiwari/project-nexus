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
import { Download, ExternalLink, Check, Code2, Layers, Sparkles, Shield, Zap, Loader2 } from "lucide-react";

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">
            Project Not Found
          </h2>
          <Button onClick={() => navigate('/projects')}>
            Back to Projects
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="w-full px-6 md:px-20 pt-24 pb-16">
        {/* Hero Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-16 animate-fade-in">
          <div>
            <div className="flex items-center gap-3 mb-4">
              {project.is_free ? (
                <Badge className="bg-accent text-accent-foreground text-lg px-4 py-1">
                  Free
                </Badge>) : (
                <Badge className="bg-primary text-primary-foreground text-lg px-4 py-1">
                  ₹{project.price}
                </Badge>)}
              <Badge variant="secondary">
                Production Ready
              </Badge>
              {hasPurchased && (
                <Badge className="bg-accent/20 text-accent">
                  Purchased
                </Badge>
              )}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {project.name}
            </h1>
            <p className="text-muted-foreground text-lg mb-6">
              {project.description}
            </p>
            <div className="flex flex-wrap gap-2 mb-8">
              {project.technologies?.map((
                tech: string, idx: number) => (
                <Badge key={idx} variant="outline" className="text-sm">
                  {tech}
                </Badge>
              ))}
            </div>
            <div className="flex gap-3">
              <Button size="lg" className="flex-1 shadow-medium" onClick={handleDownload} disabled={paymentLoading} >
                {paymentLoading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <Download className="mr-2 h-5 w-5" />
                )}
                {hasPurchased ? "Download" : project.is_free ? "Download Now" : "Buy Now"}
              </Button>
              {project.sandbox_url && (
                <Button size="lg" variant="outline" className="glass" asChild>
                  <a href={project.sandbox_url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-5 w-5" />
                    Live Demo
                  </a>
                </Button>
              )}
            </div>
          </div>

          <div className="glass rounded-2xl overflow-hidden border border-border shadow-medium">
            <img src={project.screenshot_url} className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Gallery Slider */}
        {project.gallery_urls?.length > 0 && (
          <div className="mb-16">
            <Swiper
              modules={[Navigation]}
              navigation
              slidesPerView={2.2}       // 2 full + 3rd ka 20% (adjust below)
              spaceBetween={20}
              centeredSlides={false}
              slidesOffsetAfter={60}     // 10% approx visible
              slidesOffsetBefore={0}
              className="rounded-xl"
            >
              {project.gallery_urls.map((img: string, idx: number) => (
                <SwiperSlide key={idx}>
                  <div className="glass rounded-xl overflow-hidden border border-border/50 aspect-video">
                    <img
                      src={img}
                      className="w-full h-full object-cover"
                      alt={`Screenshot ${idx + 1}`}
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}



        {/* Two Column Layout */}
        <div className="grid md:grid-cols-3 gap-8">

          {/* Main Content */}
          <div className="md:col-span-2 space-y-8">

            {/* About */}
            <Card className="glass border-border p-6 shadow-subtle">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Layers className="h-6 w-6" />
                About This Project
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {project.long_description}
              </p>
            </Card>

            {/* Features */}
            <Card className="glass border-border p-6 shadow-subtle">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Sparkles className="h-6 w-6" />
                Key Features
              </h2>

              <ul className="grid md:grid-cols-2 gap-3">
                {project.features?.map((feature: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Learning Outcomes */}
            <Card className="glass border-border p-6 shadow-subtle">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Zap className="h-6 w-6" />
                What You'll Learn
              </h2>

              <ul className="space-y-3">
                {project.learning_outcomes?.map((outcome: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <span>{outcome}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Setup Guide */}
            <Card className="glass border-border p-6 shadow-subtle">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Code2 className="h-6 w-6" />
                How to Run
              </h2>

              <div className="space-y-4">

                {/* Dependencies */}
                {project.dependencies?.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Prerequisites:</h3>
                    <ul className="space-y-1">
                      {project.dependencies.map((dep: string, idx: number) => (
                        <li key={idx} className="text-muted-foreground">
                          • {dep}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Setup Steps */}
                {project.setup_steps?.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Setup Steps:</h3>
                    <ol className="space-y-2">
                      {project.setup_steps.map((step: string, idx: number) => (
                        <li key={idx} className="flex gap-3">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-semibold">
                            {idx + 1}
                          </span>
                          <span className="text-muted-foreground">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

              </div>
            </Card>

          </div>

          {/* Sidebar */}
          <div className="space-y-6">

            {/* Best For */}
            <Card className="glass border-border p-6 shadow-subtle">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Best For
              </h3>
              <p className="text-muted-foreground">{project.best_for}</p>
            </Card>

            {/* CTA Card */}
            <Card className="glass border-primary p-6 shadow-medium">
              <h3 className="font-bold text-xl mb-2">Ready to Start?</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Get instant access to the complete source code and documentation.
              </p>

              <Button
                className="w-full"
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
                    ? "Download Free"
                    : `Buy for ₹${project.price}`}
              </Button>
            </Card>

            {/* Support */}
            <Card className="glass border-border p-6 shadow-subtle">
              <h3 className="font-semibold mb-3">What's Included</h3>

              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  Complete source code
                </li>

                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  Documentation
                </li>

                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  Setup instructions
                </li>

                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  Lifetime access
                </li>
              </ul>
            </Card>

          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
};

export default ProjectDetails;
