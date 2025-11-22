import { useState } from "react";
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

const CustomRequest = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Request Submitted!",
        description: "We'll get back to you within 24 hours.",
      });
      setLoading(false);
    }, 1000);
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
                />
              </div>

              {/* Budget */}
              <div className="space-y-2">
                <Label htmlFor="budget">Budget Range *</Label>
                <Select required>
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
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="year">Current Year</Label>
                  <Select>
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
