export interface SubscriptionPlan {
  _id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  scansPerMonth: number;
  maxFileSize: number;
  autoFixLimit: number;
  teamMembers: number;
  prioritySupport: boolean;
  stripePriceId: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserSubscription {
  _id: string;
  userId: string;
  planId: string;
  stripeSubscriptionId: string;
  stripeCustomerId: string;
  status: 'active' | 'canceled' | 'past_due' | 'unpaid';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  scansUsed: number;
  autoFixesUsed: number;
  paymentMethod: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UsageStats {
  plan: string;
  scans: {
    used: number;
    limit: number;
    remaining: number;
  };
  autoFixes: {
    used: number;
    limit: number;
    remaining: number;
  };
  periodEnd: Date;
  status: string;
}

export interface CheckoutSession {
  sessionId: string;
  url: string;
}

export interface BillingDetails {
  email: string;
  name: string;
  address?: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
}