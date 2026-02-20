import React, { createContext, useState, useContext, useEffect } from 'react';

// Exchange rate for USD to INR (approximate, you may want to fetch this from an API)
const USD_TO_INR = 83;

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState('USD');

  // Load from localStorage if available
  useEffect(() => {
    const savedCurrency = localStorage.getItem('rental_currency');
    if (savedCurrency) {
      setCurrency(savedCurrency);
    }
  }, []);

  // Save to localStorage when currency changes
  useEffect(() => {
    localStorage.setItem('rental_currency', currency);
  }, [currency]);

  const switchCurrency = () => {
    setCurrency(prev => prev === 'USD' ? 'INR' : 'USD');
  };

  const formatPrice = (price) => {
    if (currency === 'USD') {
      return `$${price.toLocaleString()}`;
    } else {
      return `₹${(price * USD_TO_INR).toLocaleString()}`;
    }
  };

  const convertPrice = (price) => {
    if (currency === 'USD') {
      return price;
    } else {
      return price * USD_TO_INR;
    }
  };

  return (
    <CurrencyContext.Provider 
      value={{ 
        currency, 
        switchCurrency, 
        formatPrice, 
        convertPrice,
        USD_TO_INR 
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
