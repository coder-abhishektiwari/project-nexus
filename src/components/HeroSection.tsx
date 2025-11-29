import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles, Code2, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center px-4 overflow-hidden">
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      
      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.03),transparent_50%)]" />

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-8 shadow-subtle animate-fade-in">
          <Sparkles className="h-4 w-4" />
          <span className="text-sm font-medium">Professional Project Platform</span>
        </div>

        {/* Heading */}
        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight animate-fade-in" style={{ animationDelay: "0.1s" }}>
          Welcome to <br />
          <span className="gradient-text">Project Nexus</span>
        </h1>

        {/* Description */}
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          Premium collection of production-ready projects. 
          Clean code, modern architecture, ready to deploy.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <Link to="/projects">
            <Button size="lg" className="shadow-medium hover:shadow-strong transition-all">
              Browse Projects
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link to="/request">
            <Button size="lg" variant="outline" className="glass">
              Request Custom Project
            </Button>
          </Link>
        </div>

        {/* Feature Pills */}
        <div className="flex flex-wrap gap-3 justify-center animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <div className="glass px-4 py-2 rounded-full flex items-center gap-2">
            <Code2 className="h-4 w-4" />
            <span className="text-sm">Clean Architecture</span>
          </div>
          <div className="glass px-4 py-2 rounded-full flex items-center gap-2">
            <Zap className="h-4 w-4" />
            <span className="text-sm">Production Ready</span>
          </div>
          <div className="glass px-4 py-2 rounded-full flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm">Modern Stack</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
