// export const subscriptionPlans = [
//   {
//     id: 'free',
//     apiPlanId: 'free',
//     name: 'Free Trial',
//     price: '₹0',
//     duration: '14 Days',
//     description: 'Perfect for getting started',
//     features: [
//       'Access to all AI tools',
//       'Basic recommendations',
//       'Community support',
//       'No commitment'
//     ],
//     popular: false,
//     badge: 'Try Free'
//   },
//   {
//     id: 'monthly',
//     apiPlanId: 'monthly',
//     name: 'Monthly',
//     price: '₹49',
//     duration: 'per month',
//     description: 'Flexible monthly access',
//     features: [
//       'Full platform access',
//       'Premium recommendations',
//       'Priority support',
//       'Advanced filters'
//     ],
//     popular: false,
//     badge: null
//   },
//   {
//     id: 'six_months',
//     apiPlanId: 'six_months',
//     name: '6 Months',
//     price: '₹149',
//     duration: '6 months',
//     description: 'Best value for regular users',
//     features: [
//       'Everything in Monthly',
//       '2 months free',
//       'Enhanced AI insights',
//       'Beta feature access'
//     ],
//     popular: true,
//     badge: 'Most Popular'
//   },
//   {
//     id: 'annual',
//     apiPlanId: 'annual',
//     name: 'Annual',
//     price: '₹249',
//     duration: '12 months',
//     description: 'Maximum savings',
//     features: [
//       'Everything in 6 months',
//       '5+ months free',
//       'Premium AI coaching',
//       'Priority feature requests'
//     ],
//     popular: false,
//     badge: 'Best Value'
//   }
// ];

// export default subscriptionPlans;
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