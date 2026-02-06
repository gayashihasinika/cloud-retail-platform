import axios from 'axios';
// frontend/src/api/products.js
//const PRODUCT_API_URL = 'http://127.0.0.1:8001'; // product-service

const PRODUCT_API_URL = import.meta.env.VITE_PRODUCT_API_URL;

export const getProducts = async () => {
  const token = localStorage.getItem('token'); // or wherever you store it

  const response = await axios.get(
    `${PRODUCT_API_URL}/api/products`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    }
  );

  return response.data;
};
