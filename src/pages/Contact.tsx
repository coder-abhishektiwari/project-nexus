import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, Phone, MapPin } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Contact = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
                Contact Us
              </h1>
              <p className="text-lg text-muted-foreground">
                Get in touch with Project Nexus. We're here to help with your project needs.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <Card className="glass">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Email</CardTitle>
                  <CardDescription>Send us an email anytime</CardDescription>
                </CardHeader>
                <CardContent>
                  <a href="mailto:contact@projectnexus.com" className="text-primary hover:underline">
                    contact@projectnexus.com
                  </a>
                </CardContent>
              </Card>

              <Card className="glass">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Phone</CardTitle>
                  <CardDescription>Call us during business hours</CardDescription>
                </CardHeader>
                <CardContent>
                  <a href="tel:+911234567890" className="text-primary hover:underline">
                    +91 123 456 7890
                  </a>
                </CardContent>
              </Card>

              <Card className="glass">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Address</CardTitle>
                  <CardDescription>Visit our office</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    123 Tech Park, Innovation Street<br />
                    Bangalore, Karnataka 560001<br />
                    India
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="glass">
              <CardHeader>
                <CardTitle>Business Information</CardTitle>
                <CardDescription>Legal business details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p><strong>Legal Business Name:</strong> Project Nexus</p>
                  <p><strong>Email:</strong> contact@projectnexus.com</p>
                  <p><strong>Phone:</strong> +91 123 456 7890</p>
                  <p><strong>Business Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM IST</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
