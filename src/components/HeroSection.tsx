import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Code2, Sparkles, Zap } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Animated gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
      
      <div className="container mx-auto px-4 z-10">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/20 mb-8">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm">Premium Academic Projects</span>
          </div>

          {/* Heading */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Build Your Future with
            <span className="block gradient-text">World-Class Projects</span>
          </h1>

          {/* Description */}
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Get production-ready projects perfect for BTech, BCA, and Diploma students. 
            Learn from real-world code, deploy with confidence.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link to="/projects">
              <Button size="lg" className="glow-primary text-lg px-8 py-6 group">
                Browse Projects
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/request">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 glass border-primary/30">
                Request Custom Project
              </Button>
            </Link>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap gap-4 justify-center">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full glass">
              <Code2 className="h-4 w-4 text-accent" />
              <span className="text-sm">Production Ready</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full glass">
              <Zap className="h-4 w-4 text-secondary" />
              <span className="text-sm">Easy Setup</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full glass">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm">Live Demos</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
