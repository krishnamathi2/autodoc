import express from 'express';
import StripeService from '../services/stripe'; // Default import
import { 
  SubscriptionService,
  SubscriptionStatus 
} from '../models/subscription';

const router = express.Router();

// Get all subscription plans
router.get('/plans', async (req, res) => {
  try {
    const plans = SubscriptionService.getActivePlans(true);
    res.json(plans);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch plans' });
  }
});

// Create checkout session
router.post('/create-checkout-session', async (req, res) => {
  try {
    const { planId, userId } = req.body;
    
    const plan = SubscriptionService.getPlanById(planId);
    if (!plan) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    const session = await StripeService.createCheckoutSession(planId, userId);
    
    res.json({ 
      sessionId: session.id, 
      url: session.url,
      planName: plan.name,
      price: plan.price 
    });
  } catch (error: any) {
    console.error('Checkout session error:', error);
    res.status(500).json({ error: error.message || 'Failed to create checkout session' });
  }
});

// Webhook handler
router.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'] as string;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!endpointSecret) {
    return res.status(500).json({ error: 'STRIPE_WEBHOOK_SECRET not configured' });
  }

  let event;

  try {
    event = StripeService.stripe.webhooks.constructEvent(
      req.body, 
      sig, 
      endpointSecret
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      await handleCheckoutSessionCompleted(session);
      break;
    case 'customer.subscription.updated':
      const subscription = event.data.object;
      await handleSubscriptionUpdated(subscription);
      break;
    case 'customer.subscription.deleted':
      const deletedSubscription = event.data.object;
      await handleSubscriptionDeleted(deletedSubscription);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

// Helper functions
async function handleCheckoutSessionCompleted(session: any) {
  try {
    const userId = session.metadata?.userId;
    const planId = session.metadata?.planId;
    const customerId = session.customer;
    const subscriptionId = session.subscription;

    if (!userId || !planId) {
      console.error('Missing userId or planId in session metadata');
      return;
    }

    console.log(`Checkout completed: user=${userId}, plan=${planId}, subscription=${subscriptionId}`);
    
    // Here you would save to your database
    // Example:
    // await saveUserSubscription({
    //   userId,
    //   planId,
    //   stripeCustomerId: customerId,
    //   stripeSubscriptionId: subscriptionId,
    //   status: 'active'
    // });
    
  } catch (error) {
    console.error('Error handling checkout session completed:', error);
  }
}

async function handleSubscriptionUpdated(subscription: any) {
  console.log(`Subscription updated: ${subscription.id}, status: ${subscription.status}`);
  // Update in your database
}

async function handleSubscriptionDeleted(subscription: any) {
  console.log(`Subscription deleted: ${subscription.id}`);
  // Update in your database
}

// Get user's current subscription
router.get('/user/:userId/subscription', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Mock response - implement your database logic here
    res.json({ 
      userId,
      hasSubscription: false,
      message: 'Implement database logic for user subscriptions'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user subscription' });
  }
});

// Cancel subscription
router.post('/subscription/:subscriptionId/cancel', async (req, res) => {
  try {
    const { subscriptionId } = req.params;
    const { cancelAtPeriodEnd } = req.body;
    
    const subscription = await StripeService.cancelSubscription(
      subscriptionId, 
      cancelAtPeriodEnd
    );
    
    res.json({ 
      success: true, 
      subscriptionId,
      status: subscription.status,
      cancelAtPeriodEnd: subscription.cancel_at_period_end
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to cancel subscription' });
  }
});

export default router;