import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import ProjectCard from "@/components/ProjectCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

// Mock featured projects
const FEATURED_PROJECTS = [
  {
    id: "1",
    name: "E-Commerce Website",
    description: "Full-stack e-commerce platform with payment integration, admin panel, and user authentication.",
    price: 799,
    isFree: false,
    technologies: ["React", "Node.js", "MongoDB", "Stripe"],
    screenshot: "https://images.unsplash.com/photo-1557821552-17105176677c?w=800&h=450&fit=crop",
    bestFor: "BTech 3rd Year, BCA Final Year"
  },
  {
    id: "2",
    name: "Portfolio Website",
    description: "Modern, responsive portfolio template with dark mode and smooth animations.",
    price: 0,
    isFree: true,
    technologies: ["React", "TailwindCSS", "Framer Motion"],
    screenshot: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop",
    bestFor: "All Students"
  },
  {
    id: "3",
    name: "Social Media Dashboard",
    description: "Analytics dashboard with real-time data visualization and user management.",
    price: 1299,
    isFree: false,
    technologies: ["React", "TypeScript", "D3.js", "Firebase"],
    screenshot: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop",
    bestFor: "BTech 4th Year, MCA"
  },
];

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      
      {/* Featured Projects Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Handpicked projects perfect for students looking to excel in their academics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {FEATURED_PROJECTS.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        <div className="text-center">
          <Link to="/projects">
            <Button size="lg" variant="outline" className="glass">
              View All Projects
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
