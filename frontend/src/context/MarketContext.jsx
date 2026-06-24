import React, { createContext, useContext, useState, useEffect } from 'react';

const MarketContext = createContext();

export function MarketProvider({ children }) {
  // For development/demonstration, we allow manual overriding of the market status.
  // We save this to localStorage so it persists when navigating back to the storefront.
  const [forceClosed, setForceClosed] = useState(() => {
    return localStorage.getItem('voltcommerce_market_closed') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('voltcommerce_market_closed', forceClosed);
  }, [forceClosed]);

  // Listen for changes from other tabs to sync in real-time
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'voltcommerce_market_closed') {
        setForceClosed(e.newValue === 'true');
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const [timeLeftStr, setTimeLeftStr] = useState('');
  
  const isMarketOpen = !forceClosed;

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      let target;
      
      if (isMarketOpen) {
        // Countdown to Delivery Cutoff (e.g., Midnight today)
        target = new Date(now);
        target.setHours(24, 0, 0, 0); 
      } else {
        // Countdown to Market Open (e.g., 8:00 AM tomorrow)
        target = new Date(now);
        // If it's currently past midnight but before 8am, it opens today. Else tomorrow.
        if (now.getHours() < 8) {
           target.setHours(8, 0, 0, 0);
        } else {
           target.setHours(24 + 8, 0, 0, 0); 
        }
      }
      
      const diff = target - now;
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / 1000 / 60) % 60);
      const s = Math.floor((diff / 1000) % 60);
      
      setTimeLeftStr(`${h.toString().padStart(2, '0')}h ${m.toString().padStart(2, '0')}m ${s.toString().padStart(2, '0')}s`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [isMarketOpen]);

  const toggleMarketStatus = () => setForceClosed(prev => !prev);

  return (
    <MarketContext.Provider value={{ isMarketOpen, toggleMarketStatus, timeLeftStr }}>
      {children}
    </MarketContext.Provider>
  );
}

export function useMarket() {
  return useContext(MarketContext);
}
