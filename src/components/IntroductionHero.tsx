import { Sparkles, Check, Star, Users, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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

  const subscriptionPlans = [
    {
      name: "Free Trial",
      price: "₹0",
      duration: "14 Days",
      description: "Perfect for getting started",
      features: [
        "Access to all AI tools",
        "Basic recommendations",
        "Community support",
        "No commitment"
      ],
      popular: false,
      badge: "Try Free"
    },
    {
      name: "Monthly",
      price: "₹49",
      duration: "per month",
      description: "Flexible monthly access",
      features: [
        "Full platform access",
        "Premium recommendations",
        "Priority support",
        "Advanced filters"
      ],
      popular: false,
      badge: null
    },
    {
      name: "6 Months",
      price: "₹149",
      duration: "6 months",
      description: "Best value for regular users",
      features: [
        "Everything in Monthly",
        "2 months free",
        "Enhanced AI insights",
        "Beta feature access"
      ],
      popular: true,
      badge: "Most Popular"
    },
    {
      name: "Annual",
      price: "₹249",
      duration: "12 months",
      description: "Maximum savings",
      features: [
        "Everything in 6 months",
        "5+ months free",
        "Premium AI coaching",
        "Priority feature requests"
      ],
      popular: false,
      badge: "Best Value"
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
            {/* Profile Section */}
            <div className="flex items-center justify-center gap-8 mb-8">
              <div className="flex items-center gap-3">
                <img 
                  src="/src/assets/parash.jpg" 
                  alt="Parash Pratim Bhardwaj" 
                  className="w-16 h-16 rounded-full object-cover border-2 border-primary/20"
                />
                <div className="text-left">
                  <p className="text-lg font-semibold text-foreground">Parash Pratim Bhardwaj</p>
                  <p className="text-sm text-muted-foreground">Founder</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <img 
                  src="/src/assets/krishna.jpg" 
                  alt="Krishna Singh" 
                  className="w-16 h-16 rounded-full object-cover border-2 border-primary/20"
                />
                <div className="text-left">
                  <p className="text-lg font-semibold text-foreground">Krishna Singh</p>
                  <p className="text-sm text-muted-foreground">Co-Founder</p>
                </div>
              </div>
            </div>

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

      {/* Subscription Plans Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Choose Your Plan
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Start with our free trial and upgrade when you're ready. All plans include full access to our AI directory.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {subscriptionPlans.map((plan, index) => (
              <Card key={index} className={`relative ${plan.popular ? 'ring-2 ring-primary shadow-xl scale-105' : ''} hover:shadow-lg transition-all duration-300`}>
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className={`${
                      plan.popular 
                        ? 'bg-primary text-primary-foreground' 
                        : plan.badge === 'Try Free' 
                        ? 'bg-green-500 text-white'
                        : 'bg-orange-500 text-white'
                    } px-3 py-1`}>
                      {plan.badge}
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-lg font-semibold">{plan.name}</CardTitle>
                  <div className="mt-2">
                    <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-sm text-muted-foreground">/{plan.duration}</span>
                  </div>
                  <CardDescription className="text-sm">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full ${
                      plan.popular 
                        ? 'bg-primary hover:bg-primary/90' 
                        : 'bg-secondary hover:bg-secondary/80'
                    }`}
                    variant={plan.popular ? "default" : "secondary"}
                  >
                    {plan.badge === 'Try Free' ? 'Start Free Trial' : 'Choose Plan'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

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