// frontend/src/components/DashboardPage.js
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
        const response = await axios.get('http://localhost:5000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data.user);
      } catch (error) {
        console.error('Error fetching user data:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        {user && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold">Welcome, {user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
            </div>
            {user.loanDetails && (
              <div className="border-t pt-4">
                <h3 className="text-lg font-medium mb-2">Loan Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600">Category</p>
                    <p>{user.loanDetails.category}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Subcategory</p>
                    <p>{user.loanDetails.subcategory}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">EMI</p>
                    <p>PKR {user.loanDetails.emi}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
