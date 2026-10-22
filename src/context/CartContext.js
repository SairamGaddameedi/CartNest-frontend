import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI } from '../api/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], totalPrice: 0, totalItems: 0 });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCart({ items: [], totalPrice: 0, totalItems: 0 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await cartAPI.getCart();
      setCart(response.data);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    const response = await cartAPI.addToCart(productId, quantity);
    setCart(response.data);
    return response.data;
  };

  const updateItem = async (itemId, quantity) => {
    const response = await cartAPI.updateItem(itemId, quantity);
    setCart(response.data);
  };

  const removeItem = async (itemId) => {
    const response = await cartAPI.removeItem(itemId);
    setCart(response.data);
  };

  const clearCart = async () => {
    await cartAPI.clearCart();
    setCart({ items: [], totalPrice: 0, totalItems: 0 });
  };

  const cartCount = cart?.totalItems || cart?.items?.length || 0;

  return (
    <CartContext.Provider value={{ cart, loading, fetchCart, addToCart, updateItem, removeItem, clearCart, cartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
