import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Plan {
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
}

function PricingPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await fetch('/api/pricing/plans');
      const data = await response.json();
      setPlans(data);
    } catch (error) {
      console.error('Failed to fetch plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlanSelection = (plan: Plan) => {
    if (plan.price === 0) {
      navigate('/workspace');
      return;
    }

    const subject = encodeURIComponent(`AutoDoc ${plan.name} Plan Inquiry`);
    const body = encodeURIComponent(
      `Hi AutoDoc team,\n\nI'm interested in the ${plan.name} plan. ` +
      `Please share the next steps to get started.\n\nThanks!`
    );

    window.location.href = `mailto:sales@autodoc.com?subject=${subject}&body=${body}`;
  };

  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '40px 20px',
      fontFamily: "'Inter', sans-serif"
    },
    header: {
      textAlign: 'center' as const,
      marginBottom: '60px'
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: 700,
      color: '#1f2937',
      marginBottom: '16px'
    },
    subtitle: {
      fontSize: '1.125rem',
      color: '#6b7280',
      maxWidth: '600px',
      margin: '0 auto'
    },
    plansGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '32px',
      marginBottom: '60px'
    },
    planCard: {
      background: 'white',
      borderRadius: '12px',
      border: '1px solid #e5e7eb',
      padding: '32px',
      transition: 'all 0.3s ease',
      position: 'relative' as const,
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
      }
    },
    popularBadge: {
      position: 'absolute' as const,
      top: '-12px',
      left: '50%',
      transform: 'translateX(-50%)',
      background: '#1f6feb',
      color: 'white',
      padding: '6px 16px',
      borderRadius: '20px',
      fontSize: '0.875rem',
      fontWeight: 600
    },
    planName: {
      fontSize: '1.5rem',
      fontWeight: 600,
      color: '#1f2937',
      marginBottom: '12px'
    },
    planDescription: {
      fontSize: '1rem',
      color: '#6b7280',
      marginBottom: '24px',
      minHeight: '48px'
    },
    priceContainer: {
      marginBottom: '24px'
    },
    price: {
      fontSize: '3rem',
      fontWeight: 700,
      color: '#1f2937'
    },
    pricePeriod: {
      fontSize: '1rem',
      color: '#6b7280'
    },
    featuresList: {
      listStyle: 'none',
      padding: 0,
      marginBottom: '32px'
    },
    featureItem: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '12px',
      fontSize: '0.95rem',
      color: '#4b5563'
    },
    featureIcon: {
      marginRight: '12px',
      color: '#10b981',
      fontSize: '1.25rem'
    },
    button: {
      width: '100%',
      padding: '14px 24px',
      fontSize: '1rem',
      fontWeight: 600,
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    },
    primaryButton: {
      background: '#1f6feb',
      color: 'white',
      '&:hover': {
        background: '#1a5fd8'
      }
    },
    secondaryButton: {
      background: 'white',
      color: '#1f6feb',
      border: '2px solid #1f6feb',
      '&:hover': {
        background: '#f3f4f6'
      }
    },
    comparisonTable: {
      background: 'white',
      borderRadius: '12px',
      border: '1px solid #e5e7eb',
      overflow: 'hidden'
    },
    tableHeader: {
      background: '#f9fafb',
      padding: '24px',
      borderBottom: '1px solid #e5e7eb'
    },
    tableRow: {
      display: 'grid',
      gridTemplateColumns: '1fr repeat(4, 150px)',
      padding: '20px 24px',
      borderBottom: '1px solid #e5e7eb',
      alignItems: 'center'
    },
    tableCell: {
      padding: '8px'
    },
    featureName: {
      fontWeight: 500,
      color: '#1f2937'
    },
    featureValue: {
      textAlign: 'center' as const,
      color: '#4b5563'
    },
    checkIcon: {
      color: '#10b981',
      fontSize: '1.25rem'
    },
    xIcon: {
      color: '#ef4444',
      fontSize: '1.25rem'
    }
  };

  if (loading) {
    return <div style={styles.container}>Loading plans...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Choose Your Security Plan</h1>
        <p style={styles.subtitle}>
          Secure your code with our automated security platform. Start with a free plan and upgrade as you grow.
        </p>
      </div>

      <div style={styles.plansGrid}>
        {plans.map((plan) => (
          <div 
            key={plan._id} 
            style={{
              ...styles.planCard,
              borderColor: plan.name === 'Pro' ? '#1f6feb' : '#e5e7eb',
              borderWidth: plan.name === 'Pro' ? '2px' : '1px'
            }}
          >
            {plan.name === 'Pro' && (
              <div style={styles.popularBadge}>MOST POPULAR</div>
            )}
            
            <h3 style={styles.planName}>{plan.name}</h3>
            <p style={styles.planDescription}>{plan.description}</p>
            
            <div style={styles.priceContainer}>
              <span style={styles.price}>${plan.price}</span>
              <span style={styles.pricePeriod}>/month</span>
            </div>
            
            <ul style={styles.featuresList}>
              {plan.features.map((feature, index) => (
                <li key={index} style={styles.featureItem}>
                  <span style={styles.featureIcon}>✓</span>
                  {feature}
                </li>
              ))}
              <li style={styles.featureItem}>
                <span style={styles.featureIcon}>✓</span>
                {plan.scansPerMonth} scans/month
              </li>
              <li style={styles.featureItem}>
                <span style={styles.featureIcon}>✓</span>
                Up to {plan.maxFileSize}MB files
              </li>
              <li style={styles.featureItem}>
                <span style={styles.featureIcon}>✓</span>
                {plan.autoFixLimit} auto-fixes/month
              </li>
              <li style={styles.featureItem}>
                <span style={styles.featureIcon}>
                  {plan.teamMembers > 1 ? '✓' : '✗'}
                </span>
                {plan.teamMembers > 1 ? `${plan.teamMembers} team members` : 'Single user'}
              </li>
              <li style={styles.featureItem}>
                <span style={styles.featureIcon}>
                  {plan.prioritySupport ? '✓' : '✗'}
                </span>
                {plan.prioritySupport ? 'Priority support' : 'Standard support'}
              </li>
            </ul>
            
            <button
              style={{
                ...styles.button,
                ...(plan.name === 'Pro' ? styles.primaryButton : styles.secondaryButton)
              }}
              onClick={() => handlePlanSelection(plan)}
            >
              {plan.price === 0 ? 'Get Started Free' : 'Contact Sales'}
            </button>
          </div>
        ))}
      </div>

      <div style={styles.comparisonTable}>
        <div style={styles.tableHeader}>
          <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>Feature Comparison</h3>
        </div>
        
        <div style={styles.tableRow}>
          <div style={{...styles.tableCell, ...styles.featureName}}>Feature</div>
          {plans.map(plan => (
            <div key={plan._id} style={{...styles.tableCell, ...styles.featureValue}}>
              {plan.name}
            </div>
          ))}
        </div>
        
        {[
          { name: 'Monthly Scans', key: 'scansPerMonth', unit: '' },
          { name: 'Max File Size', key: 'maxFileSize', unit: 'MB' },
          { name: 'Auto-Fixes', key: 'autoFixLimit', unit: '/month' },
          { name: 'Team Members', key: 'teamMembers', unit: '' },
          { name: 'Priority Support', key: 'prioritySupport', type: 'boolean' },
          { name: 'PDF Reports', key: 'pdfReports', type: 'boolean' },
          { name: 'API Access', key: 'apiAccess', type: 'boolean' },
          { name: 'Custom Rules', key: 'customRules', type: 'boolean' },
        ].map((feature, index) => (
          <div key={index} style={styles.tableRow}>
            <div style={{...styles.tableCell, ...styles.featureName}}>{feature.name}</div>
            {plans.map(plan => (
              <div key={plan._id} style={{...styles.tableCell, ...styles.featureValue}}>
                {feature.type === 'boolean' ? (
                  <span style={plan[feature.key as keyof Plan] ? styles.checkIcon : styles.xIcon}>
                    {plan[feature.key as keyof Plan] ? '✓' : '✗'}
                  </span>
                ) : (
                  `${plan[feature.key as keyof Plan]}${feature.unit}`
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default PricingPage;