import { Sparkles, Star, Users, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface IntroductionHeroProps {
  onGetStarted: () => void;
}

export const IntroductionHero = ({ onGetStarted }: IntroductionHeroProps) => {
  const features = [
    {
      icon: <Star className="w-5 h-5 text-yellow-500" />,
      title: "120+ Curated AI Tools",
      description: "Hand-picked collection of the world's most useful AI models and tools"
    },
    {
      icon: <Shield className="w-5 h-5 text-green-500" />,
      title: "Safe & Trusted Platform",
      description: "Secure environment to explore and compare AI technologies confidently"
    },
    {
      icon: <Zap className="w-5 h-5 text-blue-500" />,
      title: "Easy Discovery",
      description: "Find the perfect AI tool for your needs without confusion"
    },
    {
      icon: <Users className="w-5 h-5 text-purple-500" />,
      title: "Community Driven",
      description: "Supporting creators, students, developers, and businesses"
    }
  ];


  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,217,255,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(0,217,255,0.1),transparent_50%)]" />
        
        <div className="relative container mx-auto px-4 py-16 lg:py-24">
          <div className="text-center max-w-4xl mx-auto">
            {/* Founders removed from hero as requested */}

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">India's Most Reliable AI Directory</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Welcome to{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">
                Soch AI Store
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              An independent platform that brings together the world's most useful AI tools in one trusted space. 
              We help creators, students, developers, and businesses discover the right AI tools without confusion.
            </p>

            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={onGetStarted}
            >
              Start Exploring
              <Sparkles className="w-5 h-5 ml-2" />
            </Button>

            <div className="flex justify-center gap-8 mt-12 text-sm text-muted-foreground">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">120+</div>
                <div>AI Tools</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">24</div>
                <div>Categories</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">500K+</div>
                <div>Users</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* What is Soch AI Store Section */}
      <section className="py-16 lg:py-24 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              What is Soch AI Store?
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              We do not own or control the tools listed in our directory. Every tool belongs to its respective provider. 
              We simply offer a safe, clean, and user-friendly environment where users can explore, compare, and use AI technologies confidently.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-card border border-border mx-auto mb-4 flex items-center justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subscription Plans Section removed from main hero as requested */}

      {/* Mission Statement */}
      <section className="py-16 bg-card/30">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-6">
              Our Mission
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Our mission is to build India's most reliable AI directory and support the future of creators and learners through technology. 
              We make AI simple and accessible for everyone.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};