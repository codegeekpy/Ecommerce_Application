import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('aura_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    localStorage.setItem('aura_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, qty = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product === product._id);
      if (existing) {
        const newQty = Math.min(existing.qty + qty, product.stock || 99);
        addToast(`Updated quantity for "${product.name}" (${newQty} in bag)`, 'success');
        return prev.map((item) =>
          item.product === product._id ? { ...item, qty: newQty } : item
        );
      } else {
        addToast(`Added "${product.name}" to your bag`, 'success');
        return [
          ...prev,
          {
            product: product._id,
            name: product.name,
            price: product.price,
            originalPrice: product.originalPrice,
            image: product.image,
            category: product.category,
            stock: product.stock,
            qty: Math.min(qty, product.stock || 1),
          },
        ];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => {
      const item = prev.find((i) => i.product === productId);
      if (item) addToast(`Removed "${item.name}" from your bag`, 'info');
      return prev.filter((i) => i.product !== productId);
    });
  };

  const updateQty = (productId, qty) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.product === productId) {
          const validQty = Math.min(qty, item.stock || 99);
          return { ...item, qty: validQty };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shipping = subtotal > 9999 || subtotal === 0 ? 0 : 499;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shipping + tax;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        cartCount,
        subtotal: Math.round(subtotal * 100) / 100,
        shipping,
        tax: Math.round(tax * 100) / 100,
        total: Math.round(total * 100) / 100,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
