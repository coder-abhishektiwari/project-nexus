import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Terms = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1 pt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
                Terms & Conditions
              </h1>
              <p className="text-lg text-muted-foreground">
                Please read these terms carefully before using our services
              </p>
            </div>

            <Card className="card mb-6">
              <CardHeader>
                <CardTitle>1. Acceptance of Terms</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <p>
                  By accessing and using Project Nexus services, you agree to be bound by these Terms and Conditions. 
                  If you do not agree with any part of these terms, you may not use our services.
                </p>
              </CardContent>
            </Card>

            <Card className="card mb-6">
              <CardHeader>
                <CardTitle>2. Use of Services</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <p>
                  Our projects are intended for educational and learning purposes. You agree to:
                </p>
                <ul className="list-disc pl-6 mt-2">
                  <li>Use the projects in accordance with your educational institution's policies</li>
                  <li>Not redistribute or resell the projects without permission</li>
                  <li>Give proper attribution when using our code in your academic work</li>
                  <li>Not use the projects for commercial purposes without a commercial license</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="card mb-6">
              <CardHeader>
                <CardTitle>3. Intellectual Property</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <p>
                  All projects, code, documentation, and materials provided by Project Nexus remain our intellectual property. 
                  Upon purchase, you receive a license to use the project for your academic purposes, but ownership remains with Project Nexus.
                </p>
              </CardContent>
            </Card>

            <Card className="card mb-6">
              <CardHeader>
                <CardTitle>4. Payment and Pricing</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <p>
                  All prices are listed in Indian Rupees (INR). Payments are processed securely through our payment gateway. 
                  You agree to provide accurate payment information and authorize us to charge your payment method.
                </p>
              </CardContent>
            </Card>

            <Card className="card mb-6">
              <CardHeader>
                <CardTitle>5. Project Delivery</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <p>
                  Upon successful payment, projects will be delivered via download link. 
                  Custom projects will be delivered within the agreed timeframe. We are not responsible for delays caused by incorrect contact information.
                </p>
              </CardContent>
            </Card>

            <Card className="card mb-6">
              <CardHeader>
                <CardTitle>6. Support and Updates</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <p>
                  We provide support for project setup and basic troubleshooting. 
                  Support is available via email and is limited to the original purchaser. 
                  We may provide updates to projects at our discretion.
                </p>
              </CardContent>
            </Card>

            <Card className="card mb-6">
              <CardHeader>
                <CardTitle>7. Limitation of Liability</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <p>
                  Project Nexus provides projects "as is" without warranties of any kind. 
                  We are not liable for any damages arising from the use or inability to use our projects. 
                  You are responsible for ensuring the project meets your specific requirements.
                </p>
              </CardContent>
            </Card>

            <Card className="card mb-6">
              <CardHeader>
                <CardTitle>8. Termination</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <p>
                  We reserve the right to terminate or suspend access to our services for violations of these terms. 
                  Upon termination, you must cease all use of our projects and materials.
                </p>
              </CardContent>
            </Card>

            <Card className="card mb-6">
              <CardHeader>
                <CardTitle>9. Changes to Terms</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <p>
                  We reserve the right to modify these terms at any time. 
                  Changes will be effective immediately upon posting. 
                  Your continued use of our services constitutes acceptance of modified terms.
                </p>
              </CardContent>
            </Card>

            <Card className="card">
              <CardHeader>
                <CardTitle>10. Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <p>
                  For questions about these Terms and Conditions, please contact us at:
                  <br />
                  <strong>Email:</strong> abhishektiwari1706@gmail.com
                  <br />
                  <strong>Phone:</strong> +91 829 559 9649
                </p>
              </CardContent>
            </Card>

            <p className="text-center text-sm text-muted-foreground mt-8">
              Last updated: November 24, 2025
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
