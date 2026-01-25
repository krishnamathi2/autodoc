// services/stripe.tsx
import Stripe from 'stripe';

// Initialize Stripe with your secret key
const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export class StripeService {
  static async createCheckoutSession(planId: string, userId?: string) {
    try {
      // You need to map planId to Stripe price ID
      const priceId = this.getPriceIdForPlan(planId);
      
      const session = await stripeInstance.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}/pricing`,
        metadata: {
          userId: userId || '',
          planId: planId
        },
      });

      return session;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw error;
    }
  }

  static async getSubscription(subscriptionId: string) {
    try {
      return await stripeInstance.subscriptions.retrieve(subscriptionId);
    } catch (error) {
      console.error('Error retrieving subscription:', error);
      throw error;
    }
  }

  static async cancelSubscription(subscriptionId: string, cancelAtPeriodEnd: boolean = false) {
    try {
      return await stripeInstance.subscriptions.update(subscriptionId, {
        cancel_at_period_end: cancelAtPeriodEnd,
      });
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      throw error;
    }
  }

  private static getPriceIdForPlan(planId: string): string {
    // Map your plan IDs to Stripe price IDs
    // These should be set in your .env file
    const priceMap: Record<string, string> = {
      'pro': process.env.STRIPE_PRO_PRICE_ID!,
      'business': process.env.STRIPE_BUSINESS_PRICE_ID!,
      'enterprise': process.env.STRIPE_ENTERPRISE_PRICE_ID!,
      'pro_annual': process.env.STRIPE_PRO_ANNUAL_PRICE_ID!,
      'business_annual': process.env.STRIPE_BUSINESS_ANNUAL_PRICE_ID!,
    };
    
    const priceId = priceMap[planId];
    if (!priceId) {
      throw new Error(`No Stripe price ID found for plan: ${planId}`);
    }
    
    return priceId;
  }

  // Getter for stripe instance (for webhooks)
  static get stripe() {
    return stripeInstance;
  }
}

// Export as default
export default StripeService;