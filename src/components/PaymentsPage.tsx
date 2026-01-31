import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const PaymentsPage = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');

  const styles = {
    wrapper: {
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 16px',
      background: 'linear-gradient(135deg, #eef2ff 0%, #f8fafc 100%)',
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      color: '#0f172a'
    },
    card: {
      width: '100%',
      maxWidth: '640px',
      background: 'white',
      borderRadius: '16px',
      padding: '32px',
      boxShadow: '0 20px 45px rgba(15, 23, 42, 0.12)'
    },
    badge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      padding: '6px 14px',
      borderRadius: '999px',
      background: '#dbeafe',
      color: '#1e3a8a',
      fontSize: '0.85rem',
      fontWeight: 600,
      marginBottom: '16px'
    },
    heading: {
      fontSize: '2rem',
      fontWeight: 700,
      marginBottom: '12px'
    },
    subheading: {
      color: '#475569',
      fontSize: '1rem',
      marginBottom: '24px',
      lineHeight: 1.6
    },
    pricingSection: {
      background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
      borderRadius: '12px',
      padding: '24px',
      marginBottom: '24px',
      border: '2px solid #10b981',
    },
    planName: {
      fontSize: '1.5rem',
      fontWeight: 700,
      color: '#059669',
      marginBottom: '8px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    priceContainer: {
      display: 'flex',
      alignItems: 'baseline',
      gap: '8px',
      marginBottom: '16px',
    },
    price: {
      fontSize: '3rem',
      fontWeight: 800,
      color: '#0f172a',
    },
    pricePeriod: {
      fontSize: '1.1rem',
      color: '#64748b',
    },
    savings: {
      display: 'inline-block',
      background: '#10b981',
      color: 'white',
      padding: '4px 12px',
      borderRadius: '20px',
      fontSize: '0.85rem',
      fontWeight: 600,
      marginBottom: '16px',
    },
    billingToggle: {
      display: 'flex',
      background: '#e2e8f0',
      borderRadius: '8px',
      padding: '4px',
      marginBottom: '16px',
    },
    toggleBtn: {
      flex: 1,
      padding: '10px 16px',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontWeight: 600,
      fontSize: '0.9rem',
      transition: 'all 0.2s ease',
    },
    checklist: {
      listStyle: 'none' as const,
      padding: 0,
      margin: '0 0 24px',
      display: 'grid',
      gap: '12px'
    },
    listItem: {
      display: 'flex',
      gap: '12px',
      alignItems: 'flex-start',
      color: '#1f2937',
      lineHeight: 1.5
    },
    ctaRow: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '12px'
    },
    primaryBtn: {
      width: '100%',
      padding: '14px',
      borderRadius: '10px',
      background: 'linear-gradient(135deg, #059669, #10b981)',
      color: 'white',
      border: 'none',
      fontWeight: 600,
      fontSize: '1rem',
      cursor: 'pointer'
    },
    secondaryBtn: {
      width: '100%',
      padding: '14px',
      borderRadius: '10px',
      border: '1px solid #cbd5f5',
      background: 'white',
      color: '#2563eb',
      fontWeight: 600,
      fontSize: '1rem',
      textAlign: 'center' as const,
      textDecoration: 'none'
    },
    note: {
      marginTop: '16px',
      fontSize: '0.9rem',
      color: '#475569',
      lineHeight: 1.5
    },
    featureList: {
      listStyle: 'none' as const,
      padding: 0,
      margin: 0,
      display: 'grid',
      gap: '8px',
    },
    featureItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '0.95rem',
      color: '#1f2937',
    },
  };

  const handleEmailClick = () => {
    const plan = billingCycle === 'yearly' ? 'Pro Plan - Yearly ($250/year)' : 'Pro Plan - Monthly ($25/month)';
    const subject = encodeURIComponent(`AutoDoc ${plan} Payment`);
    const body = encodeURIComponent(
      `Hi AutoDoc team,\n\nI would like to subscribe to the ${plan}.\n\nPlease share the payment link/invoice.\n\nCompany/Team Name:\nPreferred currency:\nBilling contact:\n\nThank you!`
    );
    window.location.href = `mailto:sales@autodoc.com?subject=${subject}&body=${body}`;
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <div style={styles.badge}>
          <span role="img" aria-label="lock">🔒</span>
          Secure Checkout
        </div>
        <h1 style={styles.heading}>Upgrade to AutoDoc Pro</h1>
        <p style={styles.subheading}>
          Unlock the full power of AutoDoc's security scanning and code analysis features.
        </p>

        {/* Pricing Section */}
        <div style={styles.pricingSection}>
          <div style={styles.planName}>
            <span>⚡</span> Pro Plan
          </div>
          
          {/* Billing Toggle */}
          <div style={styles.billingToggle}>
            <button
              style={{
                ...styles.toggleBtn,
                background: billingCycle === 'monthly' ? 'white' : 'transparent',
                color: billingCycle === 'monthly' ? '#0f172a' : '#64748b',
                boxShadow: billingCycle === 'monthly' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
              }}
              onClick={() => setBillingCycle('monthly')}
            >
              Monthly
            </button>
            <button
              style={{
                ...styles.toggleBtn,
                background: billingCycle === 'yearly' ? 'white' : 'transparent',
                color: billingCycle === 'yearly' ? '#0f172a' : '#64748b',
                boxShadow: billingCycle === 'yearly' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
              }}
              onClick={() => setBillingCycle('yearly')}
            >
              Yearly
            </button>
          </div>

          <div style={styles.priceContainer}>
            <span style={styles.price}>
              ${billingCycle === 'yearly' ? '250' : '25'}
            </span>
            <span style={styles.pricePeriod}>
              {billingCycle === 'yearly' ? '/year' : '/month'}
            </span>
          </div>
          
          {billingCycle === 'yearly' && (
            <div style={styles.savings}>
              💰 Save $50/year (2 months free!)
            </div>
          )}

          <ul style={styles.featureList}>
            <li style={styles.featureItem}>
              <span style={{ color: '#10b981' }}>✓</span> Unlimited code scans
            </li>
            <li style={styles.featureItem}>
              <span style={{ color: '#10b981' }}>✓</span> Auto-fix all vulnerabilities
            </li>
            <li style={styles.featureItem}>
              <span style={{ color: '#10b981' }}>✓</span> Side-by-side code comparison
            </li>
            <li style={styles.featureItem}>
              <span style={{ color: '#10b981' }}>✓</span> Export security reports
            </li>
            <li style={styles.featureItem}>
              <span style={{ color: '#10b981' }}>✓</span> Priority support
            </li>
            <li style={styles.featureItem}>
              <span style={{ color: '#10b981' }}>✓</span> Team collaboration (up to 5 users)
            </li>
          </ul>
        </div>

        <ul style={styles.checklist}>
          <li style={styles.listItem}>
            <span role="img" aria-label="receipt">🧾</span>
            Receive a personalized invoice in USD or INR with your company details.
          </li>
          <li style={styles.listItem}>
            <span role="img" aria-label="sparkle">⚡</span>
            Instant activation of the Pro workspace once payment is confirmed.
          </li>
          <li style={styles.listItem}>
            <span role="img" aria-label="support">🤝</span>
            Dedicated onboarding call to help your team get value right away.
          </li>
        </ul>
        <div style={styles.ctaRow}>
          <button style={styles.primaryBtn} onClick={handleEmailClick}>
            Subscribe to Pro - ${billingCycle === 'yearly' ? '250/year' : '25/month'}
          </button>
          <Link to="/" style={styles.secondaryBtn}>
            ← Back to Home
          </Link>
        </div>
        <p style={styles.note}>
          Prefer to speak with someone first? Reach us at <a href="tel:+18001234567">+1 (800) 123-4567</a> or reply to
          the confirmation email sent after your free trial signup.
        </p>
      </div>
    </div>
  );
};

export default PaymentsPage;
