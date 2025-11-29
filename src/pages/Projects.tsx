import { useState, useEffect} from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProjectCard from "@/components/ProjectCard";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const CATEGORIES = [
  { label: "All Projects", value: "all" },
  { label: "Free", value: "free" },
  { label: "₹199-₹499", value: "199-499" },
  { label: "₹499-₹999", value: "499-999" },
  { label: "₹999-₹1999", value: "999-1999" },
];

// Mock data - will be replaced with API
// const MOCK_PROJECTS = [
//   {
//     id: "1",
//     name: "E-Commerce Website",
//     description: "Full-stack e-commerce platform with payment integration, admin panel, and user authentication.",
//     price: 799,
//     isFree: false,
//     technologies: ["React", "Node.js", "MongoDB", "Stripe"],
//     screenshot: "https://images.unsplash.com/photo-1557821552-17105176677c?w=800&h=450&fit=crop",
//     bestFor: "BTech 3rd Year, BCA Final Year"
//   },
//   {
//     id: "2",
//     name: "Portfolio Website",
//     description: "Modern, responsive portfolio template with dark mode and smooth animations.",
//     price: 0,
//     isFree: true,
//     technologies: ["React", "TailwindCSS", "Framer Motion"],
//     screenshot: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop",
//     bestFor: "All Students"
//   },
//   {
//     id: "3",
//     name: "Social Media Dashboard",
//     description: "Analytics dashboard with real-time data visualization and user management.",
//     price: 1299,
//     isFree: false,
//     technologies: ["React", "TypeScript", "D3.js", "Firebase"],
//     screenshot: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop",
//     bestFor: "BTech 4th Year, MCA"
//   },
//   {
//     id: "4",
//     name: "Chat Application",
//     description: "Real-time messaging app with group chats, file sharing, and notifications.",
//     price: 599,
//     isFree: false,
//     technologies: ["React", "Socket.io", "Express", "PostgreSQL"],
//     screenshot: "https://images.unsplash.com/photo-1611746872915-64382b5c76da?w=800&h=450&fit=crop",
//     bestFor: "BTech 2nd Year, BCA 2nd Year"
//   },
//   {
//     id: "5",
//     name: "Task Manager",
//     description: "Kanban-style task management system with drag-and-drop functionality.",
//     price: 0,
//     isFree: true,
//     technologies: ["React", "Redux", "DnD Kit"],
//     screenshot: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&h=450&fit=crop",
//     bestFor: "BTech 1st Year, Diploma"
//   },
//   {
//     id: "6",
//     name: "Booking System",
//     description: "Complete hotel/service booking platform with calendar integration and payment gateway.",
//     price: 1499,
//     isFree: false,
//     technologies: ["Next.js", "Prisma", "PostgreSQL", "Razorpay"],
//     screenshot: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=450&fit=crop",
//     bestFor: "BTech Final Year"
//   },
// ];



const Projects = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch from DB
  useEffect(() => {
    const loadProjects = async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*");

      if (error) {
        console.error("Error loading projects:", error);
      } else {
        setProjects(data || []);
      }

      setLoading(false);
    };

    loadProjects();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-10 w-10 rounded-full border-b-2 border-primary"></div>
      </div>
    );
  }
  const filteredProjects = projects.filter(project => {
    if (selectedCategory === "all") return true;
    if (selectedCategory === "free") return project.price === 0;

    const [min, max] = selectedCategory.split("-").map(Number);
    return project.price >= min && project.price <= max;
  });

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Explore <span className="gradient-text">Projects</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Choose from our curated collection of production-ready projects designed for students.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {CATEGORIES.map((category) => (
            <Button
              key={category.value}
              variant={selectedCategory === category.value ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.value)}
              className={selectedCategory === category.value ? "shadow-medium" : "glass"}
            >
              {category.label}
            </Button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">No projects found in this category.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Projects;
