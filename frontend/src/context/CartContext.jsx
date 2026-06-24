import React, { createContext, useContext, useState } from 'react';
import { toast } from 'sonner';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  const addToCart = (item, quantity = 1) => {
    const newItems = Array.from({ length: quantity }, () => ({
      ...item,
      cartId: Math.random().toString(36).substr(2, 9)
    }));
    setCart(prev => [...prev, ...newItems]);
    toast.success(`${quantity > 1 ? quantity + 'x ' : ''}${item.name} added to cart`);
  };

  const removeFromCart = (cartId) => {
    setCart(prev => prev.filter(item => item.cartId !== cartId));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.currentPrice, 0).toFixed(2);
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, calculateTotal, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
