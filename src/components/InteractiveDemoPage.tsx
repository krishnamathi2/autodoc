import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const InteractiveDemoPage = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [showFix, setShowFix] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const navigate = useNavigate();

  const styles = {
    container: {
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif",
      background: isDarkTheme ? '#0f172a' : '#f8fafc',
      color: isDarkTheme ? '#e2e8f0' : '#1e293b',
      minHeight: '100vh',
      padding: '20px',
      transition: 'background 0.3s ease, color 0.3s ease',
    },
    topControls: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      maxWidth: '1200px',
      margin: '0 auto 40px',
    },
    backButton: {
      background: 'transparent',
      color: isDarkTheme ? '#94a3b8' : '#64748b',
      border: 'none',
      fontSize: '1rem',
      cursor: 'pointer',
      padding: '10px 20px',
      borderRadius: '6px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      transition: 'all 0.2s ease',
    },
    themeToggle: {
      background: isDarkTheme ? '#334155' : '#e2e8f0',
      color: isDarkTheme ? '#e2e8f0' : '#1e293b',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '0.9rem',
      fontWeight: 500,
      transition: 'all 0.2s ease',
    },
    header: {
      textAlign: 'center' as const,
      maxWidth: '800px',
      margin: '0 auto 60px',
    },
    title: {
      fontSize: '3rem',
      fontWeight: 800,
      marginBottom: '20px',
      background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    subtitle: {
      fontSize: '1.2rem',
      color: isDarkTheme ? '#94a3b8' : '#64748b',
      lineHeight: 1.6,
    },
    demoContainer: {
      display: 'flex',
      gap: '40px',
      maxWidth: '1200px',
      margin: '0 auto',
      '@media (max-width: 1024px)': {
        flexDirection: 'column',
      },
    },
    leftPanel: {
      flex: 1,
      background: isDarkTheme ? '#1e293b' : 'white',
      borderRadius: '12px',
      padding: '30px',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
    },
    rightPanel: {
      flex: 1,
      background: isDarkTheme ? '#1e293b' : 'white',
      borderRadius: '12px',
      padding: '30px',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
    },
    stepIndicator: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '40px',
      position: 'relative' as const,
    },
    step: {
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      zIndex: 2,
    },
    stepCircle: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 600,
      marginBottom: '8px',
      transition: 'all 0.3s ease',
    },
    stepLabel: {
      fontSize: '0.9rem',
      fontWeight: 500,
    },
    stepLine: {
      position: 'absolute' as const,
      top: '20px',
      left: '10%',
      right: '10%',
      height: '2px',
      background: isDarkTheme ? '#334155' : '#e2e8f0',
      zIndex: 1,
    },
    codeContainer: {
      background: isDarkTheme ? '#0f172a' : '#1e293b',
      borderRadius: '8px',
      overflow: 'hidden',
      marginBottom: '20px',
    },
    codeHeader: {
      background: isDarkTheme ? '#334155' : '#475569',
      padding: '12px 20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    codeTitle: {
      fontFamily: "'Courier New', monospace",
      color: '#cbd5e1',
      fontSize: '0.9rem',
    },
    scanButton: {
      background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
      color: 'white',
      border: 'none',
      padding: '8px 16px',
      borderRadius: '6px',
      cursor: 'pointer',
      fontWeight: 600,
      fontSize: '0.9rem',
      transition: 'all 0.2s ease',
    },
    codeContent: {
      padding: '20px',
      fontFamily: "'Courier New', monospace",
      fontSize: '0.9rem',
      lineHeight: 1.6,
      color: '#e2e8f0',
    },
    vulnerability: {
      background: 'rgba(239, 68, 68, 0.1)',
      borderLeft: '3px solid #ef4444',
      padding: '10px 15px',
      margin: '10px 0',
      borderRadius: '0 6px 6px 0',
    },
    fix: {
      background: 'rgba(34, 197, 94, 0.1)',
      borderLeft: '3px solid #22c55e',
      padding: '10px 15px',
      margin: '10px 0',
      borderRadius: '0 6px 6px 0',
    },
    actionButtons: {
      display: 'flex',
      gap: '15px',
      marginTop: '30px',
    },
    primaryButton: {
      background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
      color: 'white',
      border: 'none',
      padding: '12px 24px',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: 600,
      fontSize: '1rem',
      flex: 1,
      transition: 'all 0.2s ease',
    },
    secondaryButton: {
      background: isDarkTheme ? '#334155' : '#e2e8f0',
      color: isDarkTheme ? '#e2e8f0' : '#1e293b',
      border: 'none',
      padding: '12px 24px',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: 600,
      fontSize: '1rem',
      flex: 1,
      transition: 'all 0.2s ease',
    },
    resultsPanel: {
      marginTop: '30px',
    },
    resultItem: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '15px',
      background: isDarkTheme ? '#334155' : '#f1f5f9',
      borderRadius: '8px',
      marginBottom: '10px',
    },
    ctaSection: {
      textAlign: 'center' as const,
      marginTop: '60px',
      padding: '40px',
      background: isDarkTheme ? '#1e293b' : 'white',
      borderRadius: '12px',
      maxWidth: '800px',
      margin: '60px auto 0',
    },
    ctaButton: {
      background: 'linear-gradient(135deg, #10b981, #34d399)',
      color: 'white',
      border: 'none',
      padding: '16px 32px',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: 600,
      fontSize: '1.1rem',
      marginTop: '20px',
      transition: 'all 0.2s ease',
    },
  };

  const steps = [
    { number: 1, label: 'Scan Code' },
    { number: 2, label: 'Identify Issues' },
    { number: 3, label: 'Generate Fix' },
    { number: 4, label: 'Apply Solution' },
  ];

  const vulnerabilities = [
    { id: 1, type: 'SQL Injection', severity: 'High', file: 'userController.js', line: 24 },
    { id: 2, type: 'XSS Vulnerability', severity: 'Medium', file: 'profileView.js', line: 18 },
    { id: 3, type: 'Hardcoded Secret', severity: 'Critical', file: 'config.js', line: 12 },
  ];

  const handleScan = () => {
    setScanComplete(true);
    setTimeout(() => {
      setCurrentStep(2);
    }, 1000);
  };

  const handleGenerateFix = () => {
    setShowFix(true);
    setCurrentStep(3);
  };

  const handleApplyFix = () => {
    setCurrentStep(4);
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.topControls}>
        <button 
          style={styles.backButton}
          onClick={() => navigate('/')}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = isDarkTheme ? '#e2e8f0' : '#1e293b';
            e.currentTarget.style.background = isDarkTheme ? '#334155' : '#e2e8f0';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = isDarkTheme ? '#94a3b8' : '#64748b';
            e.currentTarget.style.background = 'transparent';
          }}
        >
          ← Back to Home
        </button>
        <button 
          style={styles.themeToggle}
          onClick={() => setIsDarkTheme(!isDarkTheme)}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          {isDarkTheme ? '☀️ Switch to Light' : '🌙 Switch to Dark'}
        </button>
      </div>

      <div style={styles.header}>
        <h1 style={styles.title}>AutoDoc Interactive Demo</h1>
        <p style={styles.subtitle}>
          See how AutoDoc automatically finds and fixes security vulnerabilities in real-time.
          Follow the steps below to experience the magic!
        </p>
      </div>

      <div style={styles.stepIndicator}>
        <div style={styles.stepLine}></div>
        {steps.map((step) => (
          <div key={step.number} style={styles.step}>
            <div 
              style={{
                ...styles.stepCircle,
                background: currentStep >= step.number ? '#2563eb' : isDarkTheme ? '#334155' : '#e2e8f0',
                color: currentStep >= step.number ? 'white' : isDarkTheme ? '#94a3b8' : '#64748b',
              }}
            >
              {step.number}
            </div>
            <span style={{
              ...styles.stepLabel,
              color: currentStep >= step.number ? '#2563eb' : isDarkTheme ? '#94a3b8' : '#64748b',
            }}>
              {step.label}
            </span>
          </div>
        ))}
      </div>

      <div style={styles.demoContainer}>
        <div style={styles.leftPanel}>
          <h2 style={{marginBottom: '20px', color: isDarkTheme ? '#e2e8f0' : '#1e293b'}}>
            Step {currentStep}: {steps[currentStep - 1]?.label}
          </h2>
          
          <div style={styles.codeContainer}>
            <div style={styles.codeHeader}>
              <span style={styles.codeTitle}>example-code.js</span>
              {currentStep === 1 && !scanComplete && (
                <button 
                  style={styles.scanButton}
                  onClick={handleScan}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 5px 15px rgba(37, 99, 235, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {scanComplete ? '✓ Scanned' : 'Scan for Vulnerabilities'}
                </button>
              )}
            </div>
            <div style={styles.codeContent}>
              {currentStep === 1 && (
                <pre>
{`// User controller with security issues
app.get('/user/:id', (req, res) => {
  const userId = req.params.id;
  // VULNERABLE: SQL Injection
  db.query(\`SELECT * FROM users WHERE id = \${userId}\`);
  
  // VULNERABLE: XSS
  res.send('<div>User: ' + userId + '</div>');
});

// Config file with hardcoded secrets
const config = {
  apiKey: 'SECRET-12345-ABCDE', // VULNERABLE
  dbPassword: 'myPassword123!' // VULNERABLE
};`}
                </pre>
              )}

              {currentStep >= 2 && showFix && (
                <>
                  <div style={styles.vulnerability}>
                    <strong>⚠️ VULNERABILITY FOUND:</strong> SQL Injection on line 5
                  </div>
                  <pre>
{`// User controller - FIXED by AutoDoc
app.get('/user/:id', (req, res) => {
  const userId = parseInt(req.params.id, 10);
  // FIXED: Parameterized query
  db.query('SELECT * FROM users WHERE id = ?', [userId]);
  
  // FIXED: Output encoding
  res.send(\`<div>User: \${escapeHtml(userId)}</div>\`);
});

// Config file - FIXED by AutoDoc
const config = {
  apiKey: process.env.API_KEY, // FIXED: Environment variable
  dbPassword: process.env.DB_PASSWORD // FIXED: Environment variable
};`}
                  </pre>
                  <div style={styles.fix}>
                    <strong>✅ AUTO-FIX APPLIED:</strong> 
                    <ul style={{margin: '10px 0 0 20px'}}>
                      <li>Converted to parameterized queries</li>
                      <li>Added output encoding</li>
                      <li>Replaced hardcoded secrets with environment variables</li>
                    </ul>
                  </div>
                </>
              )}
            </div>
          </div>

          <div style={styles.actionButtons}>
            {currentStep > 1 && (
              <button 
                style={styles.secondaryButton}
                onClick={handlePrevious}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.background = isDarkTheme ? '#475569' : '#cbd5e1';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.background = isDarkTheme ? '#334155' : '#e2e8f0';
                }}
              >
                Previous Step
              </button>
            )}
            
            {currentStep === 2 && (
              <button 
                style={styles.primaryButton}
                onClick={handleGenerateFix}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 5px 15px rgba(37, 99, 235, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Generate Automatic Fix
              </button>
            )}
            
            {currentStep === 3 && (
              <button 
                style={styles.primaryButton}
                onClick={handleApplyFix}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 5px 15px rgba(37, 99, 235, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Apply Fix to Codebase
              </button>
            )}
            
            {currentStep === 4 ? (
              <Link 
                to="/free-trial" 
                style={{
                  ...styles.primaryButton,
                  textDecoration: 'none',
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 5px 15px rgba(37, 99, 235, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Start Your Free Trial →
              </Link>
            ) : (
              <button 
                style={styles.primaryButton}
                onClick={handleNext}
                disabled={currentStep === 1 && !scanComplete}
                onMouseEnter={(e) => {
                  if (!(currentStep === 1 && !scanComplete)) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 5px 15px rgba(37, 99, 235, 0.3)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Next Step
              </button>
            )}
          </div>
        </div>

        <div style={styles.rightPanel}>
          <h2 style={{marginBottom: '20px', color: isDarkTheme ? '#e2e8f0' : '#1e293b'}}>
            Scan Results & Analysis
          </h2>
          
          {currentStep >= 2 && (
            <div style={styles.resultsPanel}>
              {vulnerabilities.map((vuln) => (
                <div key={vuln.id} style={styles.resultItem}>
                  <div>
                    <strong style={{color: vuln.severity === 'Critical' ? '#ef4444' : vuln.severity === 'High' ? '#f59e0b' : '#3b82f6'}}>
                      {vuln.type}
                    </strong>
                    <div style={{fontSize: '0.9rem', color: isDarkTheme ? '#94a3b8' : '#64748b', marginTop: '4px'}}>
                      {vuln.file}:{vuln.line}
                    </div>
                  </div>
                  <div style={{
                    padding: '4px 12px',
                    borderRadius: '20px',
                    background: vuln.severity === 'Critical' ? '#fef2f2' : vuln.severity === 'High' ? '#fffbeb' : '#eff6ff',
                    color: vuln.severity === 'Critical' ? '#dc2626' : vuln.severity === 'High' ? '#d97706' : '#2563eb',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                  }}>
                    {vuln.severity}
                  </div>
                </div>
              ))}
              
              {currentStep >= 3 && (
                <div style={{
                  marginTop: '30px',
                  padding: '20px',
                  background: isDarkTheme ? '#334155' : '#f1f5f9',
                  borderRadius: '8px',
                }}>
                  <h3 style={{marginBottom: '15px', color: isDarkTheme ? '#e2e8f0' : '#1e293b'}}>
                    AutoDoc Analysis
                  </h3>
                  <ul style={{margin: 0, paddingLeft: '20px', color: isDarkTheme ? '#cbd5e1' : '#475569'}}>
                    <li>3 vulnerabilities detected and analyzed</li>
                    <li>Automatic fixes generated in 0.8 seconds</li>
                    <li>All fixes maintain backward compatibility</li>
                    <li>Documentation included with each fix</li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {currentStep === 4 && (
        <div style={styles.ctaSection}>
          <h2 style={{color: isDarkTheme ? '#e2e8f0' : '#1e293b', marginBottom: '20px'}}>
            🎉 Demo Complete!
          </h2>
          <p style={{color: isDarkTheme ? '#cbd5e1' : '#475569', fontSize: '1.1rem', lineHeight: 1.6}}>
            You've seen how AutoDoc can automatically find and fix security vulnerabilities in seconds.
            Ready to try it on your own codebase?
          </p>
          <button 
            style={styles.ctaButton}
            onClick={() => navigate('/free-trial')}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 10px 25px rgba(16, 185, 129, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Start Your 14-Day Free Trial
          </button>
          <p style={{marginTop: '20px', color: isDarkTheme ? '#94a3b8' : '#64748b', fontSize: '0.9rem'}}>
            No credit card required • Setup in 5 minutes • Works with GitHub, GitLab, Bitbucket
          </p>
        </div>
      )}
    </div>
  );
};

export default InteractiveDemoPage;