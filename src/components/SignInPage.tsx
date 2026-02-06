import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { validateEmail, validatePassword, getPasswordStrength } from '../utils/validation';
import { signInWithGoogle, signInWithGitHub, signInWithMicrosoft, createAccountWithEmail, signInWithEmail, resetPassword } from '../services/firebase';

function SignInPage() {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });
  const [loginErrors, setLoginErrors] = useState({
    email: '',
    password: '',
    general: ''
  });
  const [signupErrors, setSignupErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: ''
  });
  const [loading, setLoading] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  const handleBack = () => {
    navigate('/');
  };

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (name === 'email' || name === 'password') {
      setLoginErrors(prev => ({ ...prev, [name]: '', general: '' }));
    }
  };

  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSignupData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (name in signupErrors) {
      setSignupErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateLoginForm = (): boolean => {
    const errors = {
      email: '',
      password: '',
      general: ''
    };
    
    const emailValidation = validateEmail(loginData.email);
    if (!emailValidation.isValid) errors.email = emailValidation.error;
    
    if (!loginData.password) errors.password = 'Password is required';
    
    setLoginErrors(errors);
    return !errors.email && !errors.password;
  };

  const validateSignupForm = (): boolean => {
    const errors = {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: ''
    };
    
    // Name validation
    if (!signupData.name.trim()) {
      errors.name = 'Full name is required';
    } else if (signupData.name.length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }
    
    // Email validation
    const emailValidation = validateEmail(signupData.email);
    if (!emailValidation.isValid) errors.email = emailValidation.error;
    
    // Password validation
    const passwordValidation = validatePassword(signupData.password);
    if (!passwordValidation.isValid) errors.password = passwordValidation.error;
    
    // Confirm password validation
    if (!signupData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (signupData.password !== signupData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    // Terms validation
    if (!signupData.acceptTerms) {
      errors.acceptTerms = 'You must accept the Terms of Service';
    }
    
    setSignupErrors(errors);
    return !Object.values(errors).some(error => error !== '');
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateLoginForm()) {
      return;
    }
    
    setLoading(true);
    setLoginErrors(prev => ({ ...prev, general: '' }));
    
    try {
      const result = await signInWithEmail(loginData.email, loginData.password);
      
      setLoading(false);
      
      if (result.success) {
        // Check if email is verified (optional - remove if you want to allow unverified users)
        if (result.user && !result.user.emailVerified) {
          setLoginErrors(prev => ({ 
            ...prev, 
            general: 'Please verify your email before signing in. Check your inbox (or spam folder).' 
          }));
          return;
        }
        navigate('/interactive-demo-aftertrailsignin');
      } else {
        setLoginErrors(prev => ({ ...prev, general: result.error || 'Sign in failed. Please try again.' }));
      }
    } catch (error: any) {
      setLoading(false);
      console.error('Login error:', error);
      setLoginErrors(prev => ({ ...prev, general: 'An unexpected error occurred. Please try again.' }));
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateSignupForm()) {
      return;
    }
    
    setLoading(true);
    
    const result = await createAccountWithEmail(
      signupData.email, 
      signupData.password, 
      signupData.name
    );
    
    setLoading(false);
    
    if (result.success) {
      alert('Account created successfully! Please check your email to verify your account.');
      setIsLogin(true);
      setSignupData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        acceptTerms: false
      });
      setSignupErrors({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        acceptTerms: ''
      });
    } else {
      // Show error to user
      setSignupErrors(prev => ({ ...prev, email: result.error || 'Account creation failed. Please try again.' }));
    }
  };

  const handleForgotPassword = async () => {
    const email = prompt('Please enter your email address to reset your password:');
    if (email) {
      if (!validateEmail(email).isValid) {
        alert('Please enter a valid email address');
        return;
      }
      
      const result = await resetPassword(email);
      if (result.success) {
        alert(`Password reset instructions have been sent to ${email}`);
      } else {
        alert(result.error || 'Failed to send reset email. Please try again.');
      }
    }
  };

  const handleSocialLogin = async (provider: string) => {
    setLoading(true);
    setLoginErrors(prev => ({ ...prev, general: '' }));
    
    try {
      let result: { success: boolean; user?: any; error?: string };
      
      switch (provider) {
        case 'Google':
          result = await signInWithGoogle();
          break;
        case 'GitHub':
          result = await signInWithGitHub();
          break;
        case 'Microsoft':
          result = await signInWithMicrosoft();
          break;
        default:
          throw new Error('Unknown provider');
      }
      
      if (result.success) {
        // Store user info if needed
        localStorage.setItem('user', JSON.stringify({
          email: result.user?.email,
          name: result.user?.displayName,
          photoURL: result.user?.photoURL,
          provider: provider
        }));
        navigate('/interactive-demo-aftertrailsignin');
      } else {
        setLoginErrors(prev => ({ 
          ...prev, 
          general: result.error || `Failed to sign in with ${provider}` 
        }));
      }
    } catch (error: any) {
      setLoginErrors(prev => ({ 
        ...prev, 
        general: error.message || `Failed to sign in with ${provider}` 
      }));
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = getPasswordStrength(signupData.password);

  return (
    <div className={`App ${isDarkTheme ? 'dark' : ''}`}>
      <div className="top-controls">
        <button className="back-button" onClick={handleBack}>
          ← Back
        </button>
        <div className="top-right-buttons">
          <button className="theme-toggle" onClick={toggleTheme}>
            {isDarkTheme ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          </button>
        </div>
      </div>
      
      <main className="tutor-container">
        <header className="tutor-header">
          <h1 className="tutor-title">Welcome to AutoDoc</h1>
          <p className="tutor-subtitle">
            {isLogin 
              ? 'Sign in to access your security dashboard' 
              : 'Create your account to start your free trial'
            }
          </p>
        </header>
        
        <section className="signin-section">
          <div className="signin-container">
            <div className="signin-left">
              <div className="signin-tabs">
                <button 
                  className={`tab-button ${isLogin ? 'active' : ''}`}
                  onClick={() => setIsLogin(true)}
                >
                  Sign In
                </button>
                <button 
                  className={`tab-button ${!isLogin ? 'active' : ''}`}
                  onClick={() => setIsLogin(false)}
                >
                  Create Account
                </button>
              </div>
              
              {isLogin ? (
                <form className="signin-form" onSubmit={handleLoginSubmit}>
                  <div className="form-group">
                    <label htmlFor="loginEmail">Email Address *</label>
                    <input
                      type="email"
                      id="loginEmail"
                      name="email"
                      value={loginData.email}
                      onChange={handleLoginChange}
                      required
                      placeholder="you@company.com"
                      className={loginErrors.email ? 'input-error' : ''}
                    />
                    {loginErrors.email && <div className="error-text">{loginErrors.email}</div>}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="loginPassword">Password *</label>
                    <div className="password-input-wrapper">
                      <input
                        type={showLoginPassword ? "text" : "password"}
                        id="loginPassword"
                        name="password"
                        value={loginData.password}
                        onChange={handleLoginChange}
                        required
                        placeholder="Enter your password"
                        className={loginErrors.password ? 'input-error' : ''}
                      />
                      <button
                        type="button"
                        className="password-toggle-btn"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        aria-label={showLoginPassword ? "Hide password" : "Show password"}
                      >
                        {showLoginPassword ? '🙈' : '👁️'}
                      </button>
                    </div>
                    {loginErrors.password && <div className="error-text">{loginErrors.password}</div>}
                  </div>
                  
                  <div className="form-options">
                    <div className="checkbox-group">
                      <input
                        type="checkbox"
                        id="rememberMe"
                        name="rememberMe"
                        checked={loginData.rememberMe}
                        onChange={handleLoginChange}
                      />
                      <label htmlFor="rememberMe">Remember me</label>
                    </div>
                    <button 
                      type="button" 
                      className="forgot-password"
                      onClick={handleForgotPassword}
                    >
                      Forgot password?
                    </button>
                  </div>
                  
                  {loginErrors.general && (
                    <div className="error-message">
                      ⚠️ {loginErrors.general}
                    </div>
                  )}
                  
                  <button 
                    type="submit" 
                    className="signin-button-submit"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner"></span>
                        Signing in...
                      </>
                    ) : (
                      'Sign In to AutoDoc'
                    )}
                  </button>
                </form>
              ) : (
                <form className="signin-form" onSubmit={handleSignupSubmit}>
                  <div className="form-group">
                    <label htmlFor="signupName">Full Name *</label>
                    <input
                      type="text"
                      id="signupName"
                      name="name"
                      value={signupData.name}
                      onChange={handleSignupChange}
                      required
                      placeholder="John Developer"
                      className={signupErrors.name ? 'input-error' : ''}
                    />
                    {signupErrors.name && <div className="error-text">{signupErrors.name}</div>}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="signupEmail">Work Email *</label>
                    <input
                      type="email"
                      id="signupEmail"
                      name="email"
                      value={signupData.email}
                      onChange={handleSignupChange}
                      required
                      placeholder="john@company.com"
                      className={signupErrors.email ? 'input-error' : ''}
                    />
                    {signupErrors.email && <div className="error-text">{signupErrors.email}</div>}
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="signupPassword">Password *</label>
                      <div className="password-input-wrapper">
                        <input
                          type={showSignupPassword ? "text" : "password"}
                          id="signupPassword"
                          name="password"
                          value={signupData.password}
                          onChange={handleSignupChange}
                          required
                          placeholder="Create a password"
                          className={signupErrors.password ? 'input-error' : ''}
                        />
                        <button
                          type="button"
                          className="password-toggle-btn"
                          onClick={() => setShowSignupPassword(!showSignupPassword)}
                          aria-label={showSignupPassword ? "Hide password" : "Show password"}
                        >
                          {showSignupPassword ? '🙈' : '👁️'}
                        </button>
                      </div>
                      <div className="password-hint">
                        Minimum 8 characters with letters and numbers
                      </div>
                      {signupData.password && (
                        <>
                          <div className="password-strength">
                            <div className={`strength-bar strength-${passwordStrength.strength}`}></div>
                          </div>
                          <div className="strength-label">
                            {passwordStrength.label}
                          </div>
                        </>
                      )}
                      {signupErrors.password && <div className="error-text">{signupErrors.password}</div>}
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="confirmPassword">Confirm Password *</label>
                      <div className="password-input-wrapper">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          id="confirmPassword"
                          name="confirmPassword"
                          value={signupData.confirmPassword}
                          onChange={handleSignupChange}
                          required
                          placeholder="Confirm your password"
                          className={signupErrors.confirmPassword ? 'input-error' : ''}
                        />
                        <button
                          type="button"
                          className="password-toggle-btn"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                        >
                          {showConfirmPassword ? '🙈' : '👁️'}
                        </button>
                      </div>
                      {signupErrors.confirmPassword && <div className="error-text">{signupErrors.confirmPassword}</div>}
                    </div>
                  </div>
                  
                  <div className="form-checkbox-group">
                    <input
                      type="checkbox"
                      id="signupTerms"
                      name="acceptTerms"
                      checked={signupData.acceptTerms}
                      onChange={handleSignupChange}
                      required
                      className={signupErrors.acceptTerms ? 'checkbox-error' : ''}
                    />
                    <label htmlFor="signupTerms" className={signupErrors.acceptTerms ? 'checkbox-error-label' : ''}>
                      I agree to the <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a> *
                    </label>
                    {signupErrors.acceptTerms && <div className="error-text">{signupErrors.acceptTerms}</div>}
                  </div>
                  
                  <button 
                    type="submit" 
                    className="signup-button-submit"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner"></span>
                        Creating account...
                      </>
                    ) : (
                      'Create Account & Start Free Trial'
                    )}
                  </button>
                </form>
              )}
              
              <div className="social-login">
                <div className="divider">
                  <span>Or continue with</span>
                </div>
                
                <div className="social-buttons">
                  <button 
                    className="social-button google"
                    onClick={() => handleSocialLogin('Google')}
                  >
                    <span className="social-icon">🔍</span>
                    Google
                  </button>
                  <button 
                    className="social-button github"
                    onClick={() => handleSocialLogin('GitHub')}
                  >
                    <span className="social-icon">🐙</span>
                    GitHub
                  </button>
                  <button 
                    className="social-button microsoft"
                    onClick={() => handleSocialLogin('Microsoft')}
                  >
                    <span className="social-icon">🪟</span>
                    Microsoft
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <footer className="tutor-footer">
          <p>AutoDoc Security Platform • Secure login powered by enterprise authentication</p>
        </footer>
      </main>
    </div>
  );
}

export default SignInPage;