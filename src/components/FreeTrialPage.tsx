import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function FreeTrialPage() {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    role: '',
    teamSize: '',
    sourceControl: '',
    primaryLanguage: '',
    acceptTerms: false,
    acceptUpdates: false
  });
  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    company: '',
    role: '',
    teamSize: '',
    acceptTerms: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  const handleBack = () => {
    navigate('/');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when user starts typing
    if (name in formErrors) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    console.log('Validating form...');
    console.log('Form data:', formData);
    
    const errors = {
      name: '',
      email: '',
      company: '',
      role: '',
      teamSize: '',
      acceptTerms: ''
    };
    
    let isValid = true;
    
    // Name validation
    if (!formData.name.trim()) {
      errors.name = 'Full name is required';
      isValid = false;
    } else if (formData.name.length < 2) {
      errors.name = 'Name must be at least 2 characters';
      isValid = false;
    }
    
    // Email validation - simple version
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
      isValid = false;
    }
    
    // Company validation
    if (!formData.company.trim()) {
      errors.company = 'Company name is required';
      isValid = false;
    } else if (formData.company.length < 2) {
      errors.company = 'Company name must be at least 2 characters';
      isValid = false;
    }
    
    // Role validation
    if (!formData.role) {
      errors.role = 'Please select your role';
      isValid = false;
    }
    
    // Team size validation
    if (!formData.teamSize) {
      errors.teamSize = 'Please select team size';
      isValid = false;
    }
    
    // Terms validation
    if (!formData.acceptTerms) {
      errors.acceptTerms = 'You must accept the Terms of Service';
      isValid = false;
    }
    
    console.log('Validation errors:', errors);
    console.log('Is form valid?', isValid);
    
    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submit triggered');
    
    const isValid = validateForm();
    console.log('Form validation result:', isValid);
    
    if (!isValid) {
      console.log('Form is invalid, stopping submission');
      return;
    }
    
    console.log('Form is valid, proceeding with submission');
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Form submission successful');
      console.log('Submitted data:', formData);
      setLoading(false);
      setSubmitted(true);
      
      // Store trial data in localStorage
      localStorage.setItem('trialUser', JSON.stringify({
        email: formData.email,
        name: formData.name,
        company: formData.company,
        trialStart: new Date().toISOString(),
        trialEnd: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
      }));
      
      console.log('Data saved to localStorage');
    }, 1500);
  };

  const handleStartTrial = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log('Dashboard button clicked');
    console.log('Attempting to navigate to /dashboard');
    
    // Navigate to dashboard
    navigate('/dashboard');
    
    // Fallback after 100ms
    setTimeout(() => {
      if (window.location.pathname !== '/dashboard') {
        console.log('React Router navigation failed, using window.location');
        window.location.href = '/dashboard';
      }
    }, 100);
  };

  return (
    <div className={`App ${isDarkTheme ? 'dark' : ''}`}>
      <div className="top-controls">
        <button type="button" className="back-button" onClick={handleBack}>
          ← Back
        </button>
        <div className="top-right-buttons">
          <button type="button" className="theme-toggle" onClick={toggleTheme}>
            {isDarkTheme ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          </button>
        </div>
      </div>
      
      <main className="tutor-container">
        <header className="tutor-header">
          <h1 className="tutor-title">🚀 Start Your AutoDoc Free Trial</h1>
          <p className="tutor-subtitle">14-day free trial • No credit card required • Full platform access</p>
        </header>
        
        <section className="trial-section">
          <div className="trial-container">
            <div className="trial-benefits">
              <h2>What's included in your free trial:</h2>
              
              <div className="benefits-list">
                <div className="benefit-item">
                  <div className="benefit-icon">🔒</div>
                  <div className="benefit-content">
                    <h3>Full Security Scanning</h3>
                    <p>Unlimited scans for vulnerabilities, misconfigurations, and security risks</p>
                  </div>
                </div>
                
                <div className="benefit-item">
                  <div className="benefit-icon">🤖</div>
                  <div className="benefit-content">
                    <h3>AI-Powered Fixes</h3>
                    <p>Automated remediation for all identified security issues</p>
                  </div>
                </div>
                
                <div className="benefit-item">
                  <div className="benefit-icon">📊</div>
                  <div className="benefit-content">
                    <h3>Advanced Analytics</h3>
                    <p>Detailed security reports and compliance dashboards</p>
                  </div>
                </div>
                
                <div className="benefit-item">
                  <div className="benefit-icon">🔄</div>
                  <div className="benefit-content">
                    <h3>CI/CD Integration</h3>
                    <p>Seamless integration with GitHub, GitLab, Bitbucket, and more</p>
                  </div>
                </div>
                
                <div className="benefit-item">
                  <div className="benefit-icon">👥</div>
                  <div className="benefit-content">
                    <h3>Team Collaboration</h3>
                    <p>Invite up to 10 team members during trial period</p>
                  </div>
                </div>
                
                <div className="benefit-item">
                  <div className="benefit-icon">🎓</div>
                  <div className="benefit-content">
                    <h3>Priority Support</h3>
                    <p>Email and chat support during your trial period</p>
                  </div>
                </div>
              </div>
              
              <div className="trial-stats">
                <div className="trial-stat">
                  <div className="stat-number">2,500+</div>
                  <div className="stat-label">Developers Trust AutoDoc</div>
                </div>
                <div className="trial-stat">
                  <div className="stat-number">98%</div>
                  <div className="stat-label">Vulnerability Detection Rate</div>
                </div>
                <div className="trial-stat">
                  <div className="stat-number">90%</div>
                  <div className="stat-label">Time Saved on Security</div>
                </div>
              </div>
            </div>
            
            <div className="trial-form-container">
              {submitted ? (
                <div className="success-message">
                  <div className="success-icon">🎉</div>
                  <h2>Thank You for Signing Up!</h2>
                  <p>Your 14-day free trial has been activated for <strong>{formData.email}</strong>.</p>
                  <p>Your dashboard is now ready. Start securing your code!</p>
                  
                  <div className="next-steps">
                    <h3>Next Steps:</h3>
                    <ol>
                      <li>Set up your first project</li>
                      <li>Connect your repository</li>
                      <li>Run your first security scan</li>
                      <li>Review automated fixes</li>
                    </ol>
                  </div>
                  
                  <button 
                    type="button"
                    className="start-trial-button" 
                    onClick={handleStartTrial}
                    style={{ 
                      cursor: 'pointer', 
                      padding: '12px 24px',
                      background: '#2563eb',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '16px',
                      fontWeight: '600'
                    }}
                  >
                    Go to Your Dashboard →
                  </button>
                  
                  {/* Debug info */}
                  <div style={{ 
                    marginTop: '20px', 
                    padding: '10px',
                    background: '#f8fafc',
                    borderRadius: '6px',
                    fontSize: '12px',
                    color: '#666',
                    border: '1px solid #e5e7eb'
                  }}>
                    <p>Debug Info:</p>
                    <button 
                      type="button"
                      onClick={() => {
                        console.log('Checking localStorage...');
                        console.log('trialUser:', localStorage.getItem('trialUser'));
                        console.log('Current path:', window.location.pathname);
                        console.log('Form submitted state:', submitted);
                      }}
                      style={{ 
                        background: '#e5e7eb', 
                        padding: '5px 10px', 
                        fontSize: '11px',
                        marginRight: '10px',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Check Status
                    </button>
                    <button 
                      type="button"
                      onClick={() => window.location.href = '/dashboard'}
                      style={{ 
                        background: '#10b981', 
                        color: 'white',
                        padding: '5px 10px', 
                        fontSize: '11px',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Direct to Dashboard
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="form-header">
                    <h2>Start Your 14-Day Free Trial</h2>
                    <p>No credit card required. Get full access immediately.</p>
                  </div>
                  
                  <form className="trial-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label htmlFor="name">Full Name *</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="John Developer"
                        className={formErrors.name ? 'input-error' : ''}
                      />
                      {formErrors.name && <div className="error-text">{formErrors.name}</div>}
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="email">Work Email *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="john@company.com"
                        className={formErrors.email ? 'input-error' : ''}
                      />
                      {formErrors.email && <div className="error-text">{formErrors.email}</div>}
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="company">Company Name *</label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        required
                        placeholder="Acme Inc."
                        className={formErrors.company ? 'input-error' : ''}
                      />
                      {formErrors.company && <div className="error-text">{formErrors.company}</div>}
                    </div>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="role">Your Role *</label>
                        <select
                          id="role"
                          name="role"
                          value={formData.role}
                          onChange={handleInputChange}
                          required
                          className={formErrors.role ? 'input-error' : ''}
                        >
                          <option value="">Select role</option>
                          <option value="developer">Developer</option>
                          <option value="senior-developer">Senior Developer</option>
                          <option value="tech-lead">Tech Lead</option>
                          <option value="engineering-manager">Engineering Manager</option>
                          <option value="cto">CTO</option>
                          <option value="security-engineer">Security Engineer</option>
                          <option value="other">Other</option>
                        </select>
                        {formErrors.role && <div className="error-text">{formErrors.role}</div>}
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="teamSize">Team Size *</label>
                        <select
                          id="teamSize"
                          name="teamSize"
                          value={formData.teamSize}
                          onChange={handleInputChange}
                          required
                          className={formErrors.teamSize ? 'input-error' : ''}
                        >
                          <option value="">Select size</option>
                          <option value="1-5">1-5 developers</option>
                          <option value="6-20">6-20 developers</option>
                          <option value="21-50">21-50 developers</option>
                          <option value="51-100">51-100 developers</option>
                          <option value="100+">100+ developers</option>
                        </select>
                        {formErrors.teamSize && <div className="error-text">{formErrors.teamSize}</div>}
                      </div>
                    </div>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="sourceControl">Primary Git Provider</label>
                        <select
                          id="sourceControl"
                          name="sourceControl"
                          value={formData.sourceControl}
                          onChange={handleInputChange}
                        >
                          <option value="">Select provider</option>
                          <option value="github">GitHub</option>
                          <option value="gitlab">GitLab</option>
                          <option value="bitbucket">Bitbucket</option>
                          <option value="azure-devops">Azure DevOps</option>
                          <option value="other">Other/None</option>
                        </select>
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="primaryLanguage">Primary Language</label>
                        <select
                          id="primaryLanguage"
                          name="primaryLanguage"
                          value={formData.primaryLanguage}
                          onChange={handleInputChange}
                        >
                          <option value="">Select language</option>
                          <option value="javascript">JavaScript/TypeScript</option>
                          <option value="python">Python</option>
                          <option value="java">Java</option>
                          <option value="csharp">C#</option>
                          <option value="go">Go</option>
                          <option value="php">PHP</option>
                          <option value="ruby">Ruby</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="form-checkbox-group">
                      <input
                        type="checkbox"
                        id="acceptTerms"
                        name="acceptTerms"
                        checked={formData.acceptTerms}
                        onChange={handleInputChange}
                        required
                        className={formErrors.acceptTerms ? 'checkbox-error' : ''}
                      />
                      <label htmlFor="acceptTerms" className={formErrors.acceptTerms ? 'checkbox-error-label' : ''}>
                        I agree to the <a href="/terms" target="_blank" rel="noopener noreferrer">Terms of Service</a> and <a href="/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a> *
                      </label>
                      {formErrors.acceptTerms && <div className="error-text">{formErrors.acceptTerms}</div>}
                    </div>
                    
                    <div className="form-checkbox-group">
                      <input
                        type="checkbox"
                        id="acceptUpdates"
                        name="acceptUpdates"
                        checked={formData.acceptUpdates}
                        onChange={handleInputChange}
                      />
                      <label htmlFor="acceptUpdates">
                        Send me product updates, security tips, and best practices
                      </label>
                    </div>
                    
                    <button 
                      type="submit" 
                      className="submit-button"
                      disabled={loading}
                      style={{ 
                        cursor: loading ? 'not-allowed' : 'pointer',
                        opacity: loading ? 0.7 : 1
                      }}
                    >
                      {loading ? (
                        <>
                          <span className="spinner"></span>
                          Setting up your trial...
                        </>
                      ) : (
                        'Start My Free Trial →'
                      )}
                    </button>
                    
                    <p className="form-note">
                      By signing up, you'll get immediate access to all features. No credit card required.
                      You can cancel anytime.
                    </p>
                    
                    {/* Debug button */}
                    <div style={{ textAlign: 'center', marginTop: '10px' }}>
                      <button 
                        type="button"
                        onClick={() => {
                          console.log('Manual form check:');
                          console.log('Form data:', formData);
                          console.log('Form errors:', formErrors);
                          console.log('Is form valid?', validateForm());
                        }}
                        style={{
                          background: 'transparent',
                          border: '1px dashed #ccc',
                          padding: '5px 10px',
                          fontSize: '11px',
                          color: '#666'
                        }}
                      >
                        Debug Form
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </section>
        
        <div className="trial-faq">
          <h2>Frequently Asked Questions</h2>
          
          <div className="faq-grid">
            <div className="faq-item">
              <h3>What happens after the trial ends?</h3>
              <p>After 14 days, you can choose a plan that fits your needs. If you don't upgrade, you'll lose access to premium features but can continue with the free tier.</p>
            </div>
            
            <div className="faq-item">
              <h3>Is my code safe with AutoDoc?</h3>
              <p>Absolutely. We never store your source code. All analysis happens in-memory and results are anonymized for our ML training.</p>
            </div>
            
            <div className="faq-item">
              <h3>Can I invite team members?</h3>
              <p>Yes! During the trial, you can invite up to 10 team members to collaborate on security remediation.</p>
            </div>
            
            <div className="faq-item">
              <h3>What integrations are available?</h3>
              <p>AutoDoc integrates with GitHub, GitLab, Bitbucket, Jenkins, CircleCI, GitHub Actions, and more. We also offer a comprehensive API.</p>
            </div>
          </div>
        </div>
        
        <footer className="tutor-footer">
          <p>AutoDoc Free Trial • 14 days of unlimited security scanning • No credit card required</p>
        </footer>
      </main>
    </div>
  );
}

export default FreeTrialPage;