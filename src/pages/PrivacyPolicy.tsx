import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Shield, Eye, Lock, UserCheck, Database, Mail } from "lucide-react";

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
            <p className="text-muted-foreground max-w-2xl mx-auto">
              This Privacy Policy explains how Soch AI collects, uses, and protects your information when you use our platform.
            </p>
            <div className="mt-4 text-sm text-muted-foreground">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>

          <div className="space-y-8">
            {/* Information We Collect */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Information We Collect
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Personal Information</h3>
                  <p className="text-muted-foreground">
                    When you create an account, we collect your name, email address, and mobile number. 
                    This information is used to provide you with access to our services and to communicate with you.
                  </p>
                </div>
                <Separator />
                <div>
                  <h3 className="font-semibold mb-2">AI Model Data</h3>
                  <p className="text-muted-foreground">
                    When you upload AI models to our platform, we collect the model information, descriptions, 
                    and metadata you provide. This information is used to display and categorize your models.
                  </p>
                </div>
                <Separator />
                <div>
                  <h3 className="font-semibold mb-2">Usage Information</h3>
                  <p className="text-muted-foreground">
                    We automatically collect information about how you use our platform, including your IP address, 
                    browser type, pages visited, and interaction patterns. This helps us improve our services.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* How We Use Your Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="w-5 h-5" />
                  How We Use Your Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Provide and maintain our AI model discovery platform</li>
                  <li>• Process and display your uploaded AI models</li>
                  <li>• Communicate with you about your account and our services</li>
                  <li>• Improve our platform based on user feedback and usage patterns</li>
                  <li>• Ensure platform security and prevent fraud</li>
                  <li>• Comply with legal obligations and enforce our terms of service</li>
                </ul>
              </CardContent>
            </Card>

            {/* Information Sharing */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Information Sharing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Public Information</h3>
                  <p className="text-muted-foreground">
                    AI models you upload and mark as public, along with your name as the model creator, 
                    will be visible to all users of the platform. This is essential for the model discovery experience.
                  </p>
                </div>
                <Separator />
                <div>
                  <h3 className="font-semibold mb-2">Third Parties</h3>
                  <p className="text-muted-foreground">
                    We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, 
                    except as described in this policy or as required by law.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Data Security */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Data Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  We implement appropriate security measures to protect your personal information against unauthorized access, 
                  alteration, disclosure, or destruction. This includes:
                </p>
                <ul className="space-y-2 text-muted-foreground ml-4">
                  <li>• Encryption of sensitive data in transit and at rest</li>
                  <li>• Regular security audits and updates</li>
                  <li>• Access controls and authentication measures</li>
                  <li>• Secure data storage and backup procedures</li>
                </ul>
              </CardContent>
            </Card>

            {/* Your Rights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="w-5 h-5" />
                  Your Rights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">You have the right to:</p>
                <ul className="space-y-2 text-muted-foreground ml-4">
                  <li>• Access and review your personal information</li>
                  <li>• Update or correct your personal information</li>
                  <li>• Delete your account and associated data</li>
                  <li>• Request a copy of your data</li>
                  <li>• Object to certain processing of your data</li>
                  <li>• Withdraw consent where processing is based on consent</li>
                </ul>
              </CardContent>
            </Card>

            {/* Cookies and Tracking */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Cookies and Tracking
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  We use cookies and similar tracking technologies to enhance your experience on our platform. 
                  These technologies help us remember your preferences, maintain your session, and analyze platform usage.
                </p>
                <p className="text-muted-foreground">
                  You can control cookie settings through your browser preferences, though disabling cookies may 
                  affect the functionality of our platform.
                </p>
              </CardContent>
            </Card>

            {/* Changes to Privacy Policy */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Changes to This Privacy Policy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We may update this Privacy Policy from time to time. We will notify users of any material changes 
                  by email or through a prominent notice on our platform. Your continued use of the platform after 
                  such modifications constitutes your acknowledgment and acceptance of the updated policy.
                </p>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Contact Us
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  If you have any questions about this Privacy Policy or our privacy practices, please contact us:
                </p>
                <div className="space-y-2 text-muted-foreground">
                  <p>Email: privacy@soch-ai.com</p>
                  <p>Address: [Company Address to be added]</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;