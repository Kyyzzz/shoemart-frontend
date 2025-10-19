import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import api from '../services/api';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load cart when user logs in
  useEffect(() => {
    if (isAuthenticated) {
      loadCartFromDB();
    } else {
      // Load guest cart from sessionStorage
      const guestCart = JSON.parse(sessionStorage.getItem('cart_guest') || '[]');
      setCart(guestCart);
    }
  }, [isAuthenticated]);

  // Save guest cart to sessionStorage
  useEffect(() => {
    if (!isAuthenticated) {
      sessionStorage.setItem('cart_guest', JSON.stringify(cart));
    }
  }, [cart, isAuthenticated]);

  const loadCartFromDB = async () => {
    try {
      setLoading(true);
      const response = await api.get('/cart');
      const dbCart = response.data.data.map(item => ({
        product: item.product,
        size: item.size,
        quantity: item.quantity,
      }));
      setCart(dbCart);
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product, size, quantity = 1) => {
    if (isAuthenticated) {
      // Add to database
      try {
        const response = await api.post('/cart/add', {
          productId: product._id,
          size,
          quantity,
        });
        const dbCart = response.data.data.map(item => ({
          product: item.product,
          size: item.size,
          quantity: item.quantity,
        }));
        setCart(dbCart);
      } catch (error) {
        console.error('Error adding to cart:', error);
      }
    } else {
      // Add to guest cart (sessionStorage)
      setCart((prevCart) => {
        const existingItemIndex = prevCart.findIndex(
          (item) => item.product._id === product._id && item.size === size
        );

        if (existingItemIndex > -1) {
          const updatedCart = [...prevCart];
          updatedCart[existingItemIndex].quantity += quantity;
          return updatedCart;
        } else {
          return [...prevCart, { product, size, quantity }];
        }
      });
    }
  };

  const removeFromCart = async (productId, size) => {
    if (isAuthenticated) {
      try {
        const response = await api.delete('/cart/remove', {
          data: { productId, size },
        });
        const dbCart = response.data.data.map(item => ({
          product: item.product,
          size: item.size,
          quantity: item.quantity,
        }));
        setCart(dbCart);
      } catch (error) {
        console.error('Error removing from cart:', error);
      }
    } else {
      setCart((prevCart) =>
        prevCart.filter(
          (item) => !(item.product._id === productId && item.size === size)
        )
      );
    }
  };

  const updateQuantity = async (productId, size, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId, size);
      return;
    }

    if (isAuthenticated) {
      try {
        const response = await api.put('/cart/update', {
          productId,
          size,
          quantity,
        });
        const dbCart = response.data.data.map(item => ({
          product: item.product,
          size: item.size,
          quantity: item.quantity,
        }));
        setCart(dbCart);
      } catch (error) {
        console.error('Error updating cart:', error);
      }
    } else {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.product._id === productId && item.size === size
            ? { ...item, quantity }
            : item
        )
      );
    }
  };

  const clearCart = async () => {
    if (isAuthenticated) {
      try {
        await api.delete('/cart/clear');
        setCart([]);
      } catch (error) {
        console.error('Error clearing cart:', error);
      }
    } else {
      setCart([]);
      sessionStorage.removeItem('cart_guest');
    }
  };

  const getCartTotal = () => {
    return cart.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    cart,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};