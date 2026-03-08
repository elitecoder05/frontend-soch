export const subscriptionPlans = [
  {
    id: 'monthly',
    name: 'Monthly',
    price: '$5',
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
    price: '$12',
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
    price: '$20',
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
    price: '$99',
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

// Soch AI Apps - Script Generator Pricing
export const scriptGeneratorPlans = [
  {
    id: 'script-free',
    name: 'FREE',
    price: '$0',
    duration: 'month',
    description: '',
    features: [
      '5 Script Generations / month',
      'Basic Hook + Body Structure',
      'Language Selection',
      'Save Script History'
    ],
    popular: false,
    buttonText: 'Start Free'
  },
  {
    id: 'script-creator',
    name: 'CREATOR',
    price: '$5',
    duration: 'month',
    description: 'Best for content creator',
    features: [
      'Unlimited Script Generation',
      'Hook, Body, CTA Structured Script',
      'Reference Video Analysis',
      'Tone & Target Audience Settings',
      'Script Editing & Regeneration',
      'Save Script History'
    ],
    popular: true,
    badge: 'Best Value',
    buttonText: 'Upgrade to Creator',
    launchPrice: '$4'
  }
];