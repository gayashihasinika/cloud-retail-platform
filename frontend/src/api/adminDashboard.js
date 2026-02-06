import axios from 'axios';
// frontend/src/api/adminDashboard.js

const API_URL = import.meta.env.VITE_AUTH_API_URL;

export const getAdminDashboard = async () => {
  const token = localStorage.getItem('token');

  const response = await axios.get(
    `${API_URL}/api/admin/dashboard`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    }
  );

  return response.data;
};
