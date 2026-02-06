// frontend/src/api/customers.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_AUTH_API_URL;

export const getAllCustomers = async () => {
  const token = localStorage.getItem('token');

  const response = await axios.get(
    `${API_URL}/api/admin/customers`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return response.data;
};

export const deactivateCustomer = async (id) => {
  const token = localStorage.getItem('token');

  const response = await axios.patch(
    `${API_URL}/api/admin/customers/${id}/deactivate`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return response.data;
};

export const activateCustomer = async (id) => {
  const token = localStorage.getItem('token');
    const response = await axios.patch(
    `${API_URL}/api/admin/customers/${id}/activate`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
    return response.data;
};

