import React from 'react';

interface ThemeToggleProps {
  isDarkTheme: boolean;
  toggleTheme: () => void;
}

function ThemeToggle({ isDarkTheme, toggleTheme }: ThemeToggleProps) {
  return (
    <button className="theme-toggle" onClick={toggleTheme}>
      {isDarkTheme ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
    </button>
  );
}

export default ThemeToggle;  // ADD THIS LINE