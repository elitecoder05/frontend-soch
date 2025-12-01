import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw, AlertCircle, Mail } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const RefundPolicy = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-background">
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center">
                <RefreshCw className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold">Refund Policy</h1>
            </div>
            <p className="text-muted-foreground">Last updated: December 1, 2025</p>
          </div>

          {/* Alert */}
          <Alert className="mb-8 border-orange-200 bg-orange-50">
            <AlertCircle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              <strong>Important:</strong> Soch AI Store follows a strict no-refund policy due to the nature of our service as a directory platform.
            </AlertDescription>
          </Alert>

          <div className="space-y-8">
            {/* Refund Policy */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RefreshCw className="w-5 h-5 text-primary" />
                  Refund Policy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  Soch AI Store follows a strict no-refund policy.
                </p>
                <p>
                  Our platform is a directory of third-party AI tools. We do not own, control, or manage the payment systems of any tools listed in the store. Any subscriptions or purchases made inside those tools are handled directly by their providers.
                </p>
                <p>
                  We do not process payments on behalf of external tools. Therefore, we cannot issue refunds for charges made outside our platform.
                </p>
                <p>
                  If you believe a third-party tool has charged you incorrectly, please contact their official support team.
                  For platform-related concerns, you may write to us, and we will guide you.
                </p>
              </CardContent>
            </Card>

            {/* What We Are */}
            <Card>
              <CardHeader>
                <CardTitle>Understanding Our Service</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">🏪 We Are a Directory</h3>
                    <p className="text-sm">
                      Soch AI Store is a discovery platform that lists and organizes AI tools from various providers.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">🔗 We Don't Own Tools</h3>
                    <p className="text-sm">
                      Each AI tool listed belongs to its respective creator/company, not to Soch AI Store.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">💳 No Payment Processing</h3>
                    <p className="text-sm">
                      We don't handle payments for individual tools - each tool processes its own payments.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">🛡️ Platform Subscription</h3>
                    <p className="text-sm">
                      Our subscription is only for accessing the Soch AI Store directory features.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* How to Get Help */}
            <Card>
              <CardHeader>
                <CardTitle>How to Get Help</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">For Tool-Related Issues:</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Contact the tool's official support team directly</li>
                      <li>Check the tool's refund policy on their website</li>
                      <li>Look for their contact information or help center</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">For Platform-Related Issues:</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Email us with your concern</li>
                      <li>We'll guide you to the right solution</li>
                      <li>We'll help you understand how to contact tool providers</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-primary" />
                  Need Guidance?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  While we cannot process refunds for third-party tools, we're here to help guide you in the right direction.
                </p>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" />
                  <a 
                    href="mailto:sochaicontact@gmail.com" 
                    className="text-primary hover:underline font-medium"
                  >
                    sochaicontact@gmail.com
                  </a>
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  We typically respond within 24-48 hours and will do our best to assist you.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default RefundPolicy;