import { Sparkles, Check, Star, Users, Shield, Zap } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { authAPI } from "@/api/api-methods";
import Cookies from "js-cookie";
import subscriptionPlans from "@/data/subscriptionPlans";

interface IntroductionHeroProps {
  onGetStarted: () => void;
}

export const IntroductionHero = ({ onGetStarted }: IntroductionHeroProps) => {
  const { toast } = useToast();
  const { currentUser, updateAuthState } = useAuth();
  const navigate = useNavigate();
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

  const handlePlanSelect = async (plan: any) => {
    try {
      setLoadingPlanId(plan.id);
      
      const planId = plan.apiPlanId || plan.id;
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

      if (!res.ok) {
        console.error('Failed to create order', res.status, res.statusText);
        toast({
          title: 'Payment Initialization Failed',
          description: res.status === 404 ? 'Payment endpoint not found on the server. Please contact support or try again later.' : 'Failed to initialize payment. Please try again later.',
          variant: 'destructive'
        });
        return;
      }

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
        toast({
          title: 'Payment Error',
          description: 'Could not load payment gateway. Please try again later.',
          variant: 'destructive'
        });
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
          console.log('Payment successful', response);
          
          try {
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
              if (completeData.data?.user) {
                Cookies.set('userData', JSON.stringify(completeData.data.user), { expires: 7 });
                updateAuthState();
              }
              
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
      toast({
        title: 'Payment Error',
        description: 'An error occurred while initiating payment. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoadingPlanId(null); // Ensure loading state is cleared
    }
  };
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
          {currentUser && currentUser.isProUser ? (
            <div className="max-w-3xl mx-auto">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-center">You are on a paid plan</CardTitle>
                  <CardDescription className="text-center">{`Plan: ${currentUser.subscriptionType?.toUpperCase() || 'PRO'}`}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="mb-2">Your subscription is valid until:</p>
                  <p className="font-medium mb-4">{currentUser.subscriptionEndDate ? new Date(currentUser.subscriptionEndDate).toLocaleDateString() : 'N/A'}</p>
                  <div className="flex justify-center gap-4">
                    <Button onClick={() => navigate('/profile')}>Manage</Button>
                    <Button onClick={() => navigate('/pricing?show=upgrade')} className="bg-gradient-to-r from-primary to-blue-500 text-white">Upgrade</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
              {subscriptionPlans.filter(p => p.id !== 'free').map((plan, index) => (
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
                      onClick={() => handlePlanSelect(plan)}
                      disabled={loadingPlanId === plan.id}
                    >
                      {loadingPlanId === plan.id ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        plan.badge === 'Try Free' ? 'Start Free Trial' : 'Choose Plan'
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
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