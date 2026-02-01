import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [testMode, setTestMode] = useState(true);
  const [userCurrency, setUserCurrency] = useState<'INR' | 'USD'>('INR');
  const [paymentLoading, setPaymentLoading] = useState(false);

  // Test amounts (for testing purposes)
  const TEST_PRICE_INR = 100;  // ₹100 for testing
  const TEST_PRICE_USD = 1;    // $1 for testing
  
  // Production prices
  const USD_TO_INR_RATE = 83;
  const PRO_PLAN_PRICE_USD = 49;
  const PRO_PLAN_PRICE_INR = PRO_PLAN_PRICE_USD * USD_TO_INR_RATE;

  // Check if we're in test mode and detect user's location
  useEffect(() => {
    const isTestMode = window.location.hostname === 'localhost' ||
                      window.location.hostname.includes('test');
    setTestMode(isTestMode);

    // Simple currency detection based on timezone
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const isUS = timezone.includes('America') || 
                 timezone.includes('New_York') || 
                 timezone.includes('Los_Angeles');
    setUserCurrency(isUS ? 'USD' : 'INR');
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showPricingModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showPricingModal]);

  const handlePricingClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowPricingModal(true);
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  // Handle payment with Razorpay Payment Link
  const handlePayment = () => {
    setPaymentLoading(true);
    setShowPricingModal(false);
    
    // Redirect to Razorpay payment page
    window.open('https://razorpay.me/@mathivananponnusamy', '_blank');
    
    // Store pending payment info (user will confirm after returning)
    localStorage.setItem('autodoc_payment_pending', 'true');
    
    setPaymentLoading(false);
    
    // Show confirmation dialog
    setTimeout(() => {
      const confirmed = window.confirm(
        'After completing payment on Razorpay, click OK to activate your Pro plan.'
      );
      
      if (confirmed) {
        // Store subscription data
        localStorage.setItem('autodoc_trial', JSON.stringify({
          started: new Date().toISOString(),
          plan: 'Pro',
          currency: userCurrency,
          amount: userCurrency === 'INR' ? TEST_PRICE_INR : TEST_PRICE_USD
        }));
        localStorage.removeItem('autodoc_payment_pending');
        navigate('/dashboard');
      }
    }, 1000);
  };

  // Handle currency switch
  const handleCurrencySwitch = (currency: 'INR' | 'USD') => {
    setUserCurrency(currency);
  };

  // Pricing plans data
  const pricingPlans = [
    {
      name: 'Free',
      price: '$0',
      description: 'For individuals and small projects',
      features: [
        'Up to 1,000 lines of code per scan',
        'Basic vulnerability scanning',
        '5 auto-fixes per month',
        'Community support',
        'Public workspace access',
      ],
      buttonText: 'Get Started Free',
      highlighted: false,
      onClick: () => {
        setShowPricingModal(false);
        navigate('/workspace');
      },
    },
    {
      name: 'Pro',
      price: '$49',
      description: 'For professional developers and teams',
      features: [
        'Up to 10,000 lines of code per scan',
        'Advanced vulnerability scanning',
        'Unlimited auto-fixes',
        'Priority support',
        'Private repositories',
        'Custom security rules',
      ],
      buttonText: 'Start 14-Min Free Trial',
      highlighted: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'For large organizations',
      features: [
        'Unlimited code scanning',
        'Enterprise-grade security',
        'Dedicated support team',
        'On-premise deployment',
        'Custom integrations',
        'SLA guarantees',
        'Security compliance',
      ],
      buttonText: 'Contact Sales',
      highlighted: false,
      onClick: () => {
        setShowPricingModal(false);
        window.location.href = 'mailto:sales@autodoc.com?subject=Enterprise%20Inquiry';
      },
    },
  ];

  // Styles
  const styles = {
    container: {
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif",
      color: '#333',
      minHeight: '100vh',
      overflow: 'visible' as any,
    },
    mainContent: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 20px',
      position: 'relative' as any,
      zIndex: 1,
    },
    heroSection: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '80px 0',
      minHeight: '80vh',
    },
    heroContent: {
      flex: '1',
      maxWidth: '600px',
    },
    heroTitle: {
      fontSize: '3.5rem',
      fontWeight: 800,
      lineHeight: 1.1,
      marginBottom: '24px',
      color: '#1a1a1a',
    },
    highlight: {
      color: '#2563eb',
      background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    heroSubtitle: {
      fontSize: '1.25rem',
      color: '#666',
      marginBottom: '40px',
      lineHeight: 1.6,
    },
    heroButtons: {
      display: 'flex',
      gap: '16px',
      marginBottom: '60px',
    },
    btn: {
      padding: '14px 32px',
      borderRadius: '8px',
      fontWeight: 600,
      textDecoration: 'none',
      display: 'inline-block',
      transition: 'all 0.2s ease',
      cursor: 'pointer',
      border: 'none',
      fontSize: '1rem',
      fontFamily: "inherit",
    },
    btnPrimary: {
      background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
      color: 'white',
    },
    btnSecondary: {
      background: 'white',
      color: '#2563eb',
      border: '2px solid #2563eb',
    },
    btnLarge: {
      padding: '18px 40px',
      fontSize: '1.1rem',
    },
    heroStats: {
      display: 'flex',
      gap: '40px',
    },
    stat: {
      display: 'flex',
      flexDirection: 'column' as any,
    },
    statNumber: {
      fontSize: '2.5rem',
      fontWeight: 800,
      color: '#2563eb',
    },
    statLabel: {
      color: '#666',
      fontSize: '0.9rem',
      marginTop: '4px',
    },
    heroVisual: {
      flex: '1',
      maxWidth: '500px',
    },
    codeWindow: {
      background: '#1e293b',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    },
    codeHeader: {
      background: '#334155',
      padding: '12px 20px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    windowDots: {
      display: 'flex',
      gap: '8px',
    },
    dot: {
      width: '12px',
      height: '12px',
      borderRadius: '50%',
    },
    fileName: {
      color: '#cbd5e1',
      fontFamily: "'Courier New', monospace",
      fontSize: '0.9rem',
    },
    codeContent: {
      padding: '24px',
    },
    codePre: {
      margin: 0,
      color: '#e2e8f0',
      fontFamily: "'Courier New', monospace",
      fontSize: '0.9rem',
      lineHeight: 1.5,
    },
    trustBar: {
      padding: '40px 0',
      borderTop: '1px solid #e5e7eb',
      borderBottom: '1px solid #e5e7eb',
      margin: '40px 0',
    },
    trustTitle: {
      textAlign: 'center' as any,
      color: '#666',
      marginBottom: '30px',
      fontSize: '0.9rem',
      textTransform: 'uppercase' as any,
      letterSpacing: '1px',
    },
    companyLogos: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '40px',
      flexWrap: 'wrap' as any,
    },
    logo: {
      color: '#9ca3af',
      fontWeight: 600,
      fontSize: '1.1rem',
    },
    sectionHeader: {
      textAlign: 'center' as any,
      maxWidth: '800px',
      margin: '0 auto 60px',
    },
    sectionTitle: {
      fontSize: '2.5rem',
      fontWeight: 700,
      marginBottom: '16px',
      color: '#1a1a1a',
    },
    sectionSubtitle: {
      fontSize: '1.1rem',
      color: '#666',
      lineHeight: 1.6,
    },
    problemSection: {
      padding: '80px 0',
    },
    problemCards: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '30px',
      maxWidth: '1000px',
      margin: '0 auto',
    },
    problemCard: {
      padding: '30px',
      background: '#f8fafc',
      borderRadius: '12px',
      border: '1px solid #e5e7eb',
      transition: 'transform 0.2s ease',
    },
    problemIcon: {
      fontSize: '2rem',
      marginBottom: '20px',
    },
    solutionSection: {
      padding: '80px 0',
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      borderRadius: '20px',
      margin: '40px 0',
    },
    solutionSteps: {
      maxWidth: '800px',
      margin: '0 auto 40px',
    },
    step: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '20px',
      marginBottom: '40px',
    },
    stepNumber: {
      background: '#2563eb',
      color: 'white',
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 700,
      flexShrink: 0,
    },
    useCasesSection: {
      padding: '80px 0',
    },
    useCaseGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '30px',
      maxWidth: '1000px',
      margin: '0 auto',
    },
    useCase: {
      padding: '25px',
      background: 'white',
      border: '1px solid #e5e7eb',
      borderRadius: '12px',
    },
    workspaceCtaSection: {
      padding: '80px 0',
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      borderRadius: '20px',
      margin: '40px 0',
      textAlign: 'center' as any,
    },
    ctaSection: {
      padding: '100px 0',
      background: 'linear-gradient(135deg, #1e40af 0%, #2563eb 100%)',
      borderRadius: '20px',
      margin: '40px 0',
      textAlign: 'center' as any,
    },
    ctaContent: {
      maxWidth: '700px',
      margin: '0 auto',
      color: 'white',
    },
    ctaTitle: {
      fontSize: '2.5rem',
      fontWeight: 700,
      marginBottom: '20px',
    },
    ctaSubtitle: {
      fontSize: '1.1rem',
      marginBottom: '40px',
      opacity: 0.9,
    },
    ctaButtons: {
      display: 'flex',
      gap: '16px',
      justifyContent: 'center',
    },
    ctaNote: {
      marginTop: '30px',
      fontSize: '0.9rem',
      opacity: 0.8,
    },
    pricingModal: {
      position: 'fixed' as any,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      padding: '20px',
      overflowY: 'auto' as any,
    },
    pricingModalContent: {
      background: 'white',
      borderRadius: '16px',
      padding: '40px',
      maxWidth: '800px',
      width: '100%',
      maxHeight: '90vh',
      overflowY: 'auto' as any,
      position: 'relative' as any,
      margin: 'auto',
    },
    closeButton: {
      position: 'absolute' as any,
      top: '20px',
      right: '20px',
      background: 'none',
      border: 'none',
      fontSize: '24px',
      cursor: 'pointer',
      color: '#666',
      zIndex: 2001,
    },
    pricingTitle: {
      fontSize: '2rem',
      fontWeight: 700,
      marginBottom: '30px',
      textAlign: 'center' as any,
      color: '#1a1a1a',
    },
    pricingGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '30px',
      marginBottom: '40px',
    },
    pricingCard: {
      padding: '30px',
      borderRadius: '12px',
      border: '2px solid #e5e7eb',
      transition: 'all 0.3s ease',
    },
    pricingCardHighlighted: {
      borderColor: '#2563eb',
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
    },
    planName: {
      fontSize: '1.5rem',
      fontWeight: 700,
      marginBottom: '10px',
      color: '#1a1a1a',
    },
    planPrice: {
      fontSize: '2.5rem',
      fontWeight: 800,
      marginBottom: '20px',
      color: '#2563eb',
    },
    pricePeriod: {
      fontSize: '1rem',
      color: '#666',
      fontWeight: 400,
    },
    planFeatures: {
      listStyle: 'none' as any,
      padding: '0',
      marginBottom: '30px',
    },
    planFeature: {
      marginBottom: '12px',
      color: '#666',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    featureIcon: {
      color: '#10b981',
      fontSize: '1.2rem',
    },
    planButton: {
      width: '100%',
      padding: '15px',
      borderRadius: '8px',
      fontWeight: 600,
      textDecoration: 'none',
      display: 'inline-block',
      textAlign: 'center' as any,
      cursor: 'pointer',
      border: 'none',
      fontSize: '1rem',
      fontFamily: "inherit",
      transition: 'all 0.2s ease',
    },
    freeTrialNote: {
      textAlign: 'center' as any,
      color: '#666',
      fontSize: '0.9rem',
      marginTop: '30px',
    },
    homepageFooter: {
      padding: '40px 0',
      borderTop: '1px solid #e5e7eb',
      textAlign: 'center' as any,
    },
    footerLinks: {
      display: 'flex',
      justifyContent: 'center',
      gap: '30px',
      marginBottom: '20px',
      flexWrap: 'wrap' as any,
    },
    footerLink: {
      color: '#666',
      textDecoration: 'none',
      transition: 'color 0.2s ease',
      cursor: 'pointer',
    },
    footerCopyright: {
      color: '#9ca3af',
      fontSize: '0.9rem',
    },
  };

  const headerStyles = {
    header: {
      padding: '20px 0',
      borderBottom: '1px solid #e5e7eb',
      position: 'sticky' as any,
      top: 0,
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      zIndex: 1000,
    },
    navContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 20px',
    },
    logoContainer: {
      display: 'flex',
      flexDirection: 'column' as any,
    },
    logo: {
      fontSize: '1.8rem',
      fontWeight: 800,
      color: '#2563eb',
      margin: 0,
      background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      cursor: 'pointer',
    },
    tagline: {
      fontSize: '0.8rem',
      color: '#666',
      fontWeight: 500,
      marginTop: '2px',
    },
    nav: {
      display: 'flex',
      alignItems: 'center',
      gap: '30px',
    },
    navLink: {
      color: '#666',
      textDecoration: 'none',
      fontWeight: 500,
      fontSize: '0.95rem',
      transition: 'color 0.2s ease',
      cursor: 'pointer',
    },
    ctaButton: {
      background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
      color: 'white',
      padding: '10px 20px',
      borderRadius: '6px',
      textDecoration: 'none',
      fontWeight: 600,
      fontSize: '0.95rem',
      transition: 'all 0.2s ease',
      cursor: 'pointer',
      border: 'none',
    },
  };

  // Helper function to combine styles
  const combineStyles = (...styleObjects: any[]): any => {
    return Object.assign({}, ...styleObjects);
  };

  return (
    <div style={styles.container}>
      {/* Header/Navigation Bar */}
      <header style={headerStyles.header}>
        <div style={headerStyles.navContainer}>
          <div style={headerStyles.logoContainer}>
            <h1 style={headerStyles.logo} onClick={handleLogoClick}>
              AutoDoc
            </h1>
            <span style={headerStyles.tagline}>World's First Automated Security Remediation Platform</span>
          </div>
          <nav style={headerStyles.nav}>
            <Link 
              to="/interactive-demo" 
              style={headerStyles.navLink}
            >
              How It Works
            </Link>
            <Link 
              to="/signin" 
              style={headerStyles.navLink}
            >
              Try AutoDoc
            </Link>
            <Link 
              to="/why-autodoc" 
              style={headerStyles.navLink}
            >
              Why AutoDoc?
            </Link>
            <a 
              href="#" 
              style={headerStyles.navLink}
              onClick={handlePricingClick}
            >
              Pricing
            </a>
            <Link 
              to="/free-trial" 
              style={headerStyles.ctaButton}
            >
              Start Free Trial
            </Link>
            <Link 
              to="/signin" 
              style={headerStyles.navLink}
            >
              Sign In
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content Wrapper */}
      <div style={styles.mainContent}>
        {/* Hero Section */}
        <section style={styles.heroSection}>
          <div style={styles.heroContent}>
            <h1 style={styles.heroTitle}>
              Ship Secure Code <span style={styles.highlight}>Faster.</span> Automatically.
            </h1>
            <p style={styles.heroSubtitle}>
              AutoDoc finds and fixes security vulnerabilities in your codebase, 
              delivering ready-to-merge patches with a single click.
            </p>
            <div style={styles.heroButtons}>
              <Link 
                to="/free-trial" 
                style={combineStyles(styles.btn, styles.btnPrimary)}
              >
                Start Free Trial
              </Link>
              <Link 
                to="/signin" 
                style={combineStyles(styles.btn, styles.btnSecondary)}
              >
                Try AutoDoc Free
              </Link>
            </div>
            <div style={styles.heroStats}>
              <div style={styles.stat}>
                <span style={styles.statNumber}>99%</span>
                <span style={styles.statLabel}>Accuracy Rate</span>
              </div>
              <div style={styles.stat}>
                <span style={styles.statNumber}>10x</span>
                <span style={styles.statLabel}>Faster Remediation</span>
              </div>
              <div style={styles.stat}>
                <span style={styles.statNumber}>24/7</span>
                <span style={styles.statLabel}>Automated Protection</span>
              </div>
            </div>
          </div>
          <div style={styles.heroVisual}>
            <div style={styles.codeWindow}>
              <div style={styles.codeHeader}>
                <div style={styles.windowDots}>
                  <span style={{...styles.dot, background: '#ef4444'}}></span>
                  <span style={{...styles.dot, background: '#f59e0b'}}></span>
                  <span style={{...styles.dot, background: '#10b981'}}></span>
                </div>
                <span style={styles.fileName}>vulnerability.js</span>
              </div>
              <div style={styles.codeContent}>
                <pre style={styles.codePre}>
{`// BEFORE AutoDoc
app.get('/user/:id', (req, res) => {
  const userId = req.params.id;
  db.query(\`SELECT * FROM users WHERE id = \${userId}\`);
});

// AFTER AutoDoc
app.get('/user/:id', (req, res) => {
  const userId = parseInt(req.params.id, 10);
  db.query('SELECT * FROM users WHERE id = ?', [userId]);
});`}
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* Problem Section */}
        <section style={styles.problemSection}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Tired of Security Alert Fatigue?</h2>
            <p style={styles.sectionSubtitle}>
              Traditional scanners overwhelm developers with warnings but leave the hard work to you.
            </p>
          </div>
          <div style={styles.problemCards}>
            <div style={styles.problemCard}>
              <div style={styles.problemIcon}>⚠️</div>
              <h3 style={{fontSize: '1.5rem', marginBottom: '12px', color: '#1a1a1a'}}>Thousands of Alerts</h3>
              <p style={{color: '#666', lineHeight: 1.6}}>
                Security tools flood you with findings, but offer no clear path to fix them.
              </p>
            </div>
            <div style={styles.problemCard}>
              <div style={styles.problemIcon}>⏳</div>
              <h3 style={{fontSize: '1.5rem', marginBottom: '12px', color: '#1a1a1a'}}>Days of Manual Work</h3>
              <p style={{color: '#666', lineHeight: 1.6}}>
                Each vulnerability requires hours of research, testing, and implementation.
              </p>
            </div>
            <div style={styles.problemCard}>
              <div style={styles.problemIcon}>💸</div>
              <h3 style={{fontSize: '1.5rem', marginBottom: '12px', color: '#1a1a1a'}}>Costly Delays</h3>
              <p style={{color: '#666', lineHeight: 1.6}}>
                Security backlog slows down releases and increases risk exposure.
              </p>
            </div>
          </div>
        </section>

        {/* Solution / Core Innovation Section */}
        <section style={styles.solutionSection}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>
              The World's First Automated Security Remediation Platform
            </h2>
            <p style={styles.sectionSubtitle}>
              Unlike traditional security scanners that bombard developers with warnings, 
              AutoDoc automatically writes the remediation code itself.
            </p>
          </div>
          <div style={styles.solutionSteps}>
            <div style={styles.step}>
              <div style={styles.stepNumber}>1</div>
              <div>
                <h3 style={{fontSize: '1.5rem', marginBottom: '8px', color: '#1a1a1a'}}>Scan & Identify</h3>
                <p style={{color: '#666', lineHeight: 1.6}}>
                  AutoDoc reads your codebase and identifies security vulnerabilities with precision.
                </p>
              </div>
            </div>
            <div style={styles.step}>
              <div style={styles.stepNumber}>2</div>
              <div>
                <h3 style={{fontSize: '1.5rem', marginBottom: '8px', color: '#1a1a1a'}}>Generate Fix</h3>
                <p style={{color: '#666', lineHeight: 1.6}}>
                  Our AI analyzes the vulnerability and generates the exact code needed to fix it.
                </p>
              </div>
            </div>
            <div style={styles.step}>
              <div style={styles.stepNumber}>3</div>
              <div>
                <h3 style={{fontSize: '1.5rem', marginBottom: '8px', color: '#1a1a1a'}}>Document & Deploy</h3>
                <p style={{color: '#666', lineHeight: 1.6}}>
                  Every fix comes with proper documentation and is ready for your review and merge.
                </p>
              </div>
            </div>
          </div>
          <div style={{textAlign: 'center'}}>
            <Link 
              to="/interactive-demo" 
              style={combineStyles(styles.btn, {background: 'transparent', color: '#2563eb', border: '2px solid #2563eb'})}
            >
              Learn More About Our Technology →
            </Link>
          </div>
        </section>

        {/* Use Cases */}
        <section style={styles.useCasesSection}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Fix Critical Vulnerabilities in Minutes</h2>
            <p style={styles.sectionSubtitle}>AutoDoc handles the most common and dangerous security issues automatically.</p>
          </div>
          <div style={styles.useCaseGrid}>
            <div style={styles.useCase}>
              <h3 style={{fontSize: '1.25rem', marginBottom: '12px', color: '#1a1a1a'}}>SQL Injection</h3>
              <p style={{color: '#666', lineHeight: 1.6}}>Converts raw SQL queries to parameterized statements automatically.</p>
            </div>
            <div style={styles.useCase}>
              <h3 style={{fontSize: '1.25rem', marginBottom: '12px', color: '#1a1a1a'}}>XSS Attacks</h3>
              <p style={{color: '#666', lineHeight: 1.6}}>Adds proper output encoding and Content Security Policies.</p>
            </div>
            <div style={styles.useCase}>
              <h3 style={{fontSize: '1.25rem', marginBottom: '12px', color: '#1a1a1a'}}>Secrets Exposure</h3>
              <p style={{color: '#666', lineHeight: 1.6}}>Finds and redacts hard-coded API keys and passwords.</p>
            </div>
            <div style={styles.useCase}>
              <h3 style={{fontSize: '1.25rem', marginBottom: '12px', color: '#1a1a1a'}}>Insecure Dependencies</h3>
              <p style={{color: '#666', lineHeight: 1.6}}>Upgrades vulnerable packages with backward-compatible fixes.</p>
            </div>
          </div>
        </section>

        {/* Workspace CTA Section */}
        <section style={styles.workspaceCtaSection}>
          <div style={{maxWidth: '800px', margin: '0 auto'}}>
            <h2 style={{fontSize: '2.5rem', fontWeight: 700, marginBottom: '20px', color: '#1a1a1a'}}>
              Try AutoDoc Right Now
            </h2>
            <p style={{fontSize: '1.1rem', color: '#666', lineHeight: 1.6, marginBottom: '40px'}}>
              No signup required. Upload your code and see AutoDoc fix security vulnerabilities in real-time.
            </p>
            <Link 
              to="/interactive-demo" 
              style={combineStyles(styles.btn, styles.btnPrimary, styles.btnLarge)}
            >
              🚀 Launch AutoDoc Workspace
            </Link>
            <p style={{marginTop: '20px', color: '#666', fontSize: '0.9rem'}}>
              Free • No credit card • Works with JavaScript, Python, Java, Go, and more
            </p>
          </div>
        </section>

        {/* Final CTA Section */}
        <section style={styles.ctaSection}>
          <div style={styles.ctaContent}>
            <h2 style={styles.ctaTitle}>Ready to Automate Your Security Remediation?</h2>
            <p style={styles.ctaSubtitle}>
              Join thousands of developers who ship secure code faster with AutoDoc.
            </p>
            <div style={styles.ctaButtons}>
              <Link 
                to="/free-trial" 
                style={combineStyles(styles.btn, styles.btnPrimary, styles.btnLarge)}
              >
                Start Your Free Trial
              </Link>
              <Link 
                to="/signin" 
                style={combineStyles(styles.btn, styles.btnSecondary, styles.btnLarge)}
              >
                Try AutoDoc Free
              </Link>
            </div>
            <p style={styles.ctaNote}>
              No credit card required • 14-min free trial • Setup in 5 minutes
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer style={styles.homepageFooter}>
          <div style={styles.footerLinks}>
            <Link to="/interactive-demo" style={styles.footerLink}>
              How It Works
            </Link>
            <Link to="/signin" style={styles.footerLink}>
              Try AutoDoc
            </Link>
            <Link to="/why-autodoc" style={styles.footerLink}>
              Why AutoDoc?
            </Link>
            <a href="#" style={styles.footerLink} onClick={handlePricingClick}>
              Pricing
            </a>
            <a href="#" style={styles.footerLink} onClick={(e) => {
              e.preventDefault();
              window.location.href = 'mailto:contact@autodoc.com?subject=Contact%20Inquiry';
            }}>
              Contact
            </a>
          </div>
          <div style={styles.footerCopyright}>
            <p>© {new Date().getFullYear()} AutoDoc. All rights reserved.</p>
          </div>
        </footer>
      </div>

      {/* Pricing Modal */}
      {showPricingModal && (
        <div style={styles.pricingModal} onClick={() => setShowPricingModal(false)}>
          <div style={styles.pricingModalContent} onClick={(e) => e.stopPropagation()}>
            <button 
              style={styles.closeButton}
              onClick={() => setShowPricingModal(false)}
            >
              ×
            </button>
            <h2 style={styles.pricingTitle}>Choose Your Plan</h2>
            
            {/* Test Mode Indicator */}
            {testMode && (
              <div style={{
                background: '#fef3c7',
                color: '#92400e',
                padding: '10px 15px',
                borderRadius: '6px',
                marginBottom: '20px',
                border: '1px solid #f59e0b',
                textAlign: 'center'
              }}>
                🧪 <strong>TEST MODE</strong> - Demo billing environment active
              </div>
            )}
            
            <div style={styles.pricingGrid}>
              {pricingPlans.map((plan, index) => (
                <div 
                  key={index}
                  style={combineStyles(
                    styles.pricingCard, 
                    plan.highlighted ? styles.pricingCardHighlighted : {}
                  )}
                >
                  <h3 style={styles.planName}>{plan.name}</h3>
                  
                  {/* Dual Currency Display for Pro Plan */}
                  {plan.name === 'Pro' ? (
                    <>
                      <div style={{ marginBottom: '20px' }}>
                        {/* Currency Switch */}
                        <div style={{
                          display: 'flex',
                          background: '#f3f4f6',
                          borderRadius: '8px',
                          padding: '4px',
                          marginBottom: '15px'
                        }}>
                          <button
                            onClick={() => handleCurrencySwitch('USD')}
                            style={{
                              flex: 1,
                              padding: '10px',
                              background: userCurrency === 'USD' ? '#2563eb' : 'transparent',
                              color: userCurrency === 'USD' ? 'white' : '#666',
                              border: 'none',
                              borderRadius: '6px',
                              fontWeight: 600,
                              cursor: 'pointer'
                            }}
                          >
                            USD
                          </button>
                          <button
                            onClick={() => handleCurrencySwitch('INR')}
                            style={{
                              flex: 1,
                              padding: '10px',
                              background: userCurrency === 'INR' ? '#2563eb' : 'transparent',
                              color: userCurrency === 'INR' ? 'white' : '#666',
                              border: 'none',
                              borderRadius: '6px',
                              fontWeight: 600,
                              cursor: 'pointer'
                            }}
                          >
                            INR
                          </button>
                        </div>
                        
                        {/* Price Display */}
                        <div style={styles.planPrice}>
                          {userCurrency === 'USD' ? '$49' : `₹${PRO_PLAN_PRICE_INR}`}
                          <span style={styles.pricePeriod}>/month</span>
                        </div>
                        
                        {/* Conversion Note */}
                        <p style={{ color: '#666', fontSize: '0.9rem' }}>
                          {userCurrency === 'USD' 
                            ? `≈ ₹${PRO_PLAN_PRICE_INR} (₹1 = $${(1/USD_TO_INR_RATE).toFixed(4)})`
                            : `≈ $${PRO_PLAN_PRICE_USD} ($1 = ₹${USD_TO_INR_RATE})`
                          }
                        </p>
                      </div>
                    </>
                  ) : (
                    <div style={styles.planPrice}>
                      {plan.price}
                      {plan.price !== 'Custom' && <span style={styles.pricePeriod}>/month</span>}
                    </div>
                  )}
                  
                  <p style={{color: '#666', marginBottom: '20px'}}>{plan.description}</p>
                  <ul style={styles.planFeatures}>
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} style={styles.planFeature}>
                        <span style={styles.featureIcon}>✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  {plan.name === 'Pro' ? (
                    // Payment Options for Pro Plan
                    <div style={{ marginTop: '25px' }}>
                      <button
                        onClick={handlePayment}
                        disabled={paymentLoading}
                        style={{
                          width: '100%',
                          padding: '15px',
                          background: paymentLoading ? '#9ca3af' : (userCurrency === 'INR' ? '#2563eb' : '#059669'),
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          fontWeight: 600,
                          cursor: paymentLoading ? 'not-allowed' : 'pointer',
                          fontSize: '1rem'
                        }}
                      >
                        {paymentLoading 
                          ? 'Processing...'
                          : userCurrency === 'INR' 
                            ? `Pay ₹${TEST_PRICE_INR} (Test)` 
                            : `Pay $${TEST_PRICE_USD} (Test)`}
                      </button>
                      <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '8px', textAlign: 'center' }}>
                        Test mode: ₹{TEST_PRICE_INR} / ${TEST_PRICE_USD}
                      </p>
                      <div style={{
                        marginTop: '10px',
                        textAlign: 'center'
                      }}>
                        <button
                          onClick={() => handleCurrencySwitch(userCurrency === 'INR' ? 'USD' : 'INR')}
                          style={{
                            background: 'transparent',
                            color: '#2563eb',
                            border: 'none',
                            fontSize: '0.9rem',
                            cursor: 'pointer',
                            textDecoration: 'underline'
                          }}
                        >
                          {userCurrency === 'INR' ? 'Pay in USD instead?' : 'Pay in Indian Rupees instead?'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Regular buttons for Free and Enterprise
                    <button 
                      style={combineStyles(
                        styles.planButton,
                        plan.name === 'Enterprise' ? 
                          combineStyles(styles.btn, styles.btnSecondary) : 
                          combineStyles(styles.btn, {background: 'transparent', color: '#2563eb', border: '2px solid #2563eb'})
                      )}
                      onClick={plan.onClick}
                    >
                      {plan.buttonText}
                    </button>
                  )}
                </div>
              ))}
            </div>
            <p style={styles.freeTrialNote}>
              All paid plans include a 14-min free trial. No credit card required to start.
            </p>
          </div>
        </div>
      )}

      {/* Test Mode Indicator */}
      {testMode && (
        <div style={{
          position: 'fixed',
          bottom: '10px',
          right: '10px',
          background: '#f59e0b',
          color: '#92400e',
          padding: '5px 10px',
          borderRadius: '4px',
          fontSize: '0.8rem',
          fontWeight: 600,
          zIndex: 9999,
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
        }}>
          TEST MODE
        </div>
      )}
    </div>
  );
};

export default HomePage;