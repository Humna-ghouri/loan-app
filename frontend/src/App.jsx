import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import LoanCalculator from './pages/LoanCalculator';
import LoanRequestForm from './pages/LoanRequestForm';
import SlipGeneration from './pages/SlipGeneration';
import Home from './pages/Home'; // Import the Home component
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Routes>
        <Route path="/" element={<Home />} /> {/* Replaced welcome text with Home component */}
        <Route path="/signin" element={<SignIn setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/signup" element={<SignUp setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/loan-calculator" element={<LoanCalculator />} />
        <Route path="/loan-request" element={<LoanRequestForm />} />
        <Route path="/slip-generation/:loanRequestId" element={<SlipGeneration />} />
      </Routes>
    </Router>
  );
}

export default App;