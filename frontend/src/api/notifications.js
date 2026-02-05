import axios from 'axios';

const API_URL = 'http://127.0.0.1:8003'; // Notification service

export const notify = async (notification) => {
  const response = await axios.post(`${API_URL}/api/notify`, notification);
  return response.data;
};
