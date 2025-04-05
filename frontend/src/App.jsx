// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoanCalculator from './components/LoanCalculator';
import Navbar from './components/Navbar';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ChangePasswordPage from './pages/ChangePasswordPage';

function App() {
  const isAuthenticated = () => {
    return !!localStorage.getItem('token');
  };

  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated()) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<LoanCalculator />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/change-password" element={<ChangePasswordPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App