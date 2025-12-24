import React from 'react';

interface LogoProps {
  className?: string;
  src?: string;
}

export const Logo: React.FC<LogoProps> = ({ className, src }) => {
  if (src) {
    return (
      <img 
        src={src} 
        alt="School Logo" 
        className={`object-contain ${className}`} 
      />
    );
  }

  return (
    <svg viewBox="0 0 200 240" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Shield Background - Lazuardi Blue */}
      <path 
        d="M100 240C180 190 200 120 200 40L100 0L0 40C0 120 20 190 100 240Z" 
        fill="#1d4ed8" 
      />
      
      {/* Star - Top Right (Diamond Shape with curved edges) */}
      <path 
        d="M145 60 C145 60 152 85 185 90 C152 95 145 120 145 120 C145 120 138 95 105 90 C138 85 145 60 145 60 Z" 
        fill="white" 
      />

      {/* Top Left Swoosh - Stylized Page/Book Top */}
      <path 
        d="M30 130 C30 80 50 50 85 35 C85 35 60 90 60 110 C60 140 95 150 95 150 C95 150 60 170 30 130 Z" 
        fill="white" 
      />

      {/* Bottom Swoosh - Stylized Page/Book Bottom */}
      <path 
        d="M40 190 C40 190 60 170 100 160 C130 155 175 165 175 165 C135 210 100 230 100 230 C70 215 40 190 40 190 Z" 
        fill="white" 
      />
    </svg>
  );
};
