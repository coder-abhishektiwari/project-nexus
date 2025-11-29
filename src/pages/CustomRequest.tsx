import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Send } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

const requestSchema = z.object({
  fullName: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.string().trim().email("Invalid email address"),
  projectIdea: z.string().trim().min(10, "Project idea must be at least 10 characters"),
  technologies: z.string().trim().min(2, "Technologies are required"),
  budget: z.string().min(1, "Budget is required"),
});

const CustomRequest = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    projectIdea: "",
    technologies: "",
    suggestedName: "",
    budget: "",
    college: "",
    year: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to submit a custom project request",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    try {
      requestSchema.parse(formData);
    } catch (error: any) {
      toast({
        title: "Validation error",
        description: error.errors[0].message,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("project_requests").insert({
      user_id: user.id,
      full_name: formData.fullName,
      email: formData.email,
      project_idea: formData.projectIdea,
      technologies: formData.technologies,
      suggested_name: formData.suggestedName || null,
      budget: formData.budget,
      college: formData.college || null,
      year: formData.year || null,
    });

    setLoading(false);

    if (error) {
      toast({
        title: "Submission failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Request Submitted!",
        description: "We'll get back to you within 24 hours.",
      });
      setFormData({
        fullName: "",
        email: "",
        projectIdea: "",
        technologies: "",
        suggestedName: "",
        budget: "",
        college: "",
        year: "",
      });
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-3xl mx-auto animate-fade-in">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Request a <span className="gradient-text">Custom Project</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Can't find what you're looking for? Tell us what you need and we'll build it for you.
            </p>
          </div>

          {/* Form */}
          <Card className="glass border-border/50 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  placeholder="John Doe"
                  className="glass"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  className="glass"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              {/* Project Idea */}
              <div className="space-y-2">
                <Label htmlFor="projectIdea">Project Idea *</Label>
                <Textarea
                  id="projectIdea"
                  placeholder="Describe your project idea in detail..."
                  className="glass min-h-[120px]"
                  value={formData.projectIdea}
                  onChange={(e) => setFormData({ ...formData, projectIdea: e.target.value })}
                  required
                />
              </div>

              {/* Technologies */}
              <div className="space-y-2">
                <Label htmlFor="technologies">Required Technologies *</Label>
                <Input
                  id="technologies"
                  placeholder="e.g., React, Node.js, MongoDB"
                  className="glass"
                  value={formData.technologies}
                  onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                  required
                />
              </div>

              {/* Project Name */}
              <div className="space-y-2">
                <Label htmlFor="projectName">Suggested Project Name (Optional)</Label>
                <Input
                  id="projectName"
                  placeholder="My Awesome Project"
                  className="glass"
                  value={formData.suggestedName}
                  onChange={(e) => setFormData({ ...formData, suggestedName: e.target.value })}
                />
              </div>

              {/* Budget */}
              <div className="space-y-2">
                <Label htmlFor="budget">Budget Range *</Label>
                <Select 
                  value={formData.budget}
                  onValueChange={(value) => setFormData({ ...formData, budget: value })}
                  required
                >
                  <SelectTrigger className="glass">
                    <SelectValue placeholder="Select your budget" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="500-1000">₹500 - ₹1,000</SelectItem>
                    <SelectItem value="1000-2000">₹1,000 - ₹2,000</SelectItem>
                    <SelectItem value="2000-5000">₹2,000 - ₹5,000</SelectItem>
                    <SelectItem value="5000+">₹5,000+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* College/Year */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="college">College/University</Label>
                  <Input
                    id="college"
                    placeholder="Your institution"
                    className="glass"
                    value={formData.college}
                    onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="year">Current Year</Label>
                  <Select
                    value={formData.year}
                    onValueChange={(value) => setFormData({ ...formData, year: value })}
                  >
                    <SelectTrigger className="glass">
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1st Year</SelectItem>
                      <SelectItem value="2">2nd Year</SelectItem>
                      <SelectItem value="3">3rd Year</SelectItem>
                      <SelectItem value="4">4th Year</SelectItem>
                      <SelectItem value="final">Final Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                className="w-full glow-primary"
                disabled={loading}
              >
                {loading ? (
                  "Submitting..."
                ) : (
                  <>
                    <Send className="mr-2 h-5 w-5" />
                    Submit Request
                  </>
                )}
              </Button>
            </form>
          </Card>

          {/* Info Section */}
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <Card className="glass border-border/50 p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">24h</div>
              <p className="text-sm text-muted-foreground">Response Time</p>
            </Card>
            <Card className="glass border-border/50 p-6 text-center">
              <div className="text-3xl font-bold text-secondary mb-2">100%</div>
              <p className="text-sm text-muted-foreground">Custom Built</p>
            </Card>
            <Card className="glass border-border/50 p-6 text-center">
              <div className="text-3xl font-bold text-accent mb-2">∞</div>
              <p className="text-sm text-muted-foreground">Lifetime Support</p>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CustomRequest;
