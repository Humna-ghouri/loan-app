import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="text-center mt-10">
      <h1 className="text-3xl font-bold mb-4">Welcome to LoanApp</h1>
      <p className="mb-6">Calculate your loan EMI with our easy-to-use calculator</p>
      <div className="flex justify-center space-x-4">
        <Link 
          to="/signup" 
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Sign Up
        </Link>
        <Link 
          to="/signin" 
          className="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default Home;