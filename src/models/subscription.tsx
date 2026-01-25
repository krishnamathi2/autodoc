// Define SubscriptionPlan interface locally since it might not be exported from models
interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  billingPeriod: 'monthly' | 'annual';
  features: string[];
  limitations: {
    maxUsers: number;
    maxProjects: number;
    maxStorageGB: number;
    apiCallsPerDay: number;
    hasPrioritySupport: boolean;
    hasCustomBranding: boolean;
  };
  originalPrice?: number;
  discountPercent?: number;
  isPopular: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Subscription plan definitions
export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free',
    description: 'Basic access with limited features',
    price: 0,
    currency: 'USD',
    billingPeriod: 'monthly',
    features: [
      'Access to basic features',
      'Limited storage (1 GB)',
      'Community support',
      'Up to 100 API calls per day'
    ],
    limitations: {
      maxUsers: 1,
      maxProjects: 3,
      maxStorageGB: 1,
      apiCallsPerDay: 100,
      hasPrioritySupport: false,
      hasCustomBranding: false
    },
    isPopular: false,
    isActive: true,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01')
  },
  {
    id: 'pro',
    name: 'Professional',
    description: 'For professionals and small teams',
    price: 29.99,
    currency: 'USD',
    billingPeriod: 'monthly',
    features: [
      'All Free features',
      'Advanced analytics',
      'Priority support',
      '10 GB storage',
      '10,000 API calls per day',
      'Custom integrations'
    ],
    limitations: {
      maxUsers: 5,
      maxProjects: 50,
      maxStorageGB: 10,
      apiCallsPerDay: 10000,
      hasPrioritySupport: true,
      hasCustomBranding: false
    },
    isPopular: true,
    isActive: true,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01')
  },
  {
    id: 'business',
    name: 'Business',
    description: 'For growing businesses and enterprises',
    price: 99.99,
    currency: 'USD',
    billingPeriod: 'monthly',
    features: [
      'All Professional features',
      'Unlimited storage',
      'Dedicated account manager',
      'Custom branding',
      'SLA guarantee',
      'Advanced security features'
    ],
    limitations: {
      maxUsers: 50,
      maxProjects: 500,
      maxStorageGB: -1,
      apiCallsPerDay: 100000,
      hasPrioritySupport: true,
      hasCustomBranding: true
    },
    isPopular: false,
    isActive: true,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01')
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Custom solutions for large organizations',
    price: 499.99,
    currency: 'USD',
    billingPeriod: 'monthly',
    features: [
      'All Business features',
      'On-premise deployment',
      'Custom development',
      '24/7 phone support',
      'Compliance certification',
      'Multi-region deployment'
    ],
    limitations: {
      maxUsers: -1,
      maxProjects: -1,
      maxStorageGB: -1,
      apiCallsPerDay: -1,
      hasPrioritySupport: true,
      hasCustomBranding: true
    },
    isPopular: false,
    isActive: true,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01')
  }
];

// Annual subscription plans (with discount)
export const ANNUAL_SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'pro_annual',
    name: 'Professional (Annual)',
    description: 'Professional plan billed annually - save 20%',
    price: 287.90,
    currency: 'USD',
    billingPeriod: 'annual',
    originalPrice: 359.88,
    discountPercent: 20,
    features: [
      'All Professional features',
      'Advanced analytics',
      'Priority support',
      '10 GB storage',
      '10,000 API calls per day',
      'Custom integrations'
    ],
    limitations: {
      maxUsers: 5,
      maxProjects: 50,
      maxStorageGB: 10,
      apiCallsPerDay: 10000,
      hasPrioritySupport: true,
      hasCustomBranding: false
    },
    isPopular: true,
    isActive: true,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01')
  },
  {
    id: 'business_annual',
    name: 'Business (Annual)',
    description: 'Business plan billed annually - save 20%',
    price: 959.90,
    currency: 'USD',
    billingPeriod: 'annual',
    originalPrice: 1199.88,
    discountPercent: 20,
    features: [
      'All Business features',
      'Unlimited storage',
      'Dedicated account manager',
      'Custom branding',
      'SLA guarantee',
      'Advanced security features'
    ],
    limitations: {
      maxUsers: 50,
      maxProjects: 500,
      maxStorageGB: -1,
      apiCallsPerDay: 100000,
      hasPrioritySupport: true,
      hasCustomBranding: true
    },
    isPopular: false,
    isActive: true,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01')
  }
];

// Subscription-related helper functions
export class SubscriptionService {
  
  /**
   * Get subscription plan by ID
   */
  static getPlanById(planId: string): SubscriptionPlan | undefined {
    return SUBSCRIPTION_PLANS.find(plan => plan.id === planId) || 
           ANNUAL_SUBSCRIPTION_PLANS.find(plan => plan.id === planId);
  }

  /**
   * Get all active subscription plans
   */
  static getActivePlans(includeAnnual: boolean = true): SubscriptionPlan[] {
    const plans = [...SUBSCRIPTION_PLANS];
    if (includeAnnual) {
      plans.push(...ANNUAL_SUBSCRIPTION_PLANS);
    }
    return plans.filter(plan => plan.isActive);
  }

  /**
   * Get popular plans (marked as isPopular)
   */
  static getPopularPlans(): SubscriptionPlan[] {
    return this.getActivePlans().filter(plan => plan.isPopular);
  }

  /**
   * Get plans by billing period
   */
  static getPlansByBillingPeriod(period: 'monthly' | 'annual'): SubscriptionPlan[] {
    return this.getActivePlans().filter(plan => plan.billingPeriod === period);
  }

  /**
   * Get plans by price range
   */
  static getPlansByPriceRange(min: number, max: number): SubscriptionPlan[] {
    return this.getActivePlans().filter(plan => 
      plan.price >= min && plan.price <= max
    );
  }

  /**
   * Check if a plan has a specific feature
   */
  static hasFeature(planId: string, feature: string): boolean {
    const plan = this.getPlanById(planId);
    if (!plan) return false;
    
    return plan.features.some(f => 
      f.toLowerCase().includes(feature.toLowerCase())
    );
  }

  /**
   * Calculate monthly equivalent price for annual plans
   */
  static getMonthlyPrice(plan: SubscriptionPlan): number {
    if (plan.billingPeriod === 'monthly') {
      return plan.price;
    }
    return plan.price / 12;
  }

  /**
   * Format price for display
   */
  static formatPrice(plan: SubscriptionPlan): string {
    const monthlyPrice = this.getMonthlyPrice(plan);
    const currencySymbol = this.getCurrencySymbol(plan.currency);
    
    if (plan.billingPeriod === 'monthly') {
      return `${currencySymbol}${monthlyPrice.toFixed(2)}/month`;
    } else {
      return `${currencySymbol}${plan.price.toFixed(2)}/year`;
    }
  }

  /**
   * Get currency symbol
   */
  private static getCurrencySymbol(currency: string): string {
    const symbols: Record<string, string> = {
      'USD': '$',
      'EUR': '€',
      'GBP': '£',
      'JPY': '¥',
      'CAD': 'C$',
      'AUD': 'A$'
    };
    return symbols[currency] || currency;
  }

  /**
   * Upgrade plan comparison
   */
  static getUpgradeOptions(currentPlanId: string): SubscriptionPlan[] {
    const currentPlan = this.getPlanById(currentPlanId);
    if (!currentPlan) return this.getActivePlans();
    
    const planOrder = ['free', 'pro', 'business', 'enterprise'];
    const currentIndex = planOrder.findIndex(id => 
      currentPlan.id.startsWith(id) || id === currentPlan.id
    );
    
    if (currentIndex === -1) return this.getActivePlans();
    
    return this.getActivePlans().filter(plan => {
      const planIndex = planOrder.findIndex(id => 
        plan.id.startsWith(id) || id === plan.id
      );
      return planIndex > currentIndex;
    });
  }

  /**
   * Get downgrade options
   */
  static getDowngradeOptions(currentPlanId: string): SubscriptionPlan[] {
    const currentPlan = this.getPlanById(currentPlanId);
    if (!currentPlan) return [];
    
    const planOrder = ['free', 'pro', 'business', 'enterprise'];
    const currentIndex = planOrder.findIndex(id => 
      currentPlan.id.startsWith(id) || id === currentPlan.id
    );
    
    if (currentIndex === -1) return [];
    
    return this.getActivePlans().filter(plan => {
      const planIndex = planOrder.findIndex(id => 
        plan.id.startsWith(id) || id === plan.id
      );
      return planIndex < currentIndex;
    });
  }

  /**
   * Calculate savings percentage for annual plans
   */
  static getSavingsPercentage(plan: SubscriptionPlan): number | null {
    if (plan.billingPeriod !== 'annual' || !plan.originalPrice) {
      return null;
    }
    
    const savings = ((plan.originalPrice - plan.price) / plan.originalPrice) * 100;
    return Math.round(savings);
  }

  /**
   * Check if plan has unlimited feature
   */
  static hasUnlimitedFeature(planId: string, feature: keyof SubscriptionPlan['limitations']): boolean {
    const plan = this.getPlanById(planId);
    if (!plan) return false;
    
    return plan.limitations[feature] === -1;
  }
}

// Subscription status types
export enum SubscriptionStatus {
  ACTIVE = 'active',
  CANCELED = 'canceled',
  EXPIRED = 'expired',
  TRIAL = 'trial',
  PENDING = 'pending',
  PAST_DUE = 'past_due'
}

// Subscription tier types
export enum SubscriptionTier {
  FREE = 'free',
  PRO = 'pro',
  BUSINESS = 'business',
  ENTERPRISE = 'enterprise'
}

// Subscription interval types
export enum BillingInterval {
  MONTHLY = 'monthly',
  ANNUAL = 'annual'
}

// Type guard for checking if a plan ID is valid
export function isValidPlanId(planId: string): boolean {
  return SubscriptionService.getPlanById(planId) !== undefined;
}

// Utility function to get plan name by ID
export function getPlanName(planId: string): string {
  const plan = SubscriptionService.getPlanById(planId);
  return plan ? plan.name : 'Unknown Plan';
}

// Utility function to get plan description by ID
export function getPlanDescription(planId: string): string {
  const plan = SubscriptionService.getPlanById(planId);
  return plan ? plan.description : '';
}

// Utility function to check if plan is free
export function isFreePlan(planId: string): boolean {
  const plan = SubscriptionService.getPlanById(planId);
  return plan ? plan.price === 0 : false;
}

// Export a default constant for easier imports
export default {
  SUBSCRIPTION_PLANS,
  ANNUAL_SUBSCRIPTION_PLANS,
  SubscriptionService,
  SubscriptionStatus,
  SubscriptionTier,
  BillingInterval,
  isValidPlanId,
  getPlanName,
  getPlanDescription,
  isFreePlan
};