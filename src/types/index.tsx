// src/types/index.ts

// User-related types
export interface User {
  id: string;
  name: string;
  email: string;
  company?: string;
  role?: UserRole;
  avatar?: string;
  createdAt: Date;
  lastLogin?: Date;
  plan?: SubscriptionPlan;
}

export type UserRole = 
  | 'developer'
  | 'senior-developer' 
  | 'tech-lead'
  | 'engineering-manager'
  | 'cto'
  | 'security-engineer'
  | 'admin'
  | 'other';

export type SubscriptionPlan = 
  | 'free'
  | 'pro'
  | 'team'
  | 'enterprise';

// Repository-related types
export interface Repository {
  id: string;
  name: string;
  fullName: string;
  owner: string;
  provider: GitProvider;
  url: string;
  private: boolean;
  defaultBranch: string;
  language?: string;
  description?: string;
  connectedAt: Date;
  lastScan?: Date;
  scanStatus: ScanStatus;
  vulnerabilityCount?: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
}

export type GitProvider = 
  | 'github'
  | 'gitlab'
  | 'bitbucket'
  | 'azure-devops'
  | 'other';

export type ScanStatus = 
  | 'idle'
  | 'scanning'
  | 'completed'
  | 'failed'
  | 'queued';

// Security vulnerability types
export interface Vulnerability {
  id: string;
  repositoryId: string;
  title: string;
  description: string;
  severity: SeverityLevel;
  category: VulnerabilityCategory;
  file: string;
  line: number;
  column?: number;
  codeSnippet: string;
  fix: string;
  status: VulnerabilityStatus;
  detectedAt: Date;
  fixedAt?: Date;
  cvssScore?: number;
  cweId?: string;
  references?: string[];
}

export type SeverityLevel = 
  | 'critical'
  | 'high'
  | 'medium'
  | 'low'
  | 'info';

export type VulnerabilityCategory =
  | 'sql-injection'
  | 'xss'
  | 'csrf'
  | 'insecure-authentication'
  | 'data-exposure'
  | 'misconfiguration'
  | 'insecure-dependencies'
  | 'insecure-deserialization'
  | 'server-side-request-forgery'
  | 'other';

export type VulnerabilityStatus =
  | 'open'
  | 'fixed'
  | 'false-positive'
  | 'wont-fix'
  | 'ignored';

// Scan results types
export interface ScanResult {
  id: string;
  repositoryId: string;
  startedAt: Date;
  completedAt?: Date;
  status: ScanStatus;
  vulnerabilitiesFound: number;
  vulnerabilitiesFixed: number;
  duration?: number; // in milliseconds
  summary: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    info: number;
  };
  scanType: ScanType;
}

export type ScanType = 
  | 'full'
  | 'incremental'
  | 'scheduled'
  | 'manual'
  | 'pull-request';

// Form types
export interface SignUpFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  company?: string;
  role?: UserRole;
  teamSize?: string;
  acceptTerms: boolean;
  acceptUpdates: boolean;
}

export interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface TrialFormData {
  name: string;
  email: string;
  company: string;
  role: UserRole;
  teamSize: string;
  sourceControl?: GitProvider;
  primaryLanguage?: string;
  acceptTerms: boolean;
  acceptUpdates: boolean;
}

// API response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  timestamp: Date;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Dashboard stats types
export interface DashboardStats {
  totalRepositories: number;
  totalScans: number;
  scansToday: number;
  criticalIssues: number;
  securityScore: number;
  recentScans: ScanResult[];
  topVulnerabilities: Vulnerability[];
}

// Git provider auth types
export interface GitAuthConfig {
  provider: GitProvider;
  clientId: string;
  redirectUri: string;
  scope: string;
}

// Settings types
export interface UserSettings {
  theme: 'light' | 'dark' | 'auto';
  notifications: {
    email: boolean;
    push: boolean;
    slack: boolean;
    criticalOnly: boolean;
  };
  scanPreferences: {
    autoScan: boolean;
    scanOnPush: boolean;
    scanOnPR: boolean;
    excludedFiles: string[];
    excludedPatterns: string[];
  };
  security: {
    twoFactorEnabled: boolean;
    sessionTimeout: number;
  };
}

// Webhook types
export interface Webhook {
  id: string;
  repositoryId: string;
  url: string;
  events: string[];
  active: boolean;
  createdAt: Date;
  lastTriggered?: Date;
}

// Team types
export interface Team {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  members: TeamMember[]; // Fixed: using TeamMember interface
  createdAt: Date;
}

export interface TeamMember {
  userId: string;
  role: TeamRole;
  joinedAt: Date;
}

export type TeamRole = 'owner' | 'admin' | 'member' | 'viewer';

// Note: Removed the duplicate export statements at the bottom
// The types are already exported above