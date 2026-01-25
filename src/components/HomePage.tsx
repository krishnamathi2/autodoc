import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Define CSS properties as constants
const CSS = {
  position: {
    sticky: 'sticky' as any,
    fixed: 'fixed' as any,
    relative: 'relative' as any,
    absolute: 'absolute' as any,
    static: 'static' as any,
  },
  display: {
    flex: 'flex' as any,
    block: 'block' as any,
    inline: 'inline' as any,
    inlineBlock: 'inline-block' as any,
    grid: 'grid' as any,
    none: 'none' as any,
  },
  flexDirection: {
    column: 'column' as any,
    row: 'row' as any,
    columnReverse: 'column-reverse' as any,
    rowReverse: 'row-reverse' as any,
  },
  alignItems: {
    center: 'center' as any,
    start: 'flex-start' as any,
    end: 'flex-end' as any,
    stretch: 'stretch' as any,
    flexStart: 'flex-start' as any,
  },
  justifyContent: {
    center: 'center' as any,
    start: 'flex-start' as any,
    end: 'flex-end' as any,
    between: 'space-between' as any,
    around: 'space-around' as any,
  },
  textAlign: {
    center: 'center' as any,
    left: 'left' as any,
    right: 'right' as any,
    justify: 'justify' as any,
  },
  textTransform: {
    uppercase: 'uppercase' as any,
    lowercase: 'lowercase' as any,
    capitalize: 'capitalize' as any,
    none: 'none' as any,
  },
  flexWrap: {
    wrap: 'wrap' as any,
    nowrap: 'nowrap' as any,
    wrapReverse: 'wrap-reverse' as any,
  },
  overflow: {
    auto: 'auto' as any,
    scroll: 'scroll' as any,
    hidden: 'hidden' as any,
    visible: 'visible' as any,
  },
  overflowY: {
    auto: 'auto' as any,
    scroll: 'scroll' as any,
    hidden: 'hidden' as any,
    visible: 'visible' as any,
  },
  cursor: {
    pointer: 'pointer' as any,
    default: 'default' as any,
  },
  listStyle: {
    none: 'none' as any,
  },
};

// Define Razorpay types
interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => Promise<void> | void;
  prefill: {
    name: string;
    email: string;
    contact?: string;
  };
  notes: Record<string, string>;
  theme: {
    color: string;
  };
  modal: {
    ondismiss: () => void;
  };
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayInstance {
  open: () => void;
  close: () => void;
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

// Define plan interface
interface Plan {
  name: string;
  price: string;
  amount: number; // Amount in paise
  description: string;
  features: string[];
  buttonText: string;
  buttonStyle: React.CSSProperties;
  highlighted: boolean;
  onClick: () => void;
}

const HomePage = () => {
  const navigate = useNavigate();
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [checkoutData, setCheckoutData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize Razorpay script on component mount
  useEffect(() => {
    const initializeRazorpay = () => {
      if (window.Razorpay) {
        setRazorpayLoaded(true);
        return;
      }

      // Load Razorpay script dynamically
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      
      script.onload = () => {
        setRazorpayLoaded(true);
        console.log('Razorpay script loaded successfully');
      };
      
      script.onerror = () => {
        console.error('Failed to load Razorpay script');
        setError('Payment system failed to load. Please refresh the page.');
      };
      
      document.head.appendChild(script);

      return () => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      };
    };

    initializeRazorpay();
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showPricingModal || showCheckout) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showPricingModal, showCheckout]);

  // Helper function to combine multiple style objects
  const combineStyles = (...styleObjects: React.CSSProperties[]): React.CSSProperties => {
    return Object.assign({}, ...styleObjects);
  };

  // Checkout page styles
  const checkoutStyles: Record<string, React.CSSProperties> = {
    checkoutModal: {
      position: CSS.position.fixed,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      display: CSS.display.flex,
      alignItems: CSS.alignItems.center,
      justifyContent: CSS.justifyContent.center,
      zIndex: 3000,
      padding: '20px',
      overflowY: CSS.overflowY.auto,
    },
    checkoutContent: {
      background: 'white',
      borderRadius: '16px',
      padding: '40px',
      maxWidth: '1000px',
      width: '100%',
      maxHeight: '90vh',
      overflowY: CSS.overflowY.auto,
      position: CSS.position.relative,
      margin: 'auto',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    },
    checkoutCloseButton: {
      position: CSS.position.absolute,
      top: '20px',
      right: '20px',
      background: 'none',
      border: 'none',
      fontSize: '24px',
      cursor: CSS.cursor.pointer,
      color: '#666',
      zIndex: 3001,
    },
    checkoutHeader: {
      textAlign: CSS.textAlign.center,
      marginBottom: '30px',
    },
    checkoutGrid: {
      display: CSS.display.grid,
      gridTemplateColumns: '1fr 1fr',
      gap: '40px',
      marginBottom: '40px',
    },
    orderSummary: {
      background: '#f8fafc',
      padding: '30px',
      borderRadius: '12px',
      border: '1px solid #e5e7eb',
    },
    paymentSection: {
      background: 'white',
      padding: '30px',
      borderRadius: '12px',
      border: '1px solid #e5e7eb',
    },
    planCard: {
      background: 'white',
      padding: '20px',
      borderRadius: '8px',
      marginBottom: '20px',
      border: '1px solid #e5e7eb',
    },
    planHeader: {
      display: CSS.display.flex,
      justifyContent: CSS.justifyContent.between,
      alignItems: CSS.alignItems.center,
      marginBottom: '15px',
    },
    planPrice: {
      fontSize: '2rem',
      fontWeight: 700,
      color: '#2563eb',
    },
    trialNote: {
      background: '#dbeafe',
      padding: '12px',
      borderRadius: '6px',
      marginTop: '15px',
      border: '1px solid #93c5fd',
    },
    totalSection: {
      borderTop: '2px solid #e5e7eb',
      paddingTop: '20px',
    },
    totalRow: {
      display: CSS.display.flex,
      justifyContent: CSS.justifyContent.between,
      marginBottom: '10px',
      color: '#666',
    },
    paymentForm: {
      marginTop: '20px',
    },
    formGroup: {
      marginBottom: '20px',
    },
    formRow: {
      display: CSS.display.grid,
      gridTemplateColumns: '1fr 1fr',
      gap: '20px',
    },
    securityNote: {
      background: '#f0f9ff',
      padding: '15px',
      borderRadius: '6px',
      margin: '20px 0',
      border: '1px solid #bae6fd',
    },
    submitPaymentButton: {
      width: '100%',
      padding: '16px',
      background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      fontSize: '1.1rem',
      fontWeight: 600,
      cursor: CSS.cursor.pointer,
      transition: 'all 0.2s',
    },
    successMessage: {
      textAlign: CSS.textAlign.center,
      padding: '40px 20px',
    },
  };

  const headerStyles: Record<string, React.CSSProperties> = {
    header: {
      padding: '20px 0',
      borderBottom: '1px solid #e5e7eb',
      position: CSS.position.sticky,
      top: 0,
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      zIndex: 1000,
    },
    navContainer: {
      display: CSS.display.flex,
      justifyContent: CSS.justifyContent.between,
      alignItems: CSS.alignItems.center,
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 20px',
    },
    logoContainer: {
      display: CSS.display.flex,
      flexDirection: CSS.flexDirection.column,
    },
    logo: {
      fontSize: '1.8rem',
      fontWeight: 800,
      color: '#2563eb',
      margin: 0,
      background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      cursor: CSS.cursor.pointer,
    },
    tagline: {
      fontSize: '0.8rem',
      color: '#666',
      fontWeight: 500,
      marginTop: '2px',
    },
    nav: {
      display: CSS.display.flex,
      alignItems: CSS.alignItems.center,
      gap: '30px',
    },
    navLink: {
      color: '#666',
      textDecoration: 'none',
      fontWeight: 500,
      fontSize: '0.95rem',
      transition: 'color 0.2s ease',
      cursor: CSS.cursor.pointer,
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
      cursor: CSS.cursor.pointer,
      border: 'none',
    },
  };

  const styles: Record<string, React.CSSProperties> = {
    container: {
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif",
      color: '#333',
      minHeight: '100vh',
      overflow: 'visible',
    },
    mainContent: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 20px',
      position: 'relative' as any,
      zIndex: 1,
    },
    heroSection: {
      display: CSS.display.flex,
      alignItems: CSS.alignItems.center,
      justifyContent: CSS.justifyContent.between,
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
      display: CSS.display.flex,
      gap: '16px',
      marginBottom: '60px',
    },
    btn: {
      padding: '14px 32px',
      borderRadius: '8px',
      fontWeight: 600,
      textDecoration: 'none',
      display: CSS.display.inlineBlock,
      transition: 'all 0.2s ease',
      cursor: CSS.cursor.pointer,
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
    btnOutline: {
      background: 'transparent',
      color: '#2563eb',
      border: '2px solid #2563eb',
    },
    btnLarge: {
      padding: '18px 40px',
      fontSize: '1.1rem',
    },
    heroStats: {
      display: CSS.display.flex,
      gap: '40px',
    },
    stat: {
      display: CSS.display.flex,
      flexDirection: CSS.flexDirection.column,
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
      display: CSS.display.flex,
      alignItems: CSS.alignItems.center,
      gap: '12px',
    },
    windowDots: {
      display: CSS.display.flex,
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
      textAlign: CSS.textAlign.center,
      color: '#666',
      marginBottom: '30px',
      fontSize: '0.9rem',
      textTransform: CSS.textTransform.uppercase,
      letterSpacing: '1px',
    },
    companyLogos: {
      display: CSS.display.flex,
      justifyContent: CSS.justifyContent.center,
      alignItems: CSS.alignItems.center,
      gap: '40px',
      flexWrap: CSS.flexWrap.wrap,
    },
    logo: {
      color: '#9ca3af',
      fontWeight: 600,
      fontSize: '1.1rem',
    },
    sectionHeader: {
      textAlign: CSS.textAlign.center,
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
      display: CSS.display.grid,
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
      display: CSS.display.flex,
      alignItems: CSS.alignItems.flexStart,
      gap: '20px',
      marginBottom: '40px',
    },
    stepNumber: {
      background: '#2563eb',
      color: 'white',
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      display: CSS.display.flex,
      alignItems: CSS.alignItems.center,
      justifyContent: CSS.justifyContent.center,
      fontWeight: 700,
      flexShrink: 0,
    },
    useCasesSection: {
      padding: '80px 0',
    },
    useCaseGrid: {
      display: CSS.display.grid,
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
      textAlign: CSS.textAlign.center,
    },
    ctaSection: {
      padding: '100px 0',
      background: 'linear-gradient(135deg, #1e40af 0%, #2563eb 100%)',
      borderRadius: '20px',
      margin: '40px 0',
      textAlign: CSS.textAlign.center,
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
      display: CSS.display.flex,
      gap: '16px',
      justifyContent: CSS.justifyContent.center,
    },
    ctaNote: {
      marginTop: '30px',
      fontSize: '0.9rem',
      opacity: 0.8,
    },
    pricingModal: {
      position: CSS.position.fixed,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: CSS.display.flex,
      alignItems: CSS.alignItems.center,
      justifyContent: CSS.justifyContent.center,
      zIndex: 2000,
      padding: '20px',
      overflowY: CSS.overflowY.auto,
    },
    pricingModalContent: {
      background: 'white',
      borderRadius: '16px',
      padding: '40px',
      maxWidth: '800px',
      width: '100%',
      maxHeight: '90vh',
      overflowY: CSS.overflowY.auto,
      position: CSS.position.relative,
      margin: 'auto',
    },
    closeButton: {
      position: CSS.position.absolute,
      top: '20px',
      right: '20px',
      background: 'none',
      border: 'none',
      fontSize: '24px',
      cursor: CSS.cursor.pointer,
      color: '#666',
      zIndex: 2001,
    },
    pricingTitle: {
      fontSize: '2rem',
      fontWeight: 700,
      marginBottom: '30px',
      textAlign: CSS.textAlign.center,
      color: '#1a1a1a',
    },
    pricingGrid: {
      display: CSS.display.grid,
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
      listStyle: CSS.listStyle.none,
      padding: '0',
      marginBottom: '30px',
    },
    planFeature: {
      marginBottom: '12px',
      color: '#666',
      display: CSS.display.flex,
      alignItems: CSS.alignItems.center,
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
      display: CSS.display.inlineBlock,
      textAlign: CSS.textAlign.center,
      cursor: CSS.cursor.pointer,
      border: 'none',
      fontSize: '1rem',
      fontFamily: "inherit",
      transition: 'all 0.2s ease',
    },
    freeTrialNote: {
      textAlign: CSS.textAlign.center,
      color: '#666',
      fontSize: '0.9rem',
      marginTop: '30px',
    },
    homepageFooter: {
      padding: '40px 0',
      borderTop: '1px solid #e5e7eb',
      textAlign: CSS.textAlign.center,
    },
    footerLinks: {
      display: CSS.display.flex,
      justifyContent: CSS.justifyContent.center,
      gap: '30px',
      marginBottom: '20px',
      flexWrap: CSS.flexWrap.wrap,
    },
    footerLink: {
      color: '#666',
      textDecoration: 'none',
      transition: 'color 0.2s ease',
      cursor: CSS.cursor.pointer,
    },
    footerCopyright: {
      color: '#9ca3af',
      fontSize: '0.9rem',
    },
    errorMessage: {
      background: '#fee2e2',
      color: '#dc2626',
      padding: '12px 16px',
      borderRadius: '8px',
      marginBottom: '20px',
      border: '1px solid #fca5a5',
    },
  };

  const handlePricingClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowPricingModal(true);
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  // Handle Pro plan click - show checkout modal
  const handleProPlanClick = () => {
    setSelectedPlan({
      name: 'Pro',
      price: '$49',
      amount: 4900, // $49 in paise (4900 paise = ₹4900)
      description: 'For professional developers and teams',
      features: [
        'Up to 10,000 lines of code per scan',
        'Advanced vulnerability scanning',
        'Unlimited auto-fixes',
        'Priority support',
        'Private repositories',
        'Custom security rules',
      ],
      buttonText: 'Start 14-Day Free Trial',
      buttonStyle: combineStyles(styles.btn, styles.btnPrimary),
      highlighted: true,
      onClick: handleProPlanClick,
    });
    setShowPricingModal(false);
    setShowCheckout(true);
    setPaymentSuccess(false);
    setError(null);
    setCheckoutData({
      name: '',
      email: '',
      phone: '',
    });
  };

  // Handle checkout form input change
  const handleCheckoutInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCheckoutData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Function to create Razorpay order via backend API
  const createRazorpayOrder = async (amount: number, currency: string = 'INR'): Promise<string> => {
    try {
      // Replace with your actual backend API endpoint
      const response = await fetch('https://your-backend.com/api/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify({
          amount: amount,
          currency: currency,
          receipt: `receipt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          notes: {
            plan: 'Pro',
            email: checkoutData.email,
            trial: '14-day',
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create order');
      }

      const data = await response.json();
      
      if (!data.success || !data.orderId) {
        throw new Error('Invalid response from server');
      }

      return data.orderId;
    } catch (error) {
      console.error('Error creating Razorpay order:', error);
      throw error;
    }
  };

  // Function to verify payment via backend API
  const verifyRazorpayPayment = async (
    razorpay_payment_id: string,
    razorpay_order_id: string,
    razorpay_signature: string
  ): Promise<boolean> => {
    try {
      // Replace with your actual backend API endpoint
      const response = await fetch('https://your-backend.com/api/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify({
          razorpay_payment_id,
          razorpay_order_id,
          razorpay_signature,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Payment verification failed');
      }

      const data = await response.json();
      return data.success === true;
    } catch (error) {
      console.error('Error verifying payment:', error);
      return false;
    }
  };

  // Handle payment submission with Razorpay
  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic validation
    if (!checkoutData.email || !checkoutData.name) {
      setError('Please fill in all required fields');
      return;
    }

    if (!selectedPlan) {
      setError('No plan selected');
      return;
    }

    if (!razorpayLoaded) {
      setError('Payment system is still loading. Please try again in a moment.');
      return;
    }

    setPaymentLoading(true);

    try {
      // Create order on backend
      const orderId = await createRazorpayOrder(selectedPlan.amount);

      // Get Razorpay Key ID from environment or use a test key
      // IMPORTANT: In production, this should come from your backend
      const razorpayKeyId = process.env.REACT_APP_RAZORPAY_KEY_ID || 'rzp_test_YourTestKeyHere';
      
      // Razorpay options
      const options: RazorpayOptions = {
        key: razorpayKeyId,
        amount: selectedPlan.amount,
        currency: 'INR',
        name: 'AutoDoc',
        description: `${selectedPlan.name} Plan - 14 Day Free Trial`,
        order_id: orderId,
        handler: async (response: RazorpayResponse) => {
          try {
            // Verify payment on backend
            const isVerified = await verifyRazorpayPayment(
              response.razorpay_payment_id,
              response.razorpay_order_id,
              response.razorpay_signature
            );

            if (isVerified) {
              // Payment successful
              setPaymentSuccess(true);
              
              // Store subscription info
              localStorage.setItem('proSubscription', JSON.stringify({
                plan: selectedPlan,
                email: checkoutData.email,
                name: checkoutData.name,
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                date: new Date().toISOString(),
                trialEnd: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
                status: 'active',
              }));

              // After 2 seconds, redirect to dashboard
              setTimeout(() => {
                setShowCheckout(false);
                navigate('/dashboard');
              }, 2000);
            } else {
              setError('Payment verification failed. Please contact support.');
              setPaymentLoading(false);
            }
          } catch (verificationError) {
            console.error('Payment verification error:', verificationError);
            setError('Payment verification failed. Please contact support.');
            setPaymentLoading(false);
          }
        },
        prefill: {
          name: checkoutData.name,
          email: checkoutData.email,
          contact: checkoutData.phone || '',
        },
        notes: {
          plan: selectedPlan.name,
          trial: '14-day free trial',
          email: checkoutData.email,
        },
        theme: {
          color: '#2563eb',
        },
        modal: {
          ondismiss: () => {
            setPaymentLoading(false);
          },
        },
      };

      // Initialize Razorpay payment
      const razorpay = new window.Razorpay(options);
      razorpay.open();
      
    } catch (error: any) {
      console.error('Payment initiation error:', error);
      setError(error.message || 'Payment failed. Please try again.');
      setPaymentLoading(false);
    }
  };

  // Pricing plans data
  const pricingPlans: Plan[] = [
    {
      name: 'Free',
      price: '$0',
      amount: 0,
      description: 'For individuals and small projects',
      features: [
        'Up to 1,000 lines of code per scan',
        'Basic vulnerability scanning',
        '5 auto-fixes per month',
        'Community support',
        'Public workspace access',
      ],
      buttonText: 'Get Started Free',
      buttonStyle: combineStyles(styles.btn, styles.btnOutline),
      highlighted: false,
      onClick: () => {
        setShowPricingModal(false);
        navigate('/workspace');
      },
    },
    {
      name: 'Pro',
      price: '$49',
      amount: 4900,
      description: 'For professional developers and teams',
      features: [
        'Up to 10,000 lines of code per scan',
        'Advanced vulnerability scanning',
        'Unlimited auto-fixes',
        'Priority support',
        'Private repositories',
        'Custom security rules',
      ],
      buttonText: 'Start 14-Day Free Trial',
      buttonStyle: combineStyles(styles.btn, styles.btnPrimary),
      highlighted: true,
      onClick: handleProPlanClick,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      amount: 0,
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
      buttonStyle: combineStyles(styles.btn, styles.btnSecondary),
      highlighted: false,
      onClick: () => {
        setShowPricingModal(false);
        window.location.href = 'mailto:sales@autodoc.com?subject=Enterprise%20Inquiry';
      },
    },
  ];

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
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#2563eb';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#666';
              }}
            >
              How It Works
            </Link>
            <Link 
              to="/workspace" 
              style={headerStyles.navLink}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#2563eb';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#666';
              }}
            >
              Try AutoDoc
            </Link>
            <Link 
              to="/impulse-tutor" 
              style={headerStyles.navLink}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#2563eb';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#666';
              }}
            >
              Resources
            </Link>
            <a 
              href="#" 
              style={headerStyles.navLink}
              onClick={handlePricingClick}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#2563eb';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#666';
              }}
            >
              Pricing
            </a>
            <Link 
              to="/free-trial" 
              style={headerStyles.ctaButton}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 5px 15px rgba(37, 99, 235, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Start Free Trial
            </Link>
            <Link 
              to="/signin" 
              style={headerStyles.navLink}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#2563eb';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#666';
              }}
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
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(37, 99, 235, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Start Free Trial
              </Link>
              <Link 
                to="/workspace" 
                style={combineStyles(styles.btn, styles.btnSecondary)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.background = '#f8fafc';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.background = 'white';
                }}
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

        {/* Trust Bar */}
        <section style={styles.trustBar}>
          <p style={styles.trustTitle}>Trusted by security teams at:</p>
          <div style={styles.companyLogos}>
            <div style={styles.logo}>COMPANY A</div>
            <div style={styles.logo}>COMPANY B</div>
            <div style={styles.logo}>COMPANY C</div>
            <div style={styles.logo}>COMPANY D</div>
            <div style={styles.logo}>COMPANY E</div>
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
            <div 
              style={styles.problemCard}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.borderColor = '#2563eb';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = '#e5e7eb';
              }}
            >
              <div style={styles.problemIcon}>⚠️</div>
              <h3 style={{fontSize: '1.5rem', marginBottom: '12px', color: '#1a1a1a'}}>Thousands of Alerts</h3>
              <p style={{color: '#666', lineHeight: 1.6}}>
                Security tools flood you with findings, but offer no clear path to fix them.
              </p>
            </div>
            <div 
              style={styles.problemCard}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.borderColor = '#2563eb';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = '#e5e7eb';
              }}
            >
              <div style={styles.problemIcon}>⏳</div>
              <h3 style={{fontSize: '1.5rem', marginBottom: '12px', color: '#1a1a1a'}}>Days of Manual Work</h3>
              <p style={{color: '#666', lineHeight: 1.6}}>
                Each vulnerability requires hours of research, testing, and implementation.
              </p>
            </div>
            <div 
              style={styles.problemCard}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.borderColor = '#2563eb';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = '#e5e7eb';
              }}
            >
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
              style={combineStyles(styles.btn, styles.btnOutline)}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f8fafc';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
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
              to="/workspace" 
              style={combineStyles(styles.btn, styles.btnPrimary, styles.btnLarge)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(37, 99, 235, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
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
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(37, 99, 235, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Start Your Free Trial
              </Link>
              <Link 
                to="/workspace" 
                style={combineStyles(styles.btn, styles.btnSecondary, styles.btnLarge)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.background = '#f8fafc';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.background = 'white';
                }}
              >
                Try AutoDoc Free
              </Link>
            </div>
            <p style={styles.ctaNote}>
              No credit card required • 14-day free trial • Setup in 5 minutes
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer style={styles.homepageFooter}>
          <div style={styles.footerLinks}>
            <Link 
              to="/interactive-demo" 
              style={styles.footerLink}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#2563eb';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#666';
              }}
            >
              How It Works
            </Link>
            <Link 
              to="/workspace" 
              style={styles.footerLink}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#2563eb';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#666';
              }}
            >
              Try AutoDoc
            </Link>
            <Link 
              to="/impulse-tutor" 
              style={styles.footerLink}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#2563eb';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#666';
              }}
            >
              Resources
            </Link>
            <a 
              href="#" 
              style={styles.footerLink}
              onClick={handlePricingClick}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#2563eb';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#666';
              }}
            >
              Pricing
            </a>
            <a 
              href="#" 
              style={styles.footerLink}
              onClick={(e) => {
                e.preventDefault();
                alert('Blog coming soon!');
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#2563eb';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#666';
              }}
            >
              Blog
            </a>
            <a 
              href="#" 
              style={styles.footerLink}
              onClick={(e) => {
                e.preventDefault();
                window.location.href = 'mailto:contact@autodoc.com?subject=Contact%20Inquiry';
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#2563eb';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#666';
              }}
            >
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
            <div style={styles.pricingGrid}>
              {pricingPlans.map((plan, index) => (
                <div 
                  key={index}
                  style={combineStyles(
                    styles.pricingCard, 
                    plan.highlighted ? styles.pricingCardHighlighted : {}
                  )}
                  onMouseEnter={(e) => {
                    if (!plan.highlighted) {
                      e.currentTarget.style.borderColor = '#2563eb';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!plan.highlighted) {
                      e.currentTarget.style.borderColor = '#e5e7eb';
                    }
                  }}
                >
                  <h3 style={styles.planName}>{plan.name}</h3>
                  <div style={styles.planPrice}>
                    {plan.price}
                    {plan.price !== 'Custom' && <span style={styles.pricePeriod}>/month</span>}
                  </div>
                  <p style={{color: '#666', marginBottom: '20px'}}>{plan.description}</p>
                  <ul style={styles.planFeatures}>
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} style={styles.planFeature}>
                        <span style={styles.featureIcon}>✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button 
                    style={plan.buttonStyle}
                    onClick={plan.onClick}
                    onMouseEnter={(e) => {
                      if (plan.name === 'Pro') {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 10px 25px rgba(37, 99, 235, 0.3)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (plan.name === 'Pro') {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }
                    }}
                  >
                    {plan.buttonText}
                  </button>
                </div>
              ))}
            </div>
            <p style={styles.freeTrialNote}>
              All paid plans include a 14-day free trial. No credit card required to start.
            </p>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckout && selectedPlan && (
        <div style={checkoutStyles.checkoutModal} onClick={() => setShowCheckout(false)}>
          <div style={checkoutStyles.checkoutContent} onClick={(e) => e.stopPropagation()}>
            <button 
              style={checkoutStyles.checkoutCloseButton}
              onClick={() => setShowCheckout(false)}
            >
              ×
            </button>
            
            {paymentSuccess ? (
              <div style={checkoutStyles.successMessage}>
                <div style={{fontSize: '4rem', marginBottom: '20px'}}>🎉</div>
                <h2 style={{color: '#059669', marginBottom: '10px'}}>Payment Successful!</h2>
                <p style={{color: '#666', marginBottom: '5px'}}>Your AutoDoc Pro plan has been activated.</p>
                <p style={{color: '#666', marginBottom: '5px'}}>Redirecting to your dashboard...</p>
              </div>
            ) : (
              <>
                <div style={checkoutStyles.checkoutHeader}>
                  <h1 style={{fontSize: '2.5rem', color: '#1a1a1a', marginBottom: '10px'}}>Complete Your Purchase</h1>
                  <p style={{color: '#666', fontSize: '1.1rem'}}>Start your AutoDoc Pro plan with a 14-day free trial</p>
                </div>
                
                {error && (
                  <div style={styles.errorMessage}>
                    {error}
                  </div>
                )}
                
                <div style={checkoutStyles.checkoutGrid}>
                  <div style={checkoutStyles.orderSummary}>
                    <h2 style={{fontSize: '1.5rem', color: '#1a1a1a', marginBottom: '20px'}}>Order Summary</h2>
                    
                    <div style={checkoutStyles.planCard}>
                      <div style={checkoutStyles.planHeader}>
                        <h3 style={{fontSize: '1.5rem', margin: 0}}>{selectedPlan.name} Plan</h3>
                        <div style={checkoutStyles.planPrice}>
                          {selectedPlan.price}<span style={{fontSize: '1rem', color: '#666', fontWeight: 400}}>/month</span>
                        </div>
                      </div>
                      
                      <div style={{marginBottom: '15px'}}>
                        <h4 style={{fontSize: '1rem', color: '#1a1a1a', marginBottom: '10px'}}>What's included:</h4>
                        <ul style={{listStyle: 'none', padding: 0, margin: 0}}>
                          {selectedPlan.features.map((feature, index) => (
                            <li key={index} style={{color: '#666', marginBottom: '8px', paddingLeft: '20px', position: 'relative'}}>
                              <span style={{color: '#10b981', position: 'absolute', left: 0}}>✓</span>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div style={checkoutStyles.trialNote}>
                        <p style={{margin: '5px 0', color: '#1e40af', fontSize: '0.9rem'}}>
                          🎁 <strong>14-day free trial</strong> - No charges until {new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                        </p>
                        <p style={{margin: '5px 0', color: '#1e40af', fontSize: '0.9rem'}}>Cancel anytime during trial period</p>
                      </div>
                    </div>
                    
                    <div style={checkoutStyles.totalSection}>
                      <div style={checkoutStyles.totalRow}>
                        <span>Subtotal</span>
                        <span>{selectedPlan.price}/month</span>
                      </div>
                      <div style={checkoutStyles.totalRow}>
                        <span>Tax</span>
                        <span>Calculated at checkout</span>
                      </div>
                      <div style={{...checkoutStyles.totalRow, fontSize: '1.2rem', fontWeight: 700, color: '#1a1a1a', borderTop: '1px solid #e5e7eb', paddingTop: '10px'}}>
                        <span>Total</span>
                        <span>{selectedPlan.price}/month</span>
                      </div>
                    </div>
                  </div>
                  
                  <div style={checkoutStyles.paymentSection}>
                    <h2 style={{fontSize: '1.5rem', color: '#1a1a1a', marginBottom: '20px'}}>Payment Information</h2>
                    
                    <form style={checkoutStyles.paymentForm} onSubmit={handlePaymentSubmit}>
                      <div style={checkoutStyles.formGroup}>
                        <label htmlFor="name" style={{display: 'block', marginBottom: '8px', color: '#666', fontWeight: 500}}>
                          Name <span style={{color: '#dc2626'}}>*</span>
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={checkoutData.name}
                          onChange={handleCheckoutInputChange}
                          placeholder="John Developer"
                          required
                          style={{
                            width: '100%',
                            padding: '12px',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            fontSize: '1rem',
                            fontFamily: 'inherit'
                          }}
                        />
                      </div>
                      
                      <div style={checkoutStyles.formGroup}>
                        <label htmlFor="email" style={{display: 'block', marginBottom: '8px', color: '#666', fontWeight: 500}}>
                          Email <span style={{color: '#dc2626'}}>*</span>
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={checkoutData.email}
                          onChange={handleCheckoutInputChange}
                          placeholder="billing@company.com"
                          required
                          style={{
                            width: '100%',
                            padding: '12px',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            fontSize: '1rem',
                            fontFamily: 'inherit'
                          }}
                        />
                      </div>
                      
                      <div style={checkoutStyles.formGroup}>
                        <label htmlFor="phone" style={{display: 'block', marginBottom: '8px', color: '#666', fontWeight: 500}}>Phone Number (Optional)</label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={checkoutData.phone}
                          onChange={handleCheckoutInputChange}
                          placeholder="+91 9876543210"
                          style={{
                            width: '100%',
                            padding: '12px',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            fontSize: '1rem',
                            fontFamily: 'inherit'
                          }}
                        />
                      </div>
                      
                      <div style={checkoutStyles.securityNote}>
                        <p style={{margin: '5px 0', color: '#0369a1', fontSize: '0.9rem'}}>🔒 Secure payment powered by Razorpay</p>
                        <p style={{margin: '5px 0', color: '#0369a1', fontSize: '0.9rem'}}>Your payment is encrypted and secure</p>
                        <div style={{display: 'flex', justifyContent: 'center', marginTop: '10px'}}>
                          <div style={{
                            background: '#0f172a',
                            color: 'white',
                            padding: '4px 12px',
                            borderRadius: '4px',
                            fontSize: '0.9rem',
                            fontWeight: 600
                          }}>
                            RAZORPAY
                          </div>
                        </div>
                      </div>
                      
                      <button 
                        type="submit" 
                        style={{
                          ...checkoutStyles.submitPaymentButton,
                          opacity: paymentLoading ? 0.7 : 1,
                          cursor: paymentLoading ? 'not-allowed' : 'pointer'
                        }}
                        disabled={paymentLoading || !razorpayLoaded}
                      >
                        {!razorpayLoaded ? 'Loading Payment System...' : 
                         paymentLoading ? 'Opening Payment Gateway...' : 
                         `Start ${selectedPlan.name} Plan Trial`}
                      </button>
                      
                      <p style={{textAlign: 'center', marginTop: '15px', color: '#666', fontSize: '0.9rem'}}>
                        You'll be redirected to Razorpay for secure payment
                      </p>
                    </form>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;