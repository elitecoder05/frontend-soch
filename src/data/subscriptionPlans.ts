export const subscriptionPlans = [
  {
    id: 'monthly',
    name: 'Monthly',
    price: '₹49',
    duration: 'Month',
    description: 'Perfect to get started',
    features: [
      'List your AI tool for 30 days',
      '50–100 estimated clicks (discovery traffic in first week)',
      'Basic visibility and analytics',
      'Edit or update your listing anytime'
    ],
    popular: false,
    color: 'blue'
  },
  {
    id: 'six_months',
    name: '6 Months',
    price: '₹149',
    duration: '6 Months',
    description: 'Best value for serious builders',
    features: [
      '700–3,000+ estimated clicks',
      'Website-only focused traffic',
      'Longer listing visibility',
      'Faster updates for new features',
      'Enhanced analytics'
    ],
    popular: true,
    badge: '⭐ Most Popular',
    color: 'primary'
  },
  {
    id: 'annual',
    name: '1 Year Plan',
    price: '₹249',
    duration: '12 Months',
    description: 'Built for long-term growth',
    features: [
      '800–10,000+ estimated clicks',
      'Extra 25 days listing bonus',
      'Free homepage feature',
      'Stronger brand credibility',
      'Advanced performance insights'
    ],
    popular: false,
    color: 'orange'
  },
  {
    id: 'lifetime',
    name: 'Lifetime',
    price: '₹999',
    duration: 'One-time',
    description: 'Limited Time – Lifetime',
    features: [
      'Lifetime listing access',
      'Priority review and faster approval',
      'Lifetime Pro badge',
      'Early access to beta features',
      'Direct developer support'
    ],
    popular: false,
    badge: '♾️ Limited Time',
    color: 'purple'
  }
];