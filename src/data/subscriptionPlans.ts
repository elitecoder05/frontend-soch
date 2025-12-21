export const subscriptionPlans = [
  {
    id: 'monthly',
    name: 'Monthly',
    price: '₹49',
    duration: 'per month',
    description: 'Essential tools for creators',
    features: [
      '1 Month Listing',
      'Basic Tool Analytics',
      'Edit Tool Listing',
      'Community Access'
    ],
    popular: false,
    color: 'blue'
  },
  {
    id: 'six_months',
    name: '6 Months',
    price: '₹149',
    duration: '6 months',
    description: 'Best value for serious developers',
    features: [
      'Everything in Monthly',
      'Extended Listing Validity',
      'New Tool Updates',
      'Priority Support',
      'Enhanced Analytics'
    ],
    popular: true,
    badge: 'Most Popular',
    color: 'primary'
  },
  {
    id: 'annual',
    name: '1 Year',
    price: '₹249',
    duration: '12 months',
    description: 'Long term visibility',
    features: [
      'Everything in 6 Months',
      '25 Days Extra Validity',
      'Newsletter Mention',
      'SEO Optimization Tips'
    ],
    popular: false,
    color: 'orange'
  },
  {
    id: 'lifetime',
    name: 'Lifetime',
    price: '₹999',
    duration: 'One Time Payment',
    description: 'Never expire. Ultimate access.',
    features: [
      'Never Expires',
      'Priority Review & Approval',
      'Lifetime "Pro" Badge',
      'Access to Beta Features',
      'Direct Developer Support'
    ],
    popular: false,
    badge: 'Limited Time',
    color: 'purple'
  }
];