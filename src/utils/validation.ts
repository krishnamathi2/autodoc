// src/utils/validation.ts

// Named exports
export const validateEmail = (email: string): { isValid: boolean; error: string } => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return { isValid: false, error: 'Email is required' };
  if (!emailRegex.test(email)) return { isValid: false, error: 'Please enter a valid email address' };
  return { isValid: true, error: '' };
};

export const validatePassword = (password: string): { isValid: boolean; error: string } => {
  if (!password) return { isValid: false, error: 'Password is required' };
  if (password.length < 8) return { isValid: false, error: 'Password must be at least 8 characters' };
  if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(password)) {
    return { isValid: false, error: 'Password must contain letters and numbers' };
  }
  return { isValid: true, error: '' };
};

export const getPasswordStrength = (password: string): { strength: 'weak' | 'medium' | 'strong'; label: string } => {
  if (!password) return { strength: 'weak', label: '' };
  
  let score = 0;
  if (password.length >= 8) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;
  
  if (score <= 2) return { strength: 'weak', label: 'Weak password' };
  if (score <= 4) return { strength: 'medium', label: 'Medium password' };
  return { strength: 'strong', label: 'Strong password' };
};

// You can also export as default if needed
// export default { validateEmail, validatePassword, getPasswordStrength };