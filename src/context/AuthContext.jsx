import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await axios.post(import.meta.env.VITE_API_URL + '/api/auth/login', { email, password });
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      return data;
    } catch (error) {
      if (error.response?.data?.emailUnverified) {
        throw { message: error.response.data.message, emailUnverified: true, email: error.response.data.email };
      }
      throw error.response?.data?.message || 'Login failed';
    }
  };

  const register = async (userData) => {
    try {
      const { data } = await axios.post(import.meta.env.VITE_API_URL + '/api/auth/register', userData);
      // Do NOT set user or localStorage here; require OTP verification first
      return data;
    } catch (error) {
      throw error.response?.data?.message || 'Registration failed';
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
  };

  const verifyEmail = async (email, otp) => {
    try {
      const { data } = await axios.post(import.meta.env.VITE_API_URL + '/api/auth/verify-email', { email, otp });
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      return data;
    } catch (error) {
      throw error.response?.data?.message || 'Verification failed';
    }
  };

  const resendOTP = async (email) => {
    try {
      const { data } = await axios.post(import.meta.env.VITE_API_URL + '/api/auth/resend-otp', { email });
      return data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to resend OTP';
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, verifyEmail, resendOTP }}>
      {children}
    </AuthContext.Provider>
  );
};
