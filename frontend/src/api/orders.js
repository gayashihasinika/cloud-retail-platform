// src/api/orders.js  (or wherever this function lives)

import axios from 'axios';

const ORDER_API_URL = import.meta.env.VITE_ORDER_API_URL;

export const buyNow = async (productId) => {
  const token = localStorage.getItem('token');

  const response = await axios.post(
    `${ORDER_API_URL}/api/orders/buy-now`,   
    {
      product_id: productId,
      quantity: 1,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// Send entire cart to backend for order creation
export const createOrderFromCart = async (orderData) => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Please login to place order');

  const response = await axios.post(
    `${ORDER_API_URL}/api/orders/from-cart`,
    orderData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data;
};

// Fetch orders for the logged-in user
export const getMyOrders = async () => {
  const token = localStorage.getItem('token');

  const response = await axios.get(
    `${ORDER_API_URL}/api/orders/my`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};


// Fetch all orders (admin)
export const getAllOrders = async () => {
  const token = localStorage.getItem('token');
  const response = await axios.get(
    `${ORDER_API_URL}/api/orders/all`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
}



