import React, { useState } from 'react';
import { Check, Star, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '@/api/api-methods';
import Cookies from 'js-cookie';
import subscriptionPlans from '@/data/subscriptionPlans';

const PricingPage = () => {
  const { toast } = useToast();
  const { currentUser, updateAuthState } = useAuth();
  const navigate = useNavigate();
  const pricingPlans = subscriptionPlans;
  const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);

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
      setLoadingPlanId(planId);
      
      // Call backend to create an order
      const apiBase = import.meta.env.VITE_API_BASE_URL || '';
      // If plan requires sales contact (enterprise), go to Contact page instead of trying to process via payment SDK
      if (planId === 'enterprise') {
        toast({
          title: 'Contact Sales',
          description: 'For Enterprise/Annual plans, please contact our sales team for a custom quote.',
        });
        navigate('/contact');
        return;
      }

      // Free trial: direct the user to signup (no payment required)
      if (planId === 'free') {
        toast({
          title: 'Free Trial',
          description: 'Start your free trial by creating an account. No payment needed.',
        });
        navigate('/signup');
        return;
      }

      const res = await fetch(`${apiBase}/api/payments/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId })
      });

      // Ensure we got a valid 2xx response — otherwise show a helpful message
      if (!res.ok) {
        console.error('Failed to create order', res.status, res.statusText);
        // 404 likely means that the backend route is not available or the API base URL is wrong
        toast({
          title: 'Payment Initialization Failed',
          description: res.status === 404 ? 'Payment endpoint not found on the server. Please contact support or try again later.' : 'Failed to initialize payment. Please try again later.',
          variant: 'destructive'
        });
        return;
      }

      // Check content type, avoid parsing HTML error pages as JSON
      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        const text = await res.text();
        console.error('Unexpected response (not JSON):', text.substring(0, 400));
        toast({
          title: 'Payment Error',
          description: 'Unexpected server response while initializing payment. Please try again later.',
          variant: 'destructive'
        });
        return;
      }

      const data = await res.json();
      if (!data || !data.success) {
        console.error('Failed to create order', data);
        toast({
          title: 'Payment Error',
          description: data?.message || 'Failed to initialize payment. Please try again later.',
          variant: 'destructive'
        });
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
            // Ensure we got valid JSON and a 2xx response
            if (!completeRes.ok) {
              console.error('Failed to complete subscription', completeRes.status, completeRes.statusText);
              toast({
                title: 'Subscription Update Failed',
                description: 'Payment succeeded but updating the subscription failed. Contact support if you continue to see this.',
                variant: 'destructive'
              });
              return;
            }

            const completeContentType = completeRes.headers.get('content-type') || '';
            if (!completeContentType.includes('application/json')) {
              const txt = await completeRes.text();
              console.error('Unexpected complete-subscription response (not JSON):', txt.substring(0, 400));
              toast({
                title: 'Subscription Update Failed',
                description: 'Unexpected response from server. Please contact support.',
                variant: 'destructive'
              });
              return;
            }

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
      setLoadingPlanId(null); // Clear loading state when Razorpay opens
    } catch (err) {
      console.error('Error in handlePlanSelect', err);
      alert('An error occurred while initiating payment.');
    } finally {
      setLoadingPlanId(null); // Ensure loading state is cleared
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
                      <Star className="w-6 h-6" />
                    </div>
                  </div>
                  
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {plan.description}
                  </CardDescription>
                  
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.duration}</span>
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
                  {plan.limitations && plan.limitations.length > 0 && (
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
                    variant={plan.popular ? 'default' : 'outline'}
                    className={`w-full mt-8 ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-primary to-blue-500 text-white hover:from-primary/90 hover:to-blue-500/90' 
                        : ''
                    }`}
                    onClick={() => handlePlanSelect(plan.apiPlanId || plan.id)}
                    disabled={loadingPlanId === (plan.apiPlanId || plan.id)}
                  >
                    {loadingPlanId === (plan.apiPlanId || plan.id) ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      plan.id === 'free' ? 'Start Free Trial' : plan.apiPlanId === 'enterprise' ? 'Contact Sales' : 'Choose Plan'
                    )}
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