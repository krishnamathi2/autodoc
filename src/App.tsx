import React from 'react'; 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import './App.css'; 
 
// Import pages 
import HomePage from './components/HomePage'; 
import ImpulseTutorPage from './components/ImpulseTutorPage'; 
import WhyAutoDocPage from './components/WhyAutoDocPage'; 
import InteractiveDemoPage from './components/InteractiveDemoPage'; 
import InteractiveDemoAfterTrialSignIn from './components/InteractiveDemoAfterTrialSignIn';
import AutoDocWorkspace from './components/AutoDocWorkspace';  // New workspace component
import FreeTrialPage from './components/FreeTrialPage'; 
import SignInPage from './components/SignInPage'; 
import DashboardPage from './components/DashboardPage'; 
import PaymentsPage from './components/PaymentsPage';
import ComparePage from './components/ComparePage';
import GitHubCallbackPage from './components/GitHubCallbackPage';
 
function App() { 
  return ( 
    <Router> 
      <Routes> 
        {/* Main Landing Page */}
        <Route path="/" element={<HomePage />} /> 
        
        {/* Product Pages */}
        <Route path="/impulse-tutor" element={<ImpulseTutorPage />} /> 
        <Route path="/why-autodoc" element={<WhyAutoDocPage />} /> 
        <Route path="/interactive-demo" element={<InteractiveDemoPage />} /> 
        <Route path="/interactive-demo-aftertrailsignin" element={<InteractiveDemoAfterTrialSignIn />} />
        <Route path="/compare" element={<ComparePage />} />
        
        {/* New: Actual Working Tool */}
        <Route path="/workspace" element={<AutoDocWorkspace />} />
        
        {/* Authentication & Account */}
        <Route path="/free-trial" element={<FreeTrialPage />} /> 
        <Route path="/signin" element={<SignInPage />} /> 
        <Route path="/dashboard" element={<DashboardPage />} /> 
        <Route path="/payments" element={<PaymentsPage />} />
        
        {/* GitHub OAuth Callback */}
        <Route path="/github/callback" element={<GitHubCallbackPage />} />
        
        {/* Optional: 404 Page */}
        <Route path="*" element={
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            textAlign: 'center',
            padding: '20px'
          }}>
            <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>404 - Page Not Found</h1>
            <p style={{ fontSize: '1.2rem', marginBottom: '30px', color: '#666' }}>
              The page you're looking for doesn't exist.
            </p>
            <a 
              href="/" 
              style={{
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '1rem',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(37, 99, 235, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Go Back Home
            </a>
          </div>
        } />
      </Routes> 
    </Router> 
  ); 
} 
 
export default App;