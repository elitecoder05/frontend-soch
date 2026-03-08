import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Loader2, Crown, Sparkles, Zap, ShieldCheck, Infinity as InfinityIcon, Star } from 'lucide-react';
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
  const [planType, setPlanType] = useState<'individual' | 'team'>('individual');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

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

  // Display prices in USD - no conversion needed
  const getDisplayPrice = (plan: any) => {
    return plan.price || '$0';
  };
  
  const getOriginalPrice = (plan: any) => {
    if (plan.launchPrice) {
      return plan.launchPrice;
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
      setDynamicPlans({
        store: subscriptionPlans,
        scriptGenerator: scriptGeneratorPlans
      });
    } finally {
      setIsLoadingPlans(false);
    }
  };

  useEffect(() => {
    loadPricingPlans();
  }, []);

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

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans overflow-x-hidden">
      {/* Background with subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900/10 to-gray-900"></div>
      
      <div className="relative z-10">
        <Navbar />
        
        {/* Main Content */}
        <div className="px-4 py-8 md:py-16 max-w-md mx-auto">
          
          {/* Header Banner */}
          <div className="mb-8 text-center">
            <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-2xl p-4 mb-6">
              <div className="text-purple-300 text-sm font-semibold mb-2 uppercase tracking-wide">
                Unlimited & Kling 3.0
              </div>
              <div className="text-white text-lg font-bold mb-1">
                FREE GENS WITH 20% OFF
              </div>
              <div className="text-gray-300 text-sm">
                Get Nano Banana 2 Unlimited on Creator plan for 7 days
              </div>
              <div className="text-gray-300 text-sm">
                with Special 20% discount
              </div>
            </div>
          </div>

          {/* Pick Your Plan */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-4">
              PICK YOUR PLAN
            </h1>
            <p className="text-gray-400 text-lg">
              Scale your creativity with higher access
            </p>
          </div>

          {/* Plan Type Toggle */}
          <div className="flex bg-gray-800/50 rounded-xl p-1 mb-6">
            <button
              onClick={() => setPlanType('individual')}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                planType === 'individual'
                  ? 'bg-white text-gray-900'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Individual
            </button>
            <button
              onClick={() => setPlanType('team')}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 relative ${
                planType === 'team'
                  ? 'bg-white text-gray-900'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Team
              <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                New
              </span>
            </button>
          </div>

          {/* Billing Cycle Toggle */}
          <div className="flex bg-gray-800/50 rounded-xl p-1 mb-8">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                billingCycle === 'monthly'
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 relative ${
                billingCycle === 'annual'
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Annual
              <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                20% OFF
              </span>
            </button>
          </div>

          {/* Best Value Badge */}
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-pink-500 to-red-500 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
              <Star className="w-4 h-4 fill-current" />
              BEST VALUE
            </div>
          </div>

          {/* Creator Plan Card */}
          <div className="bg-gradient-to-br from-gray-800/80 to-purple-900/20 border border-gray-700/50 rounded-2xl p-6 mb-6">
            {/* Plan Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold text-white mb-1">Creator</h3>
                <p className="text-gray-400 text-sm">For experts scaling production to the max</p>
              </div>
              <div className="bg-pink-500/20 text-pink-400 px-3 py-1 rounded-lg text-sm font-bold">
                20% OFF
              </div>
            </div>

            {/* Pricing */}
            <div className="mb-6">
              <div className="flex items-end gap-2 mb-2">
                <span className="text-gray-500 line-through text-lg">$249</span>
                <span className="text-4xl font-bold text-white">$199</span>
                <span className="text-gray-400 mb-1">/month</span>
              </div>
              <p className="text-gray-400 text-sm mb-3">Billed for 12 months</p>
              <div className="flex items-center gap-2 text-pink-400 text-sm">
                <span>💰 Save $612</span>
                <span className="text-gray-400">compared to monthly</span>
              </div>
            </div>

            {/* Features */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <span className="text-white font-semibold">6,000 credits/mo.</span>
                <span className="bg-purple-600/80 text-xs px-2 py-1 rounded text-white font-bold">
                  x5 OF ULTIMATE
                </span>
              </div>
              <div className="space-y-2 text-gray-300 text-sm">
                <div>= 3000 Nano Banana Pro Generations</div>
                <div>~ 600 Kling 3.0 videos</div>
              </div>
            </div>

            {/* CTA Button */}
            <Button 
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-4 rounded-xl text-lg transition-all duration-200"
              onClick={() => currentScriptPlans[0] && handlePlanSelect(currentScriptPlans[0].planId || currentScriptPlans[0].id)}
              disabled={loadingPlanId !== null}
            >
              {loadingPlanId ? (
                <Loader2 className="w-5 h-5 animate-spin mx-auto" />
              ) : (
                'Get Creator Plan'
              )}
            </Button>
          </div>

          {/* Trust Line */}
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              Used by thousands of creators to create scripts
            </p>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default PricingPage;