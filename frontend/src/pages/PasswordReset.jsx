import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ChangePasswordForm({ tempToken }) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('/api/auth/change-password', {
        tempToken,
        newPassword
      });
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Password change failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Set New Password</h2>
      {error && <div className="mb-4 text-red-500">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">New Password</label>
          <input
            type="password"
            className="w-full p-2 border rounded"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Confirm Password</label>
          <input
            type="password"
            className="w-full p-2 border rounded"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Change Password'}
        </button>
      </form>
    </div>
  );
}