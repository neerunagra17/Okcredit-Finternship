import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchAuthSession } from 'aws-amplify/auth';

const ProductContext = createContext();

const API_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}api/products` 
  : 'http://localhost:5001/api/products';

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      console.error("Error loading products from database", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addProduct = async (newProduct) => {
    const productData = {
      ...newProduct,
      id: Math.random().toString(36).substr(2, 9),
      history: [newProduct.basePrice, newProduct.basePrice * 1.02, newProduct.basePrice * 0.99, newProduct.basePrice * 1.05, newProduct.basePrice],
      rating: 5.0, 
      reviews: 0,
    };

    try {
      const session = await fetchAuthSession();
      const token = session.tokens?.idToken?.toString();
      
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productData)
      });
      
      if (!response.ok) throw new Error('Failed to save product to database');
      const savedProduct = await response.json();
      
      setProducts(prev => [savedProduct, ...prev]);
    } catch (err) {
      console.error("Error saving product", err);
    }
  };

  const deleteProduct = async (id) => {
    try {
      const session = await fetchAuthSession();
      const token = session.tokens?.idToken?.toString();

      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to delete product from database');
      
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error("Error deleting product", err);
    }
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, deleteProduct, loading }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  return useContext(ProductContext);
}
