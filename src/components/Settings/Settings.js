import React, { useState, useCallback } from "react";
import { useLogo } from "../../contexts/LogoContext";
import { ToastContainer, toast } from "react-toastify";
import "./Settings.css";

// Default SVG icons for presets (same as Logo.js)
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

const Settings = () => {
  const {
    logoConfig,
    logoPresets,
    error,
    setLogoName,
    setPreset,
    handleImageUpload,
    setLogoImage,
    setFavicon,
    resetToDefault,
    clearError
  } = useLogo();

  const [localError, setLocalError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleLogoUpload = useCallback(async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const success = await handleImageUpload(file, 'logo');
    if (success) {
      setSuccessMessage('Logo uploaded successfully!');
      toast.success('Logo updated successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } else {
      setLocalError('Failed to upload logo. Please try again.');
    }
  }, [handleImageUpload]);

  const handleFaviconUpload = useCallback(async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const success = await handleImageUpload(file, 'favicon');
    if (success) {
      setSuccessMessage('Favicon uploaded successfully!');
      toast.success('Favicon updated successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } else {
      setLocalError('Failed to upload favicon. Please try again.');
    }
  }, [handleImageUpload]);

  const handleRemoveLogo = useCallback(() => {
    setLogoImage(null);
    setSuccessMessage('Logo removed');
    toast.info('Logo removed');
    setTimeout(() => setSuccessMessage(null), 3000);
  }, [setLogoImage]);

  const handleRemoveFavicon = useCallback(() => {
    setFavicon(null);
    setSuccessMessage('Favicon reset to default');
    toast.info('Favicon reset to default');
    setTimeout(() => setSuccessMessage(null), 3000);
  }, [setFavicon]);

  const handleReset = useCallback(() => {
    resetToDefault();
    setSuccessMessage('All logo settings reset to defaults');
    toast.success('Logo settings reset to defaults');
    setTimeout(() => setSuccessMessage(null), 3000);
  }, [resetToDefault]);

  return (
    <div className="settings">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <div className="page-header">
        <div className="header-content">
          <h1>Settings</h1>
          <p className="subtitle">Manage application settings and preferences</p>
        </div>
      </div>

      {/* Logo Settings Section */}
      <div className="logo-settings">
        
        {/* Error/Success Messages */}
        {(localError || error) && (
          <div className="logo-error">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
            {localError || error}
          </div>
        )}

        {successMessage && (
          <div className="logo-success">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            {successMessage}
          </div>
        )}

        {/* Preset Selection */}
        <div className="logo-settings-section">
          <h3>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
            Choose a Preset
          </h3>
          <div className="logo-preset-grid">
            {logoPresets.map((preset) => (
              <div
                key={preset.id}
                className={`logo-preset-card ${logoConfig.icon === preset.id && !logoConfig.logoImage ? 'active' : ''}`}
                onClick={() => {
                  setPreset(preset.id);
                  toast.info(`Switched to ${preset.name} preset`);
                }}
              >
                <DefaultLogoIcon type={preset.icon} className="logo-preset-icon" />
                <span className="logo-preset-name">{preset.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Logo Name */}
        <div className="logo-settings-section logo-name-section">
          <h3>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            Logo Name
          </h3>
          <input
            type="text"
            className="logo-name-input"
            value={logoConfig.name}
            onChange={(e) => setLogoName(e.target.value)}
            placeholder="Enter logo name"
          />
        </div>

        {/* Custom Upload */}
        <div className="logo-settings-section">
          <h3>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            Upload Custom Logo & Favicon
          </h3>
          <div className="logo-upload-section">
            {/* Logo Upload */}
            <div className={`logo-upload-card ${logoConfig.logoImage ? 'has-image' : ''}`}>
              <label className="logo-upload-label">Application Logo</label>
              <p className="logo-upload-description">
                Upload PNG, JPG, or SVG (max 2MB)
              </p>
              <input
                type="file"
                id="logo-upload"
                className="logo-upload-input"
                accept="image/jpeg,image/png,image/gif,image/svg+xml,image/webp"
                onChange={handleLogoUpload}
              />
              <label htmlFor="logo-upload" className="logo-upload-button">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                Choose File
              </label>
              
              {logoConfig.logoImage && (
                <div className="logo-preview">
                  <img 
                    src={logoConfig.logoImage} 
                    alt="Logo preview" 
                    className="logo-preview-image"
                  />
                  <button 
                    className="logo-preview-remove" 
                    onClick={handleRemoveLogo}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                      <line x1="18" y1="6" x2="6" y2="18"/>
                      <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* Favicon Upload */}
            <div className={`logo-upload-card ${logoConfig.favicon ? 'has-image' : ''}`}>
              <label className="logo-upload-label">Browser Favicon</label>
              <p className="logo-upload-description">
                Upload PNG or ICO (32x32 recommended)
              </p>
              <input
                type="file"
                id="favicon-upload"
                className="logo-upload-input"
                accept="image/jpeg,image/png,image/gif,image/svg+xml,image/webp"
                onChange={handleFaviconUpload}
              />
              <label htmlFor="favicon-upload" className="logo-upload-button">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                Choose File
              </label>
              
              {logoConfig.favicon && (
                <div className="logo-preview">
                  <img 
                    src={logoConfig.favicon} 
                    alt="Favicon preview" 
                    className="logo-preview-image"
                  />
                  <button 
                    className="logo-preview-remove" 
                    onClick={handleRemoveFavicon}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                      <line x1="18" y1="6" x2="6" y2="18"/>
                      <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Reset Button */}
        <div className="logo-reset-section">
          <button className="logo-reset-button" onClick={handleReset}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="1 4 1 10 7 10"/>
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
            </svg>
            Reset to Default
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
