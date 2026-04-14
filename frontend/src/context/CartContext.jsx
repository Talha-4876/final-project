import React, { createContext, useState, useEffect } from "react";

// Named export for context
export const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);

  // Load cart and user from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) setCartItems(JSON.parse(stored));

    const token = localStorage.getItem("userToken");
    if (token) {
      try {
        const base64Payload = token.split(".")[1];
        if (base64Payload) {
          const payload = JSON.parse(atob(base64Payload));
          setUser(payload);
        }
      } catch (err) {
        console.warn("Invalid token, clearing user state");
        setUser(null);
      }
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item._id === product._id);
      if (existing) {
        return prev.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item._id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => setCartItems([]);

  const getQuantity = (id) => {
    const item = cartItems.find((i) => i._id === id);
    return item ? item.quantity : 0;
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, clearCart, getQuantity, user }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Default export for Provider (Vite Fast Refresh friendly)
export default CartProvider;