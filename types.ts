export enum DealPriority {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW'
}

export interface Deal {
  id: string;
  title: string;
  description: string;
  value: string; // e.g., "+8,000 Miles" or "Save $200"
  expiry: string;
  priority: DealPriority;
  airline: string;
  effort: 'Low' | 'Medium' | 'High';
  type: 'TRANSFER' | 'SPEND' | 'FLIGHT' | 'STATUS' | 'PARTNER';
  steps?: string[]; // Added for "Show me how"
  link?: string; // External link
}

export interface Airline {
  id: string;
  name: string;
  code: string;
  color?: string;
  logo?: string;
}

export interface CreditCard {
  id: string;
  name: string;
  issuer: string;
  network: string;
  bestUse: string;
}

export interface LoyaltyAccount {
  programName: string;
  membershipNumber?: string;
  connected: boolean;
}

export interface PartnerChannel {
  id: string;
  name: string;
  type: 'Portal' | 'Partner';
  enabled: boolean;
}

export interface UserProfile {
  selectedAirlines: Airline[]; // Changed from primaryAirline
  cards: CreditCard[];
  loyaltyAccounts: LoyaltyAccount[];
  partnerChannels: PartnerChannel[];
  interestedInNewCardBonuses: boolean;
  onboardingComplete: boolean;
}

export interface WalletCard extends CreditCard {
  activeOffers: number;
  progress: number;
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  actionPlan?: ActionStep[];
}

export interface ActionStep {
  step: number;
  text: string;
  deadline?: string;
}

export type TabView = 'DEALS' | 'AIRLINE' | 'WALLET' | 'ASSISTANT';