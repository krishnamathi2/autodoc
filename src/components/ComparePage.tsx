import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ComparePage = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
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
      maxWidth: '1400px',
      margin: '0 auto 30px',
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
      margin: '0 auto 40px',
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: 800,
      marginBottom: '15px',
      background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    subtitle: {
      fontSize: '1.1rem',
      color: isDarkTheme ? '#94a3b8' : '#64748b',
    },
    compareContainer: {
      display: 'flex',
      gap: '20px',
      maxWidth: '1400px',
      margin: '0 auto',
    },
    codePanel: {
      flex: 1,
      background: isDarkTheme ? '#1e293b' : 'white',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
    },
    panelHeader: {
      padding: '15px 20px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      fontWeight: 600,
      fontSize: '1rem',
    },
    codeContent: {
      background: isDarkTheme ? '#0f172a' : '#1e293b',
      padding: '20px',
      fontFamily: "'Courier New', monospace",
      fontSize: '0.85rem',
      lineHeight: 1.6,
      color: '#e2e8f0',
      maxHeight: '70vh',
      overflowY: 'auto' as const,
    },
  };

  const originalCode = `// ============================================
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

  const fixedCode = `// ============================================
// E-Commerce Application - SECURED VERSION
// ============================================

const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const path = require('path');
const { execFile } = require('child_process');
const app = express();

// ✅ FIXED: Use environment variables
const DB_PASSWORD = process.env.DB_PASSWORD;
const API_KEY = process.env.API_KEY;
const JWT_SECRET = process.env.JWT_SECRET;

// Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: DB_PASSWORD
});

// ✅ FIXED: Parameterized query
app.get('/user/:id', (req, res) => {
  const userId = parseInt(req.params.id, 10);
  db.query('SELECT * FROM users WHERE id = ?', [userId]);
});

// ✅ FIXED: Sanitize output
app.get('/profile', (req, res) => {
  const name = escapeHtml(req.query.name);
  res.send('<h1>Welcome ' + name + '</h1>');
});

// ✅ FIXED: Use safe API with validation
app.post('/convert', (req, res) => {
  const filename = path.basename(req.body.filename);
  execFile('convert', [filename, 'output.pdf']);
});

// ✅ FIXED: Validate and sanitize path
app.get('/download', (req, res) => {
  const file = path.basename(req.query.file);
  res.sendFile(path.join('/uploads', file));
});

// ✅ FIXED: Use JSON.parse instead of eval
app.post('/data', (req, res) => {
  const obj = JSON.parse(req.body.data);
  processData(obj);
});

// ✅ FIXED: Use bcrypt for password hashing
async function hashPassword(password) {
  return bcrypt.hash(password, 12);
}

// ✅ FIXED: Use crypto.randomBytes
const crypto = require('crypto');
function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

// ✅ FIXED: Whitelist allowed URLs
const allowedUrls = ['/home', '/dashboard', '/profile'];
app.get('/redirect', (req, res) => {
  const url = req.query.url;
  if (allowedUrls.includes(url)) {
    res.redirect(url);
  } else {
    res.status(400).send('Invalid redirect URL');
  }
});

// ✅ FIXED: Add authentication middleware
app.delete('/admin/user/:id', authMiddleware, adminOnly, (req, res) => {
  db.query('DELETE FROM users WHERE id = ?', [req.params.id]);
  res.send('User deleted');
});

// ✅ FIXED: Restrict CORS origins
const allowedOrigins = ['https://myapp.com'];
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  next();
});

// ✅ FIXED: Generic error response
app.use((err, req, res, next) => {
  console.error(err.stack); // Log internally
  res.status(500).send('An error occurred');
});

app.listen(3000);`;

  const vulnerableLines = [10, 11, 12, 24, 30, 36, 42, 48, 54, 59, 64, 69, 75, 80];
  const fixedLines = [12, 13, 14, 27, 33, 39, 45, 51, 56, 62, 68, 76, 85, 92];

  const renderCodeWithHighlights = (code: string, highlightLines: number[], isFixed: boolean) => {
    const lines = code.split('\n');
    return (
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
          {lines.map((_, i) => (
            <div key={i + 1} style={{ lineHeight: '1.6' }}>{i + 1}</div>
          ))}
        </div>
        <pre style={{ margin: 0, flex: 1 }}>
          {lines.map((line, i) => {
            const lineNum = i + 1;
            const isHighlighted = highlightLines.includes(lineNum);
            
            if (isHighlighted) {
              return (
                <div 
                  key={i}
                  style={{ 
                    background: isFixed ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)',
                    margin: '0 -20px',
                    padding: '0 20px',
                    borderLeft: isFixed ? '3px solid #22c55e' : '3px solid #ef4444',
                  }}
                >
                  {line || ' '}
                </div>
              );
            }
            return <div key={i}>{line || ' '}</div>;
          })}
        </pre>
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <div style={styles.topControls}>
        <button 
          style={styles.backButton}
          onClick={() => navigate(-1)}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = isDarkTheme ? '#1e293b' : '#e2e8f0';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
          }}
        >
          ← Back to Previous Screen
        </button>
        <button 
          style={styles.themeToggle}
          onClick={() => setIsDarkTheme(!isDarkTheme)}
        >
          {isDarkTheme ? '☀️ Light' : '🌙 Dark'}
        </button>
      </div>

      <div style={styles.header}>
        <h1 style={styles.title}>Code Comparison</h1>
        <p style={styles.subtitle}>
          Side-by-side comparison of vulnerable code vs secured code
        </p>
        <button
          onClick={() => navigate('/signin')}
          style={{
            fontSize: '1rem',
            color: 'white',
            backgroundColor: '#22c55e',
            fontWeight: 600,
            marginTop: '15px',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#16a34a'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#22c55e'}
        >
          Free trial - 3 days
        </button>
      </div>

      <div style={styles.compareContainer}>
        <div style={styles.codePanel}>
          <div style={{
            ...styles.panelHeader,
            background: 'rgba(239, 68, 68, 0.1)',
            color: '#ef4444',
            borderBottom: '2px solid #ef4444',
          }}>
            <span>❌</span> Original Code (Vulnerable)
          </div>
          <div style={styles.codeContent}>
            {renderCodeWithHighlights(originalCode, vulnerableLines, false)}
          </div>
        </div>

        <div style={styles.codePanel}>
          <div style={{
            ...styles.panelHeader,
            background: 'rgba(34, 197, 94, 0.1)',
            color: '#22c55e',
            borderBottom: '2px solid #22c55e',
          }}>
            <span>✅</span> Fixed Code (Secured)
          </div>
          <div style={styles.codeContent}>
            {renderCodeWithHighlights(fixedCode, fixedLines, true)}
          </div>
        </div>
      </div>

      <div style={{ 
        maxWidth: '1400px', 
        margin: '30px auto 0',
        padding: '20px',
        background: isDarkTheme ? '#1e293b' : 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      }}>
        <h3 style={{ marginBottom: '15px', color: isDarkTheme ? '#e2e8f0' : '#1e293b' }}>
          📊 Summary of Changes
        </h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '15px',
          color: isDarkTheme ? '#cbd5e1' : '#475569',
        }}>
          <div style={{ padding: '15px', background: isDarkTheme ? '#0f172a' : '#f8fafc', borderRadius: '8px' }}>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: '#ef4444' }}>10</div>
            <div>Vulnerabilities Found</div>
          </div>
          <div style={{ padding: '15px', background: isDarkTheme ? '#0f172a' : '#f8fafc', borderRadius: '8px' }}>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: '#22c55e' }}>10</div>
            <div>Vulnerabilities Fixed</div>
          </div>
          <div style={{ padding: '15px', background: isDarkTheme ? '#0f172a' : '#f8fafc', borderRadius: '8px' }}>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: '#3b82f6' }}>3</div>
            <div>Critical Issues Resolved</div>
          </div>
          <div style={{ padding: '15px', background: isDarkTheme ? '#0f172a' : '#f8fafc', borderRadius: '8px' }}>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: '#8b5cf6' }}>100%</div>
            <div>Security Score Improvement</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparePage;
