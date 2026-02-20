import React from 'react';
import { useLogo } from '../../contexts/LogoContext';
import './Logo.css';

// Default SVG icons for different presets
const DefaultLogoIcon = ({ type = 'default', className = '' }) => {
  const icons = {
    default: (
      <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 40 L12 40 L14 28 L4 28 L6 18 L22 14 L48 14 L54 18 L58 24 L56 40 L60 40 C61.1 40 62 40.9 62 42 L62 46 C62 47.1 61.1 48 60 48 L56 48 C54.9 48 54 47.1 54 46 L54 44 L10 44 L10 46 C10 47.1 9.1 48 8 48 L4 48 C2.9 48 2 47.1 2 46 L2 42 C2 40.9 2.9 40 4 40 L8 40 Z" fill="#3b82f6" stroke="#60a5fa" strokeWidth="2"/>
        <path d="M20 14 L24 8 L44 8 L48 14" fill="#1d4ed8" stroke="#3b82f6" strokeWidth="2" strokeLinejoin="round"/>
        <path d="M26 10 L30 10 L30 13 L22 13 L22 10 Z" fill="#93c5fd"/>
        <path d="M34 10 L42 10 L46 13 L34 13 Z" fill="#93c5fd"/>
        <circle cx="16" cy="44" r="6" fill="#1e293b" stroke="#475569" strokeWidth="2"/>
        <circle cx="16" cy="44" r="2" fill="#64748b"/>
        <circle cx="48" cy="44" r="6" fill="#1e293b" stroke="#475569" strokeWidth="2"/>
        <circle cx="48" cy="44" r="2" fill="#64748b"/>
        <ellipse cx="58" cy="30" rx="2" ry="3" fill="#fbbf24"/>
        <ellipse cx="4" cy="30" rx="2" ry="3" fill="#ef4444"/>
      </svg>
    ),
    luxury: (
      <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="8" y="24" width="48" height="24" rx="4" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="2"/>
        <path d="M16 24 L20 12 L44 12 L48 24" fill="#1d4ed8" stroke="#3b82f6" strokeWidth="2" strokeLinejoin="round"/>
        <path d="M22 14 L26 14 L26 20 L18 20 Z" fill="#93c5fd"/>
        <path d="M30 14 L42 14 L46 20 L30 20 Z" fill="#93c5fd"/>
        <circle cx="16" cy="48" r="6" fill="#1e293b" stroke="#475569" strokeWidth="2"/>
        <circle cx="16" cy="48" r="3" fill="#fbbf24"/>
        <circle cx="48" cy="48" r="6" fill="#1e293b" stroke="#475569" strokeWidth="2"/>
        <circle cx="48" cy="48" r="3" fill="#fbbf24"/>
        <path d="M28 32 L36 32" stroke="#fbbf24" strokeWidth="2"/>
        <path d="M30 36 L34 36" stroke="#fbbf24" strokeWidth="2"/>
      </svg>
    ),
    fleet: (
      <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="16" width="20" height="16" rx="2" fill="#3b82f6" stroke="#60a5fa" strokeWidth="2"/>
        <rect x="26" y="16" width="20" height="16" rx="2" fill="#3b82f6" stroke="#60a5fa" strokeWidth="2"/>
        <rect x="48" y="16" width="12" height="16" rx="2" fill="#3b82f6" stroke="#60a5fa" strokeWidth="2"/>
        <path d="M6 16 L8 8 L24 8 L26 16" fill="#1d4ed8" stroke="#3b82f6" strokeWidth="2"/>
        <path d="M28 16 L30 8 L46 8 L48 16" fill="#1d4ed8" stroke="#3b82f6" strokeWidth="2"/>
        <circle cx="10" cy="32" r="4" fill="#1e293b" stroke="#475569" strokeWidth="2"/>
        <circle cx="32" cy="32" r="4" fill="#1e293b" stroke="#475569" strokeWidth="2"/>
        <circle cx="54" cy="32" r="4" fill="#1e293b" stroke="#475569" strokeWidth="2"/>
      </svg>
    ),
    premium: (
      <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 42 L12 42 L14 28 L6 28 L4 42 Z" fill="#fbbf24" stroke="#f59e0b" strokeWidth="2"/>
        <path d="M14 28 L22 14 L48 14 L58 24 L56 42 L60 42 C61.1 42 62 42.9 62 44 L62 46 C62 47.1 61.1 48 60 48 L56 48 C54.9 48 54 47.1 54 46 L54 44 L10 44 L10 46 C10 47.1 9.1 48 8 48 L4 48 C2.9 48 2 47.1 2 46 L2 44 C2 42.9 2.9 42 4 42 Z" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="2"/>
        <path d="M22 14 L26 8 L44 8 L48 14" fill="#3b82f6" stroke="#60a5fa" strokeWidth="2" strokeLinejoin="round"/>
        <path d="M28 10 L32 10 L32 13 L24 13 L24 10 Z" fill="#93c5fd"/>
        <path d="M36 10 L42 10 L46 13 L36 13 Z" fill="#93c5fd"/>
        <circle cx="16" cy="48" r="6" fill="#1e293b" stroke="#475569" strokeWidth="2"/>
        <circle cx="16" cy="48" r="2" fill="#fbbf24"/>
        <circle cx="48" cy="48" r="6" fill="#1e293b" stroke="#475569" strokeWidth="2"/>
        <circle cx="48" cy="48" r="2" fill="#fbbf24"/>
        <path d="M32 22 L32 26" stroke="#fbbf24" strokeWidth="2"/>
      </svg>
    )
  };

  return icons[type] || icons.default;
};

// Logo component for displaying in the header/sidebar
export const Logo = ({ 
  size = 'default', 
  showName = true, 
  className = '',
  variant = 'default' 
}) => {
  const { logoConfig, loading } = useLogo();
  
  if (loading) {
    return <div className={`logo logo-${size} ${className}`}>Loading...</div>;
  }

  const sizeClasses = {
    small: 'logo-small',
    default: 'logo-default',
    large: 'logo-large'
  };

  return (
    <div className={`logo ${sizeClasses[size]} ${className}`}>
      {logoConfig.logoImage ? (
        <img 
          src={logoConfig.logoImage} 
          alt={logoConfig.name} 
          className={`logo-image logo-image-${size}`}
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
      ) : null}
      <div 
        className={`logo-icon-wrapper ${logoConfig.logoImage ? 'hidden' : ''}`}
        style={{ display: logoConfig.logoImage ? 'none' : 'flex' }}
      >
        <DefaultLogoIcon type={logoConfig.icon} className={`logo-icon logo-icon-${size}`} />
      </div>
      {showName && (
        <h1 className={`logo-text logo-text-${size}`}>{logoConfig.name}</h1>
      )}
    </div>
  );
};

// Favicon component
export const Favicon = ({ size = 32 }) => {
  const { logoConfig, loading } = useLogo();

  if (loading) {
    return null;
  }

  if (logoConfig.favicon) {
    return (
      <img 
        src={logoConfig.favicon} 
        alt="Favicon" 
        width={size} 
        height={size}
        className="favicon"
        onError={(e) => {
          e.target.style.display = 'none';
        }}
      />
    );
  }

  // Default favicon
  return (
    <DefaultLogoIcon type={logoConfig.icon} className="favicon-default" />
  );
};

export default Logo;
