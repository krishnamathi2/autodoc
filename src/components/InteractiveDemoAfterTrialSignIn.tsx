import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

interface Vulnerability {
  id: number;
  type: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  line: number;
  description: string;
  suggestion: string;
}

const InteractiveDemoAfterTrialSignIn = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [uploadedCode, setUploadedCode] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>([]);
  const [highlightedLine, setHighlightedLine] = useState<number | null>(null);
  const [fixedCode, setFixedCode] = useState<string | null>(null);
  const [showFixedCode, setShowFixedCode] = useState(false);
  const [showCompareView, setShowCompareView] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const scanForVulnerabilities = (code: string): Vulnerability[] => {
    const vulns: Vulnerability[] = [];
    const lines = code.split('\n');
    let vulnId = 1;

    lines.forEach((line, index) => {
      const lineNum = index + 1;
      const lowerLine = line.toLowerCase();

      // Hardcoded credentials
      if (/password\s*=\s*['"][^'"]+['"]/.test(line) || 
          /api_key\s*=\s*['"][^'"]+['"]/.test(line) ||
          /secret\s*=\s*['"][^'"]+['"]/.test(line)) {
        vulns.push({
          id: vulnId++,
          type: 'Hardcoded Credentials',
          severity: 'Critical',
          line: lineNum,
          description: 'Sensitive credentials are hardcoded in the source code.',
          suggestion: 'Use environment variables or a secrets manager instead.'
        });
      }

      // SQL Injection
      if (/query\s*\(.*\$\{.*\}.*\)/.test(line) || 
          /query\s*\(.*\+.*\)/.test(line) ||
          /execute\s*\(.*\+.*\)/.test(line)) {
        vulns.push({
          id: vulnId++,
          type: 'SQL Injection',
          severity: 'Critical',
          line: lineNum,
          description: 'User input is directly concatenated into SQL query.',
          suggestion: 'Use parameterized queries or prepared statements.'
        });
      }

      // XSS Vulnerability
      if (/innerHTML\s*=/.test(line) || 
          /document\.write\s*\(/.test(line) ||
          /\.html\s*\(.*\+/.test(line)) {
        vulns.push({
          id: vulnId++,
          type: 'XSS Vulnerability',
          severity: 'High',
          line: lineNum,
          description: 'Potential Cross-Site Scripting vulnerability detected.',
          suggestion: 'Sanitize user input before rendering in the DOM.'
        });
      }

      // Command Injection
      if (/exec\s*\(.*\+/.test(line) || 
          /spawn\s*\(.*\+/.test(line) ||
          /system\s*\(.*\+/.test(line)) {
        vulns.push({
          id: vulnId++,
          type: 'Command Injection',
          severity: 'Critical',
          line: lineNum,
          description: 'User input may be passed to shell command.',
          suggestion: 'Use execFile() with validated arguments instead of exec().'
        });
      }

      // Eval usage
      if (/\beval\s*\(/.test(line)) {
        vulns.push({
          id: vulnId++,
          type: 'Unsafe Eval',
          severity: 'Critical',
          line: lineNum,
          description: 'Using eval() can lead to code injection attacks.',
          suggestion: 'Use JSON.parse() for JSON data or safer alternatives.'
        });
      }

      // Weak cryptography
      if (/md5\s*\(/.test(lowerLine) || /sha1\s*\(/.test(lowerLine)) {
        vulns.push({
          id: vulnId++,
          type: 'Weak Cryptography',
          severity: 'Medium',
          line: lineNum,
          description: 'Using weak/deprecated hashing algorithm.',
          suggestion: 'Use bcrypt, Argon2, or SHA-256 for hashing.'
        });
      }

      // Insecure random
      if (/Math\.random\s*\(/.test(line)) {
        vulns.push({
          id: vulnId++,
          type: 'Insecure Random',
          severity: 'Low',
          line: lineNum,
          description: 'Math.random() is not cryptographically secure.',
          suggestion: 'Use crypto.randomBytes() for security-sensitive operations.'
        });
      }

      // Console.log in production
      if (/console\.(log|debug|info)\s*\(/.test(line)) {
        vulns.push({
          id: vulnId++,
          type: 'Debug Statement',
          severity: 'Low',
          line: lineNum,
          description: 'Console statements should be removed in production.',
          suggestion: 'Remove or use a proper logging library.'
        });
      }

      // CORS wildcard
      if (/Access-Control-Allow-Origin.*\*/.test(line)) {
        vulns.push({
          id: vulnId++,
          type: 'CORS Misconfiguration',
          severity: 'Medium',
          line: lineNum,
          description: 'Wildcard CORS allows any origin to access resources.',
          suggestion: 'Specify allowed origins explicitly.'
        });
      }
    });

    return vulns;
  };

  const handleScan = () => {
    if (!uploadedCode) return;
    
    setIsScanning(true);
    setScanComplete(false);
    setHighlightedLine(null);
    
    // Simulate scanning delay
    setTimeout(() => {
      const results = scanForVulnerabilities(uploadedCode);
      setVulnerabilities(results);
      setIsScanning(false);
      setScanComplete(true);
    }, 1500);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return '#ef4444';
      case 'High': return '#f97316';
      case 'Medium': return '#eab308';
      case 'Low': return '#22c55e';
      default: return '#64748b';
    }
  };

  const applyFixes = (code: string): string => {
    let lines = code.split('\n');
    
    lines = lines.map((line) => {
      // Fix hardcoded credentials
      if (/password\s*=\s*['"][^'"]+['"]/i.test(line)) {
        line = line.replace(/password\s*=\s*['"][^'"]+['"]/gi, 'password = process.env.DB_PASSWORD');
      }
      if (/api_key\s*=\s*['"][^'"]+['"]/i.test(line)) {
        line = line.replace(/api_key\s*=\s*['"][^'"]+['"]/gi, 'api_key = process.env.API_KEY');
      }
      if (/secret\s*=\s*['"][^'"]+['"]/i.test(line)) {
        line = line.replace(/secret\s*=\s*['"][^'"]+['"]/gi, 'secret = process.env.SECRET_KEY');
      }
      
      // Fix SQL Injection - replace string concatenation with parameterized query
      if (/query\s*\(`[^`]*\$\{[^}]+\}[^`]*`\)/.test(line)) {
        line = line.replace(/query\s*\(`[^`]*\$\{([^}]+)\}[^`]*`\)/, 'query("SELECT * FROM table WHERE id = ?", [$1])');
      }
      
      // Fix eval usage
      if (/\beval\s*\(/.test(line)) {
        line = line.replace(/eval\s*\(([^)]+)\)/, 'JSON.parse($1)');
      }
      
      // Fix weak cryptography
      if (/createHash\s*\(\s*['"]md5['"]\s*\)/.test(line)) {
        line = line.replace(/createHash\s*\(\s*['"]md5['"]\s*\)/, 'createHash("sha256")');
      }
      if (/createHash\s*\(\s*['"]sha1['"]\s*\)/.test(line)) {
        line = line.replace(/createHash\s*\(\s*['"]sha1['"]\s*\)/, 'createHash("sha256")');
      }
      
      // Fix insecure random
      if (/Math\.random\s*\(\s*\)/.test(line)) {
        line = line.replace(/Math\.random\s*\(\s*\)/, 'crypto.randomBytes(16).toString("hex")');
      }
      
      // Fix CORS wildcard
      if (/Access-Control-Allow-Origin.*['"]?\*['"]?/.test(line)) {
        line = line.replace(/['"]?\*['"]?/, '"https://yourdomain.com"');
      }
      
      // Remove console.log statements (comment them out)
      if (/^\s*console\.(log|debug|info)\s*\(/.test(line)) {
        line = '// ' + line.trim() + ' // TODO: Remove in production';
      }
      
      return line;
    });
    
    // Add security header comment at the top
    const header = `// ============================================
// SECURED BY AUTODOC
// Vulnerabilities fixed: ${vulnerabilities.length}
// Date: ${new Date().toLocaleDateString()}
// ============================================

`;
    
    return header + lines.join('\n');
  };

  const handleFixAll = () => {
    if (!uploadedCode) return;
    
    const fixed = applyFixes(uploadedCode);
    setFixedCode(fixed);
    setShowFixedCode(true);
  };

  const handleDownloadFixed = () => {
    if (!fixedCode) return;
    
    const blob = new Blob([fixedCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName.replace(/\.([^.]+)$/, '_fixed.$1') || 'fixed_code.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCompareCode = () => {
    if (!uploadedCode || !fixedCode) {
      // Generate fixed code first if not already done
      if (uploadedCode) {
        const fixed = applyFixes(uploadedCode);
        setFixedCode(fixed);
      }
    }
    setShowCompareView(true);
    setShowFixedCode(false);
  };

  const handleExportReport = () => {
    const criticalCount = vulnerabilities.filter(v => v.severity === 'Critical').length;
    const highCount = vulnerabilities.filter(v => v.severity === 'High').length;
    const mediumCount = vulnerabilities.filter(v => v.severity === 'Medium').length;
    const lowCount = vulnerabilities.filter(v => v.severity === 'Low').length;

    const report = `
================================================================================
                        AUTODOC SECURITY SCAN REPORT
================================================================================

📄 File: ${fileName}
📅 Date: ${new Date().toLocaleString()}
🔍 Scanner: AutoDoc Security Scanner v1.0

================================================================================
                              EXECUTIVE SUMMARY
================================================================================

Total Vulnerabilities Found: ${vulnerabilities.length}

  🔴 Critical: ${criticalCount}
  🟠 High:     ${highCount}
  🟡 Medium:   ${mediumCount}
  🟢 Low:      ${lowCount}

Risk Level: ${criticalCount > 0 ? '🔴 CRITICAL' : highCount > 0 ? '🟠 HIGH' : mediumCount > 0 ? '🟡 MEDIUM' : '🟢 LOW'}

================================================================================
                           DETAILED FINDINGS
================================================================================

${vulnerabilities.map((v, i) => `
[${v.severity.toUpperCase()}] #${i + 1}: ${v.type}
${'─'.repeat(60)}
  📍 Location: Line ${v.line}
  📝 Description: ${v.description}
  💡 Recommendation: ${v.suggestion}
`).join('\n')}

================================================================================
                            RECOMMENDATIONS
================================================================================

${criticalCount > 0 ? `
⚠️  IMMEDIATE ACTION REQUIRED
    ${criticalCount} critical vulnerabilities must be fixed before deployment.
` : ''}
${highCount > 0 ? `
⚡ HIGH PRIORITY
    ${highCount} high severity issues should be addressed as soon as possible.
` : ''}
${mediumCount > 0 ? `
📋 MEDIUM PRIORITY
    ${mediumCount} medium severity issues should be scheduled for remediation.
` : ''}
${lowCount > 0 ? `
📌 LOW PRIORITY
    ${lowCount} low severity issues can be addressed during regular maintenance.
` : ''}

================================================================================
                              NEXT STEPS
================================================================================

1. Review all critical and high severity findings immediately
2. Use AutoDoc's "Fix All" feature to automatically remediate issues
3. Re-scan the code after applying fixes to verify remediation
4. Implement secure coding practices to prevent future vulnerabilities

================================================================================
                    Report Generated by AutoDoc Security Scanner
                         © ${new Date().getFullYear()} AutoDoc - All Rights Reserved
================================================================================
`;

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `security_report_${fileName.replace(/\.[^.]+$/, '')}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setUploadedCode(content);
      setFileName(file.name);
    };
    reader.readAsText(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleClearFile = () => {
    setUploadedCode(null);
    setFileName('');
    setScanComplete(false);
    setVulnerabilities([]);
    setHighlightedLine(null);
    setFixedCode(null);
    setShowFixedCode(false);
    setShowCompareView(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

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
      background: 'linear-gradient(135deg, #10b981, #34d399)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    subtitle: {
      fontSize: '1.2rem',
      color: isDarkTheme ? '#94a3b8' : '#64748b',
      lineHeight: 1.6,
    },
    trialBadge: {
      display: 'inline-block',
      background: 'linear-gradient(135deg, #10b981, #34d399)',
      color: 'white',
      padding: '8px 20px',
      borderRadius: '20px',
      fontSize: '0.9rem',
      fontWeight: 600,
      marginTop: '15px',
    },
    demoContainer: {
      display: 'flex',
      gap: '40px',
      maxWidth: '1200px',
      margin: '0 auto',
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
      background: 'linear-gradient(135deg, #10b981, #34d399)',
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
      maxHeight: '400px',
      overflowY: 'auto' as const,
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
  };

  return (
    <div style={styles.container}>
      <div style={styles.topControls}>
        <button
          style={styles.backButton}
          onClick={() => navigate('/')}
          onMouseOver={(e) => e.currentTarget.style.background = isDarkTheme ? '#334155' : '#e2e8f0'}
          onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
        >
          ← Back to Home
        </button>
        <button
          style={styles.themeToggle}
          onClick={() => setIsDarkTheme(!isDarkTheme)}
        >
          {isDarkTheme ? '☀️ Light' : '🌙 Dark'}
        </button>
      </div>

      <div style={styles.header}>
        <h1 style={styles.title}>🎉 Welcome to Your Free Trial!</h1>
        <p style={styles.subtitle}>
          You now have full access to AutoDoc's security scanning features for 3 days.
          Try scanning your code below to discover vulnerabilities instantly.
        </p>
        <div style={styles.trialBadge}>
          ✅ Free Trial Active - 3 Days Remaining
        </div>
      </div>

      <div style={styles.demoContainer}>
        {showCompareView ? (
          // Compare View - Side by Side
          <div style={{ flex: 1, display: 'flex', gap: '20px' }}>
            <div style={{ ...styles.leftPanel, flex: 1 }}>
              <div style={styles.codeContainer}>
                <div style={{
                  ...styles.codeHeader,
                  background: 'rgba(239, 68, 68, 0.2)',
                  borderBottom: '2px solid #ef4444',
                }}>
                  <span style={{ ...styles.codeTitle, color: '#ef4444' }}>
                    ❌ Original Code (Vulnerable)
                  </span>
                </div>
                <div style={styles.codeContent}>
                  {uploadedCode?.split('\n').map((line, index) => {
                    const lineNum = index + 1;
                    const hasVuln = vulnerabilities.some(v => v.line === lineNum);
                    return (
                      <div
                        key={index}
                        style={{
                          display: 'flex',
                          background: hasVuln ? 'rgba(239, 68, 68, 0.15)' : 'transparent',
                          borderLeft: hasVuln ? '3px solid #ef4444' : '3px solid transparent',
                          padding: '2px 10px',
                        }}
                      >
                        <span style={{ color: '#64748b', marginRight: '15px', minWidth: '30px', textAlign: 'right', userSelect: 'none' }}>
                          {lineNum}
                        </span>
                        <span style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{line}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div style={{ ...styles.rightPanel, flex: 1 }}>
              <div style={styles.codeContainer}>
                <div style={{
                  ...styles.codeHeader,
                  background: 'rgba(16, 185, 129, 0.2)',
                  borderBottom: '2px solid #10b981',
                }}>
                  <span style={{ ...styles.codeTitle, color: '#10b981' }}>
                    ✅ Fixed Code (Secured)
                  </span>
                </div>
                <div style={styles.codeContent}>
                  {fixedCode?.split('\n').map((line, index) => {
                    const lineNum = index + 1;
                    const isFixed = line.includes('process.env.') || 
                                    line.includes('// SECURED BY AUTODOC') ||
                                    line.includes('sha256') ||
                                    line.includes('crypto.randomBytes') ||
                                    line.includes('JSON.parse') ||
                                    line.includes('// TODO: Remove in production') ||
                                    line.includes('Vulnerabilities fixed');
                    return (
                      <div
                        key={index}
                        style={{
                          display: 'flex',
                          background: isFixed ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                          borderLeft: isFixed ? '3px solid #10b981' : '3px solid transparent',
                          padding: '2px 10px',
                        }}
                      >
                        <span style={{ color: '#64748b', marginRight: '15px', minWidth: '30px', textAlign: 'right', userSelect: 'none' }}>
                          {lineNum}
                        </span>
                        <span style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{line}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
        <div style={styles.leftPanel}>
          <div style={styles.codeContainer}>
            <div style={styles.codeHeader}>
              <span style={styles.codeTitle}>
                {showFixedCode ? `✅ ${fileName} (Fixed)` : uploadedCode ? `📄 ${fileName}` : '📄 Upload your code'}
              </span>
              <div style={{ display: 'flex', gap: '10px' }}>
                {showFixedCode && (
                  <button
                    style={{
                      ...styles.scanButton,
                      background: '#64748b',
                    }}
                    onClick={() => setShowFixedCode(false)}
                  >
                    View Original
                  </button>
                )}
                {uploadedCode && (
                  <button
                    style={{
                      ...styles.scanButton,
                      background: '#ef4444',
                    }}
                    onClick={handleClearFile}
                  >
                    ✕ Clear
                  </button>
                )}
              </div>
            </div>
            {!uploadedCode ? (
              <div
                style={{
                  ...styles.codeContent,
                  display: 'flex',
                  flexDirection: 'column' as const,
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '300px',
                  textAlign: 'center' as const,
                  border: isDragging ? '2px dashed #10b981' : '2px dashed transparent',
                  background: isDragging ? 'rgba(16, 185, 129, 0.1)' : undefined,
                  transition: 'all 0.2s ease',
                }}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileInputChange}
                  accept=".js,.ts,.tsx,.jsx,.py,.java,.c,.cpp,.cs,.go,.rb,.php,.html,.css,.json,.xml,.yaml,.yml,.md,.txt"
                  style={{ display: 'none' }}
                />
                <p style={{ fontSize: '3rem', marginBottom: '20px' }}>📁</p>
                <p style={{ marginBottom: '15px' }}>
                  {isDragging ? 'Drop your file here!' : 'Drag and drop your code file here'}
                </p>
                <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '20px' }}>or</p>
                <button
                  style={styles.scanButton}
                  onClick={handleBrowseClick}
                >
                  Browse Files
                </button>
              </div>
            ) : showFixedCode && fixedCode ? (
              <div style={styles.codeContent}>
                {fixedCode.split('\n').map((line, index) => {
                  const lineNum = index + 1;
                  const isFixed = line.includes('process.env.') || 
                                  line.includes('// SECURED BY AUTODOC') ||
                                  line.includes('sha256') ||
                                  line.includes('crypto.randomBytes') ||
                                  line.includes('JSON.parse') ||
                                  line.includes('// TODO: Remove in production');
                  return (
                    <div
                      key={index}
                      style={{
                        display: 'flex',
                        background: isFixed ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                        borderLeft: isFixed ? '3px solid #10b981' : '3px solid transparent',
                        padding: '2px 10px',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <span style={{ 
                        color: '#64748b', 
                        marginRight: '15px', 
                        minWidth: '30px',
                        userSelect: 'none',
                        textAlign: 'right',
                      }}>
                        {lineNum}
                      </span>
                      <span style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{line}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={styles.codeContent}>
                {uploadedCode.split('\n').map((line, index) => {
                  const lineNum = index + 1;
                  const hasVuln = vulnerabilities.some(v => v.line === lineNum);
                  const isHighlighted = highlightedLine === lineNum;
                  return (
                    <div
                      key={index}
                      style={{
                        display: 'flex',
                        background: isHighlighted ? 'rgba(239, 68, 68, 0.3)' : 
                                   hasVuln && scanComplete ? 'rgba(239, 68, 68, 0.1)' : 'transparent',
                        borderLeft: hasVuln && scanComplete ? '3px solid #ef4444' : '3px solid transparent',
                        padding: '2px 10px',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <span style={{ 
                        color: '#64748b', 
                        marginRight: '15px', 
                        minWidth: '30px',
                        userSelect: 'none',
                        textAlign: 'right',
                      }}>
                        {lineNum}
                      </span>
                      <span style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{line}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div style={styles.rightPanel}>
          <h3 style={{ marginBottom: '20px', fontSize: '1.2rem' }}>
            {scanComplete ? '🛡️ Scan Results' : uploadedCode ? '🛡️ Code Uploaded' : '🔍 Ready to Scan'}
          </h3>
          
          {isScanning ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: isDarkTheme ? '#94a3b8' : '#64748b' }}>
              <p style={{ fontSize: '3rem', marginBottom: '20px' }}>🔄</p>
              <p>Scanning code for vulnerabilities...</p>
              <div style={{
                width: '200px',
                height: '4px',
                background: isDarkTheme ? '#334155' : '#e2e8f0',
                borderRadius: '2px',
                margin: '20px auto',
                overflow: 'hidden',
              }}>
                <div style={{
                  width: '50%',
                  height: '100%',
                  background: 'linear-gradient(135deg, #10b981, #34d399)',
                  borderRadius: '2px',
                  animation: 'scan 1s ease-in-out infinite',
                }}></div>
              </div>
            </div>
          ) : scanComplete ? (
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '15px',
                background: isDarkTheme ? '#0f172a' : '#f1f5f9',
                borderRadius: '8px',
                marginBottom: '15px',
              }}>
                <span style={{ fontWeight: 600 }}>
                  Found {vulnerabilities.length} {vulnerabilities.length === 1 ? 'issue' : 'issues'}
                </span>
                <span style={{ 
                  color: vulnerabilities.filter(v => v.severity === 'Critical').length > 0 ? '#ef4444' : '#22c55e',
                  fontWeight: 600 
                }}>
                  {vulnerabilities.filter(v => v.severity === 'Critical').length} Critical
                </span>
              </div>
              
              {vulnerabilities.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px', color: isDarkTheme ? '#94a3b8' : '#64748b' }}>
                  <p style={{ fontSize: '3rem', marginBottom: '15px' }}>✅</p>
                  <p style={{ fontWeight: 600, color: '#22c55e' }}>No vulnerabilities found!</p>
                  <p style={{ marginTop: '10px', fontSize: '0.9rem' }}>Your code looks secure.</p>
                </div>
              ) : (
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {vulnerabilities.map((vuln) => (
                    <div
                      key={vuln.id}
                      style={{
                        padding: '15px',
                        background: isDarkTheme ? '#334155' : '#f8fafc',
                        borderRadius: '8px',
                        marginBottom: '10px',
                        borderLeft: `4px solid ${getSeverityColor(vuln.severity)}`,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                      onClick={() => setHighlightedLine(vuln.line)}
                      onMouseOver={(e) => e.currentTarget.style.transform = 'translateX(5px)'}
                      onMouseOut={(e) => e.currentTarget.style.transform = 'translateX(0)'}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontWeight: 600 }}>{vuln.type}</span>
                        <span style={{
                          background: getSeverityColor(vuln.severity),
                          color: 'white',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                        }}>
                          {vuln.severity}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: isDarkTheme ? '#94a3b8' : '#64748b', marginBottom: '5px' }}>
                        Line {vuln.line}: {vuln.description}
                      </p>
                      <p style={{ fontSize: '0.8rem', color: '#10b981' }}>
                        💡 {vuln.suggestion}
                      </p>
                    </div>
                  ))}
                </div>
              )}
              
              {vulnerabilities.length > 0 && !showFixedCode && (
                <div style={{ marginTop: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' as const }}>
                  <button
                    style={{
                      ...styles.scanButton,
                      flex: 1,
                      minWidth: '140px',
                      padding: '12px 20px',
                      fontSize: '1rem',
                    }}
                    onClick={handleFixAll}
                  >
                    🔧 Fix All
                  </button>
                  <button
                    style={{
                      ...styles.scanButton,
                      flex: 1,
                      minWidth: '140px',
                      padding: '12px 20px',
                      fontSize: '1rem',
                      background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
                    }}
                    onClick={handleCompareCode}
                  >
                    📊 Compare Code
                  </button>
                  <button
                    style={{
                      ...styles.scanButton,
                      flex: 1,
                      minWidth: '140px',
                      padding: '12px 20px',
                      fontSize: '1rem',
                      background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
                    }}
                    onClick={handleExportReport}
                  >
                    📄 Export Report
                  </button>
                </div>
              )}
              
              {showFixedCode && (
                <div style={{ marginTop: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' as const }}>
                  <button
                    style={{
                      ...styles.scanButton,
                      flex: 1,
                      minWidth: '140px',
                      padding: '12px 20px',
                      fontSize: '1rem',
                      background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
                    }}
                    onClick={handleDownloadFixed}
                  >
                    📥 Download Fixed
                  </button>
                  <button
                    style={{
                      ...styles.scanButton,
                      flex: 1,
                      minWidth: '140px',
                      padding: '12px 20px',
                      fontSize: '1rem',
                      background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
                    }}
                    onClick={handleCompareCode}
                  >
                    📊 Compare Code
                  </button>
                  <button
                    style={{
                      ...styles.scanButton,
                      flex: 1,
                      minWidth: '140px',
                      padding: '12px 20px',
                      fontSize: '1rem',
                      background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
                    }}
                    onClick={handleExportReport}
                  >
                    📄 Export Report
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: isDarkTheme ? '#94a3b8' : '#64748b' }}>
              <p style={{ fontSize: '3rem', marginBottom: '20px' }}>{uploadedCode ? '✅' : '🔐'}</p>
              <p>
                {uploadedCode 
                  ? `File "${fileName}" uploaded successfully!` 
                  : 'Upload your code to analyze it for security vulnerabilities.'}
              </p>
              <p style={{ marginTop: '10px', fontSize: '0.9rem' }}>
                {uploadedCode
                  ? 'Click "Scan for Vulnerabilities" to analyze your code.'
                  : 'AutoDoc will identify potential security issues and suggest fixes.'}
              </p>
              {uploadedCode && (
                <button
                  style={{
                    ...styles.scanButton,
                    marginTop: '20px',
                    padding: '12px 24px',
                    fontSize: '1rem',
                  }}
                  onClick={handleScan}
                >
                  🔍 Scan for Vulnerabilities
                </button>
              )}
            </div>
          )}
        </div>
        </>
        )}
      </div>

      {/* Compare View Controls */}
      {showCompareView && (
        <div style={{
          maxWidth: '1200px',
          margin: '20px auto 0',
          display: 'flex',
          gap: '10px',
          justifyContent: 'center',
          flexWrap: 'wrap' as const,
        }}>
          <button
            style={{
              ...styles.scanButton,
              padding: '12px 24px',
              fontSize: '1rem',
              background: '#64748b',
            }}
            onClick={() => setShowCompareView(false)}
          >
            ← Back to Editor
          </button>
          <button
            style={{
              ...styles.scanButton,
              padding: '12px 24px',
              fontSize: '1rem',
              background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
            }}
            onClick={handleDownloadFixed}
          >
            📥 Download Fixed Code
          </button>
          <button
            style={{
              ...styles.scanButton,
              padding: '12px 24px',
              fontSize: '1rem',
              background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
            }}
            onClick={handleExportReport}
          >
            📄 Export Report
          </button>
        </div>
      )}

      <div style={styles.ctaSection}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '15px' }}>
          Enjoying Your Free Trial?
        </h2>
        <p style={{ color: isDarkTheme ? '#94a3b8' : '#64748b', marginBottom: '20px' }}>
          Upgrade to a paid plan to continue using AutoDoc after your trial ends.
        </p>
        <button
          style={{
            background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
            color: 'white',
            border: 'none',
            padding: '14px 28px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '1rem',
            transition: 'all 0.2s ease',
          }}
          onClick={() => navigate('/payments')}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          View Pricing Plans →
        </button>
      </div>
    </div>
  );
};

export default InteractiveDemoAfterTrialSignIn;
