import axios from 'axios';
// frontend/src/api/adminDashboard.js

export const getAdminDashboard = async () => {
  const token = localStorage.getItem('token');

  const response = await axios.get(
    'http://127.0.0.1:8000/api/admin/dashboard',
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    }
  );

  return response.data;
};
