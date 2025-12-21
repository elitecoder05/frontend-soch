import React, { useState } from 'react';
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
import api from '@/lib/api'; // Ensure this points to your axios instance
import { subscriptionPlans } from '@/data/subscriptionPlans'; 

const PricingPage = () => {
  const { toast } = useToast();
  const { currentUser, updateAuthState } = useAuth();
  const navigate = useNavigate();
  const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);

  // --- Payment Logic ---
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

      // 1. Login Check
      if (!currentUser) {
        toast({ title: "Login Required", description: "Please create an account to subscribe.", variant: "default" });
        navigate('/signup');
        return;
      }

      // 2. Create Subscription Order (Backend)
      // ✅ Endpoint must match backend app.use('/api/payments', ...)
      const res = await api.post('/payments/create-order', { planId });
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
        key: key_id || import.meta.env.VITE_RAZORPAY_KEY_ID, // Uses backend key or env fallback
        amount: order.amount,
        currency: order.currency,
        name: 'SochAI Store',
        description: `Subscription: ${planId}`,
        order_id: order.id,
        handler: async function (response: any) {
          try {
            toast({ title: "Processing...", description: "Verifying your subscription status." });

            // 5. Verify & Activate Subscription (Backend)
            const completeRes = await api.post('/payments/complete-subscription', {
              planId,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature
            });

            const completeData = completeRes.data;

            if (completeData.success) {
              // Update local session
              if (completeData.data?.user) {
                Cookies.set('userData', JSON.stringify(completeData.data.user), { expires: 7 });
                await updateAuthState(); // Refresh context
              }
              
              toast({
                title: "🎉 Welcome to Pro!",
                description: "Your subscription is now active.",
                className: "bg-green-50 border-green-200 text-green-900"
              });
              
              navigate('/profile'); // Redirect to profile
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
        theme: { color: '#7c3aed' } // Purple theme
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
    // Default purple style for consistency
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
    <div className="min-h-screen bg-background font-sans">
      <Navbar />
      
      <main className="container mx-auto px-4 py-24">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">
             Choose Your <span className="text-primary">Power</span>
          </h1>
          <p className="text-lg text-muted-foreground">
             Unlock unlimited uploads and premium features.
          </p>
        </div>

        {/* --- ACTIVE PLAN CARD --- */}
        {currentUser && currentUser.isProUser && (
          <Card className="max-w-2xl mx-auto mb-16 border-primary shadow-lg bg-gradient-to-br from-background to-primary/5">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
                <Crown className="w-6 h-6" />
              </div>
              <CardTitle className="text-2xl">Active Subscription</CardTitle>
              <CardDescription className="text-lg font-medium text-primary uppercase tracking-widest">
                {currentUser.subscriptionType || 'PRO'} PLAN
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center pb-6">
               <p className="text-muted-foreground mb-1">Valid Until</p>
               <p className="text-2xl font-bold font-mono">
                 {currentUser.subscriptionEndDate 
                   ? new Date(currentUser.subscriptionEndDate).toLocaleDateString(undefined, { dateStyle: 'medium' }) 
                   : 'Forever'}
               </p>
            </CardContent>
            <CardFooter className="flex justify-center border-t bg-muted/20 py-4">
               <Button variant="outline" onClick={() => navigate('/contact')}>Need Help?</Button>
            </CardFooter>
          </Card>
        )}

        {/* --- PRICING GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-stretch max-w-7xl mx-auto">
          {subscriptionPlans.map((plan) => {
            const styles = getPlanStyles(plan.color, plan.popular || false);
            const isPopular = plan.popular;
            
            return (
              <Card 
                key={plan.id} 
                className={`
                  relative flex flex-col h-full transition-all duration-300 hover:shadow-xl
                  ${isPopular ? `border-2 ${styles.border} shadow-lg z-10` : 'border border-border'}
                `}
              >
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
                  <CardDescription className="text-sm mt-2 min-h-[40px]">
                    {plan.description}
                  </CardDescription>
                  
                  <div className="mt-4 flex items-end justify-center gap-1">
                    <span className="text-3xl font-extrabold">{plan.price}</span>
                    <span className="text-muted-foreground text-sm mb-1">/{plan.duration.replace('per ', '')}</span>
                  </div>
                </CardHeader>

                <CardContent className="flex-1">
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3 text-sm text-muted-foreground text-left">
                        <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" strokeWidth={3} />
                        <span className="leading-snug">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter className="pt-4 pb-6">
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
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PricingPage;