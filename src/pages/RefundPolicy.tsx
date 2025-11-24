import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

const RefundPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
                Refund & Cancellation Policy
              </h1>
              <p className="text-lg text-muted-foreground">
                Our commitment to customer satisfaction and fair refund practices
              </p>
            </div>

            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-8 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <p className="text-sm">
                Please read this policy carefully before making a purchase. By purchasing from Project Nexus, 
                you agree to the terms outlined in this refund and cancellation policy.
              </p>
            </div>

            <Card className="glass mb-6">
              <CardHeader>
                <CardTitle>1. Digital Product Refund Policy</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <p>
                  Due to the digital nature of our products, we have a strict refund policy:
                </p>
                <ul className="list-disc pl-6 mt-2">
                  <li>
                    <strong>24-Hour Window:</strong> Refund requests must be made within 24 hours of purchase
                  </li>
                  <li>
                    <strong>No Download:</strong> Refunds are only available if you have not downloaded the project files
                  </li>
                  <li>
                    <strong>Technical Issues:</strong> If the project has critical technical issues that cannot be resolved, 
                    a full refund or replacement will be provided
                  </li>
                  <li>
                    <strong>Non-Refundable:</strong> Once project files are downloaded, the sale is final
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="glass mb-6">
              <CardHeader>
                <CardTitle>2. Custom Project Cancellations</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <p>
                  For custom project requests:
                </p>
                <ul className="list-disc pl-6 mt-2">
                  <li>
                    <strong>Before Work Begins:</strong> Full refund if cancellation is made before development starts
                  </li>
                  <li>
                    <strong>During Development:</strong> 50% refund if cancellation is made after development has started 
                    but before 50% completion
                  </li>
                  <li>
                    <strong>After 50% Completion:</strong> No refunds once the project is more than 50% complete
                  </li>
                  <li>
                    <strong>Completion:</strong> No refunds after project delivery and approval
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="glass mb-6">
              <CardHeader>
                <CardTitle>3. Refund Process</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <p>
                  To request a refund:
                </p>
                <ol className="list-decimal pl-6 mt-2">
                  <li>Contact us at contact@projectnexus.com with your order details</li>
                  <li>Provide your reason for the refund request</li>
                  <li>Include proof of purchase (order ID and transaction details)</li>
                  <li>Allow 5-7 business days for refund review</li>
                  <li>Approved refunds will be processed within 10-14 business days</li>
                </ol>
              </CardContent>
            </Card>

            <Card className="glass mb-6">
              <CardHeader>
                <CardTitle>4. Eligible Refund Reasons</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <p>
                  Refunds will be considered for:
                </p>
                <ul className="list-disc pl-6 mt-2">
                  <li>Project files are corrupted or incomplete</li>
                  <li>Critical functionality described in the project description does not work</li>
                  <li>Project is significantly different from the description</li>
                  <li>Duplicate purchase made by mistake (must be reported within 24 hours)</li>
                  <li>Technical issues that prevent project installation (after support attempts)</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="glass mb-6">
              <CardHeader>
                <CardTitle>5. Non-Eligible Refund Reasons</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <p>
                  Refunds will NOT be provided for:
                </p>
                <ul className="list-disc pl-6 mt-2">
                  <li>Change of mind after downloading the project</li>
                  <li>Lack of technical skills to implement the project</li>
                  <li>Project does not meet your specific requirements (not mentioned in description)</li>
                  <li>Issues caused by modifications you made to the code</li>
                  <li>Incompatibility with systems not mentioned in requirements</li>
                  <li>Academic institution policies or restrictions</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="glass mb-6">
              <CardHeader>
                <CardTitle>6. Refund Method</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <p>
                  All approved refunds will be processed through the original payment method used for purchase. 
                  Refund processing times may vary depending on your bank or payment provider:
                </p>
                <ul className="list-disc pl-6 mt-2">
                  <li>Credit/Debit Card: 5-10 business days</li>
                  <li>Net Banking: 7-14 business days</li>
                  <li>UPI/Wallets: 3-7 business days</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="glass mb-6">
              <CardHeader>
                <CardTitle>7. Partial Refunds</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <p>
                  In certain cases, we may offer partial refunds:
                </p>
                <ul className="list-disc pl-6 mt-2">
                  <li>If only some features of the project are not working</li>
                  <li>For custom projects that are partially completed</li>
                  <li>If substitute resources or fixes are provided</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="glass">
              <CardHeader>
                <CardTitle>8. Contact for Refunds</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <p>
                  For all refund and cancellation queries:
                  <br />
                  <strong>Email:</strong> abhishektiwari1706@gmail.com
                  <br />
                  <strong>Phone:</strong> +91 829 559 9649
                  <br />
                  <strong>Business Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM IST
                </p>
                <p className="mt-4">
                  We strive to respond to all refund requests within 48 hours. 
                  Please ensure you include all relevant details to help us process your request quickly.
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

export default RefundPolicy;
