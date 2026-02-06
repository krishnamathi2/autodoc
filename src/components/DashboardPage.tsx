import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  initiateGitHubOAuth, 
  isGitHubConnected, 
  getGitHubUser, 
  removeGitHubToken,
  fetchGitHubRepos,
  GitHubRepo,
  GitHubUser
} from '../services/github';

// Define TypeScript interfaces
interface Vulnerability {
  id: number;
  type: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  file: string;
  line: number;
  status: 'Auto-Fixed' | 'Manual Review' | 'Pending' | 'Ignored';
  fixTime: string;
  detectionDate: string;
}

interface Scan {
  id: number;
  project: string;
  timestamp: string;
  vulnerabilities: number;
  status: 'Completed' | 'In Progress' | 'Failed';
  language: string;
  duration: string;
}

interface Stats {
  totalScans: number;
  vulnerabilitiesFound: number;
  autoFixed: number;
  manualReview: number;
  fixedPercentage: number;
  avgFixTime: string;
}

interface TrialStatus {
  started: Date | null;
  daysRemaining: number;
  isActive: boolean;
}

interface Project {
  id: number;
  name: string;
  lastScan: string;
  vulnerabilityTrend: 'up' | 'down' | 'stable';
  language: string;
  repo: string;
}

function DashboardPage() {
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>([]);
  const [recentScans, setRecentScans] = useState<Scan[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalScans: 0,
    vulnerabilitiesFound: 0,
    autoFixed: 0,
    manualReview: 0,
    fixedPercentage: 0,
    avgFixTime: '0m'
  });

  const [trialStatus, setTrialStatus] = useState<TrialStatus>({
    started: null,
    daysRemaining: 14,
    isActive: true,
  });
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  
  // GitHub Integration State
  const [searchParams] = useSearchParams();
  const [githubConnected, setGithubConnected] = useState<boolean>(false);
  const [githubUser, setGithubUser] = useState<GitHubUser | null>(null);
  const [githubRepos, setGithubRepos] = useState<GitHubRepo[]>([]);
  const [showRepoModal, setShowRepoModal] = useState<boolean>(false);
  const [loadingRepos, setLoadingRepos] = useState<boolean>(false);
  
  const navigate = useNavigate();

  // Check GitHub connection status on mount
  useEffect(() => {
    const checkGitHubConnection = async () => {
      if (isGitHubConnected()) {
        setGithubConnected(true);
        const user = getGitHubUser();
        if (user) {
          setGithubUser(user);
        }
      }
      
      // Check if just connected via callback
      if (searchParams.get('github') === 'connected') {
        setGithubConnected(true);
        const user = getGitHubUser();
        if (user) {
          setGithubUser(user);
        }
      }
    };
    checkGitHubConnection();
  }, [searchParams]);

  // Load GitHub repos when connected
  const loadGitHubRepos = async () => {
    setLoadingRepos(true);
    const repos = await fetchGitHubRepos();
    setGithubRepos(repos);
    setLoadingRepos(false);
    setShowRepoModal(true);
  };

  // Handle GitHub connect
  const handleConnectGitHub = () => {
    initiateGitHubOAuth();
  };

  // Handle GitHub disconnect
  const handleDisconnectGitHub = () => {
    removeGitHubToken();
    setGithubConnected(false);
    setGithubUser(null);
    setGithubRepos([]);
  };

  // Handle repo selection for scanning
  const handleScanRepo = (repo: GitHubRepo) => {
    setShowRepoModal(false);
    // Navigate to workspace with repo info
    navigate(`/workspace?repo=${repo.full_name}&branch=${repo.default_branch}`);
  };

  // Check trial status on component mount
  useEffect(() => {
    const savedTrial = localStorage.getItem('autodoc_trial');
    if (savedTrial) {
      try {
        const trialData = JSON.parse(savedTrial);
        const trialStart = new Date(trialData.started);
        // Using minutes for testing (change to days calculation for production)
        const minutesSinceStart = Math.floor((new Date().getTime() - trialStart.getTime()) / (1000 * 60));
        const daysRemaining = Math.max(0, 14 - minutesSinceStart);
        
        setTrialStatus({
          started: trialStart,
          daysRemaining: daysRemaining,
          isActive: daysRemaining > 0,
        });

        // If trial has expired, show subscription modal
        if (daysRemaining <= 0) {
          setShowSubscribeModal(true);
        }
      } catch (error) {
        console.error('Error parsing trial data:', error);
      }
    } else {
      // If no trial data, redirect to sign in
      navigate('/signin');
      return;
    }

    // Mock data for demonstration - REAL AUTODOC DATA
    const mockVulnerabilities: Vulnerability[] = [
      { id: 1, type: 'SQL Injection', severity: 'Critical', file: 'userController.js', line: 42, status: 'Auto-Fixed', fixTime: '2.3s', detectionDate: '2024-01-15' },
      { id: 2, type: 'XSS Attack', severity: 'High', file: 'profileView.js', line: 18, status: 'Auto-Fixed', fixTime: '1.8s', detectionDate: '2024-01-15' },
      { id: 3, type: 'Hardcoded Secret', severity: 'Critical', file: 'config.js', line: 12, status: 'Auto-Fixed', fixTime: '1.5s', detectionDate: '2024-01-14' },
      { id: 4, type: 'CSRF Vulnerability', severity: 'Medium', file: 'authMiddleware.js', line: 56, status: 'Manual Review', fixTime: '-', detectionDate: '2024-01-14' },
      { id: 5, type: 'Insecure Dependency', severity: 'High', file: 'package.json', line: 23, status: 'Auto-Fixed', fixTime: '45.2s', detectionDate: '2024-01-13' },
      { id: 6, type: 'Path Traversal', severity: 'Critical', file: 'fileUpload.js', line: 89, status: 'Auto-Fixed', fixTime: '3.1s', detectionDate: '2024-01-13' },
      { id: 7, type: 'CORS Misconfiguration', severity: 'Medium', file: 'serverConfig.js', line: 34, status: 'Pending', fixTime: '-', detectionDate: '2024-01-12' },
      { id: 8, type: 'SSRF Attack', severity: 'High', file: 'apiProxy.js', line: 67, status: 'Auto-Fixed', fixTime: '4.5s', detectionDate: '2024-01-12' },
    ];

    const mockScans: Scan[] = [
      { id: 1, project: 'E-Commerce API', timestamp: 'Just now', vulnerabilities: 3, status: 'Completed', language: 'Node.js', duration: '42s' },
      { id: 2, project: 'Payment Gateway', timestamp: '2 hours ago', vulnerabilities: 5, status: 'Completed', language: 'Python', duration: '1m 23s' },
      { id: 3, project: 'User Dashboard', timestamp: '5 hours ago', vulnerabilities: 2, status: 'Completed', language: 'React', duration: '31s' },
      { id: 4, project: 'Admin Panel', timestamp: 'Yesterday', vulnerabilities: 8, status: 'Completed', language: 'Ruby', duration: '2m 15s' },
      { id: 5, project: 'Mobile Backend', timestamp: '2 days ago', vulnerabilities: 4, status: 'Completed', language: 'Go', duration: '56s' },
    ];

    const mockProjects: Project[] = [
      { id: 1, name: 'E-Commerce Platform', lastScan: 'Active', vulnerabilityTrend: 'down', language: 'Node.js', repo: 'github.com/company/ecommerce' },
      { id: 2, name: 'Payment Microservice', lastScan: 'Active', vulnerabilityTrend: 'stable', language: 'Python', repo: 'github.com/company/payments' },
      { id: 3, name: 'User Management', lastScan: '2 hours ago', vulnerabilityTrend: 'down', language: 'Java', repo: 'github.com/company/auth' },
      { id: 4, name: 'Data Analytics', lastScan: 'Yesterday', vulnerabilityTrend: 'up', language: 'Python', repo: 'github.com/company/analytics' },
      { id: 5, name: 'Mobile App API', lastScan: '2 days ago', vulnerabilityTrend: 'stable', language: 'Go', repo: 'github.com/company/mobile-api' },
    ];

    const mockStats: Stats = {
      totalScans: 42,
      vulnerabilitiesFound: 156,
      autoFixed: 132,
      manualReview: 24,
      fixedPercentage: 85,
      avgFixTime: '3.2s'
    };

    setVulnerabilities(mockVulnerabilities);
    setRecentScans(mockScans);
    setProjects(mockProjects);
    setStats(mockStats);
  }, [navigate]);

  const styles = {
    container: {
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif",
      background: isDarkTheme ? '#0f172a' : '#f8fafc',
      color: isDarkTheme ? '#e2e8f0' : '#1e293b',
      minHeight: '100vh',
      padding: '20px',
      transition: 'background 0.3s ease, color 0.3s ease',
    } as React.CSSProperties,
    topBar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '30px',
      flexWrap: 'wrap' as const,
      gap: '20px',
    } as React.CSSProperties,
    leftControls: {
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
      flexWrap: 'wrap' as const,
    } as React.CSSProperties,
    logo: {
      fontSize: '1.8rem',
      fontWeight: 800,
      margin: 0,
      background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
      WebkitBackgroundClip: 'text' as const,
      WebkitTextFillColor: 'transparent' as const,
    } as React.CSSProperties,
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
    } as React.CSSProperties,
    rightControls: {
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
      flexWrap: 'wrap' as const,
    } as React.CSSProperties,
    themeToggle: {
      background: isDarkTheme ? '#334155' : '#e2e7eb',
      color: isDarkTheme ? '#e2e8f0' : '#1e293b',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '0.9rem',
      fontWeight: 500,
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    } as React.CSSProperties,
    userMenu: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '8px 16px',
      background: isDarkTheme ? '#1e293b' : 'white',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    } as React.CSSProperties,
    trialWarning: {
      background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
      color: '#1e293b',
      padding: '12px 20px',
      borderRadius: '8px',
      marginBottom: '25px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 4px 6px rgba(245, 158, 11, 0.2)',
    } as React.CSSProperties,
    trialWarningText: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      fontWeight: 600,
    } as React.CSSProperties,
    upgradeButton: {
      background: '#1e293b',
      color: 'white',
      border: 'none',
      padding: '8px 16px',
      borderRadius: '6px',
      cursor: 'pointer',
      fontWeight: 600,
      fontSize: '0.9rem',
      transition: 'all 0.2s ease',
      whiteSpace: 'nowrap' as const,
    } as React.CSSProperties,
    header: {
      marginBottom: '30px',
    } as React.CSSProperties,
    title: {
      fontSize: '2rem',
      fontWeight: 700,
      marginBottom: '8px',
      color: isDarkTheme ? '#e2e8f0' : '#1e293b',
    } as React.CSSProperties,
    subtitle: {
      fontSize: '1rem',
      color: isDarkTheme ? '#94a3b8' : '#64748b',
    } as React.CSSProperties,
    welcomeCard: {
      background: isDarkTheme ? '#1e293b' : 'white',
      borderRadius: '12px',
      padding: '25px',
      marginBottom: '30px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap' as const,
      gap: '20px',
      borderLeft: '4px solid #3b82f6',
    } as React.CSSProperties,
    welcomeContent: {
      flex: 1,
    } as React.CSSProperties,
    welcomeTitle: {
      fontSize: '1.4rem',
      fontWeight: 700,
      marginBottom: '10px',
      color: isDarkTheme ? '#e2e8f0' : '#1e293b',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    } as React.CSSProperties,
    welcomeText: {
      color: isDarkTheme ? '#94a3b8' : '#64748b',
      marginBottom: '15px',
      lineHeight: 1.6,
    } as React.CSSProperties,
    planBadge: {
      background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
      color: 'white',
      padding: '6px 16px',
      borderRadius: '20px',
      fontSize: '0.85rem',
      fontWeight: 600,
      display: 'inline-block',
      marginRight: '10px',
    } as React.CSSProperties,
    trialInfo: {
      textAlign: 'right' as const,
      minWidth: '180px',
    } as React.CSSProperties,
    trialDays: {
      fontSize: '2.2rem',
      fontWeight: 800,
      color: '#2563eb',
      marginBottom: '5px',
      lineHeight: 1,
    } as React.CSSProperties,
    trialLabel: {
      fontSize: '0.9rem',
      color: isDarkTheme ? '#94a3b8' : '#64748b',
      marginBottom: '12px',
    } as React.CSSProperties,
    actionButton: {
      background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
      color: 'white',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '0.95rem',
      fontWeight: 600,
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    } as React.CSSProperties,
    tabs: {
      display: 'flex',
      gap: '5px',
      marginBottom: '30px',
      background: isDarkTheme ? '#1e293b' : '#f1f5f9',
      borderRadius: '10px',
      padding: '5px',
      flexWrap: 'wrap' as const,
    } as React.CSSProperties,
    tab: {
      padding: '12px 24px',
      background: 'transparent',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '0.95rem',
      fontWeight: 500,
      color: isDarkTheme ? '#94a3b8' : '#64748b',
      transition: 'all 0.2s ease',
      whiteSpace: 'nowrap' as const,
    } as React.CSSProperties,
    activeTab: {
      background: isDarkTheme ? '#334155' : 'white',
      color: isDarkTheme ? '#e2e8f0' : '#1e293b',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    } as React.CSSProperties,
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '20px',
      marginBottom: '30px',
    } as React.CSSProperties,
    statCard: {
      background: isDarkTheme ? '#1e293b' : 'white',
      borderRadius: '12px',
      padding: '25px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.2s ease',
      borderTop: '4px solid',
    } as React.CSSProperties,
    statHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '20px',
    } as React.CSSProperties,
    statTitle: {
      fontSize: '0.9rem',
      color: isDarkTheme ? '#94a3b8' : '#64748b',
      fontWeight: 500,
      textTransform: 'uppercase' as const,
      letterSpacing: '0.5px',
    } as React.CSSProperties,
    statIcon: {
      fontSize: '1.5rem',
      opacity: 0.8,
    } as React.CSSProperties,
    statValue: {
      fontSize: '2.5rem',
      fontWeight: 700,
      marginBottom: '10px',
      lineHeight: 1,
    } as React.CSSProperties,
    statSubtitle: {
      fontSize: '0.85rem',
      color: isDarkTheme ? '#94a3b8' : '#64748b',
    } as React.CSSProperties,
    statProgress: {
      height: '6px',
      background: isDarkTheme ? '#334155' : '#e2e7eb',
      borderRadius: '3px',
      marginTop: '15px',
      overflow: 'hidden',
    } as React.CSSProperties,
    statProgressBar: {
      height: '100%',
      borderRadius: '3px',
      transition: 'width 0.3s ease',
    } as React.CSSProperties,
    dashboardGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
      gap: '20px',
      marginBottom: '30px',
    } as React.CSSProperties,
    card: {
      background: isDarkTheme ? '#1e293b' : 'white',
      borderRadius: '12px',
      padding: '25px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.2s ease',
    } as React.CSSProperties,
    cardHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
    } as React.CSSProperties,
    cardTitle: {
      fontSize: '1.2rem',
      fontWeight: 600,
      color: isDarkTheme ? '#e2e8f0' : '#1e293b',
      margin: 0,
    } as React.CSSProperties,
    cardAction: {
      color: '#2563eb',
      fontSize: '0.9rem',
      fontWeight: 500,
      cursor: 'pointer',
      textDecoration: 'none',
      transition: 'color 0.2s ease',
    } as React.CSSProperties,
    table: {
      width: '100%',
      borderCollapse: 'collapse' as const,
    } as React.CSSProperties,
    tableHeader: {
      background: isDarkTheme ? '#334155' : '#f1f5f9',
      padding: '12px 16px',
      textAlign: 'left' as const,
      fontWeight: 600,
      color: isDarkTheme ? '#e2e8f0' : '#1e293b',
      borderBottom: `1px solid ${isDarkTheme ? '#475569' : '#e2e7eb'}`,
      fontSize: '0.85rem',
    } as React.CSSProperties,
    tableCell: {
      padding: '14px 16px',
      borderBottom: `1px solid ${isDarkTheme ? '#334155' : '#e2e7eb'}`,
      color: isDarkTheme ? '#cbd5e1' : '#475569',
      fontSize: '0.9rem',
    } as React.CSSProperties,
    statusBadge: {
      padding: '4px 10px',
      borderRadius: '12px',
      fontSize: '0.75rem',
      fontWeight: 600,
      display: 'inline-block',
      textTransform: 'uppercase' as const,
      letterSpacing: '0.5px',
    } as React.CSSProperties,
    severityBadge: {
      padding: '4px 10px',
      borderRadius: '12px',
      fontSize: '0.75rem',
      fontWeight: 600,
      display: 'inline-block',
    } as React.CSSProperties,
    languageBadge: {
      padding: '4px 10px',
      borderRadius: '12px',
      fontSize: '0.75rem',
      fontWeight: 500,
      display: 'inline-block',
      background: isDarkTheme ? '#334155' : '#e2e7eb',
      color: isDarkTheme ? '#cbd5e1' : '#475569',
    } as React.CSSProperties,
    trendIcon: {
      fontSize: '1rem',
      marginLeft: '5px',
    } as React.CSSProperties,
    footer: {
      marginTop: '40px',
      paddingTop: '20px',
      textAlign: 'center' as const,
      color: isDarkTheme ? '#94a3b8' : '#64748b',
      fontSize: '0.85rem',
      borderTop: `1px solid ${isDarkTheme ? '#334155' : '#e2e7eb'}`,
    } as React.CSSProperties,
    quickActions: {
      display: 'flex',
      gap: '15px',
      marginTop: '30px',
      flexWrap: 'wrap' as const,
    } as React.CSSProperties,
    quickActionButton: {
      flex: 1,
      minWidth: '120px',
      background: isDarkTheme ? '#334155' : '#f1f5f9',
      border: 'none',
      padding: '15px',
      borderRadius: '10px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      gap: '10px',
    } as React.CSSProperties,
    quickActionIcon: {
      fontSize: '1.8rem',
    } as React.CSSProperties,
    quickActionText: {
      fontSize: '0.9rem',
      fontWeight: 500,
      color: isDarkTheme ? '#e2e8f0' : '#1e293b',
    } as React.CSSProperties,
  };

  const getSeverityColor = (severity: string) => {
    switch(severity.toLowerCase()) {
      case 'critical': return { background: '#fef2f2', color: '#dc2626', border: '#dc2626' };
      case 'high': return { background: '#fffbeb', color: '#d97706', border: '#f59e0b' };
      case 'medium': return { background: '#eff6ff', color: '#2563eb', border: '#3b82f6' };
      case 'low': return { background: '#f0fdf4', color: '#16a34a', border: '#10b981' };
      default: return { background: '#f3f4f6', color: '#6b7280', border: '#9ca3af' };
    }
  };

  const getStatusColor = (status: string) => {
    switch(status.toLowerCase()) {
      case 'auto-fixed': return { background: '#dcfce7', color: '#166534' };
      case 'manual review': return { background: '#fef3c7', color: '#92400e' };
      case 'pending': return { background: '#fee2e2', color: '#991b1b' };
      case 'ignored': return { background: '#f3f4f6', color: '#6b7280' };
      default: return { background: '#f3f4f6', color: '#6b7280' };
    }
  };

  const getStatCardColor = (index: number) => {
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
    return colors[index % colors.length];
  };

  const handleUpgrade = () => {
    navigate('/signin');
  };

  const handleNewScan = () => {
    navigate('/workspace');
  };

  const handleViewAll = () => {
    setActiveTab('vulnerabilities');
  };

  // Show trial warning if less than 3 days remaining
  const showTrialWarning = trialStatus.daysRemaining <= 3 && trialStatus.daysRemaining > 0;

  return (
    <div style={styles.container}>
      {/* Trial Expired - Subscribe Modal */}
      {showSubscribeModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
        }}>
          <div style={{
            background: isDarkTheme ? '#1e293b' : '#ffffff',
            borderRadius: '16px',
            padding: '40px',
            maxWidth: '500px',
            width: '90%',
            textAlign: 'center',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)',
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #f59e0b, #f97316)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              fontSize: '40px',
            }}>
              ⏰
            </div>
            <h2 style={{
              fontSize: '1.8rem',
              fontWeight: 700,
              marginBottom: '16px',
              color: isDarkTheme ? '#f1f5f9' : '#1e293b',
            }}>
              Your Free Trial Has Ended
            </h2>
            <p style={{
              fontSize: '1.1rem',
              color: isDarkTheme ? '#94a3b8' : '#64748b',
              marginBottom: '24px',
              lineHeight: 1.6,
            }}>
              Your 14-minute trial period has expired. Subscribe now to continue using AutoDoc's powerful security scanning features.
            </p>
            <div style={{
              background: isDarkTheme ? '#0f172a' : '#f1f5f9',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '24px',
            }}>
              <h3 style={{
                fontSize: '1.2rem',
                fontWeight: 600,
                marginBottom: '12px',
                color: isDarkTheme ? '#f1f5f9' : '#1e293b',
              }}>
                Pro Plan Benefits:
              </h3>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                textAlign: 'left',
              }}>
                {['Unlimited code scans', 'AI-powered auto-fixes', 'Priority support', 'Advanced vulnerability detection', 'Team collaboration'].map((benefit, i) => (
                  <li key={i} style={{
                    padding: '8px 0',
                    color: isDarkTheme ? '#94a3b8' : '#64748b',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}>
                    <span style={{ color: '#22c55e' }}>✓</span> {benefit}
                  </li>
                ))}
              </ul>
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={() => {
                  localStorage.removeItem('autodoc_trial');
                  navigate('/');
                }}
                style={{
                  padding: '14px 28px',
                  background: 'transparent',
                  color: isDarkTheme ? '#94a3b8' : '#64748b',
                  border: `1px solid ${isDarkTheme ? '#334155' : '#e2e8f0'}`,
                  borderRadius: '8px',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  fontWeight: 500,
                }}
              >
                Maybe Later
              </button>
              <button
                onClick={() => {
                  // Open Razorpay payment page
                  window.open('https://razorpay.me/@mathivananponnusamy', '_blank');
                  // Show confirmation after payment
                  setTimeout(() => {
                    const confirmed = window.confirm(
                      'After completing payment on Razorpay, click OK to activate your Pro plan.'
                    );
                    if (confirmed) {
                      localStorage.setItem('autodoc_trial', JSON.stringify({
                        started: new Date().toISOString(),
                        plan: 'Pro',
                        subscribed: true
                      }));
                      setShowSubscribeModal(false);
                      window.location.reload();
                    }
                  }, 1000);
                }}
                style={{
                  padding: '14px 28px',
                  background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  fontWeight: 600,
                  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)',
                }}
              >
                Subscribe Now - ₹4,067/year
              </button>
            </div>
            <p style={{
              fontSize: '0.85rem',
              color: isDarkTheme ? '#64748b' : '#94a3b8',
              marginTop: '16px',
            }}>
              Secure payment powered by Razorpay
            </p>
          </div>
        </div>
      )}

      {/* Top Navigation Bar */}
      <div style={styles.topBar}>
        <div style={styles.leftControls}>
          <h1 style={styles.logo}>AutoDoc</h1>
          <button 
            style={styles.backButton}
            onClick={() => navigate('/')}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = isDarkTheme ? '#e2e8f0' : '#1e293b';
              e.currentTarget.style.background = isDarkTheme ? '#334155' : '#e2e7eb';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = isDarkTheme ? '#94a3b8' : '#64748b';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            ← Home
          </button>
        </div>
        <div style={styles.rightControls}>
          <button 
            style={styles.themeToggle}
            onClick={() => setIsDarkTheme(!isDarkTheme)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {isDarkTheme ? '☀️ Light' : '🌙 Dark'}
          </button>
          <div 
            style={styles.userMenu}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
            }}
          >
            <div style={{fontSize: '1.2rem'}}>👤</div>
            <div>
              <div style={{fontWeight: 600, fontSize: '0.9rem'}}>Security Engineer</div>
              <div style={{fontSize: '0.8rem', color: isDarkTheme ? '#94a3b8' : '#64748b'}}>Free Trial</div>
            </div>
          </div>
        </div>
      </div>

      {/* Trial Warning Banner */}
      {showTrialWarning && (
        <div style={styles.trialWarning}>
          <div style={styles.trialWarningText}>
            <span>⚠️</span>
            <span>Trial ending soon! {trialStatus.daysRemaining} day(s) remaining.</span>
          </div>
          <button 
            style={styles.upgradeButton}
            onClick={handleUpgrade}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Upgrade to Pro
          </button>
        </div>
      )}

      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Security Dashboard</h1>
        <p style={styles.subtitle}>
          Real-time monitoring of security vulnerabilities and automated fixes across your codebase
        </p>
      </div>

      {/* Welcome Card with Trial Info */}
      <div style={styles.welcomeCard}>
        <div style={styles.welcomeContent}>
          <h2 style={styles.welcomeTitle}>
            <span>🛡️</span>
            Active Security Protection
          </h2>
          <p style={styles.welcomeText}>
            AutoDoc is actively monitoring {projects.length} projects and has automatically fixed {stats.autoFixed} vulnerabilities. 
            Your codebase is <strong>85% more secure</strong> than when you started.
          </p>
          <div>
            <span style={styles.planBadge}>FREE TRIAL</span>
            <span style={{color: isDarkTheme ? '#94a3b8' : '#64748b', fontSize: '0.9rem'}}>
              {trialStatus.daysRemaining} days remaining • {stats.totalScans} scans completed
            </span>
          </div>
        </div>
        <div style={styles.trialInfo}>
          <div style={styles.trialDays}>{trialStatus.daysRemaining}</div>
          <div style={styles.trialLabel}>Days Left</div>
          <button 
            style={styles.actionButton}
            onClick={handleNewScan}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(37, 99, 235, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            🔍 New Scan
          </button>
        </div>
      </div>

      {/* GitHub Integration Card */}
      <div style={{
        ...styles.welcomeCard,
        borderLeftColor: githubConnected ? '#22c55e' : '#6366f1',
        marginBottom: '30px',
      }}>
        <div style={styles.welcomeContent}>
          <h2 style={{...styles.welcomeTitle, gap: '12px'}}>
            <svg height="24" viewBox="0 0 16 16" width="24" fill={isDarkTheme ? '#e2e8f0' : '#1e293b'}>
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
            </svg>
            GitHub Integration
            {githubConnected && (
              <span style={{
                background: '#22c55e',
                color: 'white',
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '0.75rem',
                fontWeight: 600,
              }}>
                Connected
              </span>
            )}
          </h2>
          <p style={styles.welcomeText}>
            {githubConnected 
              ? `Connected as ${githubUser?.login || 'GitHub User'}. Select a repository to scan for vulnerabilities.`
              : 'Connect your GitHub account to scan repositories directly and enable automatic security monitoring.'}
          </p>
        </div>
        <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
          {githubConnected ? (
            <>
              <button 
                style={{
                  ...styles.actionButton,
                  background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                }}
                onClick={loadGitHubRepos}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                📂 Select Repository
              </button>
              <button 
                style={{
                  ...styles.actionButton,
                  background: isDarkTheme ? '#334155' : '#e2e7eb',
                  color: isDarkTheme ? '#e2e8f0' : '#1e293b',
                }}
                onClick={handleDisconnectGitHub}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Disconnect
              </button>
            </>
          ) : (
            <button 
              style={{
                ...styles.actionButton,
                background: isDarkTheme ? '#1e293b' : '#24292e',
                border: '1px solid #30363d',
              }}
              onClick={handleConnectGitHub}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <svg height="16" viewBox="0 0 16 16" width="16" fill="white">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
              </svg>
              Connect GitHub
            </button>
          )}
        </div>
      </div>

      {/* GitHub Repository Selection Modal */}
      {showRepoModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px',
        }}>
          <div style={{
            background: isDarkTheme ? '#1e293b' : 'white',
            borderRadius: '16px',
            padding: '30px',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '80vh',
            overflow: 'auto',
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
            }}>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                color: isDarkTheme ? '#e2e8f0' : '#1e293b',
                margin: 0,
              }}>
                Select Repository to Scan
              </h2>
              <button
                onClick={() => setShowRepoModal(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: isDarkTheme ? '#94a3b8' : '#64748b',
                }}
              >
                ×
              </button>
            </div>
            
            {loadingRepos ? (
              <div style={{textAlign: 'center', padding: '40px'}}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  border: '4px solid rgba(59, 130, 246, 0.2)',
                  borderTopColor: '#3b82f6',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto 20px',
                }} />
                <p style={{color: isDarkTheme ? '#94a3b8' : '#64748b'}}>
                  Loading repositories...
                </p>
              </div>
            ) : (
              <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                {githubRepos.length === 0 ? (
                  <p style={{
                    textAlign: 'center',
                    color: isDarkTheme ? '#94a3b8' : '#64748b',
                    padding: '40px',
                  }}>
                    No repositories found. Make sure you have repositories in your GitHub account.
                  </p>
                ) : (
                  githubRepos.map((repo) => (
                    <div
                      key={repo.id}
                      style={{
                        padding: '15px',
                        background: isDarkTheme ? '#0f172a' : '#f8fafc',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        border: '1px solid transparent',
                      }}
                      onClick={() => handleScanRepo(repo)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#3b82f6';
                        e.currentTarget.style.transform = 'translateX(5px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'transparent';
                        e.currentTarget.style.transform = 'translateX(0)';
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                      }}>
                        <div>
                          <h3 style={{
                            fontSize: '1rem',
                            fontWeight: 600,
                            color: isDarkTheme ? '#e2e8f0' : '#1e293b',
                            marginBottom: '5px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                          }}>
                            {repo.private && <span>🔒</span>}
                            {repo.name}
                          </h3>
                          <p style={{
                            fontSize: '0.85rem',
                            color: isDarkTheme ? '#94a3b8' : '#64748b',
                            margin: 0,
                          }}>
                            {repo.description || 'No description'}
                          </p>
                        </div>
                        <div style={{
                          display: 'flex',
                          gap: '10px',
                          alignItems: 'center',
                        }}>
                          {repo.language && (
                            <span style={{
                              padding: '4px 10px',
                              background: isDarkTheme ? '#334155' : '#e2e7eb',
                              borderRadius: '12px',
                              fontSize: '0.75rem',
                              color: isDarkTheme ? '#94a3b8' : '#64748b',
                            }}>
                              {repo.language}
                            </span>
                          )}
                          <span style={{
                            fontSize: '0.85rem',
                            color: isDarkTheme ? '#94a3b8' : '#64748b',
                          }}>
                            ⭐ {repo.stargazers_count}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div style={styles.tabs}>
        {['overview', 'vulnerabilities', 'scans', 'projects', 'reports'].map((tab) => (
          <button
            key={tab}
            style={{
              ...styles.tab,
              ...(activeTab === tab ? styles.activeTab : {})
            }}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <>
          {/* Key Statistics */}
          <div style={styles.statsGrid}>
            {[
              { title: 'Vulnerabilities Found', value: stats.vulnerabilitiesFound, subtitle: 'Across all projects', icon: '⚠️', progress: 100 },
              { title: 'Auto-Fixed', value: stats.autoFixed, subtitle: `${stats.fixedPercentage}% fixed automatically`, icon: '⚡', progress: stats.fixedPercentage },
              { title: 'Manual Review', value: stats.manualReview, subtitle: 'Needs human attention', icon: '👁️', progress: (stats.manualReview / stats.vulnerabilitiesFound) * 100 },
              { title: 'Avg Fix Time', value: stats.avgFixTime, subtitle: 'Per vulnerability', icon: '⏱️', progress: 100 },
            ].map((stat, index) => {
              const color = getStatCardColor(index);
              return (
                <div 
                  key={index}
                  style={{
                    ...styles.statCard,
                    borderTopColor: color,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                  }}
                >
                  <div style={styles.statHeader}>
                    <div style={styles.statTitle}>{stat.title}</div>
                    <div style={styles.statIcon}>{stat.icon}</div>
                  </div>
                  <div style={{...styles.statValue, color}}>{stat.value}</div>
                  <div style={styles.statSubtitle}>{stat.subtitle}</div>
                  <div style={styles.statProgress}>
                    <div style={{
                      ...styles.statProgressBar,
                      width: `${stat.progress}%`,
                      background: color,
                    }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Main Dashboard Grid */}
          <div style={styles.dashboardGrid}>
            {/* Recent Vulnerabilities Card */}
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <h3 style={styles.cardTitle}>Recent Vulnerabilities</h3>
                <a 
                  style={styles.cardAction}
                  onClick={handleViewAll}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#1d4ed8';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#2563eb';
                  }}
                >
                  View All →
                </a>
              </div>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.tableHeader}>Type</th>
                    <th style={styles.tableHeader}>Severity</th>
                    <th style={styles.tableHeader}>Status</th>
                    <th style={styles.tableHeader}>Fix Time</th>
                  </tr>
                </thead>
                <tbody>
                  {vulnerabilities.slice(0, 5).map((vuln) => {
                    const severityColors = getSeverityColor(vuln.severity);
                    const statusColors = getStatusColor(vuln.status);
                    return (
                      <tr key={vuln.id}>
                        <td style={styles.tableCell}>
                          <div style={{fontWeight: 500}}>{vuln.type}</div>
                          <div style={{fontSize: '0.8rem', color: isDarkTheme ? '#94a3b8' : '#64748b', marginTop: '2px'}}>
                            {vuln.file}:{vuln.line}
                          </div>
                        </td>
                        <td style={styles.tableCell}>
                          <span style={{
                            ...styles.severityBadge,
                            background: severityColors.background,
                            color: severityColors.color,
                            border: `1px solid ${severityColors.border}`
                          }}>
                            {vuln.severity}
                          </span>
                        </td>
                        <td style={styles.tableCell}>
                          <span style={{
                            ...styles.statusBadge,
                            background: statusColors.background,
                            color: statusColors.color,
                          }}>
                            {vuln.status}
                          </span>
                        </td>
                        <td style={styles.tableCell}>
                          <span style={{
                            color: vuln.status === 'Auto-Fixed' ? '#10b981' : isDarkTheme ? '#94a3b8' : '#64748b',
                            fontWeight: vuln.status === 'Auto-Fixed' ? 600 : 400,
                          }}>
                            {vuln.fixTime}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Recent Scans Card */}
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <h3 style={styles.cardTitle}>Recent Scans</h3>
                <a 
                  style={styles.cardAction}
                  onClick={() => setActiveTab('scans')}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#1d4ed8';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#2563eb';
                  }}
                >
                  View All →
                </a>
              </div>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.tableHeader}>Project</th>
                    <th style={styles.tableHeader}>Language</th>
                    <th style={styles.tableHeader}>Issues</th>
                    <th style={styles.tableHeader}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentScans.map((scan) => (
                    <tr key={scan.id}>
                      <td style={styles.tableCell}>
                        <div style={{fontWeight: 500}}>{scan.project}</div>
                        <div style={{fontSize: '0.8rem', color: isDarkTheme ? '#94a3b8' : '#64748b', marginTop: '2px'}}>
                          {scan.timestamp}
                        </div>
                      </td>
                      <td style={styles.tableCell}>
                        <span style={styles.languageBadge}>{scan.language}</span>
                      </td>
                      <td style={styles.tableCell}>
                        <span style={{
                          color: scan.vulnerabilities > 3 ? '#ef4444' : scan.vulnerabilities > 0 ? '#f59e0b' : '#10b981',
                          fontWeight: 600
                        }}>
                          {scan.vulnerabilities}
                        </span>
                      </td>
                      <td style={styles.tableCell}>
                        <span style={{
                          ...styles.statusBadge,
                          background: scan.status === 'Completed' ? '#dcfce7' : 
                                    scan.status === 'In Progress' ? '#fef3c7' : '#fee2e2',
                          color: scan.status === 'Completed' ? '#166534' : 
                                scan.status === 'In Progress' ? '#92400e' : '#991b1b',
                        }}>
                          {scan.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions */}
          <div style={styles.quickActions}>
            {[
              { icon: '🔍', text: 'New Security Scan', action: handleNewScan },
              { icon: '⚡', text: 'Quick Fix All', action: () => alert('Applying quick fixes...') },
              { icon: '📊', text: 'Generate Report', action: () => alert('Generating report...') },
              { icon: '🔔', text: 'Alert Settings', action: () => setActiveTab('settings') },
              { icon: '🔄', text: 'Sync Repos', action: () => alert('Syncing repositories...') },
            ].map((action, index) => (
              <button
                key={index}
                style={styles.quickActionButton}
                onClick={action.action}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.background = isDarkTheme ? '#475569' : '#e2e7eb';
                  e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.background = isDarkTheme ? '#334155' : '#f1f5f9';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={styles.quickActionIcon}>{action.icon}</div>
                <div style={styles.quickActionText}>{action.text}</div>
              </button>
            ))}
          </div>
        </>
      )}

      {/* Other tabs content (simplified for now) */}
      {activeTab !== 'overview' && (
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} View
          </h3>
          <p style={{color: isDarkTheme ? '#94a3b8' : '#64748b', lineHeight: 1.6}}>
            This view is under development. In the complete version, you would see detailed 
            {activeTab === 'vulnerabilities' && ' vulnerability analysis and management tools.'}
            {activeTab === 'scans' && ' scan history and configuration options.'}
            {activeTab === 'projects' && ' project management and repository settings.'}
            {activeTab === 'reports' && ' security reports and compliance documentation.'}
          </p>
          <button 
            style={{
              ...styles.actionButton,
              marginTop: '20px',
              background: 'linear-gradient(135deg, #10b981, #34d399)',
            }}
            onClick={() => setActiveTab('overview')}
          >
            ← Back to Overview
          </button>
        </div>
      )}

      <div style={styles.footer}>
        <p>AutoDoc Security Dashboard • Free Trial Day {14 - trialStatus.daysRemaining + 1} of 14</p>
        <p style={{marginTop: '8px', fontSize: '0.8rem'}}>
          Last updated: Just now • 
          {' '}<a href="#" onClick={handleUpgrade} style={{color: '#2563eb', textDecoration: 'none'}}>Upgrade for unlimited scans</a>
        </p>
      </div>
    </div>
  );
}

export default DashboardPage;