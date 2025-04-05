import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      if (response.data.mustChangePassword) {
        navigate(`/change-password?tempToken=${response.data.tempToken}`);
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: error.response?.data?.message || 'Invalid credentials',
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 p-2 border rounded w-full"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 p-2 border rounded w-full"
              required
            />
          </div>
          <button type="submit" className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}