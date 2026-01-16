import { Airline, CreditCard, PartnerChannel, Deal, DealPriority, UserProfile } from './types';

// --- Static Data for Selection ---

export const AIRLINES_LIST: Airline[] = [
  { id: 'qf', name: 'Qantas', code: 'QF', color: '#E30000', logo: 'https://logo.clearbit.com/qantas.com' },
  { id: 'va', name: 'Virgin Australia', code: 'VA', color: '#822433', logo: 'https://logo.clearbit.com/virginaustralia.com' },
  { id: 'sq', name: 'Singapore Airlines', code: 'SQ', color: '#FDB913', logo: 'https://logo.clearbit.com/singaporeair.com' },
  { id: 'cx', name: 'Cathay Pacific', code: 'CX', color: '#006B6E', logo: 'https://logo.clearbit.com/cathaypacific.com' },
  { id: 'dl', name: 'Delta Air Lines', code: 'DL', color: '#00295F', logo: 'https://logo.clearbit.com/delta.com' },
  { id: 'ua', name: 'United Airlines', code: 'UA', color: '#005DAA', logo: 'https://logo.clearbit.com/united.com' },
  { id: 'aa', name: 'American Airlines', code: 'AA', color: '#0078D2', logo: 'https://logo.clearbit.com/aa.com' },
  { id: 'ba', name: 'British Airways', code: 'BA', color: '#EB2226', logo: 'https://logo.clearbit.com/ba.com' },
  { id: 'nz', name: 'Air New Zealand', code: 'NZ', color: '#000000', logo: 'https://logo.clearbit.com/airnewzealand.com' },
  { id: 'ek', name: 'Emirates', code: 'EK', color: '#D71A21', logo: 'https://logo.clearbit.com/emirates.com' },
];

export const CREDIT_CARDS_LIST: CreditCard[] = [
  { id: 'amex_plat', name: 'Platinum Card', issuer: 'Amex', network: 'Amex', bestUse: 'Travel & Dining' },
  { id: 'amex_expl', name: 'Explorer', issuer: 'Amex', network: 'Amex', bestUse: 'Gateway to multiple airlines' },
  { id: 'westpac_alt', name: 'Altitude Black', issuer: 'Westpac', network: 'Mastercard', bestUse: 'Qantas or Altitude Points' },
  { id: 'anz_ff', name: 'Frequent Flyer Black', issuer: 'ANZ', network: 'Visa', bestUse: 'Qantas Points' },
  { id: 'anz_rwd', name: 'Rewards Black', issuer: 'ANZ', network: 'Visa', bestUse: 'Flexible Points' },
  { id: 'nab_rwd', name: 'Rewards Signature', issuer: 'NAB', network: 'Visa', bestUse: 'Flexible Points' },
  { id: 'cba_ult', name: 'Ultimate Awards', issuer: 'CommBank', network: 'Mastercard', bestUse: 'International Spend' },
  { id: 'qf_prem', name: 'Qantas Premier', issuer: 'Qantas Money', network: 'Mastercard', bestUse: 'Qantas Spend' },
];

export const PARTNER_CHANNELS_LIST: PartnerChannel[] = [
  { id: 'estore', name: 'Airline e-Store Portal', type: 'Portal', enabled: true },
  { id: 'dining', name: 'Dining Rewards Network', type: 'Partner', enabled: true },
  { id: 'rideshare', name: 'Rideshare Linkage (Uber/Lyft)', type: 'Partner', enabled: true },
  { id: 'hotels', name: 'Hotel Booking Portal', type: 'Portal', enabled: true },
];

export const SUGGESTED_PROMPTS = [
  "Identify my highest value earning opportunity right now.",
  "Find me a business class seat to Tokyo in October.",
  "How do I maximize my Amex points transfer?",
  "Is the current Virgin status match worth it?",
  "Plan a weekend trip using my Qantas points."
];

// --- Dynamic Generators ---

export const generateDeals = (profile: UserProfile): Deal[] => {
  const deals: Deal[] = [];
  
  // Use first selected airline for primary deal generation, or default
  const primaryAirline = profile.selectedAirlines[0];
  const airlineCode = primaryAirline?.code || 'ANY';
  const airlineName = primaryAirline?.name || 'Airlines';

  // 1. High Priority Transfer Bonus (Generic fallback if no cards, specific if cards exist)
  if (profile.cards.some(c => c.issuer === 'Amex' || c.issuer === 'Westpac' || c.issuer === 'ANZ')) {
    deals.push({
      id: 'p1',
      title: `Transfer Bonus: Bank to ${airlineCode}`,
      description: `Turn 30k bank points into 35k ${airlineName} miles. Limited time 15% bonus.`,
      value: '+5,000 Miles',
      expiry: '48h left',
      priority: DealPriority.HIGH,
      airline: airlineCode,
      effort: 'Low',
      type: 'TRANSFER',
      link: 'https://www.americanexpress.com',
      steps: [
        "Log in to your Bank Rewards portal.",
        `Select 'Transfer to Partners' and choose ${airlineName}.`,
        "Initiate transfer (instant). Bonus applies automatically."
      ]
    });
  } else {
    deals.push({
      id: 'p1',
      title: `Double Status Credits: ${airlineCode}`,
      description: `Book a flight in the next 3 days to earn double status credits.`,
      value: 'Status Boost',
      expiry: '72h left',
      priority: DealPriority.HIGH,
      airline: airlineCode,
      effort: 'Low',
      type: 'STATUS',
      link: `https://www.google.com/search?q=${airlineName}+status+credits`,
      steps: [
        `Register on the ${airlineName} app under 'Offers'.`,
        "Book any eligible flight before Friday.",
        "Travel dates must be between May and August."
      ]
    });
  }

  // 2. Card Specific Deals
  if (profile.interestedInNewCardBonuses) {
     deals.push({
      id: 'd_signup',
      title: '70k Bonus Point Offer',
      description: 'The ANZ Frequent Flyer Black is offering 70k bonus points. Ends soon.',
      value: '+70,000 Pts',
      expiry: 'New Offer',
      priority: DealPriority.MEDIUM,
      airline: airlineCode,
      effort: 'Medium',
      type: 'SPEND',
      link: 'https://www.anz.com.au',
      steps: [
        "Apply via the specific partner link.",
        "Spend $3,000 in first 3 months.",
        "Points credit within 60 days of meeting spend."
      ]
    });
  }

  const amexCard = profile.cards.find(c => c.issuer === 'Amex');
  if (amexCard) {
    deals.push({
      id: 'd1',
      title: 'Shop Small',
      description: 'Spend $10 get $5 back at local businesses up to 5 times.',
      value: 'Save $25',
      expiry: '10 days',
      priority: DealPriority.MEDIUM,
      airline: airlineCode,
      effort: 'Low',
      type: 'SPEND',
      link: 'https://www.americanexpress.com',
      steps: [
        "Log in to Amex App.",
        "Go to 'Offers' tab.",
        "Save 'Shop Small' offer to card.",
        "Spend at participating locations."
      ]
    });
  }

  // 3. Partner Channel Deals (Added more shopping deals)
  deals.push({
    id: 'd_shopping_1',
    title: `Apple Store Bonus`,
    description: `Earn 5 points per $1 spent at Apple (usually 1pt/$). Today only via ${airlineName} Shopping.`,
    value: '5x Points',
    expiry: 'Ends Midnight',
    priority: DealPriority.LOW,
    airline: airlineCode,
    effort: 'Low',
    type: 'PARTNER',
    link: 'https://www.apple.com',
    steps: [
      `Go to ${airlineName} Online Mall.`,
      "Login with frequent flyer details.",
      "Click through to Apple Store.",
      "Complete purchase in same session."
    ]
  });

  deals.push({
    id: 'd_shopping_2',
    title: `The Iconic Sale Boost`,
    description: `Earn 10 points per $1 at The Iconic. Stack with end of season sale.`,
    value: '10x Points',
    expiry: '48h left',
    priority: DealPriority.MEDIUM,
    airline: airlineCode,
    effort: 'Low',
    type: 'PARTNER',
    link: 'https://www.theiconic.com.au',
    steps: [
        `Go to ${airlineName} Online Mall.`,
        "Search for 'The Iconic'.",
        "Click 'Shop Now' to track cookies.",
        "Checkout as normal."
    ]
  });
  
  deals.push({
    id: 'd_shopping_3',
    title: `Amazon Device Bonus`,
    description: `Bonus 2000 points on Amazon Echo devices.`,
    value: '+2000 Pts',
    expiry: 'While stock lasts',
    priority: DealPriority.LOW,
    airline: airlineCode,
    effort: 'Low',
    type: 'PARTNER',
    link: 'https://www.amazon.com',
    steps: [
        `Go to ${airlineName} Online Mall.`,
        "Click through to Amazon.",
        "Purchase eligible Echo device."
    ]
  });


  // 4. Flight Deal (Generic)
  deals.push({
    id: 'd2',
    title: 'Bali Award Seats',
    description: 'Business class seats to DPS available for 45k points in August.',
    value: 'Save $1,200',
    expiry: 'High Demand',
    priority: DealPriority.MEDIUM,
    airline: airlineCode,
    effort: 'Medium',
    type: 'FLIGHT',
    link: `https://www.google.com/travel/flights`,
    steps: [
      `Login to ${airlineName} site.`,
      "Select 'Use Points'.",
      "Search SYD to DPS for dates in August."
    ]
  });

  // 5. Secondary Airline Deal (if multiple selected)
  if (profile.selectedAirlines.length > 1) {
    const secondary = profile.selectedAirlines[1];
    deals.push({
      id: 'd4',
      title: `${secondary.code} Status Match`,
      description: `Match your current status to ${secondary.name} for 12 months.`,
      value: 'Gold Status',
      expiry: 'Targeted',
      priority: DealPriority.MEDIUM,
      airline: secondary.code,
      effort: 'Medium',
      type: 'STATUS',
      link: `https://www.${secondary.name.replace(/\s+/g, '').toLowerCase()}.com`,
      steps: [
        "Email proof of current status to status.match@airline.com.",
        "Include screenshot of activity statement.",
        "Wait 5-7 days for approval."
      ]
    });
  }

  return deals;
};