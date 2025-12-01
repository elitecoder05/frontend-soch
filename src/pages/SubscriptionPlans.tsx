import { useState } from "react";
import { Check, Star } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/Navbar";

const SubscriptionPlans = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const subscriptionPlans = [
    {
      name: "Free Trial",
      price: "₹0",
      duration: "14 Days",
      description: "Perfect for getting started and exploring our platform",
      features: [
        "Access to all AI tools directory",
        "Basic search and filtering",
        "Community support",
        "Tool recommendations",
        "No commitment required"
      ],
      popular: false,
      badge: "Try Free",
      color: "green"
    },
    {
      name: "Monthly Plan",
      price: "₹49",
      duration: "per month",
      description: "Flexible monthly access with premium features",
      features: [
        "Everything in Free Trial",
        "Advanced search filters",
        "Premium tool recommendations",
        "Priority customer support",
        "Bookmark favorite tools",
        "Usage analytics"
      ],
      popular: false,
      badge: null,
      color: "blue"
    },
    {
      name: "6 Months Plan",
      price: "₹149",
      duration: "6 months",
      originalPrice: "₹294",
      description: "Best value for regular users - Save 2 months!",
      features: [
        "Everything in Monthly Plan",
        "2 months completely free",
        "Enhanced AI tool insights",
        "Beta features early access",
        "Advanced comparison tools",
        "Custom tool collections",
        "Priority feature requests"
      ],
      popular: true,
      badge: "Most Popular",
      color: "primary"
    },
    {
      name: "Annual Plan",
      price: "₹249",
      duration: "12 months",
      originalPrice: "₹588",
      description: "Maximum savings for power users",
      features: [
        "Everything in 6 months plan",
        "5+ months completely free",
        "Premium AI tool coaching",
        "One-on-one consultation",
        "Custom integrations",
        "Priority feature development",
        "Exclusive community access",
        "Annual summary reports"
      ],
      popular: false,
      badge: "Best Value",
      color: "orange"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground">Subscription Plans</h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Choose the perfect plan for your AI discovery journey. Start with our 14-day free trial 
              and upgrade when you're ready for premium features.
            </p>
          </div>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {subscriptionPlans.map((plan, index) => (
              <Card 
                key={index} 
                className={`relative transition-all duration-300 hover:shadow-lg ${
                  plan.popular 
                    ? 'ring-2 ring-primary shadow-xl scale-105 border-primary/50' 
                    : 'hover:scale-102'
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    <Badge className={`px-3 py-1 ${
                      plan.color === 'green' ? 'bg-green-500 hover:bg-green-600' :
                      plan.color === 'orange' ? 'bg-orange-500 hover:bg-orange-600' :
                      plan.color === 'primary' ? 'bg-primary hover:bg-primary/90' :
                      'bg-blue-500 hover:bg-blue-600'
                    } text-white border-0`}>
                      {plan.badge}
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-xl font-semibold text-foreground">
                    {plan.name}
                  </CardTitle>
                  <div className="mt-4">
                    <div className="flex items-end justify-center gap-1">
                      <span className="text-3xl lg:text-4xl font-bold text-foreground">
                        {plan.price}
                      </span>
                      <span className="text-sm text-muted-foreground pb-1">
                        /{plan.duration}
                      </span>
                    </div>
                    {plan.originalPrice && (
                      <div className="text-sm text-muted-foreground mt-1">
                        <span className="line-through">{plan.originalPrice}</span>
                        <span className="ml-2 text-green-600 font-medium">
                          Save {Math.round(((parseInt(plan.originalPrice.replace('₹', '')) - parseInt(plan.price.replace('₹', ''))) / parseInt(plan.originalPrice.replace('₹', ''))) * 100)}%
                        </span>
                      </div>
                    )}
                  </div>
                  <CardDescription className="text-sm mt-3">
                    {plan.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-0">
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={`w-full transition-all duration-200 ${
                      plan.popular 
                        ? 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg' 
                        : 'bg-secondary hover:bg-secondary/80 text-secondary-foreground'
                    }`}
                    size="lg"
                  >
                    {plan.price === '₹0' ? 'Start Free Trial' : 'Choose This Plan'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Additional Information */}
          <div className="max-w-4xl mx-auto">
            <Card className="bg-muted/30 border-0">
              <CardContent className="pt-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    Important Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-muted-foreground">
                    <div>
                      <h4 className="font-medium text-foreground mb-2">📝 Free Trial</h4>
                      <p>
                        Get full access to all features for 14 days. No credit card required. 
                        Cancel anytime during the trial period.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground mb-2">🔒 Secure & Safe</h4>
                      <p>
                        All payments are processed securely. Your data is encrypted and protected. 
                        We respect your privacy completely.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground mb-2">💼 For Everyone</h4>
                      <p>
                        Perfect for students, creators, developers, researchers, and businesses 
                        exploring AI tools and technologies.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground mb-2">🚀 Always Growing</h4>
                      <p>
                        We continuously add new AI tools and features. Your subscription grows 
                        in value over time with regular updates.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* FAQ Section */}
            <div className="mt-12 text-center">
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Questions about our plans?
              </h3>
              <p className="text-muted-foreground mb-4">
                We're here to help you choose the right plan for your needs.
              </p>
              <Button variant="outline" size="lg">
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans;