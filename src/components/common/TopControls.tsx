import React from 'react';
import BackButton from './BackButton';
import ThemeToggle from './ThemeToggle';

interface TopControlsProps {
  isDarkTheme: boolean;
  toggleTheme: () => void;
  showBackButton?: boolean;
  backLabel?: string;
  onBackClick?: () => void;
  showThemeToggle?: boolean;
}

function TopControls({
  isDarkTheme,
  toggleTheme,
  showBackButton = true,
  backLabel = 'Back',
  onBackClick,
  showThemeToggle = true
}: TopControlsProps) {
  return (
    <div className="top-controls">
      {showBackButton && (
        <BackButton onClick={onBackClick} label={backLabel} />
      )}
      {showThemeToggle && (
        <div className="top-right-buttons">
          <ThemeToggle isDarkTheme={isDarkTheme} toggleTheme={toggleTheme} />
        </div>
      )}
    </div>
  );
}

export default TopControls;  // ADD THIS LINE