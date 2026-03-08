import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Loader2, Crown, Sparkles, Zap, ShieldCheck, Infinity as InfinityIcon } from 'lucide-react';
import Cookies from 'js-cookie';

// Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

// Hooks & Context
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

// API & Data
import api from '@/lib/api'; 
import { subscriptionPlans, scriptGeneratorPlans } from '@/data/subscriptionPlans';
import { pricingAPI } from '@/api/api-methods'; 

const PricingPage = () => {
  const { toast } = useToast();
  const { currentUser, updateAuthState } = useAuth();
  const navigate = useNavigate();
  const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);
  const [dynamicPlans, setDynamicPlans] = useState<{ store: any[]; scriptGenerator: any[] } | null>(null);
  const [isLoadingPlans, setIsLoadingPlans] = useState(true);

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

  // Currency conversion for Indian users
  const USD_TO_INR_RATE = 83;
  
  const convertUSDPriceToINR = (usdPriceString: string) => {
    // Extract number from price string like "$4" or "$5"
    const numericValue = parseFloat(usdPriceString.replace('$', ''));
    const inrValue = Math.round(numericValue * USD_TO_INR_RATE);
    return `₹${inrValue}`;
  };
  
  const getDisplayPrice = (plan: any) => {
    if (plan.launchPrice) {
      return convertUSDPriceToINR(plan.launchPrice);
    }
    return convertUSDPriceToINR(plan.price);
  };
  
  const getOriginalPrice = (plan: any) => {
    if (plan.launchPrice) {
      return convertUSDPriceToINR(plan.price);
    }
    return null;
  };

  // Load dynamic pricing plans
  const loadPricingPlans = async () => {
    try {
      setIsLoadingPlans(true);
      const response = await pricingAPI.getAllPlans();
      if (response.success) {
        setDynamicPlans(response.data.categories);
      }
    } catch (error) {
      console.warn('Failed to load dynamic pricing, using static fallback:', error);
      // Fallback to static data
      setDynamicPlans({
        store: subscriptionPlans,
        scriptGenerator: scriptGeneratorPlans
      });
    } finally {
      setIsLoadingPlans(false);
    }
  };

  // Load plans on mount
  useEffect(() => {
    loadPricingPlans();
  }, []);

  // Get current plans to display (dynamic or fallback)
  const currentStorePlans = dynamicPlans?.store || subscriptionPlans;
  const currentScriptPlans = dynamicPlans?.scriptGenerator || scriptGeneratorPlans;

  const handlePlanSelect = async (planId: string) => {
    try {
      setLoadingPlanId(planId);

      // 1. Login Check
      if (!currentUser) {
        toast({ title: "Login Required", description: "Please create an account to subscribe.", variant: "default" });
        navigate('/signup');
        return;
      }

      // 2. Create Subscription Order
      const res = await api.post('/api/payments/create-order', { planId });
      const data = res.data;

      if (!data || !data.success) throw new Error(data?.message || 'Failed to initialize payment');

      const { order, key_id } = data;

      // 3. Load SDK
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        alert('Could not load Razorpay SDK. Check your internet.');
        return;
      }

      // 4. Open Razorpay
      const options = {
        key: key_id || import.meta.env.VITE_RAZORPAY_KEY_ID, 
        amount: order.amount,
        currency: order.currency,
        name: 'SochAI Store',
        description: `Subscription: ${planId}`,
        order_id: order.id,
        handler: async function (response: any) {
          try {
            toast({ title: "Processing...", description: "Verifying your subscription status." });

            const completeRes = await api.post('/api/payments/complete-subscription', {
              planId,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature
            });

            const completeData = completeRes.data;

            if (completeData.success) {
              if (completeData.data?.user) {
                Cookies.set('userData', JSON.stringify(completeData.data.user), { expires: 7 });
                await updateAuthState(); 
              }
              
              toast({
                title: "🎉 Welcome to Pro!",
                description: "Your subscription is now active.",
                className: "bg-green-50 border-green-200 text-green-900"
              });
              
              navigate('/profile'); 
            } else {
              throw new Error(completeData.message);
            }
          } catch (error: any) {
            console.error(error);
            toast({
              title: "Activation Failed",
              description: "Payment successful but account update failed. Contact support.",
              variant: "destructive"
            });
          }
        },
        prefill: {
          name: `${currentUser.firstName} ${currentUser.lastName}`,
          email: currentUser.email,
          contact: currentUser.mobileNumber
        },
        theme: { color: '#7c3aed' } 
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
      
    } catch (err: any) {
      console.error(err);
      toast({
        title: 'Error',
        description: err.response?.data?.message || 'Something went wrong.',
        variant: 'destructive'
      });
    } finally {
      setLoadingPlanId(null); 
    }
  };

  // --- Styles Helper ---
  const getPlanStyles = (color: string | undefined, isPopular: boolean) => {
    return { 
        border: 'border-primary/50', 
        bg: 'bg-primary/5', 
        text: 'text-primary', 
        badge: 'bg-primary', 
        btn: 'hover:bg-primary hover:text-white' 
    };
  };

  const getPlanIcon = (id: string) => {
    if (id === 'lifetime') return <InfinityIcon className="w-6 h-6" />;
    if (id === 'annual') return <ShieldCheck className="w-6 h-6" />;
    if (id === 'six_months') return <Sparkles className="w-6 h-6" />;
    return <Zap className="w-6 h-6" />;
  };

  return (
    <div className="min-h-screen bg-background font-sans flex flex-col overflow-x-hidden">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-10 md:py-24 pb-24 md:pb-24">
        
        <div className="mb-8 md:mb-12 text-center max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight">
             Choose Your <span className="text-primary">Power</span>
          </h1>
          <p className="text-base md:text-lg text-muted-foreground px-4">
             Unlock unlimited uploads and premium features.
          </p>
        </div>

        {/* --- SOCH AI APPS SECTION --- */}
        <div className="mb-20 max-w-4xl mx-auto">
          {/* Optional Launch Offer Banner */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-full text-orange-600 font-medium text-sm">
              <Sparkles className="w-4 h-4" />
              Launch Offer – $4/month
            </div>
          </div>

          {/* Header Section */}
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              Soch AI Apps
            </h2>
            <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-4">
              Soch AI Script Generator
            </h3>
            <div className="max-w-2xl mx-auto">
              <h4 className="text-lg font-semibold text-foreground mb-2">Pick Your Plan</h4>
              <p className="text-muted-foreground">
                Create viral video scripts in seconds with Soch AI Script Generator
              </p>
            </div>
          </div>

          {/* Simple Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-8">
            {isLoadingPlans ? (
              // Loading skeleton
              [1, 2].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader className="text-center pt-6">
                    <div className="h-6 bg-muted rounded mb-4"></div>
                    <div className="h-10 bg-muted rounded"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[1, 2, 3, 4].map((j) => <div key={j} className="h-4 bg-muted rounded"></div>)}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className="h-10 bg-muted rounded w-full"></div>
                  </CardFooter>
                </Card>
              ))
            ) : (
              currentScriptPlans.map((plan) => (
              <Card 
                key={plan.id} 
                className={`
                  relative transition-all duration-300 hover:shadow-lg
                  ${plan.popular ? 'border-2 border-primary shadow-md ring-1 ring-primary/20' : 'border border-border'}
                `}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary hover:bg-primary/90 text-white px-3 py-1 text-xs">
                      {plan.badge}
                    </Badge>
                  </div>
                )}

                {plan.description && (
                  <div className="text-center pt-6 pb-2">
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                  </div>
                )}

                <CardHeader className={`text-center ${plan.badge ? 'pt-4' : 'pt-6'}`}>
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <div className="flex items-end justify-center gap-1">
                      <span className="text-4xl font-bold">{getDisplayPrice(plan)}</span>
                      <span className="text-muted-foreground text-sm mb-1">/{plan.duration}</span>
                    </div>
                    {plan.launchPrice && getOriginalPrice(plan) && (
                      <div className="text-center mt-1">
                        <span className="text-muted-foreground line-through text-sm">{getOriginalPrice(plan)}</span>
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3 text-sm">
                        <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" strokeWidth={3} />
                        <span className="text-muted-foreground leading-snug">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter className="pt-4 pb-6">
                  <Button
                    variant={plan.popular ? 'default' : 'outline'}
                    className="w-full font-semibold"
                    onClick={() => handlePlanSelect(plan.id)}
                    disabled={loadingPlanId === plan.id}
                  >
                    {loadingPlanId === plan.id ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      plan.buttonText
                    )}
                  </Button>
                </CardFooter>
              </Card>
            ))
            )}
          </div>

          {/* Trust Line */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Used by thousands of creators to create scripts
            </p>
          </div>
        </div>

        {/* --- STORE PRICING SECTION --- */}
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Store Listing Plans
            </h2>
            <p className="text-muted-foreground">
              Get your AI tool discovered by thousands of users
            </p>
          </div>

        {/* --- ACTIVE PLAN CARD --- */}
        {currentUser && currentUser.isProUser && (
          <Card className="max-w-xl mx-auto mb-12 md:mb-16 border-primary shadow-lg bg-gradient-to-br from-background to-primary/5">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
                <Crown className="w-6 h-6" />
              </div>
              <CardTitle className="text-xl md:text-2xl">Active Subscription</CardTitle>
              <CardDescription className="text-base md:text-lg font-medium text-primary uppercase tracking-widest">
                {currentUser.subscriptionType || 'PRO'} PLAN
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center pb-6">
               <p className="text-muted-foreground mb-1 text-sm">Valid Until</p>
               <p className="text-xl md:text-2xl font-bold font-mono">
                 {currentUser.subscriptionEndDate 
                   ? new Date(currentUser.subscriptionEndDate).toLocaleDateString(undefined, { dateStyle: 'medium' }) 
                   : 'Forever'}
               </p>
            </CardContent>
            <CardFooter className="flex justify-center border-t bg-muted/20 py-4">
               <Button variant="outline" size="sm" onClick={() => navigate('/contact')}>Need Help?</Button>
            </CardFooter>
          </Card>
        )}

        {/* --- PRICING GRID --- */}
        {/* Responsive Grid: 1 col (Mobile), 2 cols (Tablet), 4 cols (Desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch max-w-7xl mx-auto">
          {isLoadingPlans ? (
            // Loading skeleton for store plans
            [1, 2, 3, 4].map((i) => (
              <Card key={i} className="animate-pulse flex flex-col">
                <CardHeader className="text-center pt-6">
                  <div className="h-6 bg-muted rounded mb-4"></div>
                  <div className="h-4 bg-muted rounded mb-4"></div>
                  <div className="h-8 bg-muted rounded"></div>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="space-y-3">
                    {[1, 2, 3, 4].map((j) => <div key={j} className="h-4 bg-muted rounded"></div>)}
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="h-10 bg-muted rounded w-full"></div>
                </CardFooter>
              </Card>
            ))
          ) : (
            currentStorePlans.map((plan) => {
            const styles = getPlanStyles(plan.color, plan.popular || false);
            const isPopular = plan.popular;
            
            return (
              <Card 
                key={plan.id} 
                className={`
                  relative flex flex-col h-full transition-all duration-300
                  ${isPopular 
                    ? `border-2 ${styles.border} shadow-md` // ✅ UNIFORM SIZE: No scaling, just specific border
                    : 'border border-border hover:border-primary/30'
                  }
                  hover:shadow-xl
                `}
              >
                {/* Badge differentiates Popular Plan */}
                {plan.badge && (
                  <div className="absolute -top-3 left-0 right-0 flex justify-center">
                    <Badge className={`${styles.badge} px-3 py-1 text-xs shadow-md`}>
                      {plan.badge}
                    </Badge>
                  </div>
                )}

                <CardHeader className={`text-center ${plan.badge ? 'pt-8' : 'pt-6'}`}>
                  <div className={`mx-auto w-12 h-12 rounded-xl ${styles.bg} ${styles.text} flex items-center justify-center mb-4`}>
                    {getPlanIcon(plan.id)}
                  </div>
                  
                  <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
                  <CardDescription className="text-sm mt-2 min-h-[40px] flex items-center justify-center">
                    {plan.description}
                  </CardDescription>
                  
                  <div className="mt-4 flex items-end justify-center gap-1">
                    <span className="text-3xl font-extrabold">{getDisplayPrice(plan)}</span>
                    <span className="text-muted-foreground text-sm mb-1">/{plan.duration.replace('per ', '')}</span>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 px-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3 text-sm text-muted-foreground text-left">
                        <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" strokeWidth={3} />
                        <span className="leading-snug">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter className="pt-4 pb-6 px-6">
                  <Button
                    variant={isPopular ? 'default' : 'outline'}
                    className={`w-full font-semibold transition-all ${isPopular ? '' : styles.btn}`}
                    onClick={() => handlePlanSelect(plan.id)}
                    disabled={loadingPlanId === plan.id}
                  >
                    {loadingPlanId === plan.id ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      'Choose Plan'
                    )}
                  </Button>
                </CardFooter>
              </Card>
            );
          })
          )}
        </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PricingPage;