import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { setGitHubToken, fetchGitHubUser } from '../services/github';

const GitHubCallbackPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const error = searchParams.get('error');

      if (error) {
        setStatus('error');
        setErrorMessage('GitHub authorization was denied.');
        return;
      }

      if (!code) {
        setStatus('error');
        setErrorMessage('No authorization code received.');
        return;
      }

      try {
        // Exchange code for token via your backend API
        // For now, we'll use a serverless function or direct exchange
        // Note: In production, this should be done server-side for security
        
        const response = await fetch('/api/github/exchange', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code }),
        });

        if (!response.ok) {
          throw new Error('Failed to exchange code for token');
        }

        const data = await response.json();
        
        if (data.access_token) {
          setGitHubToken(data.access_token);
          await fetchGitHubUser();
          setStatus('success');
          
          // Redirect to dashboard after short delay
          setTimeout(() => {
            navigate('/dashboard?github=connected');
          }, 1500);
        } else {
          throw new Error('No access token received');
        }
      } catch (err) {
        console.error('GitHub OAuth error:', err);
        setStatus('error');
        setErrorMessage('Failed to complete GitHub authentication. Please try again.');
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      color: 'white',
      textAlign: 'center' as const,
      padding: '20px',
    },
    icon: {
      fontSize: '4rem',
      marginBottom: '20px',
    },
    title: {
      fontSize: '1.5rem',
      marginBottom: '10px',
    },
    message: {
      color: '#94a3b8',
      marginBottom: '20px',
    },
    spinner: {
      width: '40px',
      height: '40px',
      border: '4px solid rgba(255,255,255,0.1)',
      borderTopColor: '#3b82f6',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      marginBottom: '20px',
    },
    button: {
      padding: '12px 24px',
      background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '1rem',
    },
  };

  return (
    <div style={styles.container}>
      <style>
        {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}
      </style>
      
      {status === 'loading' && (
        <>
          <div style={styles.spinner} />
          <h2 style={styles.title}>Connecting to GitHub...</h2>
          <p style={styles.message}>Please wait while we complete the authentication.</p>
        </>
      )}

      {status === 'success' && (
        <>
          <div style={styles.icon}>✅</div>
          <h2 style={styles.title}>GitHub Connected!</h2>
          <p style={styles.message}>Redirecting to your dashboard...</p>
        </>
      )}

      {status === 'error' && (
        <>
          <div style={styles.icon}>❌</div>
          <h2 style={styles.title}>Connection Failed</h2>
          <p style={styles.message}>{errorMessage}</p>
          <button 
            style={styles.button}
            onClick={() => navigate('/dashboard')}
          >
            Back to Dashboard
          </button>
        </>
      )}
    </div>
  );
};

export default GitHubCallbackPage;
