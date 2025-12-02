import React from 'react';
import { Check, Star, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { authAPI } from '@/api/api-methods';
import Cookies from 'js-cookie';

const PricingPage = () => {
  const { toast } = useToast();
  const { currentUser, updateAuthState } = useAuth();
  const pricingPlans = [
    {
      id: 'free',
      name: 'Free',
      price: '$0',
      period: '/month',
      description: 'Perfect for exploring and getting started',
      features: [
        'Browse unlimited AI models',
        'View model details and documentation', 
        'Access basic model information',
        'Community support',
        'Basic search and filtering'
      ],
      limitations: [
        'No model uploads',
        'Limited API access',
        'No priority support'
      ],
      buttonText: 'Get Started',
      buttonVariant: 'outline' as const,
      popular: false,
      icon: Star
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$19',
      period: '/month',
      description: 'Ideal for developers and content creators',
      features: [
        'Everything in Free plan',
        'Upload your own AI models',
        'Priority model review',
        'Enhanced model analytics',
        'API access tokens',
        'Priority email support',
        'Advanced search filters',
        'Custom model categories'
      ],
      limitations: [],
      buttonText: 'Start Pro Trial',
      buttonVariant: 'default' as const,
      popular: true,
      icon: Zap
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: '$99',
      period: '/month',
      description: 'For teams and organizations',
      features: [
        'Everything in Pro plan',
        'Unlimited model uploads',
        'White-label solutions',
        'Custom integrations',
        'Dedicated account manager',
        '24/7 phone support',
        'Advanced analytics dashboard',
        'Team collaboration tools',
        'Custom branding',
        'SLA guarantee'
      ],
      limitations: [],
      buttonText: 'Contact Sales',
      buttonVariant: 'outline' as const,
      popular: false,
      icon: Star
    }
  ];

  const loadRazorpayScript = () => {
    return new Promise<boolean>((resolve) => {
      if ((window as any).Razorpay) return resolve(true);
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePlanSelect = async (planId: string) => {
    try {
      // Call backend to create an order
      const apiBase = import.meta.env.VITE_API_BASE_URL || '';
      const res = await fetch(`${apiBase}/api/payments/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId })
      });

      const data = await res.json();
      if (!data || !data.success) {
        console.error('Failed to create order', data);
        alert('Failed to initialize payment. Please try again later.');
        return;
      }

      const { order, key_id } = data;

      const loaded = await loadRazorpayScript();
      if (!loaded) {
        alert('Could not load Razorpay SDK.');
        return;
      }

      const options = {
        key: key_id || import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'SochAI',
        description: `${planId} subscription`,
        order_id: order.id,
        handler: async function (response: any) {
          // Payment successful — response contains razorpay_payment_id, razorpay_order_id, razorpay_signature
          console.log('Payment successful', response);
          
            try {
            // Call backend to complete subscription
            const token = authAPI.getToken();
            if (!token) {
              throw new Error('Authentication required');
            }
            
            const completeRes = await fetch(`${apiBase}/api/payments/complete-subscription`, {
              method: 'POST',
              headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({ 
                planId,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature
              })
            });
            
            const completeData = await completeRes.json();
            if (completeData.success) {
              // Update user cookie and auth state with new user data
              if (completeData.data?.user) {
                Cookies.set('userData', JSON.stringify(completeData.data.user), { expires: 7 });
                updateAuthState();
              }
              
              // Show green success toast
              toast({
                title: "✅ Successfully Subscribed!",
                description: `You are now subscribed to the ${planId.toUpperCase()} plan. Enjoy all the premium features!`,
                variant: "default",
                className: "bg-green-50 border-green-200 text-green-800"
              });
            } else {
              throw new Error(completeData.message || 'Failed to complete subscription');
            }
          } catch (error: any) {
            console.error('Error completing subscription:', error);
            toast({
              title: "⚠️ Payment Successful, Subscription Pending",
              description: "Payment was successful but there was an issue updating your subscription. Please contact support.",
              variant: "destructive"
            });
          }
        },
        modal: {
          ondismiss: function () {
            console.log('Checkout closed');
          }
        },
        prefill: {
          name: '',
          email: ''
        },
        theme: {
          color: '#0ea5a0'
        }
      } as any;

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error('Error in handlePlanSelect', err);
      alert('An error occurred while initiating payment.');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Choose Your Perfect Plan
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Whether you're exploring AI models or building the next big thing, we have a plan that fits your needs.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {pricingPlans.map((plan) => {
            const IconComponent = plan.icon;
            
            return (
              <Card 
                key={plan.id} 
                className={`relative overflow-hidden transition-all duration-300 hover:shadow-2xl ${
                  plan.popular ? 'border-primary shadow-xl scale-105' : 'hover:scale-105'
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-primary to-blue-500 text-white text-center py-2 text-sm font-medium">
                    Most Popular
                  </div>
                )}
                
                <CardHeader className={`text-center ${plan.popular ? 'pt-12' : ''}`}>
                  <div className="flex justify-center mb-4">
                    <div className={`p-3 rounded-full ${
                      plan.popular ? 'bg-primary text-white' : 'bg-muted'
                    }`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                  </div>
                  
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {plan.description}
                  </CardDescription>
                  
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Features */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                      Included Features
                    </h4>
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Limitations (for free plan) */}
                  {plan.limitations.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                        Limitations
                      </h4>
                      <ul className="space-y-2">
                        {plan.limitations.map((limitation, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <div className="w-4 h-4 border border-muted-foreground rounded-full mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-muted-foreground">{limitation}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Button */}
                  <Button
                    variant={plan.buttonVariant}
                    className={`w-full mt-8 ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-primary to-blue-500 text-white hover:from-primary/90 hover:to-blue-500/90' 
                        : ''
                    }`}
                    onClick={() => handlePlanSelect(plan.id)}
                  >
                    {plan.buttonText}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* FAQ or Additional Info */}
        <div className="mt-16 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div className="space-y-3">
                <h3 className="font-semibold">Can I upgrade or downgrade anytime?</h3>
                <p className="text-sm text-muted-foreground">
                  Yes! You can change your plan at any time. Changes take effect immediately and we'll prorate any charges.
                </p>
              </div>
              
              <div className="space-y-3">
                <h3 className="font-semibold">What payment methods do you accept?</h3>
                <p className="text-sm text-muted-foreground">
                  We accept all major credit cards, PayPal, and bank transfers for enterprise customers.
                </p>
              </div>
              
              <div className="space-y-3">
                <h3 className="font-semibold">Is there a free trial for Pro plan?</h3>
                <p className="text-sm text-muted-foreground">
                  Yes! We offer a 14-day free trial for the Pro plan. No credit card required to start.
                </p>
              </div>
              
              <div className="space-y-3">
                <h3 className="font-semibold">Do you offer refunds?</h3>
                <p className="text-sm text-muted-foreground">
                  We offer a 30-day money-back guarantee for all paid plans if you're not satisfied.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PricingPage;