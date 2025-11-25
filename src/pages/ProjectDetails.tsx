import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { 
  Download, 
  ExternalLink, 
  Check, 
  Code2, 
  Layers, 
  Sparkles,
  Shield,
  Zap,
  Loader2
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useRazorpay } from "@/hooks/useRazorpay";
import { useToast } from "@/hooks/use-toast";

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { initiatePayment, loading: paymentLoading } = useRazorpay();
  const { toast } = useToast();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hasPurchased, setHasPurchased] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setProject(data);

        // Check if user has purchased this project
        if (user) {
          const { data: transaction } = await supabase
            .from('transactions')
            .select('*')
            .eq('user_id', user.id)
            .eq('project_id', id)
            .eq('payment_status', 'completed')
            .single();

          setHasPurchased(!!transaction);
        }
      } catch (error) {
        console.error('Error fetching project:', error);
        toast({
          title: "Error",
          description: "Failed to load project details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProject();
  }, [id, user]);

  const handlePurchase = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to purchase this project",
      });
      navigate('/auth');
      return;
    }

    if (hasPurchased) {
      toast({
        title: "Already Purchased",
        description: "You have already purchased this project",
      });
      return;
    }

    initiatePayment({
      projectId: project.id,
      projectName: project.name,
      amount: project.price,
      onSuccess: () => {
        setHasPurchased(true);
        toast({
          title: "Success!",
          description: "Project purchased successfully. Check your email for download link.",
        });
      },
    });
  };

  const handleDownload = () => {
    if (project.is_free || hasPurchased) {
      if (project.zip_url) {
        window.open(project.zip_url, '_blank');
      } else {
        toast({
          title: "Download link not available",
          description: "Please contact support",
          variant: "destructive",
        });
      }
    } else {
      handlePurchase();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Project Not Found</h2>
          <Button onClick={() => navigate('/projects')}>Back to Projects</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        {/* Hero Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-16 animate-fade-in">
          <div>
            <div className="flex items-center gap-3 mb-4">
              {project.is_free ? (
                <Badge className="bg-accent text-accent-foreground text-lg px-4 py-1">Free</Badge>
              ) : (
                <Badge className="bg-primary text-primary-foreground text-lg px-4 py-1">
                  ₹{project.price}
                </Badge>
              )}
              <Badge variant="secondary">Production Ready</Badge>
              {hasPurchased && (
                <Badge className="bg-green-500/20 text-green-500">Purchased</Badge>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {project.name}
            </h1>
            
            <p className="text-muted-foreground text-lg mb-6">
              {project.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-8">
              {project.technologies?.map((tech: string, idx: number) => (
                <Badge key={idx} variant="outline" className="text-sm">
                  {tech}
                </Badge>
              ))}
            </div>

            <div className="flex gap-3">
              <Button 
                size="lg" 
                className="glow-primary flex-1"
                onClick={handleDownload}
                disabled={paymentLoading}
              >
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

          <div className="glass rounded-2xl overflow-hidden border border-border/50">
            <img 
              src={project.screenshot_url} 
              alt={project.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Gallery */}
        {project.gallery_urls && project.gallery_urls.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-16">
            {project.gallery_urls.map((img: string, idx: number) => (
              <div key={idx} className="glass rounded-xl overflow-hidden border border-border/50 aspect-video">
                <img src={img} alt={`Screenshot ${idx + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        )}

        {/* Two Column Layout */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-8">
            {/* About */}
            <Card className="glass border-border/50 p-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Layers className="h-6 w-6 text-primary" />
                About This Project
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {project.long_description}
              </p>
            </Card>

            {/* Features */}
            <Card className="glass border-border/50 p-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-accent" />
                Key Features
              </h2>
              <ul className="grid md:grid-cols-2 gap-3">
                {project.features?.map((feature: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Learning Outcomes */}
            <Card className="glass border-border/50 p-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Zap className="h-6 w-6 text-secondary" />
                What You'll Learn
              </h2>
              <ul className="space-y-3">
                {project.learning_outcomes?.map((outcome: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                    <span>{outcome}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Setup Guide */}
            <Card className="glass border-border/50 p-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Code2 className="h-6 w-6 text-primary" />
                How to Run
              </h2>
              
              <div className="space-y-4">
                {project.dependencies && project.dependencies.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Prerequisites:</h3>
                    <ul className="space-y-1">
                      {project.dependencies.map((dep: string, idx: number) => (
                        <li key={idx} className="text-muted-foreground">• {dep}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {project.setup_steps && project.setup_steps.length > 0 && (
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
            <Card className="glass border-border/50 p-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Shield className="h-5 w-5 text-accent" />
                Best For
              </h3>
              <p className="text-muted-foreground">{project.best_for}</p>
            </Card>

            {/* CTA Card */}
            <Card className="glass border-primary/30 p-6 glow-primary">
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
                {hasPurchased ? "Download Now" : project.is_free ? "Download Free" : `Buy for ₹${project.price}`}
              </Button>
            </Card>

            {/* Support */}
            <Card className="glass border-border/50 p-6">
              <h3 className="font-semibold mb-3">What's Included</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  Complete source code
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  Documentation
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  Setup instructions
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
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
