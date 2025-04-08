import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="text-xl font-bold text-gray-800">
              LoanApp
            </Link>
          </div>
          <div className="flex space-x-4">
            {!isLoggedIn ? (
              <>
                <Link to="/signin" className="px-3 py-2 text-gray-700 hover:text-blue-600">
                  Sign In
                </Link>
                <Link to="/signup" className="px-3 py-2 text-white bg-blue-600 rounded hover:bg-blue-700">
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <Link to="/loan-calculator" className="px-3 py-2 text-gray-700 hover:text-blue-600">
                  Calculator
                </Link>
                <button onClick={handleLogout} className="px-3 py-2 text-gray-700 hover:text-blue-600">
                  Sign Out
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;