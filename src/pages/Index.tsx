import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import ProjectCard from "@/components/ProjectCard";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const Index = () => {
  const { data: featuredProjects = [], isLoading } = useQuery({
    queryKey: ["featured-projects"],
    queryFn: async () => {
      // 3 sabse zyada downloaded projects
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
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />

      {/* Featured Projects */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Most Downloaded <span className="gradient-text">Projects</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            These projects are popular among students and developers!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProjects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
