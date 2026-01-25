// Demo helpers 
// src/utils/demoHelpers.ts
export function getStepTitle(step: number): string {
  switch(step) {
    case 1: return 'Code Scanning';
    case 2: return 'Vulnerability Analysis';
    case 3: return 'Fix Generation';
    case 4: return 'Review & Apply';
    default: return 'Demo';
  }
}

export function getStepDescription(step: number): string {
  switch(step) {
    case 1: return 'AutoDoc scans your codebase for security vulnerabilities using advanced pattern recognition.';
    case 2: return 'Identified vulnerabilities are analyzed for context, severity, and potential impact.';
    case 3: return 'AutoDoc generates secure, production-ready fixes with explanations.';
    case 4: return 'Review the automatic fix and apply it to your codebase with one click.';
    default: return '';
  }
}

export function getButtonText(step: number): string {
  switch(step) {
    case 1: return 'Analyze Code';
    case 2: return 'Generate Fix';
    case 3: return 'Review Fix';
    default: return 'Next';
  }
}