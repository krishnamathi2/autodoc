// GitHub OAuth Configuration
const GITHUB_CLIENT_ID = process.env.REACT_APP_GITHUB_CLIENT_ID || '';
const GITHUB_REDIRECT_URI = window.location.origin + '/github/callback';
const GITHUB_SCOPE = 'repo read:user';

// GitHub API Base URL
const GITHUB_API_BASE = 'https://api.github.com';

export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  name: string;
  email: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string;
  private: boolean;
  html_url: string;
  language: string;
  default_branch: string;
  updated_at: string;
  stargazers_count: number;
}

export interface GitHubFile {
  name: string;
  path: string;
  type: 'file' | 'dir';
  size?: number;
  download_url?: string;
  content?: string;
}

// Initiate GitHub OAuth flow
export const initiateGitHubOAuth = (): void => {
  const authUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(GITHUB_REDIRECT_URI)}&scope=${encodeURIComponent(GITHUB_SCOPE)}`;
  window.location.href = authUrl;
};

// Store GitHub token
export const setGitHubToken = (token: string): void => {
  localStorage.setItem('github_access_token', token);
};

// Get GitHub token
export const getGitHubToken = (): string | null => {
  return localStorage.getItem('github_access_token');
};

// Remove GitHub token (disconnect)
export const removeGitHubToken = (): void => {
  localStorage.removeItem('github_access_token');
  localStorage.removeItem('github_user');
};

// Check if GitHub is connected
export const isGitHubConnected = (): boolean => {
  return !!getGitHubToken();
};

// Store GitHub user info
export const setGitHubUser = (user: GitHubUser): void => {
  localStorage.setItem('github_user', JSON.stringify(user));
};

// Get GitHub user info
export const getGitHubUser = (): GitHubUser | null => {
  const user = localStorage.getItem('github_user');
  return user ? JSON.parse(user) : null;
};

// Fetch authenticated user
export const fetchGitHubUser = async (): Promise<GitHubUser | null> => {
  const token = getGitHubToken();
  if (!token) return null;

  try {
    const response = await fetch(`${GITHUB_API_BASE}/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        removeGitHubToken();
      }
      return null;
    }

    const user = await response.json();
    setGitHubUser(user);
    return user;
  } catch (error) {
    console.error('Error fetching GitHub user:', error);
    return null;
  }
};

// Fetch user's repositories
export const fetchGitHubRepos = async (): Promise<GitHubRepo[]> => {
  const token = getGitHubToken();
  if (!token) return [];

  try {
    const response = await fetch(`${GITHUB_API_BASE}/user/repos?sort=updated&per_page=50`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    if (!response.ok) {
      return [];
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching repos:', error);
    return [];
  }
};

// Fetch repository contents (files/folders)
export const fetchRepoContents = async (
  owner: string,
  repo: string,
  path: string = ''
): Promise<GitHubFile[]> => {
  const token = getGitHubToken();
  if (!token) return [];

  try {
    const response = await fetch(
      `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${path}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [data];
  } catch (error) {
    console.error('Error fetching repo contents:', error);
    return [];
  }
};

// Fetch file content
export const fetchFileContent = async (
  owner: string,
  repo: string,
  path: string
): Promise<string | null> => {
  const token = getGitHubToken();
  if (!token) return null;

  try {
    const response = await fetch(
      `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${path}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    
    // Content is base64 encoded
    if (data.content) {
      return atob(data.content.replace(/\n/g, ''));
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching file content:', error);
    return null;
  }
};

// Fetch multiple files from a repository (for scanning)
export const fetchRepoFiles = async (
  owner: string,
  repo: string,
  extensions: string[] = ['.js', '.ts', '.jsx', '.tsx', '.py', '.java', '.go', '.rb', '.php']
): Promise<{ path: string; content: string }[]> => {
  const files: { path: string; content: string }[] = [];
  
  const processDirectory = async (path: string = '') => {
    const contents = await fetchRepoContents(owner, repo, path);
    
    for (const item of contents) {
      if (item.type === 'dir' && !item.name.startsWith('.') && item.name !== 'node_modules') {
        await processDirectory(item.path);
      } else if (item.type === 'file') {
        const hasValidExtension = extensions.some(ext => item.name.endsWith(ext));
        if (hasValidExtension && item.size && item.size < 100000) { // Skip large files
          const content = await fetchFileContent(owner, repo, item.path);
          if (content) {
            files.push({ path: item.path, content });
          }
        }
      }
    }
  };

  await processDirectory();
  return files;
};
