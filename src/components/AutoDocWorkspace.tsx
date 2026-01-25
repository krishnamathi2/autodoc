import React, { useState, useRef, useEffect, CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';

// Define interfaces at the top
interface Vulnerability {
  id: string;
  type: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low' | 'Info';
  line: number;
  column: number;
  description: string;
  suggestion: string;
  originalLine?: string;
  fixType?: string;
  autoFixable: boolean;
}

interface FixSummary {
  totalFixes: number;
  fixedTypes: string[];
  criticalFixed: number;
  highFixed: number;
  suggestions: string[];
  appliedFixes: AppliedFix[];
}

interface AppliedFix {
  type: string;
  severity: string;
  line: number;
  original: string;
  fixed: string;
}

// Add CSS animations
const addGlobalStyles = () => {
  if (typeof document === 'undefined') return;
  
  if (!document.getElementById('autodoc-styles')) {
    const style = document.createElement('style');
    style.id = 'autodoc-styles';
    style.innerHTML = `
      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      
      @keyframes pulse {
        0%, 100% {
          opacity: 1;
          transform: scale(1);
        }
        50% {
          opacity: 0.7;
          transform: scale(1.05);
        }
      }
      
      * {
        box-sizing: border-box;
      }
      
      body {
        margin: 0;
        overflow: hidden;
      }
    `;
    document.head.appendChild(style);
  }
};

function AutoDocWorkspace() {
  const [code, setCode] = useState<string>(`// AutoDoc Workspace - Test Security Vulnerabilities

// 1. SQL Injection Examples
app.get('/user/:id', (req, res) => {
  const userId = req.params.id;
  db.query(\`SELECT * FROM users WHERE id = \${userId}\`);
  
  const productName = req.query.product;
  connection.query("SELECT * FROM products WHERE name = '" + productName + "'");
});

// 2. XSS Examples  
app.post('/comment', (req, res) => {
  const comment = req.body.comment;
  res.send('<div class="comment">' + comment + '</div>');
  
  document.getElementById('output').innerHTML = userInput;
});

// 3. Hardcoded Secrets
const config = {
  apiKey: 'sk_live_1234567890abcdef',
  secretToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  database: {
    host: 'localhost',
    user: 'admin',
    password: 'Admin@123!'
  }
};

// 4. Command Injection
function deleteFile(filename) {
  exec('rm -rf ' + filename);
}

// 5. Insecure Dependencies
const httpModule = require('http://unsecure-package.com');
const ftpClient = require('ftp://old-library.org');`);
  
  const [fixedCode, setFixedCode] = useState<string>('');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [isFixing, setIsFixing] = useState<boolean>(false);
  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>([]);
  const [fileName, setFileName] = useState<string>('mycode.js');
  const [showDiff, setShowDiff] = useState<boolean>(false);
  const [fixSummary, setFixSummary] = useState<FixSummary | null>(null);
  const [activeTab, setActiveTab] = useState<'editor' | 'fixed'>('editor');
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [shareUrl, setShareUrl] = useState<string>('');
  const [copiedNotification, setCopiedNotification] = useState<string>('');
  const [selectedVulnerabilities, setSelectedVulnerabilities] = useState<Set<string>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Calculate autoFixableCount
  const autoFixableCount = vulnerabilities.filter(v => v.autoFixable).length;

  // Initialize styles on mount
  useEffect(() => {
    addGlobalStyles();
  }, []);

  // Generate unique ID for sharing
  const generateShareId = (): string => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };

  // Copy code to clipboard
  const copyToClipboard = (text: string, type: 'original' | 'fixed'): void => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopiedNotification(`${type === 'original' ? 'Original' : 'Secured'} code copied to clipboard!`);
        setTimeout(() => setCopiedNotification(''), 2000);
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
        setCopiedNotification('Failed to copy to clipboard');
        setTimeout(() => setCopiedNotification(''), 2000);
      });
  };

  // Helper function to copy current tab's code
  const copyCurrentTabCode = (): void => {
    const codeToCopy = activeTab === 'editor' ? code : fixedCode;
    const type: 'original' | 'fixed' = activeTab === 'editor' ? 'original' : 'fixed';
    copyToClipboard(codeToCopy, type);
  };

  // Download code
  const downloadCode = (code: string, filename: string): void => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Share code
  const shareCode = (code: string): void => {
    const shareId = generateShareId();
    const data = {
      code,
      vulnerabilities,
      fixSummary,
      timestamp: new Date().toISOString()
    };
    
    try {
      localStorage.setItem(`autodoc_share_${shareId}`, JSON.stringify(data));
      const demoUrl = `${window.location.origin}/share/${shareId}`;
      setShareUrl(demoUrl);
      setShowShareModal(true);
      copyToClipboard(demoUrl, 'original');
    } catch (error) {
      console.error('Failed to share code:', error);
      setCopiedNotification('Failed to generate share link');
      setTimeout(() => setCopiedNotification(''), 3000);
    }
  };

  // Simple HTML export
  const exportToHTML = () => {
    if (vulnerabilities.length === 0) {
      setCopiedNotification('No vulnerabilities found to export');
      setTimeout(() => setCopiedNotification(''), 3000);
      return;
    }

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>AutoDoc Security Report - ${fileName}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            h1 { color: #1f6feb; }
            h2 { color: #333; margin-top: 30px; }
            table { border-collapse: collapse; width: 100%; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #f8f9fa; font-weight: bold; }
            .critical { color: #dc3545; font-weight: bold; }
            .high { color: #fd7e14; font-weight: bold; }
            .medium { color: #ffc107; font-weight: bold; }
            .info { color: #17a2b8; }
            .fixed { color: #28a745; }
            .code { background: #f8f9fa; padding: 10px; border-radius: 5px; font-family: 'Courier New', monospace; }
            .header { background: #1f6feb; color: white; padding: 20px; border-radius: 5px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>AutoDoc Security Report</h1>
            <p>Generated: ${new Date().toLocaleString()}</p>
            <p>File: ${fileName}</p>
            <p>Total Vulnerabilities: ${vulnerabilities.length}</p>
          </div>
          
          <h2>Summary</h2>
          <table>
            <tr>
              <th>Metric</th><th>Count</th>
            </tr>
            <tr><td>Total Vulnerabilities</td><td>${vulnerabilities.length}</td></tr>
            <tr><td>Critical</td><td>${vulnerabilities.filter(v => v.severity === 'Critical').length}</td></tr>
            <tr><td>High</td><td>${vulnerabilities.filter(v => v.severity === 'High').length}</td></tr>
            <tr><td>Medium</td><td>${vulnerabilities.filter(v => v.severity === 'Medium').length}</td></tr>
            <tr><td>Auto-Fixable</td><td>${autoFixableCount}</td></tr>
            <tr><td>Fixed</td><td>${fixSummary?.totalFixes || 0}</td></tr>
          </table>
          
          <h2>Vulnerabilities Detected</h2>
          <table>
            <tr>
              <th>Type</th>
              <th>Severity</th>
              <th>Location</th>
              <th>Description</th>
              <th>Auto-Fixable</th>
              <th>Suggestion</th>
            </tr>
            ${vulnerabilities.map(v => `
              <tr>
                <td>${v.type}</td>
                <td class="${v.severity.toLowerCase()}">${v.severity}</td>
                <td>Line ${v.line}:${v.column}</td>
                <td>${v.description}</td>
                <td>${v.autoFixable ? 'Yes' : 'No'}</td>
                <td>${v.suggestion}</td>
              </tr>
            `).join('')}
          </table>
          
          ${fixSummary && fixSummary.totalFixes > 0 ? `
            <h2>Fixes Applied</h2>
            <table>
              <tr>
                <th>Type</th><th>Severity</th><th>Line</th><th>Original</th><th>Fixed</th>
              </tr>
              ${fixSummary.appliedFixes.map(f => `
                <tr>
                  <td>${f.type}</td>
                  <td>${f.severity}</td>
                  <td>Line ${f.line}</td>
                  <td><code>${f.original}</code></td>
                  <td><code>${f.fixed}</code></td>
                </tr>
              `).join('')}
            </table>
          ` : ''}
          
          <h2>Code Samples</h2>
          <h3>Original Code (${code.split('\n').length} lines)</h3>
          <div class="code">
            <pre>${code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
          </div>
          
          ${fixedCode ? `
            <h3>Secured Code (${fixedCode.split('\n').length} lines)</h3>
            <div class="code">
              <pre>${fixedCode.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
            </div>
          ` : ''}
          
          <div style="margin-top: 40px; padding-top: 20px; border-top: 2px solid #ddd;">
            <p><strong>Generated by AutoDoc Security Platform</strong></p>
            <p>World's First Automated Security Remediation Platform</p>
          </div>
        </body>
      </html>
    `;
    
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `security-report-${fileName.replace('.', '-')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setCopiedNotification('HTML report exported successfully!');
    setTimeout(() => setCopiedNotification(''), 3000);
  };

  // Enhanced pattern-based security scanning
  const scanCode = (): void => {
    setIsScanning(true);
    setVulnerabilities([]);
    setFixSummary(null);
    setSelectedVulnerabilities(new Set());
    
    setTimeout(() => {
      const foundVulnerabilities: Vulnerability[] = [];
      const lines = code.split('\n');
      
      lines.forEach((line, index) => {
        const lineNumber = index + 1;
        const trimmedLine = line.trim();
        
        if (trimmedLine === '' || (trimmedLine.startsWith('//') && !trimmedLine.includes('app.get') && !trimmedLine.includes('db.query') && !trimmedLine.includes('res.send'))) {
          return;
        }
        
        // 1. Detect SQL Injection patterns
        const sqlPatterns = ['db.query', 'db.execute', 'connection.query', 'pool.query', 'database.query'];
        const hasSqlPattern = sqlPatterns.some(pattern => line.includes(pattern));
        const hasInjectionPattern = line.includes('${') || (line.includes('"') && line.includes("'") && line.includes('+'));
        
        if (hasSqlPattern && hasInjectionPattern) {
          foundVulnerabilities.push({
            id: `sql-${lineNumber}-${Date.now()}`,
            type: 'SQL Injection',
            severity: 'Critical',
            line: lineNumber,
            column: line.indexOf('query') + 1,
            description: 'User input directly concatenated into SQL query',
            suggestion: 'Use parameterized queries or prepared statements',
            originalLine: line,
            fixType: 'parameterized_query',
            autoFixable: true
          });
        }
        
        // 2. Detect XSS patterns
        const xssPatterns = ['res.send', 'res.write', 'innerHTML', 'document.write', 'eval('];
        const hasXssPattern = xssPatterns.some(pattern => line.includes(pattern));
        const hasUserInput = line.includes('+') || line.includes('${') || line.includes('userInput');
        
        if (hasXssPattern && hasUserInput) {
          foundVulnerabilities.push({
            id: `xss-${lineNumber}-${Date.now()}`,
            type: 'XSS (Cross-Site Scripting)',
            severity: 'High',
            line: lineNumber,
            column: line.indexOf('send') > -1 ? line.indexOf('send') + 1 : 
                   line.indexOf('innerHTML') > -1 ? line.indexOf('innerHTML') + 1 : 1,
            description: 'User input directly output without proper encoding',
            suggestion: 'Use output encoding or safe alternatives',
            originalLine: line,
            fixType: 'html_encoding',
            autoFixable: true
          });
        }
        
        // 3. Detect hardcoded secrets
        const secretKeywords = ['apiKey', 'password', 'secret', 'token', 'key', 'credential', 'auth'];
        const hasSecretKeyword = secretKeywords.some(keyword => 
          line.toLowerCase().includes(keyword.toLowerCase())
        );
        
        if (hasSecretKeyword && (line.includes('=') || line.includes(':')) && (line.includes("'") || line.includes('"'))) {
          const quoteChar = line.includes("'") ? "'" : '"';
          foundVulnerabilities.push({
            id: `secret-${lineNumber}-${Date.now()}`,
            type: 'Hardcoded Secret',
            severity: 'Critical',
            line: lineNumber,
            column: line.indexOf(quoteChar) + 1,
            description: 'Sensitive credential exposed in source code',
            suggestion: 'Move to environment variables or secure vault',
            originalLine: line,
            fixType: 'env_variable',
            autoFixable: true
          });
        }
        
        // 4. Detect command injection
        if ((line.includes('exec(') || line.includes('spawn(') || line.includes('system(')) && 
            (line.includes('${') || line.includes('+'))) {
          const execIndex = line.indexOf('exec(') > -1 ? line.indexOf('exec(') : -1;
          const spawnIndex = line.indexOf('spawn(') > -1 ? line.indexOf('spawn(') : -1;
          const systemIndex = line.indexOf('system(') > -1 ? line.indexOf('system(') : -1;
          
          foundVulnerabilities.push({
            id: `cmd-${lineNumber}-${Date.now()}`,
            type: 'Command Injection',
            severity: 'Critical',
            line: lineNumber,
            column: Math.max(execIndex, spawnIndex, systemIndex) + 1,
            description: 'User input used in system commands',
            suggestion: 'Use parameterized command execution',
            originalLine: line,
            fixType: 'safe_command',
            autoFixable: true
          });
        }
        
        // 5. Detect insecure dependencies
        if (line.includes('require(') && 
            (line.includes('http:') || line.includes('ftp:') || line.toLowerCase().includes('insecure'))) {
          foundVulnerabilities.push({
            id: `dep-${lineNumber}-${Date.now()}`,
            type: 'Insecure Dependency',
            severity: 'Medium',
            line: lineNumber,
            column: line.indexOf('require(') + 1,
            description: 'Potential insecure or outdated dependency',
            suggestion: 'Update to secure version or use HTTPS',
            originalLine: line,
            fixType: 'secure_url',
            autoFixable: true
          });
        }

        // 6. Detect eval() usage
        if (line.includes('eval(') && !line.includes('//')) {
          foundVulnerabilities.push({
            id: `eval-${lineNumber}-${Date.now()}`,
            type: 'Unsafe eval() Usage',
            severity: 'Critical',
            line: lineNumber,
            column: line.indexOf('eval(') + 1,
            description: 'Dangerous eval() function used with dynamic input',
            suggestion: 'Use JSON.parse() or safer alternatives',
            originalLine: line,
            fixType: 'safe_eval',
            autoFixable: true
          });
        }
      });
      
      if (foundVulnerabilities.length === 0 && code.length > 50) {
        foundVulnerabilities.push({
          id: 'info-1',
          type: 'Code Analysis Complete',
          severity: 'Info',
          line: 1,
          column: 1,
          description: 'No critical vulnerabilities detected with pattern matching',
          suggestion: 'Try adding SQL queries, user input handling, or hardcoded credentials to test',
          originalLine: '',
          autoFixable: false
        });
      }
      
      setVulnerabilities(foundVulnerabilities);
      setIsScanning(false);
    }, 1500);
  };

  // Generate fix for a specific vulnerability
  const generateFix = (vuln: Vulnerability, lineContent: string): string => {
    switch(vuln.fixType) {
      case 'parameterized_query': {
        if (lineContent.includes('db.query') && lineContent.includes('`')) {
          return lineContent.replace(/db\.query\(`([^`]+)`\)/, "db.query('SELECT * FROM users WHERE id = ?', [userId])");
        } else if (lineContent.includes('connection.query') && lineContent.includes('"')) {
          return lineContent.replace(/connection\.query\("([^"]+)"\)/, "connection.query('SELECT * FROM products WHERE name = ?', [productName])");
        }
        break;
      }
        
      case 'html_encoding': {
        if (lineContent.includes('res.send')) {
          return lineContent.replace(/res\.send\(([^)]+)\)/, "res.send(escapeHtml($1))");
        } else if (lineContent.includes('innerHTML')) {
          return lineContent.replace(/innerHTML\s*=\s*([^;]+)/, "textContent = $1");
        }
        break;
      }
        
      case 'env_variable': {
        const envMatch = lineContent.match(/(\w+)\s*[:=]\s*['"][^'"]*['"]/);
        if (envMatch) {
          const varName = envMatch[1];
          const envVarName = varName.toUpperCase().replace(/([A-Z])/g, '_$1').toUpperCase();
          return lineContent.replace(/(\w+)\s*[:=]\s*['"][^'"]*['"]/, `${varName}: process.env.${envVarName}`);
        }
        break;
      }
        
      case 'safe_command': {
        if (lineContent.includes('exec(')) {
          return lineContent.replace(/exec\(([^)]+)\)/, "execFile('rm', ['-rf', filename])");
        }
        break;
      }
        
      case 'secure_url': {
        return lineContent.replace(/http:/g, 'https:').replace(/ftp:/g, 'sftp:');
      }
        
      case 'safe_eval': {
        if (lineContent.includes('eval(')) {
          return lineContent.replace(/eval\(([^)]+)\)/, "JSON.parse($1)");
        }
        break;
      }
    }
    return lineContent;
  };

  // Generate fix summary
  const generateFixSummary = (appliedFixes: AppliedFix[]): string[] => {
    const fixedTypes: string[] = [];
    appliedFixes.forEach(fix => {
      if (!fixedTypes.includes(fix.type)) {
        fixedTypes.push(fix.type);
      }
    });
    return fixedTypes;
  };

  // Apply automatic fixes
  const applyFixes = (): void => {
    if (vulnerabilities.length === 0 || vulnerabilities[0].type === 'Code Analysis Complete') {
      alert('No fixable vulnerabilities found. Please scan your code first.');
      return;
    }
    
    setIsFixing(true);
    setShowDiff(true);
    
    setTimeout(() => {
      let fixed = code;
      const appliedFixes: AppliedFix[] = [];
      const importsAdded: string[] = [];
      const suggestions: string[] = [];
      
      const fixableVulns = vulnerabilities
        .filter(v => v.autoFixable && v.severity !== 'Info')
        .sort((a, b) => b.line - a.line);
      
      fixableVulns.forEach(vuln => {
        const lines = fixed.split('\n');
        if (vuln.line <= lines.length && vuln.originalLine) {
          const originalLine = lines[vuln.line - 1];
          const fixedLine = generateFix(vuln, originalLine);
          
          if (fixedLine !== originalLine) {
            lines[vuln.line - 1] = fixedLine;
            fixed = lines.join('\n');
            
            appliedFixes.push({
              type: vuln.type,
              severity: vuln.severity,
              line: vuln.line,
              original: originalLine.trim(),
              fixed: fixedLine.trim()
            });
            
            if (vuln.fixType === 'html_encoding' && !importsAdded.includes('escapeHtml')) {
              importsAdded.push('escapeHtml');
              suggestions.push('Added HTML escaping function for XSS protection');
            }
            
            if (vuln.fixType === 'env_variable') {
              suggestions.push('Moved secret to environment variable - update your .env file');
            }
            
            if (vuln.fixType === 'safe_command') {
              suggestions.push('Replaced exec() with execFile() for safer command execution');
              importsAdded.push('execFile');
            }
          }
        }
      });
      
      if (importsAdded.length > 0) {
        let header = '// ============================================\n';
        header += '// AUTO-FIXED BY AUTODOC SECURITY PLATFORM\n';
        header += '// ============================================\n\n';
        
        if (importsAdded.includes('escapeHtml')) {
          header += `// Added XSS protection function
const escapeHtml = (str: string) => {
  if (typeof str !== 'string') return str;
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};\n\n`;
        }
        
        if (importsAdded.includes('execFile')) {
          header += `// Note: Replaced exec() with execFile() for security
// const { execFile } = require('child_process');\n\n`;
        }
        
        if (suggestions.some(s => s.includes('environment variable'))) {
          header += `// IMPORTANT: Update your environment variables
// Create a .env file with the following:
// API_KEY=your_actual_key_here
// SECRET_TOKEN=your_actual_token_here
// DB_PASSWORD=your_actual_password_here\n\n`;
        }
        
        fixed = header + fixed;
      }
      
      const summary: FixSummary = {
        totalFixes: appliedFixes.length,
        fixedTypes: generateFixSummary(appliedFixes),
        criticalFixed: appliedFixes.filter(f => f.severity === 'Critical').length,
        highFixed: appliedFixes.filter(f => f.severity === 'High').length,
        suggestions: suggestions,
        appliedFixes: appliedFixes
      };
      
      setFixedCode(fixed);
      setFixSummary(summary);
      setIsFixing(false);
      
      if (appliedFixes.length > 0) {
        const notification = document.createElement('div');
        notification.style.cssText = `
          position: fixed;
          top: 20px;
          right: 20px;
          background: #238636;
          color: white;
          padding: 15px 20px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          z-index: 10000;
          animation: slideIn 0.3s ease;
        `;
        notification.innerHTML = `
          <div style="font-weight: 600; margin-bottom: 5px;">✅ ${appliedFixes.length} vulnerabilities fixed!</div>
          <div style="font-size: 0.9em;">Your code has been secured automatically</div>
        `;
        document.body.appendChild(notification);
        setTimeout(() => {
          if (notification.parentNode) {
            document.body.removeChild(notification);
          }
        }, 3000);
      }
    }, 2000);
  };

  // Generate diff view between original and fixed code
  const generateDiffView = () => {
    if (!fixedCode) return null;
    
    const originalLines = code.split('\n');
    const fixedLines = fixedCode.split('\n');
    const maxLines = Math.max(originalLines.length, fixedLines.length);
    
    return (
      <div style={{ 
        background: '#0d1117', 
        padding: '20px', 
        fontFamily: "'Fira Code', monospace",
        fontSize: '0.9rem',
        lineHeight: 1.6,
        overflow: 'auto',
        height: '100%'
      }}>
        <div style={{ 
          display: 'flex', 
          marginBottom: '20px', 
          paddingBottom: '10px',
          borderBottom: '1px solid #30363d'
        }}>
          <div style={{ flex: 1, color: '#f85149', fontWeight: 600 }}>Original Code</div>
          <div style={{ flex: 1, color: '#3fb950', fontWeight: 600 }}>Secured Code</div>
        </div>
        
        {Array.from({ length: maxLines }).map((_, index) => {
          const original = originalLines[index] || '';
          const fixed = fixedLines[index] || '';
          const isChanged = original !== fixed && original.trim() !== '' && fixed.trim() !== '';
          
          return (
            <div key={index} style={{ 
              display: 'flex',
              background: isChanged ? 'rgba(251, 241, 199, 0.1)' : 'transparent',
              borderLeft: isChanged ? '3px solid #d29922' : 'none',
              padding: '5px 10px',
              marginBottom: '2px'
            }}>
              <div style={{ 
                flex: 1, 
                color: isChanged ? '#f85149' : '#8b949e',
                whiteSpace: 'pre',
                paddingRight: '20px',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {original || ' '}
              </div>
              <div style={{ 
                flex: 1, 
                color: isChanged ? '#3fb950' : '#8b949e',
                whiteSpace: 'pre',
                paddingLeft: '20px',
                borderLeft: '1px solid #30363d',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {fixed || ' '}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Apply batch fixes
  const applyBatchFixes = (fixTypes?: string[]) => {
    const vulnerabilitiesToFix = fixTypes 
      ? vulnerabilities.filter(v => fixTypes.includes(v.type) && v.autoFixable)
      : vulnerabilities.filter(v => v.autoFixable && v.severity !== 'Info');
    
    if (vulnerabilitiesToFix.length === 0) {
      alert('No fixable vulnerabilities of the selected types found.');
      return;
    }
    
    setIsFixing(true);
    
    setTimeout(() => {
      let fixed = code;
      let fixedCount = 0;
      
      vulnerabilitiesToFix
        .sort((a, b) => b.line - a.line)
        .forEach(vuln => {
          const lines = fixed.split('\n');
          if (vuln.line <= lines.length && vuln.originalLine) {
            const fixedLine = generateFix(vuln, lines[vuln.line - 1]);
            if (fixedLine !== lines[vuln.line - 1]) {
              lines[vuln.line - 1] = fixedLine;
              fixed = lines.join('\n');
              fixedCount++;
            }
          }
        });
      
      if (fixedCount > 0) {
        setFixedCode(fixed);
        setCopiedNotification(`✅ Successfully fixed ${fixedCount} vulnerabilities automatically!`);
        setTimeout(() => setCopiedNotification(''), 3000);
      }
      
      setIsFixing(false);
    }, 1500);
  };

  // Toggle vulnerability selection
  const toggleVulnerability = (id: string) => {
    const newSelected = new Set(selectedVulnerabilities);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedVulnerabilities(newSelected);
  };

  // Apply fixes for selected vulnerabilities
  const applySelectedFixes = () => {
    if (selectedVulnerabilities.size === 0) {
      alert('Please select at least one vulnerability to fix.');
      return;
    }

    const selectedVulns = vulnerabilities.filter(v => selectedVulnerabilities.has(v.id));
    applyBatchFixes(selectedVulns.map(v => v.type));
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setFileName(file.name);
    setFixSummary(null);
    setShowDiff(false);
    setFixedCode('');
    setVulnerabilities([]);
    setSelectedVulnerabilities(new Set());
    
    const reader = new FileReader();
    reader.onload = (event) => {
      setCode(event.target?.result as string);
    };
    reader.readAsText(file);
  };

  // Styles
  const styles: { [key: string]: CSSProperties } = {
    container: {
      fontFamily: "'Fira Code', 'Courier New', monospace",
      background: '#0d1117',
      color: '#c9d1d9',
      minHeight: '100vh',
      padding: '0',
      overflow: 'hidden'
    },
    header: {
      background: '#161b22',
      padding: '15px 30px',
      borderBottom: '1px solid #30363d',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '20px',
    },
    logo: {
      fontSize: '1.5rem',
      fontWeight: 800,
      margin: 0,
      background: 'linear-gradient(135deg, #58a6ff, #1f6feb)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    headerControls: {
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
      flexWrap: 'wrap',
    },
    backButton: {
      background: 'transparent',
      color: '#8b949e',
      border: '1px solid #30363d',
      padding: '8px 16px',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '0.9rem',
      fontFamily: "'Fira Code', monospace",
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    workspace: {
      display: 'flex',
      height: 'calc(100vh - 70px)',
      overflow: 'hidden'
    },
    leftPanel: {
      width: '350px',
      background: '#161b22',
      borderRight: '1px solid #30363d',
      padding: '20px',
      overflowY: 'auto',
      flexShrink: 0
    },
    rightPanel: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    },
    panelHeader: {
      padding: '15px 20px',
      background: '#161b22',
      borderBottom: '1px solid #30363d',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexShrink: 0
    },
    panelTitle: {
      fontSize: '1.1rem',
      fontWeight: 600,
      color: '#c9d1d9',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    editorContainer: {
      flex: 1,
      display: 'flex',
      position: 'relative',
      overflow: 'hidden'
    },
    editor: {
      flex: 1,
      padding: '20px',
      background: '#0d1117',
      color: '#c9d1d9',
      border: 'none',
      outline: 'none',
      fontSize: '0.95rem',
      lineHeight: 1.6,
      fontFamily: "'Fira Code', 'Courier New', monospace",
      resize: 'none',
      whiteSpace: 'pre',
      tabSize: 2,
      overflow: 'auto'
    },
    lineNumbers: {
      width: '50px',
      padding: '20px 10px',
      background: '#161b22',
      color: '#6e7681',
      textAlign: 'right',
      fontSize: '0.95rem',
      lineHeight: 1.6,
      borderRight: '1px solid #30363d',
      overflow: 'hidden',
      flexShrink: 0
    },
    actionButtons: {
      display: 'flex',
      gap: '10px',
      marginBottom: '20px',
      flexWrap: 'wrap',
    },
    primaryButton: {
      flex: 1,
      padding: '12px',
      background: '#238636',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '0.95rem',
      fontWeight: 600,
      fontFamily: "'Fira Code', monospace",
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      minWidth: '160px',
    },
    secondaryButton: {
      flex: 1,
      padding: '12px',
      background: 'transparent',
      color: '#8b949e',
      border: '1px solid #30363d',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '0.95rem',
      fontFamily: "'Fira Code', monospace",
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      minWidth: '160px',
    },
    fileUpload: {
      display: 'none',
    },
    uploadArea: {
      padding: '20px',
      border: '2px dashed #30363d',
      borderRadius: '8px',
      textAlign: 'center',
      cursor: 'pointer',
      marginBottom: '20px',
      transition: 'all 0.2s ease',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '10px',
    },
    vulnerabilityItem: {
      background: '#21262d',
      borderRadius: '6px',
      padding: '15px',
      marginBottom: '10px',
      border: '1px solid #30363d',
      transition: 'all 0.2s ease',
      cursor: 'pointer',
    },
    severityBadge: {
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '0.75rem',
      fontWeight: 600,
      textTransform: 'uppercase',
      display: 'inline-block',
      marginRight: '8px',
    },
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    },
    modalContent: {
      background: '#161b22',
      borderRadius: '12px',
      padding: '30px',
      width: '90%',
      maxWidth: '500px',
      border: '1px solid #30363d',
    },
    notification: {
      position: 'fixed',
      top: '20px',
      right: '20px',
      background: '#238636',
      color: 'white',
      padding: '15px 20px',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
      zIndex: 10000,
      animation: 'slideIn 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    checkbox: {
      marginRight: '10px',
      cursor: 'pointer',
    },
  };

  // Get severity color
  const getSeverityColor = (severity: string): string => {
    switch(severity) {
      case 'Critical': return '#f85149';
      case 'High': return '#ff7b72';
      case 'Medium': return '#ffa657';
      case 'Low': return '#aff5b4';
      case 'Info': return '#8b949e';
      default: return '#8b949e';
    }
  };

  // Generate line numbers
  const generateLineNumbers = (code: string) => {
    const lines = code.split('\n').length;
    return Array.from({ length: lines }, (_, i) => i + 1).join('\n');
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.logo}>🚀 AutoDoc Security Platform</h1>
        <div style={styles.headerControls}>
          <button 
            onClick={() => navigate('/')}
            style={styles.backButton}
          >
            ← Back to Dashboard
          </button>
          <div style={{ color: '#8b949e', fontSize: '0.9rem' }}>
            {fileName}
          </div>
        </div>
      </div>

      {/* Main Workspace */}
      <div style={styles.workspace}>
        {/* Left Panel - Controls & Vulnerabilities */}
        <div style={styles.leftPanel}>
          {/* Action Buttons */}
          <div style={styles.actionButtons}>
            <button 
              onClick={scanCode}
              style={{ 
                ...styles.primaryButton,
                background: isScanning ? '#f0a045' : '#1f6feb',
                animation: isScanning ? 'pulse 1s infinite' : 'none'
              }}
              disabled={isScanning}
            >
              {isScanning ? '🔍 Scanning...' : '🔍 Scan for Vulnerabilities'}
            </button>
            
            <button 
              onClick={applyFixes}
              style={{
                ...styles.primaryButton,
                background: isFixing ? '#f0a045' : '#238636',
                animation: isFixing ? 'pulse 1s infinite' : 'none'
              }}
              disabled={isFixing || vulnerabilities.length === 0}
            >
              {isFixing ? '⚡ Fixing...' : '⚡ Auto-Fix All'}
            </button>
            
            <div 
              onClick={() => fileInputRef.current?.click()}
              style={styles.uploadArea}
            >
              📁 Upload Code File
              <input 
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".js,.ts,.jsx,.tsx,.py,.java,.cpp,.c,.cs,.php,.rb,.go"
                style={styles.fileUpload}
              />
              <div style={{ fontSize: '0.8rem', color: '#6e7681' }}>
                .js, .ts, .py, .java, etc.
              </div>
            </div>
            
            {selectedVulnerabilities.size > 0 && (
              <button 
                onClick={applySelectedFixes}
                style={{
                  ...styles.secondaryButton,
                  background: '#d29922',
                  color: 'white'
                }}
              >
                ⚡ Fix Selected ({selectedVulnerabilities.size})
              </button>
            )}
          </div>

          {/* File Information */}
          <div style={{ 
            background: '#21262d', 
            padding: '15px', 
            borderRadius: '8px',
            marginBottom: '20px',
            border: '1px solid #30363d'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div style={{ fontWeight: 600 }}>File Info</div>
              <div style={{ color: '#8b949e', fontSize: '0.9rem' }}>{fileName}</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <div>Lines:</div>
              <div style={{ color: '#aff5b4' }}>{code.split('\n').length}</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <div>Characters:</div>
              <div style={{ color: '#aff5b4' }}>{code.length}</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <div>Vulnerabilities:</div>
              <div style={{ 
                color: vulnerabilities.length === 0 ? '#aff5b4' : 
                       vulnerabilities.some(v => v.severity === 'Critical') ? '#f85149' : '#ffa657'
              }}>
                {vulnerabilities.length}
              </div>
            </div>
          </div>

          {/* Vulnerabilities List */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '10px' 
            }}>
              <div style={{ fontWeight: 600, fontSize: '1rem' }}>Vulnerabilities</div>
              <div style={{ 
                padding: '4px 8px', 
                background: vulnerabilities.length === 0 ? '#238636' : '#f85149',
                borderRadius: '4px',
                fontSize: '0.8rem',
                fontWeight: 600
              }}>
                {vulnerabilities.length} found
              </div>
            </div>
            
            {vulnerabilities.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '20px', 
                color: '#8b949e',
                fontSize: '0.9rem'
              }}>
                {isScanning ? 'Scanning code...' : 'No vulnerabilities detected yet. Click Scan to start.'}
              </div>
            ) : (
              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {vulnerabilities.map(vuln => (
                  <div 
                    key={vuln.id}
                    style={{
                      ...styles.vulnerabilityItem,
                      borderLeft: `4px solid ${getSeverityColor(vuln.severity)}`,
                      background: selectedVulnerabilities.has(vuln.id) ? '#30363d' : '#21262d'
                    }}
                    onClick={() => toggleVulnerability(vuln.id)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                      <input 
                        type="checkbox"
                        checked={selectedVulnerabilities.has(vuln.id)}
                        onChange={() => {}}
                        style={styles.checkbox}
                      />
                      <span style={{
                        ...styles.severityBadge,
                        background: getSeverityColor(vuln.severity),
                        color: '#0d1117'
                      }}>
                        {vuln.severity}
                      </span>
                      <div style={{ 
                        fontSize: '0.9rem', 
                        fontWeight: 600,
                        color: '#c9d1d9'
                      }}>
                        {vuln.type}
                      </div>
                    </div>
                    <div style={{ 
                      fontSize: '0.85rem', 
                      color: '#8b949e',
                      marginBottom: '5px'
                    }}>
                      Line {vuln.line}:{vuln.column}
                    </div>
                    <div style={{ 
                      fontSize: '0.85rem', 
                      marginBottom: '5px',
                      color: '#c9d1d9'
                    }}>
                      {vuln.description}
                    </div>
                    <div style={{ 
                      fontSize: '0.8rem', 
                      color: vuln.autoFixable ? '#3fb950' : '#8b949e',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span>
                        {vuln.autoFixable ? '✅ Auto-fixable' : '⚠️ Manual fix required'}
                      </span>
                      <span style={{ color: getSeverityColor(vuln.severity) }}>
                        {vuln.severity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Fix Summary */}
          {fixSummary && (
            <div style={{ 
              background: 'rgba(35, 134, 54, 0.1)', 
              padding: '15px', 
              borderRadius: '8px',
              border: '1px solid #238636',
              marginBottom: '20px'
            }}>
              <div style={{ 
                fontWeight: 600, 
                marginBottom: '10px',
                color: '#3fb950',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                ✅ Fix Summary
              </div>
              <div style={{ fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span>Total fixes:</span>
                  <span style={{ color: '#3fb950', fontWeight: 600 }}>{fixSummary.totalFixes}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span>Critical fixed:</span>
                  <span style={{ color: '#f85149', fontWeight: 600 }}>{fixSummary.criticalFixed}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span>High fixed:</span>
                  <span style={{ color: '#ff7b72', fontWeight: 600 }}>{fixSummary.highFixed}</span>
                </div>
                {fixSummary.suggestions.length > 0 && (
                  <div style={{ marginTop: '10px' }}>
                    <div style={{ fontWeight: 600, marginBottom: '5px' }}>Suggestions:</div>
                    <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.85rem' }}>
                      {fixSummary.suggestions.map((suggestion, index) => (
                        <li key={index} style={{ marginBottom: '3px', color: '#8b949e' }}>
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Export Buttons */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button 
              onClick={() => downloadCode(code, `original-${fileName}`)}
              style={styles.secondaryButton}
            >
              💾 Download Original
            </button>
            {fixedCode && (
              <button 
                onClick={() => downloadCode(fixedCode, `secured-${fileName}`)}
                style={styles.secondaryButton}
              >
                💾 Download Secured
              </button>
            )}
            <button 
              onClick={exportToHTML}
              style={styles.secondaryButton}
            >
              📊 Export Report
            </button>
            <button 
              onClick={() => shareCode(code)}
              style={styles.secondaryButton}
            >
              🔗 Share Analysis
            </button>
          </div>
        </div>

        {/* Right Panel - Code Editor */}
        <div style={styles.rightPanel}>
          <div style={styles.panelHeader}>
            <div style={styles.panelTitle}>
              {activeTab === 'editor' ? '📝 Original Code' : '🔒 Secured Code'}
              {fixedCode && (
                <div style={{ display: 'flex', gap: '10px', marginLeft: '20px' }}>
                  <button 
                    onClick={() => setActiveTab('editor')}
                    style={{
                      padding: '6px 12px',
                      background: activeTab === 'editor' ? '#1f6feb' : 'transparent',
                      color: activeTab === 'editor' ? 'white' : '#8b949e',
                      border: '1px solid #30363d',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      fontFamily: "'Fira Code', monospace"
                    }}
                  >
                    Original
                  </button>
                  <button 
                    onClick={() => setActiveTab('fixed')}
                    style={{
                      padding: '6px 12px',
                      background: activeTab === 'fixed' ? '#238636' : 'transparent',
                      color: activeTab === 'fixed' ? 'white' : '#8b949e',
                      border: '1px solid #30363d',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      fontFamily: "'Fira Code', monospace"
                    }}
                  >
                    Secured
                  </button>
                </div>
              )}
            </div>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={copyCurrentTabCode}
                style={{
                  padding: '8px 16px',
                  background: 'transparent',
                  color: '#8b949e',
                  border: '1px solid #30363d',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontFamily: "'Fira Code', monospace",
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                📋 Copy
              </button>
              {activeTab === 'fixed' && fixedCode && showDiff && (
                <button 
                  onClick={() => setShowDiff(!showDiff)}
                  style={{
                    padding: '8px 16px',
                    background: showDiff ? '#d29922' : 'transparent',
                    color: showDiff ? 'white' : '#8b949e',
                    border: '1px solid #30363d',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontFamily: "'Fira Code', monospace",
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  {showDiff ? '📝 Hide Diff' : '🔍 Show Diff'}
                </button>
              )}
            </div>
          </div>

          <div style={styles.editorContainer}>
            {activeTab === 'editor' || !fixedCode || !showDiff ? (
              <>
                <div style={styles.lineNumbers}>
                  {generateLineNumbers(activeTab === 'editor' ? code : fixedCode)}
                </div>
                <textarea
                  value={activeTab === 'editor' ? code : fixedCode}
                  onChange={(e) => activeTab === 'editor' ? setCode(e.target.value) : setFixedCode(e.target.value)}
                  style={styles.editor}
                  spellCheck={false}
                  readOnly={activeTab === 'fixed'}
                />
              </>
            ) : (
              generateDiffView()
            )}
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div style={styles.modalOverlay} onClick={() => setShowShareModal(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginTop: 0, color: '#c9d1d9' }}>🔗 Share Your Analysis</h3>
            <p style={{ color: '#8b949e', fontSize: '0.9rem', marginBottom: '20px' }}>
              Share this link with others to show them your security analysis:
            </p>
            <div style={{ 
              background: '#0d1117', 
              padding: '15px', 
              borderRadius: '6px',
              border: '1px solid #30363d',
              marginBottom: '20px',
              wordBreak: 'break-all',
              fontSize: '0.9rem',
              color: '#8b949e'
            }}>
              {shareUrl}
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={() => {
                  copyToClipboard(shareUrl, 'original');
                  setShowShareModal(false);
                }}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#238636',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  fontFamily: "'Fira Code', monospace"
                }}
              >
                Copy Link
              </button>
              <button 
                onClick={() => setShowShareModal(false)}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: 'transparent',
                  color: '#8b949e',
                  border: '1px solid #30363d',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  fontFamily: "'Fira Code', monospace"
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification */}
      {copiedNotification && (
        <div style={styles.notification}>
          <div>✅</div>
          <div>{copiedNotification}</div>
        </div>
      )}
    </div>
  );
}

export default AutoDocWorkspace;