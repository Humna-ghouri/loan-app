import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import LoanCalculator from './pages/LoanCalculator';
import LoanRequestForm from './pages/LoanRequestForm'; // Import LoanRequest
import SlipGeneration from './pages/SlipGeneration';

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
      <Routes>
        <Route path="/signin" element={<SignIn setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/signup" element={<SignUp setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/loan-calculator" element={<LoanCalculator />} />
        <Route path="/loan-request" element={<LoanRequestForm />} /> {/* Add this line */}
        <Route path="/slip-generation/:loanRequestId" element={<SlipGeneration />} />
        <Route path="/" element={<p>Welcome to LoanApp!</p>} />
      </Routes>
    </Router>
  );
}

export default App;