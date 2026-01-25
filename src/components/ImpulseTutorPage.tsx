import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopControls from './common/TopControls';

function ImpulseTutorPage() {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const navigate = useNavigate();

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  const handleBack = () => {
    navigate('/');
  };

  const handleNext = () => {
    navigate('/why-autodoc');
  };

  const handleInteractiveDemo = () => {
    navigate('/interactive-demo');
  };

  return (
    <div className={`App ${isDarkTheme ? 'dark' : ''}`}>
      <TopControls
        isDarkTheme={isDarkTheme}
        toggleTheme={toggleTheme}
        onBackClick={handleBack}
        backLabel="Back"
      />
      
      <main className="tutor-container">
        <header className="tutor-header">
          <h1 className="tutor-title">AutoDoc: Automated Security Remediation</h1>
        </header>
        
        <section className="problem-section">
          <div className="content-box">
            <h2>The World's First Automated Security Remediation Platform</h2>
            
            <div className="content-section">
              <h3>Core Innovation:</h3>
              <p>Unlike traditional security scanners that bombard developers with warnings and leave them to figure out solutions, AutoDoc automatically writes the remediation code itself. It reads your codebase, identifies security vulnerabilities with precision, and directly implements the fixes with proper documentation.</p>
            </div>
            
            <div className="content-section">
              <h3>How It Works:</h3>
              <ul className="feature-list">
                <li><strong>Intelligent Code Analysis</strong> - Scans your codebase using advanced AI-powered pattern recognition</li>
                <li><strong>Context-Aware Remediation</strong> - Understands your specific tech stack and architecture</li>
                <li><strong>Automated Fix Generation</strong> - Writes secure replacement code with inline explanations</li>
                <li><strong>Developer-Centric Design</strong> - Presents changes in clear, merge-ready formats</li>
              </ul>
            </div>
            
            <div className="content-section">
              <h3>Key Benefits:</h3>
              <div className="benefits-grid">
                <div className="benefit-item">
                  <div className="benefit-number">90%</div>
                  <div className="benefit-text">Reduction in remediation time</div>
                </div>
                <div className="benefit-item">
                  <div className="benefit-number">Eliminates</div>
                  <div className="benefit-text">Security knowledge gaps for junior developers</div>
                </div>
                <div className="benefit-item">
                  <div className="benefit-number">Enterprise</div>
                  <div className="benefit-text">Grade compliance with industry standards</div>
                </div>
                <div className="benefit-item">
                  <div className="benefit-number">Continuous</div>
                  <div className="benefit-text">Learning from thousands of codebases</div>
                </div>
              </div>
            </div>
            
            <div className="content-section">
              <h3>The Developer Experience:</h3>
              <p>AutoDoc feels like having a senior security engineer pair-programming with you 24/7. Instead of struggling with cryptic security warnings, developers receive clear, actionable fixes that they can understand, trust, and implement immediately.</p>
            </div>
            
            <div className="content-section vision-section">
              <h3>Vision:</h3>
              <p>To make world-class security accessible to every developer and every organization, regardless of size or expertise level. AutoDoc isn't just a tool—it's a fundamental shift toward more secure, efficient, and empowered software development.</p>
            </div>
          </div>
        </section>
        
        <div className="action-section">
          <button className="next-button" onClick={handleNext}>
            Next →
          </button>
          <button className="demo-button-inline" onClick={handleInteractiveDemo}>
            Try Interactive Demo
          </button>
        </div>
        
        <footer className="tutor-footer">
          <p>AutoDoc Security Platform • Built with ❤️ for developers</p>
        </footer>
      </main>
    </div>
  );
}

export default ImpulseTutorPage;