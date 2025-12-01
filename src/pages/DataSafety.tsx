import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Lock, Eye, Database, Users, CheckCircle } from "lucide-react";

const DataSafety = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const safetyFeatures = [
    {
      icon: <Lock className="w-6 h-6 text-green-500" />,
      title: "Encrypted Storage",
      description: "All your data is stored using industry-standard encryption protocols"
    },
    {
      icon: <Eye className="w-6 h-6 text-blue-500" />,
      title: "Privacy Focused",
      description: "We don't access your private conversations or tool usage data"
    },
    {
      icon: <Database className="w-6 h-6 text-purple-500" />,
      title: "Secure Systems",
      description: "Continuous monitoring and upgrades ensure system reliability"
    },
    {
      icon: <Users className="w-6 h-6 text-orange-500" />,
      title: "No Data Selling",
      description: "We never sell, rent, or share your personal information"
    }
  ];

  const dataTypes = [
    {
      category: "Account Information",
      items: ["Name and email address", "Profile preferences", "Subscription status"],
      purpose: "Account management and personalization"
    },
    {
      category: "Usage Analytics",
      items: ["Pages visited", "Tools viewed", "Search queries"],
      purpose: "Improving recommendations and platform features"
    },
    {
      category: "Device Information",
      items: ["Browser type", "Device type", "General location (country/region)"],
      purpose: "Platform optimization and security"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold">User Data Safety</h1>
            </div>
            <p className="text-muted-foreground">How we protect and handle your information</p>
          </div>

          <div className="space-y-8">
            {/* Main Statement */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  User Data Safety Statement
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  We respect your data and treat it with complete responsibility. Your information is stored securely and is never misused.
                </p>
                <p>
                  We do not access your private AI conversations or internal tool data unless you voluntarily share it with us.
                </p>
                <p>
                  We continuously monitor and upgrade our systems to ensure safety, reliability, and transparency.
                </p>
              </CardContent>
            </Card>

            {/* Safety Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {safetyFeatures.map((feature, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        {feature.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Data Collection */}
            <Card>
              <CardHeader>
                <CardTitle>What Data We Collect</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {dataTypes.map((dataType, index) => (
                    <div key={index} className="border-l-4 border-primary/30 pl-4">
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        {dataType.category}
                      </h3>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground mb-2">
                        {dataType.items.map((item, itemIndex) => (
                          <li key={itemIndex}>{item}</li>
                        ))}
                      </ul>
                      <p className="text-sm text-primary font-medium">
                        Purpose: {dataType.purpose}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Your Rights */}
            <Card>
              <CardHeader>
                <CardTitle>Your Data Rights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="font-medium text-foreground">Access Your Data</span>
                    </div>
                    <p className="text-sm text-muted-foreground pl-7">
                      Request a copy of all data we have about you
                    </p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="font-medium text-foreground">Correct Information</span>
                    </div>
                    <p className="text-sm text-muted-foreground pl-7">
                      Update or fix any incorrect personal information
                    </p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="font-medium text-foreground">Delete Your Data</span>
                    </div>
                    <p className="text-sm text-muted-foreground pl-7">
                      Request permanent deletion of your account and data
                    </p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="font-medium text-foreground">Data Portability</span>
                    </div>
                    <p className="text-sm text-muted-foreground pl-7">
                      Export your data in a machine-readable format
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Measures */}
            <Card>
              <CardHeader>
                <CardTitle>Security Measures</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-muted-foreground">
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">🔐 Technical Safeguards</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>End-to-end encryption for data transmission</li>
                      <li>Encrypted database storage</li>
                      <li>Regular security audits and updates</li>
                      <li>Secure authentication systems</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">👥 Administrative Safeguards</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Limited access controls - only authorized personnel</li>
                      <li>Regular staff training on data protection</li>
                      <li>Incident response procedures</li>
                      <li>Data breach notification protocols</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">📋 Compliance</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Following international data protection standards</li>
                      <li>Regular compliance reviews</li>
                      <li>Transparent privacy practices</li>
                      <li>User consent management</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card>
              <CardHeader>
                <CardTitle>Questions About Your Data?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  If you have any questions about how we handle your data or want to exercise your data rights, please contact us.
                </p>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary" />
                  <a 
                    href="mailto:sochaicontact@gmail.com" 
                    className="text-primary hover:underline font-medium"
                  >
                    sochaicontact@gmail.com
                  </a>
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  We take data protection seriously and will respond to all requests promptly.
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

export default DataSafety;