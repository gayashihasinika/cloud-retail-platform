import axios from 'axios';

// Base URL for your Auth service
const API_URL = 'http://127.0.0.1:8000/api';

// Function to login a user
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    // Throw a more descriptive error
    throw error.response?.data || { message: error.message };
  }
};

// Function to register a new user
export const register = async (name, email, password, password_confirmation) => {
  try {
    const response = await axios.post(`${API_URL}/register`, {
      name,
      email,
      password,
      password_confirmation,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

// Optional: You can add logout and getProfile functions later
