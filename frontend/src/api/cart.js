// src/api/cart.js

// Get current cart from localStorage
export const getCart = () => {
  const cart = localStorage.getItem('cart');
  return cart ? JSON.parse(cart) : [];
};

// Add product to cart
export const addToCart = (product) => {
  const cart = getCart();

  // Check if product already exists
  const existingItem = cart.find(item => item.id === product.id);

  if (existingItem) {
    // Increase quantity
    existingItem.quantity += 1;
  } else {
    // Add new item with quantity 1
    cart.push({ ...product, quantity: 1 });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  return cart;
};

// Optional: Remove item, update quantity, clear cart, etc.
export const removeFromCart = (productId) => {
  const cart = getCart().filter(item => item.id !== productId);
  localStorage.setItem('cart', JSON.stringify(cart));
  return cart;
};

export const updateCartQuantity = (productId, quantity) => {
  const cart = getCart().map(item =>
    item.id === productId ? { ...item, quantity } : item
  );
  localStorage.setItem('cart', JSON.stringify(cart));
  return cart;
};

export const clearCart = () => {
  localStorage.removeItem('cart');
};