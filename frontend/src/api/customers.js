// frontend/src/api/customers.js
import axios from 'axios';

export const getAllCustomers = async () => {
  const token = localStorage.getItem('token');

  const response = await axios.get(
    'http://127.0.0.1:8000/api/admin/customers',
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return response.data;
};

export const deactivateCustomer = async (id) => {
  const token = localStorage.getItem('token');

  const response = await axios.patch(
    `http://127.0.0.1:8000/api/admin/customers/${id}/deactivate`,
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
    `http://127.0.0.1:8000/api/admin/customers/${id}/activate`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
    return response.data;
};

