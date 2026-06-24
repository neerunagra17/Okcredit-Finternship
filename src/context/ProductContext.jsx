import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockProducts } from '@/lib/mockData';

const ProductContext = createContext();

export function ProductProvider({ children }) {
  // Initialize state from localStorage or fallback to our default mock data
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('voltcommerce_products');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse local storage products", e);
        return mockProducts;
      }
    }
    return mockProducts;
  });

  // Whenever products change, save them back to localStorage
  useEffect(() => {
    localStorage.setItem('voltcommerce_products', JSON.stringify(products));
  }, [products]);

  // Listen for changes from other tabs to sync in real-time
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'voltcommerce_products' && e.newValue) {
        try {
          setProducts(JSON.parse(e.newValue));
        } catch (err) {
          console.error("Failed to sync products across tabs", err);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const addProduct = (newProduct) => {
    const product = {
      ...newProduct,
      id: Math.random().toString(36).substr(2, 9),
      // Mock history for chart if volatile
      history: [newProduct.basePrice, newProduct.basePrice * 1.02, newProduct.basePrice * 0.99, newProduct.basePrice * 1.05, newProduct.basePrice],
      rating: 5.0, // Default for new products
      reviews: 0,
    };
    setProducts(prev => [product, ...prev]);
  };

  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, deleteProduct }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  return useContext(ProductContext);
}
