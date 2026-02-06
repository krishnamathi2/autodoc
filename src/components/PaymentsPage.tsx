import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface Plan {
  id: string;
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
  popular?: boolean;
  teamSize: string;
}

const PaymentsPage = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const [selectedPlan, setSelectedPlan] = useState<string>('pro');
  const [currency, setCurrency] = useState<'USD' | 'INR'>('USD');

  const exchangeRate = 83; // Approximate USD to INR

  // PayPal.me link for USD payments
  const PAYPAL_USERNAME = 'mathivananponnusamy';

  // Razorpay Payment Links (INR) - Create these in Razorpay Dashboard > Payment Links
  const razorpayLinks: { [key: string]: { monthly: string; yearly: string } } = {
    starter: {
      monthly: 'https://rzp.io/rzp/starter-monthly',  // ₹830/month
      yearly: 'https://rzp.io/rzp/starter-yearly',    // ₹8,300/year
    },
    pro: {
      monthly: 'https://rzp.io/rzp/pro-monthly',      // ₹2,075/month
      yearly: 'https://rzp.io/rzp/pro-yearly',        // ₹20,750/year
    },
    enterprise: {
      monthly: '',  // Contact sales
      yearly: '',   // Contact sales
    },
  };

  const plans: Plan[] = [
    {
      id: 'starter',
      name: 'Starter',
      monthlyPrice: 10,
      yearlyPrice: 100,
      teamSize: '1 user',
      features: [
        '50 code scans/month',
        'Basic vulnerability detection',
        'Email support',
        'Single project',
      ],
    },
    {
      id: 'pro',
      name: 'Pro',
      monthlyPrice: 25,
      yearlyPrice: 250,
      teamSize: 'Up to 5 users',
      popular: true,
      features: [
        'Unlimited code scans',
        'Auto-fix all vulnerabilities',
        'Side-by-side code comparison',
        'Export security reports',
        'Priority support',
        'Team collaboration',
        'GitHub integration',
      ],
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      monthlyPrice: 100,
      yearlyPrice: 1000,
      teamSize: 'Unlimited users',
      features: [
        'Everything in Pro',
        'Custom integrations',
        'SSO / SAML',
        'Dedicated account manager',
        'SLA guarantee',
        'On-premise deployment option',
        'Custom training',
        'Audit logs',
      ],
    },
  ];

  const getPrice = (plan: Plan) => {
    const basePrice = billingCycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;
    if (currency === 'INR') {
      return Math.round(basePrice * exchangeRate);
    }
    return basePrice;
  };

  const formatPrice = (amount: number) => {
    if (currency === 'INR') {
      return `₹${amount.toLocaleString('en-IN')}`;
    }
    return `$${amount}`;
  };

  const handlePayment = () => {
    const plan = plans.find(p => p.id === selectedPlan);
    if (!plan) return;

    if (currency === 'USD') {
      // PayPal for USD payments
      const amount = billingCycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;
      const description = `${plan.name} Plan - ${billingCycle === 'yearly' ? 'Annual' : 'Monthly'}`;
      const paypalUrl = `https://www.paypal.com/paypalme/${PAYPAL_USERNAME}/${amount}USD`;
      window.open(paypalUrl, '_blank');
    } else {
      // Razorpay for INR payments
      const razorpayLink = razorpayLinks[selectedPlan]?.[billingCycle];
      if (razorpayLink) {
        window.open(razorpayLink, '_blank');
      } else {
        alert('Payment link not configured. Please contact support.');
      }
    }
  };

  const handleContactSales = () => {
    const plan = plans.find(p => p.id === selectedPlan);
    const subject = encodeURIComponent(`AutoDoc ${plan?.name} Plan Inquiry`);
    const body = encodeURIComponent(
      `Hi AutoDoc team,\n\nI'm interested in the ${plan?.name} Plan (${billingCycle}).\n\nCompany Name:\nTeam Size:\nUse Case:\n\nPlease contact me to discuss further.\n\nThank you!`
    );
    window.location.href = `mailto:sales@autodoc.com?subject=${subject}&body=${body}`;
  };

  const selectedPlanData = plans.find(p => p.id === selectedPlan);

  const styles: { [key: string]: React.CSSProperties } = {
    wrapper: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      padding: '40px 20px',
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
    },
    header: {
      textAlign: 'center',
      marginBottom: '40px',
    },
    badge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      background: 'rgba(59, 130, 246, 0.2)',
      color: '#60a5fa',
      padding: '8px 16px',
      borderRadius: '20px',
      fontSize: '0.9rem',
      fontWeight: 500,
      marginBottom: '16px',
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: 700,
      color: 'white',
      marginBottom: '12px',
    },
    subtitle: {
      fontSize: '1.1rem',
      color: '#94a3b8',
      maxWidth: '600px',
      margin: '0 auto',
    },
    controls: {
      display: 'flex',
      justifyContent: 'center',
      gap: '24px',
      marginBottom: '40px',
      flexWrap: 'wrap',
    },
    billingToggle: {
      display: 'flex',
      background: 'rgba(255,255,255,0.1)',
      borderRadius: '10px',
      padding: '4px',
    },
    toggleBtn: {
      padding: '10px 20px',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: 500,
      fontSize: '0.95rem',
      transition: 'all 0.2s ease',
    },
    currencyToggle: {
      display: 'flex',
      background: 'rgba(255,255,255,0.1)',
      borderRadius: '10px',
      padding: '4px',
    },
    plansGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
      gap: '24px',
      marginBottom: '40px',
    },
    planCard: {
      background: 'white',
      borderRadius: '16px',
      padding: '32px',
      position: 'relative',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    },
    popularBadge: {
      position: 'absolute',
      top: '-12px',
      left: '50%',
      transform: 'translateX(-50%)',
      background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
      color: 'white',
      padding: '6px 16px',
      borderRadius: '20px',
      fontSize: '0.8rem',
      fontWeight: 600,
    },
    planName: {
      fontSize: '1.3rem',
      fontWeight: 600,
      color: '#1f2937',
      marginBottom: '8px',
    },
    teamSize: {
      fontSize: '0.9rem',
      color: '#6b7280',
      marginBottom: '16px',
    },
    priceContainer: {
      marginBottom: '24px',
    },
    price: {
      fontSize: '2.5rem',
      fontWeight: 700,
      color: '#1f2937',
    },
    period: {
      fontSize: '1rem',
      color: '#6b7280',
    },
    savings: {
      display: 'inline-block',
      background: '#dcfce7',
      color: '#16a34a',
      padding: '4px 12px',
      borderRadius: '12px',
      fontSize: '0.85rem',
      fontWeight: 500,
      marginTop: '8px',
    },
    featureList: {
      listStyle: 'none',
      padding: 0,
      margin: '0 0 24px',
    },
    featureItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '8px 0',
      color: '#4b5563',
      fontSize: '0.95rem',
    },
    checkIcon: {
      color: '#10b981',
      fontWeight: 'bold',
    },
    selectBtn: {
      width: '100%',
      padding: '14px',
      borderRadius: '10px',
      border: 'none',
      fontWeight: 600,
      fontSize: '1rem',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    checkoutSection: {
      background: 'white',
      borderRadius: '16px',
      padding: '32px',
      maxWidth: '500px',
      margin: '0 auto',
    },
    checkoutTitle: {
      fontSize: '1.5rem',
      fontWeight: 600,
      color: '#1f2937',
      marginBottom: '24px',
      textAlign: 'center',
    },
    summaryRow: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '12px 0',
      borderBottom: '1px solid #e5e7eb',
      color: '#4b5563',
    },
    totalRow: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '16px 0',
      fontWeight: 600,
      fontSize: '1.2rem',
      color: '#1f2937',
    },
    payBtn: {
      width: '100%',
      padding: '16px',
      borderRadius: '10px',
      background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
      color: 'white',
      border: 'none',
      fontWeight: 600,
      fontSize: '1.1rem',
      cursor: 'pointer',
      marginTop: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
    },
    backLink: {
      display: 'block',
      textAlign: 'center',
      color: '#6b7280',
      textDecoration: 'none',
      marginTop: '16px',
      fontSize: '0.95rem',
    },
    secureNote: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      marginTop: '24px',
      color: '#6b7280',
      fontSize: '0.9rem',
    },
    paymentMethods: {
      display: 'flex',
      justifyContent: 'center',
      gap: '16px',
      marginTop: '16px',
      flexWrap: 'wrap',
    },
    paymentMethod: {
      background: '#f3f4f6',
      padding: '8px 16px',
      borderRadius: '8px',
      fontSize: '0.85rem',
      color: '#4b5563',
    },
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.badge}>
            <span>🔒</span> Secure Checkout
          </div>
          <h1 style={styles.title}>Choose Your Plan</h1>
          <p style={styles.subtitle}>
            Select the plan that best fits your team's security needs. All plans include a 14-day free trial.
          </p>
        </div>

        {/* Controls */}
        <div style={styles.controls}>
          {/* Billing Toggle */}
          <div style={styles.billingToggle}>
            <button
              style={{
                ...styles.toggleBtn,
                background: billingCycle === 'monthly' ? 'white' : 'transparent',
                color: billingCycle === 'monthly' ? '#0f172a' : '#94a3b8',
              }}
              onClick={() => setBillingCycle('monthly')}
            >
              Monthly
            </button>
            <button
              style={{
                ...styles.toggleBtn,
                background: billingCycle === 'yearly' ? 'white' : 'transparent',
                color: billingCycle === 'yearly' ? '#0f172a' : '#94a3b8',
              }}
              onClick={() => setBillingCycle('yearly')}
            >
              Yearly (Save 17%)
            </button>
          </div>

          {/* Currency Toggle */}
          <div style={styles.currencyToggle}>
            <button
              style={{
                ...styles.toggleBtn,
                background: currency === 'USD' ? 'white' : 'transparent',
                color: currency === 'USD' ? '#0f172a' : '#94a3b8',
              }}
              onClick={() => setCurrency('USD')}
            >
              USD ($)
            </button>
            <button
              style={{
                ...styles.toggleBtn,
                background: currency === 'INR' ? 'white' : 'transparent',
                color: currency === 'INR' ? '#0f172a' : '#94a3b8',
              }}
              onClick={() => setCurrency('INR')}
            >
              INR (₹)
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        <div style={styles.plansGrid}>
          {plans.map((plan) => (
            <div
              key={plan.id}
              style={{
                ...styles.planCard,
                border: selectedPlan === plan.id ? '2px solid #2563eb' : '2px solid transparent',
                transform: selectedPlan === plan.id ? 'scale(1.02)' : 'scale(1)',
                boxShadow: selectedPlan === plan.id 
                  ? '0 20px 40px rgba(37, 99, 235, 0.2)' 
                  : '0 4px 20px rgba(0,0,0,0.1)',
              }}
            >
              {plan.popular && <div style={styles.popularBadge}>Most Popular</div>}
              
              <h3 style={styles.planName}>{plan.name}</h3>
              <p style={styles.teamSize}>{plan.teamSize}</p>
              
              <div style={styles.priceContainer}>
                <span style={styles.price}>{formatPrice(getPrice(plan))}</span>
                <span style={styles.period}>/{billingCycle === 'yearly' ? 'year' : 'month'}</span>
              </div>

              <ul style={styles.featureList}>
                {plan.features.map((feature, idx) => (
                  <li key={idx} style={styles.featureItem}>
                    <span style={styles.checkIcon}>✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                style={{
                  ...styles.selectBtn,
                  background: selectedPlan === plan.id 
                    ? 'linear-gradient(135deg, #2563eb, #3b82f6)' 
                    : '#f3f4f6',
                  color: selectedPlan === plan.id ? 'white' : '#4b5563',
                }}
                onClick={() => setSelectedPlan(plan.id)}
              >
                {selectedPlan === plan.id ? '✓ Selected' : 'Select Plan'}
              </button>
            </div>
          ))}
        </div>

        {/* Checkout Section */}
        <div style={styles.checkoutSection}>
          <h2 style={styles.checkoutTitle}>Order Summary</h2>
          
          <div style={styles.summaryRow}>
            <span>{selectedPlanData?.name} Plan</span>
            <span>{formatPrice(getPrice(selectedPlanData!))}</span>
          </div>
          <div style={styles.summaryRow}>
            <span>Billing Cycle</span>
            <span>{billingCycle === 'yearly' ? 'Annual' : 'Monthly'}</span>
          </div>
          <div style={styles.summaryRow}>
            <span>Team Size</span>
            <span>{selectedPlanData?.teamSize}</span>
          </div>
          <div style={styles.totalRow}>
            <span>Total</span>
            <span>{formatPrice(getPrice(selectedPlanData!))}/{billingCycle === 'yearly' ? 'year' : 'month'}</span>
          </div>

          {selectedPlan === 'enterprise' ? (
            <button
              style={{
                ...styles.payBtn,
                background: 'linear-gradient(135deg, #059669, #10b981)',
              }}
              onClick={handleContactSales}
            >
              <span>📞</span> Contact Sales
            </button>
          ) : (
            <button
              style={styles.payBtn}
              onClick={handlePayment}
            >
              {currency === 'USD' ? (
                <><span>💳</span> Pay with PayPal</>
              ) : (
                <><span>💳</span> Pay with Razorpay</>
              )}
            </button>
          )}

          <Link to="/" style={styles.backLink}>
            ← Back to Home
          </Link>

          <div style={styles.secureNote}>
            <span>🔒</span> {currency === 'USD' ? 'Secured by PayPal.' : 'Secured by Razorpay.'} 256-bit SSL encryption.
          </div>

          <div style={styles.paymentMethods}>
            {currency === 'USD' ? (
              <>
                <span style={styles.paymentMethod}>💳 Cards</span>
                <span style={styles.paymentMethod}>🏦 Bank Account</span>
                <span style={styles.paymentMethod}>💰 PayPal Balance</span>
              </>
            ) : (
              <>
                <span style={styles.paymentMethod}>💳 Cards</span>
                <span style={styles.paymentMethod}>🏦 Net Banking</span>
                <span style={styles.paymentMethod}>📱 UPI</span>
                <span style={styles.paymentMethod}>💰 Wallets</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentsPage;
