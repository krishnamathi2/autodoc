import React from 'react';
import { useNavigate } from 'react-router-dom';

interface BackButtonProps {
  onClick?: () => void;
  label?: string;
}

function BackButton({ onClick, label = 'Back' }: BackButtonProps) {
  const navigate = useNavigate();
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(-1);
    }
  };

  return (
    <button className="back-button" onClick={handleClick}>
      ← {label}
    </button>
  );
}

export default BackButton;  // ADD THIS LINE