import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Target, Heart, Shield, Globe, Star } from "lucide-react";

const About = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const values = [
    {
      icon: <Shield className="w-6 h-6 text-blue-500" />,
      title: "Trust & Safety",
      description: "We provide a safe, clean environment for AI tool discovery"
    },
    {
      icon: <Globe className="w-6 h-6 text-green-500" />,
      title: "Accessibility",
      description: "Making AI simple and accessible for everyone"
    },
    {
      icon: <Star className="w-6 h-6 text-yellow-500" />,
      title: "Quality Curation",
      description: "Hand-picked tools to ensure the highest quality"
    },
    {
      icon: <Heart className="w-6 h-6 text-red-500" />,
      title: "Community First",
      description: "Supporting creators, learners, and innovators"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground">About Soch AI Store</h1>
            </div>
          </div>

          {/* Main About Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Users className="w-6 h-6 text-primary" />
                About Us
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                Soch AI Store is an independent platform that brings together the world's most useful AI tools in one trusted space. 
                We help creators, students, developers, and businesses discover the right AI tools without confusion. 
                Our goal is to make AI simple and accessible for everyone.
              </p>
              <p>
                We do not own or control the tools listed in our directory. Every tool belongs to its respective provider. 
                We simply offer a safe, clean, and user-friendly environment where users can explore, compare, and use AI technologies confidently.
              </p>
              <p>
                Our mission is to build India's most reliable AI directory and support the future of creators and learners through technology.
              </p>
            </CardContent>
          </Card>

          {/* Mission Section */}
          <Card className="mb-8" id="mission">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Target className="w-6 h-6 text-primary" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              <p className="text-lg">
                Our mission is to build India's most reliable AI directory and support the future of creators and learners through technology. 
                We make AI simple and accessible for everyone.
              </p>
            </CardContent>
          </Card>

          {/* Values Grid */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground text-center mb-8">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {values.map((value, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="pt-6">
                    <div className="flex justify-center mb-4">
                      {value.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {value.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* What We Do */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl">What We Do</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">🔍 Curated Discovery</h3>
                  <p className="text-sm">
                    We carefully select and organize AI tools across 24+ categories to help you find exactly what you need.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">🛡️ Safe Environment</h3>
                  <p className="text-sm">
                    We provide a trusted platform where you can explore AI tools confidently without security concerns.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">📊 Clear Comparisons</h3>
                  <p className="text-sm">
                    Compare features, pricing, and capabilities across different AI tools to make informed decisions.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">🎓 Educational Resources</h3>
                  <p className="text-sm">
                    Learn about AI tools, their applications, and how they can benefit your specific use case.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Founder Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl">Meet Our Founder</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-bold text-white">S</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">Sidharth Varma</h3>
                  <p className="text-sm text-primary font-medium mb-2">Founder & CEO</p>
                  <p className="text-sm text-muted-foreground">
                    Passionate about making AI accessible to everyone. Building India's most trusted AI directory 
                    to support creators, learners, and businesses in their AI journey.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Community Stats */}
          <Card className="text-center">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold text-foreground mb-6">Our Growing Community</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">120+</div>
                  <div className="text-sm text-muted-foreground">Curated AI Tools</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">24+</div>
                  <div className="text-sm text-muted-foreground">Categories</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">500K+</div>
                  <div className="text-sm text-muted-foreground">Active Users</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default About;