import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Shield, Mail, RefreshCw, Users } from "lucide-react";

const PrivacyPolicy = () => {
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
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold">Privacy Policy</h1>
            </div>
          </div>

          <div className="space-y-8">
            {/* Privacy Policy */}
            <Card>
              <CardContent className="pt-6 space-y-4">
                <p className="text-muted-foreground">
                  Your privacy matters to us. Soch AI Store is committed to protecting your personal information and ensuring a secure experience for every user.
                </p>
                <p className="text-muted-foreground">
                  We collect basic information such as your name email device details and general usage patterns. This information helps us personalise your experience improve recommendations and maintain the platform. All data is stored securely using encrypted systems and restricted access controls.
                </p>
                <p className="text-muted-foreground">
                  We do not sell your data and we do not share personal information without your consent except in situations required by law or necessary for safety and security.
                </p>
                <p className="text-muted-foreground">
                  Some tools listed on our platform belong to third party providers. When you use those tools you may be subject to their individual privacy policies. Please review their policies for full clarity.
                </p>
                <p className="text-muted-foreground">
                  You may request data correction or deletion at any time by contacting the email below.
                </p>
              </CardContent>
            </Card>

            {/* Refund Policy */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RefreshCw className="w-5 h-5" />
                  Refund Policy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Soch AI Store follows a strict no refunds policy.
                </p>
                <p className="text-muted-foreground">
                  Our platform is a directory of third party AI tools. We do not own control or manage the payment systems of tools listed inside the store. Any subscriptions or purchases inside those tools are processed by the respective providers.
                </p>
                <p className="text-muted-foreground">
                  We do not process payments on behalf of external tools. Therefore we cannot issue refunds for charges made outside our platform.
                </p>
                <p className="text-muted-foreground">
                  If you believe a third party tool charged you incorrectly contact their official support team.
                  For platform related concerns you may write to us and we will guide you.
                </p>
              </CardContent>
            </Card>

            {/* User Data Safety Statement */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  User Data Safety Statement
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  We respect user data and treat it with complete responsibility.
                  Your information is stored securely and is never misused.
                  We do not access your private AI conversations or internal tool data unless you choose to share it with us.
                </p>
                <p className="text-muted-foreground">
                  We continuously monitor and upgrade our systems to ensure safety reliability and transparency.
                </p>
              </CardContent>
            </Card>

            {/* Contact Us */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Contact Us
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  For any questions support requests or privacy concerns you may contact us anytime.
                </p>
                <div className="space-y-2">
                  <div>
                    <h3 className="font-semibold mb-2">Email</h3>
                    <p className="text-muted-foreground">sochaicontact@gmail.com</p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  We respond as quickly as possible and will assist you with anything related to the Soch AI platform.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;