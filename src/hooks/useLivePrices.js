import { useState, useEffect } from 'react';
import { mockProducts, generateNextPrice } from '@/lib/mockData';

export function useLivePrices() {
  const [products, setProducts] = useState(mockProducts);

  useEffect(() => {
    const interval = setInterval(() => {
      setProducts(currentProducts => 
        currentProducts.map(p => {
          if (p.volatility === 0) return p;
          
          const newPrice = generateNextPrice(p.history[p.history.length - 1], p.volatility);
          const newHistory = [...p.history, newPrice].slice(-20); // keep last 20 data points
          
          return {
            ...p,
            history: newHistory
          };
        })
      );
    }, 5000); // price updates every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return products;
}
