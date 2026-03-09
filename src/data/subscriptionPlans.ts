export const subscriptionPlans = [
  {
    id: 'starter',
    name: 'Starter Listing',
    price: '$2.99',
    duration: 'month',
    description: 'Best for early projects',
    features: [
      'AI tool listed for 30 days',
      'Basic discovery traffic',
      'Tool description + link',
      'Edit listing anytime'
    ],
    popular: false,
    color: 'blue',
    buttonText: 'Start Listing'
  },
  {
    id: 'builder',
    name: 'Builder Listing',
    price: '$8.99',
    duration: '6 months',
    description: 'For founders serious about traffic',
    features: [
      '6 month listing visibility',
      'Higher ranking in directory',
      'Estimated 1k–5k discovery clicks',
      'Feature updates allowed',
      'Basic analytics'
    ],
    popular: true,
    badge: '⭐ Recommended',
    color: 'primary',
    buttonText: 'Choose Builder'
  },
  {
    id: 'pro',
    name: 'Pro Listing',
    price: '$23.99',
    duration: 'year',
    description: 'For long-term exposure',
    features: [
      '12 month listing',
      'Homepage feature (limited slots)',
      'Estimated 5k–20k discovery clicks',
      'Priority approval',
      'Advanced analytics'
    ],
    popular: false,
    color: 'orange',
    buttonText: 'Go Pro'
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
    price: '$2.16',
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
    trustLine: 'Used by thousands of creators to create scripts',
    launchOffer: '$2.16'
  }
];

// Script Generator Pricing Page Configuration
export const scriptGeneratorPricingConfig = {
  header: {
    title: 'Pick Your Plan',
    subtitle: 'Create viral video scripts in seconds with Soch AI Script Generator'
  },
  offerBanner: {
    text: 'Launch Offer – $2.16 /month',
    show: true
  }
};