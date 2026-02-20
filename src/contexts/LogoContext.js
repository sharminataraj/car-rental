import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

// Default logo configuration
const DEFAULT_LOGO = {
  icon: 'default',
  name: 'InJee Rental',
  favicon: null,
  logoImage: null
};

// Predefined logo options
const LOGO_PRESETS = [
  { id: 'default', name: 'Car Rental', icon: 'default' },
  { id: 'luxury', name: 'Luxury Cars', icon: 'luxury' },
  { id: 'fleet', name: 'Fleet Management', icon: 'fleet' },
  { id: 'premium', name: 'Premium Rentals', icon: 'premium' },
];

const LogoContext = createContext();

export const LogoProvider = ({ children }) => {
  const [logoConfig, setLogoConfig] = useState(DEFAULT_LOGO);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load logo configuration from localStorage on mount
  useEffect(() => {
    const loadLogoConfig = () => {
      try {
        const savedConfig = localStorage.getItem('rental_logo_config');
        if (savedConfig) {
          const parsed = JSON.parse(savedConfig);
          setLogoConfig(parsed);
        }
      } catch (err) {
        console.error('Error loading logo config:', err);
        setError('Failed to load logo configuration');
      } finally {
        setLoading(false);
      }
    };

    loadLogoConfig();
  }, []);

  // Save logo configuration to localStorage whenever it changes
  useEffect(() => {
    if (!loading) {
      try {
        localStorage.setItem('rental_logo_config', JSON.stringify(logoConfig));
      } catch (err) {
        console.error('Error saving logo config:', err);
        setError('Failed to save logo configuration');
      }
    }
  }, [logoConfig, loading]);

  // Update the browser favicon
  const updateFavicon = useCallback((faviconUrl) => {
    const linkElements = document.querySelectorAll('link[rel*="icon"]');
    
    if (faviconUrl) {
      // Remove existing favicons
      linkElements.forEach(link => link.remove());
      
      // Create new favicon link
      const link = document.createElement('link');
      link.rel = 'icon';
      link.type = 'image/png';
      link.href = faviconUrl;
      document.head.appendChild(link);
    } else {
      // Use default favicon
      linkElements.forEach(link => link.remove());
    }
  }, []);

  // Update favicon when logo config changes
  useEffect(() => {
    if (logoConfig.favicon) {
      updateFavicon(logoConfig.favicon);
    } else {
      updateFavicon(null);
    }
  }, [logoConfig.favicon, updateFavicon]);

  // Update page title when logo name changes
  useEffect(() => {
    if (logoConfig.name && logoConfig.name !== 'InJee Rental') {
      document.title = `${logoConfig.name} - Car Rental Dashboard`;
    } else {
      document.title = 'InJee Car Rental';
    }
  }, [logoConfig.name]);

  // Set logo image (from upload or URL)
  const setLogoImage = useCallback((imageData) => {
    setLogoConfig(prev => ({
      ...prev,
      logoImage: imageData
    }));
  }, []);

  // Set favicon image (from upload or URL)
  const setFavicon = useCallback((faviconData) => {
    setLogoConfig(prev => ({
      ...prev,
      favicon: faviconData
    }));
  }, []);

  // Set logo name
  const setLogoName = useCallback((name) => {
    setLogoConfig(prev => ({
      ...prev,
      name: name || 'InJee Rental'
    }));
  }, []);

  // Set preset logo
  const setPreset = useCallback((presetId) => {
    const preset = LOGO_PRESETS.find(p => p.id === presetId);
    if (preset) {
      setLogoConfig(prev => ({
        ...prev,
        icon: preset.icon,
        name: preset.name,
        logoImage: null,
        favicon: null
      }));
    }
  }, []);

  // Reset to default
  const resetToDefault = useCallback(() => {
    setLogoConfig(DEFAULT_LOGO);
    updateFavicon(null);
  }, [updateFavicon]);

  // Get optimized image URL with size constraints
  const getOptimizedImageUrl = useCallback((imageData, maxWidth = 200, maxHeight = 200) => {
    if (!imageData) return null;
    
    // If it's already a data URL, return as-is for now
    // In production, you'd implement actual image optimization
    return imageData;
  }, []);

  // Validate image file
  const validateImage = useCallback((file) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml', 'image/webp'];
    const maxSize = 2 * 1024 * 1024; // 2MB
    
    if (!validTypes.includes(file.type)) {
      return { valid: false, error: 'Invalid file type. Please upload JPEG, PNG, GIF, SVG, or WebP images.' };
    }
    
    if (file.size > maxSize) {
      return { valid: false, error: 'File too large. Maximum size is 2MB.' };
    }
    
    return { valid: true };
  }, []);

  // Convert file to base64 data URL
  const fileToDataUrl = useCallback((file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }, []);

  // Handle image upload
  const handleImageUpload = useCallback(async (file, type = 'logo') => {
    const validation = validateImage(file);
    if (!validation.valid) {
      setError(validation.error);
      return false;
    }

    try {
      const dataUrl = await fileToDataUrl(file);
      
      if (type === 'logo') {
        setLogoImage(dataUrl);
      } else if (type === 'favicon') {
        setFavicon(dataUrl);
      }
      
      setError(null);
      return true;
    } catch (err) {
      setError('Failed to upload image');
      return false;
    }
  }, [validateImage, fileToDataUrl, setLogoImage, setFavicon]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = {
    logoConfig,
    loading,
    error,
    logoPresets: LOGO_PRESETS,
    setLogoImage,
    setFavicon,
    setLogoName,
    setPreset,
    resetToDefault,
    handleImageUpload,
    getOptimizedImageUrl,
    clearError,
    updateFavicon
  };

  return (
    <LogoContext.Provider value={value}>
      {children}
    </LogoContext.Provider>
  );
};

export const useLogo = () => {
  const context = useContext(LogoContext);
  if (!context) {
    throw new Error('useLogo must be used within a LogoProvider');
  }
  return context;
};

export default LogoContext;
