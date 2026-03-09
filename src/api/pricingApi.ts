// API methods for pricing and payments
import { api } from './index';

export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  duration: string;
  description: string;
  features: string[];
  popular: boolean;
  badge?: string;
  color?: string;
  buttonText?: string;
  trustLine?: string;
  launchOffer?: string;
}

export interface PaymentOrder {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
  displayAmount: string;
  actualCurrency: string;
  actualAmount: string;
}

export interface SubscriptionStatus {
  scriptGenerator: {
    planId?: string;
    status: string;
    startDate?: string;
    endDate?: string;
    isUnlimited?: boolean;
    usageCount?: number;
  };
  store: {
    planId?: string;
    status: string;
    startDate?: string;
    endDate?: string;
    listingType?: string;
  };
}

// Get pricing plans by category
export const getPricingPlans = async (category: 'store' | 'script-generator'): Promise<PricingPlan[]> => {
  try {
    const response = await api.get(`/payments/plans/${category}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching pricing plans:', error);
    throw error;
  }
};

// Create payment order
export const createPaymentOrder = async (planId: string, category: 'store' | 'script-generator'): Promise<PaymentOrder> => {
  try {
    const response = await api.post('/payments/create-order', {
      planId,
      category
    });
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to create payment order');
    }

    return {
      orderId: response.data.order.id,
      amount: response.data.order.amount,
      currency: response.data.order.currency,
      keyId: response.data.key_id,
      displayAmount: response.data.displayAmount,
      actualCurrency: response.data.actualCurrency,
      actualAmount: response.data.actualAmount
    };
  } catch (error) {
    console.error('Error creating payment order:', error);
    throw error;
  }
};

// Verify payment and activate subscription
export const verifyPayment = async (
  paymentData: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
    planId: string;
    category: 'store' | 'script-generator';
  }
) => {
  try {
    const response = await api.post('/payments/verify-payment', paymentData);
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Payment verification failed');
    }

    return response.data;
  } catch (error) {
    console.error('Error verifying payment:', error);
    throw error;
  }
};

// Get user subscription status
export const getSubscriptionStatus = async (): Promise<SubscriptionStatus> => {
  try {
    const response = await api.get('/payments/subscription-status');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching subscription status:', error);
    throw error;
  }
};

// Helper function to load Razorpay script
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const existingScript = document.getElementById('razorpay-script');
    
    if (existingScript) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.id = 'razorpay-script';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    
    document.body.appendChild(script);
  });
};

// Helper function to initiate Razorpay payment
export const initiateRazorpayPayment = async (
  orderData: PaymentOrder,
  plan: PricingPlan,
  category: 'store' | 'script-generator',
  userDetails?: { name?: string; email?: string; phone?: string }
): Promise<{ success: boolean; data?: any; error?: string }> => {
  
  const isScriptLoaded = await loadRazorpayScript();
  
  if (!isScriptLoaded) {
    return { success: false, error: 'Failed to load payment gateway' };
  }

  return new Promise((resolve) => {
    const options = {
      key: orderData.keyId,
      amount: orderData.amount,
      currency: orderData.currency,
      name: 'Soch AI',
      description: `${plan.name} - ${category === 'script-generator' ? 'Script Generator' : 'Store Listing'}`,
      order_id: orderData.orderId,
      prefill: {
        name: userDetails?.name || '',
        email: userDetails?.email || '',
        contact: userDetails?.phone || '',
      },
      notes: {
        category: category,
        planId: plan.id,
      },
      theme: {
        color: '#6366f1',
      },
      handler: async function (response: any) {
        try {
          const verificationResult = await verifyPayment({
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
            planId: plan.id,
            category: category,
          });
          
          resolve({ success: true, data: verificationResult });
        } catch (error) {
          resolve({ success: false, error: 'Payment verification failed' });
        }
      },
      modal: {
        ondismiss: function () {
          resolve({ success: false, error: 'Payment cancelled by user' });
        },
      },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  });
};

// Helper function to handle complete payment flow
export const handlePaymentFlow = async (
  planId: string,
  category: 'store' | 'script-generator',
  userDetails?: { name?: string; email?: string; phone?: string }
) => {
  try {
    // 1. Get plan details
    const plans = await getPricingPlans(category);
    const selectedPlan = plans.find(p => p.id === planId);
    
    if (!selectedPlan) {
      throw new Error('Selected plan not found');
    }

    // 2. Handle free plans
    if (selectedPlan.price === '$0') {
      // For free plans, just update the subscription status
      return { success: true, message: 'Free plan activated successfully', plan: selectedPlan };
    }

    // 3. Create payment order
    const orderData = await createPaymentOrder(planId, category);

    // 4. Initiate payment
    const paymentResult = await initiateRazorpayPayment(orderData, selectedPlan, category, userDetails);

    return paymentResult;

  } catch (error: any) {
    console.error('Payment flow error:', error);
    return { success: false, error: error.message || 'Payment failed' };
  }
};