import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Zap, Image as ImageIcon, ArrowRight } from "lucide-react";

const SochAIApps = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const apps = [
    {
      id: 1,
      name: "Soch AI Script Generator",
      description: "Generate professional scripts for videos, presentations, and content creation. Perfect for creators, marketers, and businesses.",
      icon: <Sparkles className="w-12 h-12 text-purple-500" />,
      color: "from-purple-600 to-blue-600",
      features: [
        "AI-powered script writing",
        "Multiple formats (YouTube, TikTok, etc.)",
        "SEO optimization",
        "Customizable tone and style"
      ],
      badge: "Popular",
      comingSoon: true
    },
    {
      id: 2,
      name: "Soch AI Caption Generator",
      description: "Create engaging captions and descriptions instantly. Boost engagement with AI-powered caption suggestions.",
      icon: <Zap className="w-12 h-12 text-yellow-500" />,
      color: "from-yellow-600 to-orange-600",
      features: [
        "Social media captions",
        "Hashtag suggestions",
        "Multi-language support",
        "Emoji recommendations"
      ],
      badge: "Featured",
      comingSoon: true
    },
    {
      id: 3,
      name: "Soch AI Image Generator",
      description: "Generate stunning images from text descriptions. Create unique visuals for your projects with AI.",
      icon: <ImageIcon className="w-12 h-12 text-pink-500" />,
      color: "from-pink-600 to-red-600",
      features: [
        "Text-to-image generation",
        "Multiple art styles",
        "High-resolution output",
        "Batch generation"
      ],
      badge: "New",
      comingSoon: true
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      
      <div className="container mx-auto px-4 py-12 pt-28">
        {/* Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center shadow-lg">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Soch AI Apps
          </h1>
          <p className="text-lg text-muted-foreground">
            Powerful AI-powered tools designed to supercharge your creativity and productivity. 
            All in one unified ecosystem.
          </p>
        </div>

        {/* Apps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {apps.map((app) => (
            <Card 
              key={app.id} 
              className="group relative overflow-hidden border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 flex flex-col"
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${app.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              
              {/* Badge */}
              <div className="absolute top-4 right-4 z-10">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold text-white ${
                  app.badge === "Popular" ? "bg-purple-500" :
                  app.badge === "Featured" ? "bg-blue-500" :
                  "bg-pink-500"
                }`}>
                  {app.badge}
                </span>
              </div>

              {/* Content */}
              <CardHeader className="relative z-10 pb-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-black/5 to-black/10 flex items-center justify-center">
                    {app.icon}
                  </div>
                </div>
                <CardTitle className="text-xl text-foreground group-hover:text-primary transition-colors duration-300">
                  {app.name}
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  {app.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="relative z-10 space-y-6 flex-grow">
                {/* Features List */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Key Features</p>
                  <ul className="space-y-2">
                    {app.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="w-1 h-1 rounded-full bg-primary mt-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Coming Soon / CTA Button */}
                {app.comingSoon ? (
                  <div className="pt-4">
                    <div className="w-full py-3 px-4 rounded-lg bg-primary/10 border border-primary/20 text-center">
                      <p className="text-sm font-semibold text-primary">Coming Soon</p>
                    </div>
                  </div>
                ) : (
                  <Button className="w-full rounded-lg group/btn">
                    <span>Try Now</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Info Section */}
        <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20 rounded-2xl p-8 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">🚀 Fast & Powerful</h3>
              <p className="text-muted-foreground">
                Cutting-edge AI models that deliver results in seconds
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">🔒 Secure & Private</h3>
              <p className="text-muted-foreground">
                Your data is encrypted and never shared with third parties
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">💡 Always Learning</h3>
              <p className="text-muted-foreground">
                Regular updates with new features and improvements
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Ready to Explore More?
          </h2>
          <p className="text-muted-foreground mb-8">
            Discover thousands of AI tools to complement these apps. Browse our full collection of AI applications.
          </p>
          <Button size="lg" className="rounded-lg" onClick={() => window.location.href = '/explorer'}>
            Explore All Tools
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SochAIApps;
