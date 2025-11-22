import { useParams, Link } from "react-router-dom";
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
  Zap
} from "lucide-react";

// Mock data - will be replaced with API
const MOCK_PROJECT = {
  id: "1",
  name: "E-Commerce Website",
  description: "A complete full-stack e-commerce platform built with modern technologies.",
  longDescription: `This comprehensive e-commerce solution includes everything you need to build a professional online store. 
  Features include user authentication, product management, shopping cart, payment integration with Razorpay, 
  order tracking, and a powerful admin dashboard. The project follows industry best practices and includes 
  complete documentation for easy setup and deployment.`,
  price: 799,
  isFree: false,
  technologies: ["React", "Node.js", "MongoDB", "Express", "Stripe", "JWT", "Redux"],
  screenshot: "https://images.unsplash.com/photo-1557821552-17105176677c?w=1200&h=600&fit=crop",
  gallery: [
    "https://images.unsplash.com/photo-1557821552-17105176677c?w=800&h=450&fit=crop",
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop",
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop",
  ],
  bestFor: "BTech 3rd Year, BCA Final Year, MCA Students",
  features: [
    "User Authentication & Authorization",
    "Product Management System",
    "Shopping Cart & Checkout",
    "Payment Gateway Integration",
    "Order Management & Tracking",
    "Admin Dashboard",
    "Responsive Design",
    "Email Notifications"
  ],
  learningOutcomes: [
    "Master full-stack development with MERN stack",
    "Learn payment gateway integration",
    "Understand authentication & security best practices",
    "Build scalable REST APIs",
    "Implement state management with Redux"
  ],
  dependencies: [
    "Node.js v16+",
    "MongoDB v4+",
    "npm or yarn",
    "Git"
  ],
  setupSteps: [
    "Clone the repository",
    "Install dependencies with npm install",
    "Configure environment variables",
    "Run MongoDB locally or connect to cloud",
    "Start backend: npm run server",
    "Start frontend: npm start"
  ]
};

const ProjectDetails = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        {/* Hero Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-16 animate-fade-in">
          <div>
            <div className="flex items-center gap-3 mb-4">
              {MOCK_PROJECT.isFree ? (
                <Badge className="bg-accent text-accent-foreground text-lg px-4 py-1">Free</Badge>
              ) : (
                <Badge className="bg-primary text-primary-foreground text-lg px-4 py-1">
                  ₹{MOCK_PROJECT.price}
                </Badge>
              )}
              <Badge variant="secondary">Production Ready</Badge>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {MOCK_PROJECT.name}
            </h1>
            
            <p className="text-muted-foreground text-lg mb-6">
              {MOCK_PROJECT.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-8">
              {MOCK_PROJECT.technologies.map((tech, idx) => (
                <Badge key={idx} variant="outline" className="text-sm">
                  {tech}
                </Badge>
              ))}
            </div>

            <div className="flex gap-3">
              <Button size="lg" className="glow-primary flex-1">
                <Download className="mr-2 h-5 w-5" />
                {MOCK_PROJECT.isFree ? "Download Now" : "Buy Now"}
              </Button>
              <Button size="lg" variant="outline" className="glass">
                <ExternalLink className="mr-2 h-5 w-5" />
                Live Demo
              </Button>
            </div>
          </div>

          <div className="glass rounded-2xl overflow-hidden border border-border/50">
            <img 
              src={MOCK_PROJECT.screenshot} 
              alt={MOCK_PROJECT.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Gallery */}
        <div className="grid grid-cols-3 gap-4 mb-16">
          {MOCK_PROJECT.gallery.map((img, idx) => (
            <div key={idx} className="glass rounded-xl overflow-hidden border border-border/50 aspect-video">
              <img src={img} alt={`Screenshot ${idx + 1}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>

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
                {MOCK_PROJECT.longDescription}
              </p>
            </Card>

            {/* Features */}
            <Card className="glass border-border/50 p-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-accent" />
                Key Features
              </h2>
              <ul className="grid md:grid-cols-2 gap-3">
                {MOCK_PROJECT.features.map((feature, idx) => (
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
                {MOCK_PROJECT.learningOutcomes.map((outcome, idx) => (
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
                <div>
                  <h3 className="font-semibold mb-2">Prerequisites:</h3>
                  <ul className="space-y-1">
                    {MOCK_PROJECT.dependencies.map((dep, idx) => (
                      <li key={idx} className="text-muted-foreground">• {dep}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Setup Steps:</h3>
                  <ol className="space-y-2">
                    {MOCK_PROJECT.setupSteps.map((step, idx) => (
                      <li key={idx} className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-semibold">
                          {idx + 1}
                        </span>
                        <span className="text-muted-foreground">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
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
              <p className="text-muted-foreground">{MOCK_PROJECT.bestFor}</p>
            </Card>

            {/* CTA Card */}
            <Card className="glass border-primary/30 p-6 glow-primary">
              <h3 className="font-bold text-xl mb-2">Ready to Start?</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Get instant access to the complete source code and documentation.
              </p>
              <Button className="w-full" size="lg">
                <Download className="mr-2 h-5 w-5" />
                {MOCK_PROJECT.isFree ? "Download Free" : `Buy for ₹${MOCK_PROJECT.price}`}
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
