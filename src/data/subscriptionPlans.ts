export const subscriptionPlans = [
  {
    id: 'free',
    apiPlanId: 'free',
    name: 'Free Trial',
    price: '₹0',
    duration: '14 Days',
    description: 'Perfect for getting started',
    features: [
      'Access to all AI tools',
      'Basic recommendations',
      'Community support',
      'No commitment'
    ],
    popular: false,
    badge: 'Try Free'
  },
  {
    id: 'monthly',
    apiPlanId: 'pro',
    name: 'Monthly',
    price: '₹49',
    duration: 'per month',
    description: 'Flexible monthly access',
    features: [
      'Full platform access',
      'Premium recommendations',
      'Priority support',
      'Advanced filters'
    ],
    popular: false,
    badge: null
  },
  {
    id: 'six_months',
    apiPlanId: 'pro',
    name: '6 Months',
    price: '₹149',
    duration: '6 months',
    description: 'Best value for regular users',
    features: [
      'Everything in Monthly',
      '2 months free',
      'Enhanced AI insights',
      'Beta feature access'
    ],
    popular: true,
    badge: 'Most Popular'
  },
  {
    id: 'annual',
    apiPlanId: 'enterprise',
    name: 'Annual',
    price: '₹249',
    duration: '12 months',
    description: 'Maximum savings',
    features: [
      'Everything in 6 months',
      '5+ months free',
      'Premium AI coaching',
      'Priority feature requests'
    ],
    popular: false,
    badge: 'Best Value'
  }
];

export default subscriptionPlans;
