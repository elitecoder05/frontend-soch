import { useState } from "react";
import { Check, Star, Zap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/Navbar";
import { scriptGeneratorPlans, scriptGeneratorPricingConfig } from '@/data/subscriptionPlans';

const ScriptGeneratorPricing = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Offer Banner */}
          {scriptGeneratorPricingConfig.offerBanner.show && (
            <div className="text-center mb-6">
              <Badge className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 text-sm font-medium">
                🚀 {scriptGeneratorPricingConfig.offerBanner.text}
              </Badge>
            </div>
          )}

          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              {scriptGeneratorPricingConfig.header.title}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {scriptGeneratorPricingConfig.header.subtitle}
            </p>
          </div>

          {/* Plans Grid - Simple 2-column layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 max-w-2xl mx-auto">
            {scriptGeneratorPlans.map((plan, index) => (
              <Card 
                key={index} 
                className={`relative transition-all duration-300 hover:shadow-lg ${
                  plan.popular 
                    ? 'ring-2 ring-primary shadow-xl border-primary/50 transform scale-105' 
                    : 'hover:scale-102'
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    <Badge className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0">
                      {plan.badge}
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-6">
                  <CardTitle className="text-xl font-semibold text-foreground mb-2">
                    {plan.name}
                  </CardTitle>
                  
                  {/* Price Display */}
                  <div className="mt-4 mb-4">
                    <div className="flex items-end justify-center gap-1">
                      <span className={`font-bold ${plan.name === 'FREE' ? 'text-2xl' : 'text-4xl'} text-foreground`}>
                        {plan.price}
                      </span>
                      <span className="text-sm text-muted-foreground pb-1">
                        / {plan.duration}
                      </span>
                    </div>
                    {plan.launchOffer && plan.name === 'CREATOR' && (
                      <div className="text-xs text-muted-foreground mt-1">
                        <span className="text-orange-600 font-medium">
                          🎉 Launch Offer Price
                        </span>
                      </div>
                    )}
                  </div>

                  {plan.description && (
                    <div className="text-center mb-4">
                      <p className="text-sm text-purple-600 font-medium bg-purple-50 rounded-full px-3 py-1 inline-block">
                        {plan.description}
                      </p>
                    </div>
                  )}
                </CardHeader>

                <CardContent className="pt-0">
                  {/* Features List */}
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3 text-sm">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {/* Action Button */}
                  <Button 
                    className={`w-full mb-3 transition-all duration-200 ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg' 
                        : 'bg-secondary hover:bg-secondary/80 text-secondary-foreground'
                    }`}
                    size="lg"
                  >
                    {plan.buttonText}
                  </Button>

                  {/* Trust Line */}
                  {plan.trustLine && (
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">
                        {plan.trustLine}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Additional Information - Simplified */}
          <div className="max-w-2xl mx-auto">
            <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200/50">
              <CardContent className="pt-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    ✨ Why Choose Soch AI Script Generator?
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                        <Check className="w-4 h-4 text-purple-600" />
                      </div>
                      <span>Instant viral script generation</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                        <Check className="w-4 h-4 text-purple-600" />
                      </div>
                      <span>Multiple languages supported</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                        <Check className="w-4 h-4 text-purple-600" />
                      </div>
                      <span>Hook + Body + CTA structure</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                        <Check className="w-4 h-4 text-purple-600" />
                      </div>
                      <span>Save & edit your scripts</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* CTA Section */}
            <div className="mt-8 text-center">
              <p className="text-muted-foreground mb-4">
                Join thousands of content creators who have transformed their video scripts with AI
              </p>
              <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="ml-2">Trusted by 10,000+ creators</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScriptGeneratorPricing;