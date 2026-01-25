// src/components/common/Footer.tsx
import React from 'react';

interface FooterProps {
  text?: string;
}

function Footer({ text = 'Built with ❤️ for developers' }: FooterProps) {
  return (
    <footer className="footer">
      <p className="footer-text">{text}</p>
    </footer>
  );
}

export default Footer;