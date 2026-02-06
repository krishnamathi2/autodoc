import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const InteractiveDemoPage = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [showFix, setShowFix] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [highlightedLine, setHighlightedLine] = useState<number | null>(null);
  const [fixesApplied, setFixesApplied] = useState(false);
  const [importedCode, setImportedCode] = useState<string | null>(null);
  const [importedFileName, setImportedFileName] = useState<string>('example-code.js');
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
    { number: 2, label: 'Scan Results & Analysis' },
  ];

  // Default example code with multiple vulnerability types
  const defaultExampleCode = `// ============================================
// E-Commerce Application - Security Review
// ============================================

const express = require('express');
const mysql = require('mysql');
const app = express();

// HARDCODED CREDENTIALS (Critical)
const DB_PASSWORD = 'admin123!';
const API_KEY = 'sk_live_abc123xyz789';
const JWT_SECRET = 'mysupersecretkey';

// Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: DB_PASSWORD
});

// SQL INJECTION (High)
app.get('/user/:id', (req, res) => {
  const userId = req.params.id;
  db.query(\`SELECT * FROM users WHERE id = \${userId}\`);
});

// XSS VULNERABILITY (Medium)
app.get('/profile', (req, res) => {
  const name = req.query.name;
  res.send('<h1>Welcome ' + name + '</h1>');
});

// COMMAND INJECTION (Critical)
app.post('/convert', (req, res) => {
  const filename = req.body.filename;
  exec('convert ' + filename + ' output.pdf');
});

// PATH TRAVERSAL (High)
app.get('/download', (req, res) => {
  const file = req.query.file;
  res.sendFile('/uploads/' + file);
});

// INSECURE DESERIALIZATION (Critical)
app.post('/data', (req, res) => {
  const obj = eval('(' + req.body.data + ')');
  processData(obj);
});

// WEAK CRYPTOGRAPHY (Medium)
const crypto = require('crypto');
function hashPassword(password) {
  return crypto.createHash('md5').update(password).digest('hex');
}

// INSECURE RANDOM (Low)
function generateToken() {
  return Math.random().toString(36).substring(7);
}

// OPEN REDIRECT (Medium)
app.get('/redirect', (req, res) => {
  const url = req.query.url;
  res.redirect(url);
});

// MISSING AUTHENTICATION
app.delete('/admin/user/:id', (req, res) => {
  db.query('DELETE FROM users WHERE id = ?', [req.params.id]);
  res.send('User deleted');
});

// CORS MISCONFIGURATION (Medium)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

// INFORMATION DISCLOSURE
app.use((err, req, res, next) => {
  res.status(500).send(err.stack);
});

app.listen(3000);`;

  const vulnerabilities = [
    { 
      id: 1, 
      type: 'Hardcoded Credentials', 
      severity: 'Critical', 
      file: 'app.js', 
      line: 10,
      explanation: 'Sensitive credentials (DB_PASSWORD, API_KEY, JWT_SECRET) are hardcoded in source code. Use environment variables instead.',
      fix: 'Moved all sensitive credentials to environment variables using process.env. This ensures secrets are never committed to version control.'
    },
    { 
      id: 2, 
      type: 'SQL Injection', 
      severity: 'High', 
      file: 'app.js', 
      line: 24,
      explanation: 'User input is directly concatenated into SQL query. Use parameterized queries to prevent SQL injection attacks.',
      fix: 'Replaced string concatenation with parameterized query using ? placeholders. User input is now safely escaped by the database driver.'
    },
    { 
      id: 3, 
      type: 'XSS Vulnerability', 
      severity: 'Medium', 
      file: 'app.js', 
      line: 30,
      explanation: 'User input is rendered directly in HTML without sanitization. Use proper output encoding or a template engine.',
      fix: 'Added escapeHtml() function to sanitize user input before rendering. All special HTML characters are now properly encoded.'
    },
    { 
      id: 4, 
      type: 'Command Injection', 
      severity: 'Critical', 
      file: 'app.js', 
      line: 36,
      explanation: 'User input is passed directly to shell command. Validate input and use safe APIs instead of exec().',
      fix: 'Replaced exec() with execFile() and used path.basename() to strip directory traversal. Arguments are now passed as array, not string.'
    },
    { 
      id: 5, 
      type: 'Path Traversal', 
      severity: 'High', 
      file: 'app.js', 
      line: 42,
      explanation: 'User can traverse directories using "../" sequences. Validate and sanitize file paths.',
      fix: 'Used path.basename() to extract only the filename and path.join() to construct safe paths. Directory traversal sequences are now stripped.'
    },
    { 
      id: 6, 
      type: 'Insecure Deserialization', 
      severity: 'Critical', 
      file: 'app.js', 
      line: 48,
      explanation: 'Using eval() on user input allows arbitrary code execution. Use JSON.parse() instead.',
      fix: 'Replaced dangerous eval() with JSON.parse() for safe JSON deserialization. Arbitrary code execution is no longer possible.'
    },
    { 
      id: 7, 
      type: 'Weak Cryptography', 
      severity: 'Medium', 
      file: 'app.js', 
      line: 54,
      explanation: 'MD5 is cryptographically broken. Use bcrypt or Argon2 for password hashing.',
      fix: 'Replaced MD5 with bcrypt using a cost factor of 12. Passwords are now securely hashed with salt automatically included.'
    },
    { 
      id: 8, 
      type: 'Insecure Random', 
      severity: 'Low', 
      file: 'app.js', 
      line: 59,
      explanation: 'Math.random() is not cryptographically secure. Use crypto.randomBytes() for security tokens.',
      fix: 'Replaced Math.random() with crypto.randomBytes(32) for cryptographically secure token generation.'
    },
    { 
      id: 9, 
      type: 'Open Redirect', 
      severity: 'Medium', 
      file: 'app.js', 
      line: 64,
      explanation: 'Unvalidated redirect allows phishing attacks. Whitelist allowed redirect URLs.',
      fix: 'Implemented URL whitelist validation. Redirects are now only allowed to pre-approved internal paths.'
    },
    { 
      id: 10, 
      type: 'Missing Authentication', 
      severity: 'High', 
      file: 'app.js', 
      line: 69,
      explanation: 'Admin endpoint lacks authentication. Add proper authentication middleware.',
      fix: 'Added authMiddleware and adminOnly middleware to verify user authentication and admin privileges before processing requests.'
    },
  ];

  const handleVulnerabilityClick = (line: number) => {
    setHighlightedLine(line);
    // Scroll to the code container
    const codeContent = document.getElementById('code-content');
    if (codeContent) {
      codeContent.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

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

  const handleFixVulnerabilities = () => {
    setFixesApplied(true);
  };

  const handleExportFixedCode = () => {
    const fixedCode = `// ============================================
// E-Commerce Application - SECURED VERSION
// Fixed by AutoDoc Security Scanner
// ============================================

const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const path = require('path');
const { execFile } = require('child_process');
const app = express();

// FIXED: Use environment variables
const DB_PASSWORD = process.env.DB_PASSWORD;
const API_KEY = process.env.API_KEY;
const JWT_SECRET = process.env.JWT_SECRET;

// Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: DB_PASSWORD
});

// FIXED: Parameterized query
app.get('/user/:id', (req, res) => {
  const userId = parseInt(req.params.id, 10);
  db.query('SELECT * FROM users WHERE id = ?', [userId]);
});

// FIXED: Sanitize output
app.get('/profile', (req, res) => {
  const name = escapeHtml(req.query.name);
  res.send('<h1>Welcome ' + name + '</h1>');
});

// FIXED: Use safe API with validation
app.post('/convert', (req, res) => {
  const filename = path.basename(req.body.filename);
  execFile('convert', [filename, 'output.pdf']);
});

// FIXED: Validate and sanitize path
app.get('/download', (req, res) => {
  const file = path.basename(req.query.file);
  res.sendFile(path.join('/uploads', file));
});

// FIXED: Use JSON.parse instead of eval
app.post('/data', (req, res) => {
  const obj = JSON.parse(req.body.data);
  processData(obj);
});

// FIXED: Use bcrypt for password hashing
async function hashPassword(password) {
  return bcrypt.hash(password, 12);
}

// FIXED: Use crypto.randomBytes
const crypto = require('crypto');
function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

// FIXED: Whitelist allowed URLs
const allowedUrls = ['/home', '/dashboard', '/profile'];
app.get('/redirect', (req, res) => {
  const url = req.query.url;
  if (allowedUrls.includes(url)) {
    res.redirect(url);
  } else {
    res.status(400).send('Invalid redirect URL');
  }
});

// FIXED: Add authentication middleware
app.delete('/admin/user/:id', authMiddleware, adminOnly, (req, res) => {
  db.query('DELETE FROM users WHERE id = ?', [req.params.id]);
  res.send('User deleted');
});

// FIXED: Restrict CORS origins
const allowedOrigins = ['https://myapp.com'];
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  next();
});

// FIXED: Generic error response
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('An error occurred');
});

app.listen(3000);`;

    const blob = new Blob([fixedCode], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'fixed-code.js';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportDetailedReport = () => {
    const report = `
================================================================================
                    AUTODOC SECURITY SCAN REPORT
================================================================================

Scan Date: ${new Date().toLocaleString()}
File Scanned: ${importedFileName}
Total Lines of Code: 75
Scan Duration: 0.8 seconds

================================================================================
                         EXECUTIVE SUMMARY
================================================================================

┌─────────────────────────────────────────────────────────────────────────────┐
│  VULNERABILITIES FOUND: 10                                                  │
│  CRITICAL: 3  |  HIGH: 3  |  MEDIUM: 3  |  LOW: 1                          │
│  ALL VULNERABILITIES HAVE BEEN AUTOMATICALLY FIXED                          │
└─────────────────────────────────────────────────────────────────────────────┘

================================================================================
                      DETAILED VULNERABILITY REPORT
================================================================================

──────────────────────────────────────────────────────────────────────────────
VULNERABILITY #1: Hardcoded Credentials
──────────────────────────────────────────────────────────────────────────────
Severity:    🔴 CRITICAL
Location:    app.js:10
Status:      ✅ FIXED

ISSUE DESCRIPTION:
Sensitive credentials (DB_PASSWORD, API_KEY, JWT_SECRET) are hardcoded in 
source code. This exposes secrets in version control and makes rotation 
difficult.

VULNERABLE CODE:
  const DB_PASSWORD = 'admin123!';
  const API_KEY = 'sk_live_abc123xyz789';
  const JWT_SECRET = 'mysupersecretkey';

FIX APPLIED:
  const DB_PASSWORD = process.env.DB_PASSWORD;
  const API_KEY = process.env.API_KEY;
  const JWT_SECRET = process.env.JWT_SECRET;

REMEDIATION:
Moved all sensitive credentials to environment variables using process.env. 
This ensures secrets are never committed to version control.

──────────────────────────────────────────────────────────────────────────────
VULNERABILITY #2: SQL Injection
──────────────────────────────────────────────────────────────────────────────
Severity:    🟠 HIGH
Location:    app.js:24
Status:      ✅ FIXED

ISSUE DESCRIPTION:
User input is directly concatenated into SQL query, allowing attackers to 
manipulate database queries and access unauthorized data.

VULNERABLE CODE:
  db.query(\`SELECT * FROM users WHERE id = \${userId}\`);

FIX APPLIED:
  db.query('SELECT * FROM users WHERE id = ?', [userId]);

REMEDIATION:
Replaced string concatenation with parameterized query using ? placeholders. 
User input is now safely escaped by the database driver.

──────────────────────────────────────────────────────────────────────────────
VULNERABILITY #3: XSS Vulnerability
──────────────────────────────────────────────────────────────────────────────
Severity:    🟡 MEDIUM
Location:    app.js:30
Status:      ✅ FIXED

ISSUE DESCRIPTION:
User input is rendered directly in HTML without sanitization, enabling 
attackers to inject malicious scripts.

VULNERABLE CODE:
  res.send('<h1>Welcome ' + name + '</h1>');

FIX APPLIED:
  const name = escapeHtml(req.query.name);
  res.send('<h1>Welcome ' + name + '</h1>');

REMEDIATION:
Added escapeHtml() function to sanitize user input before rendering. 
All special HTML characters are now properly encoded.

──────────────────────────────────────────────────────────────────────────────
VULNERABILITY #4: Command Injection
──────────────────────────────────────────────────────────────────────────────
Severity:    🔴 CRITICAL
Location:    app.js:36
Status:      ✅ FIXED

ISSUE DESCRIPTION:
User input is passed directly to shell command, allowing arbitrary command 
execution on the server.

VULNERABLE CODE:
  exec('convert ' + filename + ' output.pdf');

FIX APPLIED:
  const filename = path.basename(req.body.filename);
  execFile('convert', [filename, 'output.pdf']);

REMEDIATION:
Replaced exec() with execFile() and used path.basename() to strip directory 
traversal. Arguments are now passed as array, not string.

──────────────────────────────────────────────────────────────────────────────
VULNERABILITY #5: Path Traversal
──────────────────────────────────────────────────────────────────────────────
Severity:    🟠 HIGH
Location:    app.js:42
Status:      ✅ FIXED

ISSUE DESCRIPTION:
User can traverse directories using "../" sequences to access files outside 
the intended directory.

VULNERABLE CODE:
  res.sendFile('/uploads/' + file);

FIX APPLIED:
  const file = path.basename(req.query.file);
  res.sendFile(path.join('/uploads', file));

REMEDIATION:
Used path.basename() to extract only the filename and path.join() to 
construct safe paths. Directory traversal sequences are now stripped.

──────────────────────────────────────────────────────────────────────────────
VULNERABILITY #6: Insecure Deserialization
──────────────────────────────────────────────────────────────────────────────
Severity:    🔴 CRITICAL
Location:    app.js:48
Status:      ✅ FIXED

ISSUE DESCRIPTION:
Using eval() on user input allows arbitrary code execution, which can lead 
to complete server compromise.

VULNERABLE CODE:
  const obj = eval('(' + req.body.data + ')');

FIX APPLIED:
  const obj = JSON.parse(req.body.data);

REMEDIATION:
Replaced dangerous eval() with JSON.parse() for safe JSON deserialization. 
Arbitrary code execution is no longer possible.

──────────────────────────────────────────────────────────────────────────────
VULNERABILITY #7: Weak Cryptography
──────────────────────────────────────────────────────────────────────────────
Severity:    🟡 MEDIUM
Location:    app.js:54
Status:      ✅ FIXED

ISSUE DESCRIPTION:
MD5 is cryptographically broken and should not be used for password hashing 
as it can be cracked quickly.

VULNERABLE CODE:
  return crypto.createHash('md5').update(password).digest('hex');

FIX APPLIED:
  return bcrypt.hash(password, 12);

REMEDIATION:
Replaced MD5 with bcrypt using a cost factor of 12. Passwords are now 
securely hashed with salt automatically included.

──────────────────────────────────────────────────────────────────────────────
VULNERABILITY #8: Insecure Random
──────────────────────────────────────────────────────────────────────────────
Severity:    🟢 LOW
Location:    app.js:59
Status:      ✅ FIXED

ISSUE DESCRIPTION:
Math.random() is not cryptographically secure and should not be used for 
generating security tokens.

VULNERABLE CODE:
  return Math.random().toString(36).substring(7);

FIX APPLIED:
  return crypto.randomBytes(32).toString('hex');

REMEDIATION:
Replaced Math.random() with crypto.randomBytes(32) for cryptographically 
secure token generation.

──────────────────────────────────────────────────────────────────────────────
VULNERABILITY #9: Open Redirect
──────────────────────────────────────────────────────────────────────────────
Severity:    🟡 MEDIUM
Location:    app.js:64
Status:      ✅ FIXED

ISSUE DESCRIPTION:
Unvalidated redirect allows attackers to redirect users to malicious sites 
for phishing attacks.

VULNERABLE CODE:
  res.redirect(url);

FIX APPLIED:
  const allowedUrls = ['/home', '/dashboard', '/profile'];
  if (allowedUrls.includes(url)) res.redirect(url);

REMEDIATION:
Implemented URL whitelist validation. Redirects are now only allowed to 
pre-approved internal paths.

──────────────────────────────────────────────────────────────────────────────
VULNERABILITY #10: Missing Authentication
──────────────────────────────────────────────────────────────────────────────
Severity:    🟠 HIGH
Location:    app.js:69
Status:      ✅ FIXED

ISSUE DESCRIPTION:
Admin endpoint lacks authentication, allowing anyone to delete users without 
authorization.

VULNERABLE CODE:
  app.delete('/admin/user/:id', (req, res) => {

FIX APPLIED:
  app.delete('/admin/user/:id', authMiddleware, adminOnly, (req, res) => {

REMEDIATION:
Added authMiddleware and adminOnly middleware to verify user authentication 
and admin privileges before processing requests.

================================================================================
                         SECURITY SCORE
================================================================================

  BEFORE SCAN:  ████░░░░░░░░░░░░░░░░  20% (CRITICAL)
  AFTER FIX:    ████████████████████  100% (EXCELLENT)

================================================================================
                      RECOMMENDATIONS
================================================================================

1. ENVIRONMENT VARIABLES
   - Store all secrets in environment variables
   - Use a secrets manager for production deployments
   - Rotate credentials regularly

2. INPUT VALIDATION
   - Always validate and sanitize user input
   - Use parameterized queries for database operations
   - Implement strict input type checking

3. AUTHENTICATION & AUTHORIZATION
   - Implement authentication on all sensitive endpoints
   - Use role-based access control (RBAC)
   - Add rate limiting to prevent brute force attacks

4. SECURITY HEADERS
   - Implement Content Security Policy (CSP)
   - Add X-Frame-Options, X-Content-Type-Options headers
   - Use HTTPS everywhere

5. LOGGING & MONITORING
   - Log all security-relevant events
   - Set up alerting for suspicious activities
   - Regularly review access logs

================================================================================
                         REPORT GENERATED BY AUTODOC
                    https://autodoc.security | support@autodoc.com
================================================================================
`;

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'autodoc-security-report.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
          onClick={() => navigate(-1)}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = isDarkTheme ? '#e2e8f0' : '#1e293b';
            e.currentTarget.style.background = isDarkTheme ? '#334155' : '#e2e8f0';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = isDarkTheme ? '#94a3b8' : '#64748b';
            e.currentTarget.style.background = 'transparent';
          }}
        >
          ← Back to Previous Screen
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

      <div style={styles.demoContainer}>
        <div style={styles.leftPanel}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{margin: 0, color: isDarkTheme ? '#e2e8f0' : '#1e293b'}}>
              {currentStep === 1 ? 'Scan Code' : 'Scan Results & Analysis'}
            </h2>
          </div>
          
          <div style={styles.codeContainer}>
            <div style={styles.codeHeader}>
              <span style={styles.codeTitle}>{importedFileName}</span>
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
            <div id="code-content" style={{...styles.codeContent, maxHeight: '400px', overflowY: 'auto'}}>
              {currentStep === 1 && (
                <div style={{ display: 'flex' }}>
                  <div style={{ 
                    borderRight: '1px solid #475569', 
                    paddingRight: '15px', 
                    marginRight: '15px',
                    color: '#64748b',
                    userSelect: 'none',
                    textAlign: 'right',
                    minWidth: '30px'
                  }}>
                    {(importedCode || defaultExampleCode).split('\n').map((_, i) => (
                      <div key={i + 1} style={{ lineHeight: '1.6' }}>{i + 1}</div>
                    ))}
                  </div>
                  <pre style={{ margin: 0, flex: 1, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                    {(importedCode || defaultExampleCode).split('\n').map((line, i) => (
                      <div key={i}>{line || ' '}</div>
                    ))}
                  </pre>
                </div>
              )}

              {currentStep >= 2 && !showFix && !fixesApplied && (
                <div style={{ display: 'flex' }}>
                  <div style={{ 
                    borderRight: '1px solid #475569', 
                    paddingRight: '15px', 
                    marginRight: '15px',
                    color: '#64748b',
                    userSelect: 'none',
                    textAlign: 'right',
                    minWidth: '30px'
                  }}>
                    {defaultExampleCode.split('\n').map((_, i) => (
                      <div key={i + 1} style={{ lineHeight: '1.6' }}>{i + 1}</div>
                    ))}
                  </div>
                  <pre style={{ margin: 0, flex: 1 }}>
                    {defaultExampleCode.split('\n').map((line, lineNum) => {
                      const actualLine = lineNum + 1;
                      const isVulnerable = vulnerabilities.some(v => v.line === actualLine);
                      const isHighlighted = highlightedLine === actualLine;
                      
                      if (isVulnerable) {
                        return (
                          <div 
                            key={lineNum}
                            style={{ 
                              background: isHighlighted ? 'rgba(239, 68, 68, 0.5)' : 'rgba(239, 68, 68, 0.3)',
                              margin: '0 -20px',
                              padding: '0 20px',
                              borderLeft: isHighlighted ? '4px solid #ef4444' : '3px solid #ef4444',
                              transition: 'all 0.3s ease'
                            }}
                          >
                            {line || ' '}
                          </div>
                        );
                      }
                      return <div key={lineNum}>{line || ' '}</div>;
                    })}
                  </pre>
                </div>
              )}

              {currentStep >= 2 && fixesApplied && (
                <div style={{ display: 'flex' }}>
                  <div style={{ 
                    borderRight: '1px solid #475569', 
                    paddingRight: '15px', 
                    marginRight: '15px',
                    color: '#64748b',
                    userSelect: 'none',
                    textAlign: 'right',
                    minWidth: '30px'
                  }}>
                    {Array.from({ length: 70 }, (_, i) => (
                      <div key={i + 1} style={{ lineHeight: '1.6' }}>{i + 1}</div>
                    ))}
                  </div>
                  <pre style={{ margin: 0, flex: 1 }}>
                    <div>{`// ============================================`}</div>
                    <div>{`// E-Commerce Application - SECURED VERSION`}</div>
                    <div>{`// ============================================`}</div>
                    <div>{``}</div>
                    <div>{`const express = require('express');`}</div>
                    <div>{`const mysql = require('mysql');`}</div>
                    <div>{`const app = express();`}</div>
                    <div>{``}</div>
                    <div style={{ background: 'rgba(34, 197, 94, 0.3)', margin: '0 -20px', padding: '0 20px', borderLeft: '3px solid #22c55e' }}>
                      {`// FIXED: Use environment variables`}
                    </div>
                    <div style={{ background: 'rgba(34, 197, 94, 0.3)', margin: '0 -20px', padding: '0 20px', borderLeft: '3px solid #22c55e' }}>
                      {`const DB_PASSWORD = process.env.DB_PASSWORD;`}
                    </div>
                    <div style={{ background: 'rgba(34, 197, 94, 0.3)', margin: '0 -20px', padding: '0 20px', borderLeft: '3px solid #22c55e' }}>
                      {`const API_KEY = process.env.API_KEY;`}
                    </div>
                    <div style={{ background: 'rgba(34, 197, 94, 0.3)', margin: '0 -20px', padding: '0 20px', borderLeft: '3px solid #22c55e' }}>
                      {`const JWT_SECRET = process.env.JWT_SECRET;`}
                    </div>
                    <div>{``}</div>
                    <div>{`const db = mysql.createConnection({`}</div>
                    <div>{`  host: 'localhost',`}</div>
                    <div>{`  user: 'root',`}</div>
                    <div>{`  password: DB_PASSWORD`}</div>
                    <div>{`});`}</div>
                    <div>{``}</div>
                    <div style={{ background: 'rgba(34, 197, 94, 0.3)', margin: '0 -20px', padding: '0 20px', borderLeft: '3px solid #22c55e' }}>
                      {`// FIXED: Parameterized query`}
                    </div>
                    <div>{`app.get('/user/:id', (req, res) => {`}</div>
                    <div>{`  const userId = parseInt(req.params.id, 10);`}</div>
                    <div style={{ background: 'rgba(34, 197, 94, 0.3)', margin: '0 -20px', padding: '0 20px', borderLeft: '3px solid #22c55e' }}>
                      {`  db.query('SELECT * FROM users WHERE id = ?', [userId]);`}
                    </div>
                    <div>{`});`}</div>
                    <div>{``}</div>
                    <div style={{ background: 'rgba(34, 197, 94, 0.3)', margin: '0 -20px', padding: '0 20px', borderLeft: '3px solid #22c55e' }}>
                      {`// FIXED: Sanitize output`}
                    </div>
                    <div>{`app.get('/profile', (req, res) => {`}</div>
                    <div>{`  const name = escapeHtml(req.query.name);`}</div>
                    <div style={{ background: 'rgba(34, 197, 94, 0.3)', margin: '0 -20px', padding: '0 20px', borderLeft: '3px solid #22c55e' }}>
                      {`  res.send('<h1>Welcome ' + name + '</h1>');`}
                    </div>
                    <div>{`});`}</div>
                    <div>{``}</div>
                    <div style={{ background: 'rgba(34, 197, 94, 0.3)', margin: '0 -20px', padding: '0 20px', borderLeft: '3px solid #22c55e' }}>
                      {`// FIXED: Use safe API with validation`}
                    </div>
                    <div>{`app.post('/convert', (req, res) => {`}</div>
                    <div>{`  const filename = path.basename(req.body.filename);`}</div>
                    <div style={{ background: 'rgba(34, 197, 94, 0.3)', margin: '0 -20px', padding: '0 20px', borderLeft: '3px solid #22c55e' }}>
                      {`  execFile('convert', [filename, 'output.pdf']);`}
                    </div>
                    <div>{`});`}</div>
                    <div>{``}</div>
                    <div style={{ background: 'rgba(34, 197, 94, 0.3)', margin: '0 -20px', padding: '0 20px', borderLeft: '3px solid #22c55e' }}>
                      {`// FIXED: Validate and sanitize path`}
                    </div>
                    <div>{`app.get('/download', (req, res) => {`}</div>
                    <div>{`  const file = path.basename(req.query.file);`}</div>
                    <div style={{ background: 'rgba(34, 197, 94, 0.3)', margin: '0 -20px', padding: '0 20px', borderLeft: '3px solid #22c55e' }}>
                      {`  res.sendFile(path.join('/uploads', file));`}
                    </div>
                    <div>{`});`}</div>
                    <div>{``}</div>
                    <div style={{ background: 'rgba(34, 197, 94, 0.3)', margin: '0 -20px', padding: '0 20px', borderLeft: '3px solid #22c55e' }}>
                      {`// FIXED: Use JSON.parse instead of eval`}
                    </div>
                    <div>{`app.post('/data', (req, res) => {`}</div>
                    <div style={{ background: 'rgba(34, 197, 94, 0.3)', margin: '0 -20px', padding: '0 20px', borderLeft: '3px solid #22c55e' }}>
                      {`  const obj = JSON.parse(req.body.data);`}
                    </div>
                    <div>{`  processData(obj);`}</div>
                    <div>{`});`}</div>
                    <div>{``}</div>
                    <div style={{ background: 'rgba(34, 197, 94, 0.3)', margin: '0 -20px', padding: '0 20px', borderLeft: '3px solid #22c55e' }}>
                      {`// FIXED: Use bcrypt for password hashing`}
                    </div>
                    <div>{`const bcrypt = require('bcrypt');`}</div>
                    <div>{`async function hashPassword(password) {`}</div>
                    <div style={{ background: 'rgba(34, 197, 94, 0.3)', margin: '0 -20px', padding: '0 20px', borderLeft: '3px solid #22c55e' }}>
                      {`  return bcrypt.hash(password, 12);`}
                    </div>
                    <div>{`}`}</div>
                    <div>{``}</div>
                    <div style={{ background: 'rgba(34, 197, 94, 0.3)', margin: '0 -20px', padding: '0 20px', borderLeft: '3px solid #22c55e' }}>
                      {`// FIXED: Use crypto.randomBytes`}
                    </div>
                    <div>{`function generateToken() {`}</div>
                    <div style={{ background: 'rgba(34, 197, 94, 0.3)', margin: '0 -20px', padding: '0 20px', borderLeft: '3px solid #22c55e' }}>
                      {`  return crypto.randomBytes(32).toString('hex');`}
                    </div>
                    <div>{`}`}</div>
                    <div>{``}</div>
                    <div style={{ background: 'rgba(34, 197, 94, 0.3)', margin: '0 -20px', padding: '0 20px', borderLeft: '3px solid #22c55e' }}>
                      {`// FIXED: Whitelist allowed URLs`}
                    </div>
                    <div>{`const allowedUrls = ['/home', '/dashboard'];`}</div>
                    <div>{`app.get('/redirect', (req, res) => {`}</div>
                    <div>{`  const url = req.query.url;`}</div>
                    <div style={{ background: 'rgba(34, 197, 94, 0.3)', margin: '0 -20px', padding: '0 20px', borderLeft: '3px solid #22c55e' }}>
                      {`  if (allowedUrls.includes(url)) res.redirect(url);`}
                    </div>
                    <div>{`});`}</div>
                    <div>{``}</div>
                    <div style={{ background: 'rgba(34, 197, 94, 0.3)', margin: '0 -20px', padding: '0 20px', borderLeft: '3px solid #22c55e' }}>
                      {`// FIXED: Add authentication middleware`}
                    </div>
                    <div style={{ background: 'rgba(34, 197, 94, 0.3)', margin: '0 -20px', padding: '0 20px', borderLeft: '3px solid #22c55e' }}>
                      {`app.delete('/admin/user/:id', authMiddleware, adminOnly, (req, res) => {`}
                    </div>
                    <div>{`  db.query('DELETE FROM users WHERE id = ?', [req.params.id]);`}</div>
                    <div>{`});`}</div>
                    <div>{``}</div>
                    <div>{`app.listen(3000);`}</div>
                  </pre>
                </div>
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
                onClick={handleFixVulnerabilities}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.background = isDarkTheme ? '#475569' : '#cbd5e1';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.background = isDarkTheme ? '#334155' : '#e2e8f0';
                }}
              >
                Fix All
              </button>
            )}

            {fixesApplied && (
              <button 
                style={{
                  ...styles.primaryButton,
                  background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
                }}
                onClick={() => navigate('/compare')}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 5px 15px rgba(139, 92, 246, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                🔍 Compare Code
              </button>
            )}

            {fixesApplied && (
              <button 
                style={{
                  ...styles.primaryButton,
                  background: 'linear-gradient(135deg, #059669, #10b981)',
                }}
                onClick={handleExportFixedCode}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 5px 15px rgba(5, 150, 105, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                📥 Export Fixed Code
              </button>
            )}

            {fixesApplied && (
              <button 
                style={{
                  ...styles.primaryButton,
                  background: 'linear-gradient(135deg, #dc2626, #ef4444)',
                }}
                onClick={handleExportDetailedReport}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 5px 15px rgba(220, 38, 38, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                📋 Export Detailed Report
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
          </div>
        </div>

        <div style={styles.rightPanel}>
          <h2 style={{marginBottom: '20px', color: isDarkTheme ? '#e2e8f0' : '#1e293b'}}>
            {fixesApplied ? '✅ Fixes Applied' : 'Scan Results & Analysis'}
          </h2>
          
          {currentStep >= 2 && (
            <div style={styles.resultsPanel}>
              {vulnerabilities.map((vuln) => (
                <div 
                  key={vuln.id} 
                  style={{
                    ...styles.resultItem,
                    cursor: 'pointer',
                    border: highlightedLine === vuln.line ? '2px solid #2563eb' : '2px solid transparent',
                    transition: 'all 0.2s ease',
                  }}
                  onClick={() => handleVulnerabilityClick(vuln.line)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateX(5px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateX(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <strong style={{color: fixesApplied ? '#22c55e' : (vuln.severity === 'Critical' ? '#ef4444' : vuln.severity === 'High' ? '#f59e0b' : '#3b82f6')}}>
                        {fixesApplied ? '✓ ' : ''}{vuln.type}
                      </strong>
                      <div style={{
                        padding: '4px 12px',
                        borderRadius: '20px',
                        background: fixesApplied ? '#f0fdf4' : (vuln.severity === 'Critical' ? '#fef2f2' : vuln.severity === 'High' ? '#fffbeb' : '#eff6ff'),
                        color: fixesApplied ? '#16a34a' : (vuln.severity === 'Critical' ? '#dc2626' : vuln.severity === 'High' ? '#d97706' : '#2563eb'),
                        fontSize: '0.8rem',
                        fontWeight: 600,
                      }}>
                        {fixesApplied ? 'Fixed' : vuln.severity}
                      </div>
                    </div>
                    <div style={{fontSize: '0.85rem', color: isDarkTheme ? '#94a3b8' : '#64748b', marginBottom: '6px'}}>
                      📁 {vuln.file}:{vuln.line}
                    </div>
                    <div style={{
                      fontSize: '0.85rem', 
                      color: isDarkTheme ? '#cbd5e1' : '#475569', 
                      lineHeight: 1.5,
                      padding: '8px 12px',
                      background: isDarkTheme ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.05)',
                      borderRadius: '6px',
                      borderLeft: fixesApplied ? '3px solid #22c55e' : `3px solid ${vuln.severity === 'Critical' ? '#ef4444' : vuln.severity === 'High' ? '#f59e0b' : '#3b82f6'}`
                    }}>
                      {fixesApplied ? (
                        <>
                          <div style={{ marginBottom: '6px', color: '#22c55e', fontWeight: 500 }}>🔧 How it was fixed:</div>
                          {vuln.fix}
                        </>
                      ) : vuln.explanation}
                    </div>
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
            onClick={() => navigate('/signin')}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 10px 25px rgba(16, 185, 129, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Start Your 14-Min Free Trial
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