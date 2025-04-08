import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const SlipGeneration = () => {
  const [loanDetails, setLoanDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const location = useLocation();
  const loanId = location.state?.loanId;

  useEffect(() => {
    const fetchLoanDetails = async () => {
      try {
        if (!loanId) {
          throw new Error('No loan ID provided');
        }
        const response = await axios.get(`/api/loan/details/${loanId}`);
        setLoanDetails(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch loan details');
      } finally {
        setLoading(false);
      }
    };

    fetchLoanDetails();
  }, [loanId]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Loan Application Slip</h1>
      
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Application Details</h2>
        <p><strong>Application ID:</strong> {loanDetails?._id}</p>
        <p><strong>Date:</strong> {new Date(loanDetails?.createdAt).toLocaleDateString()}</p>
        <p><strong>Status:</strong> {loanDetails?.status || 'Pending'}</p>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <h2 className="text-lg font-semibold mb-2">Loan Information</h2>
          <p><strong>Amount:</strong> {loanDetails?.amount} PKR</p>
          <p><strong>Tenure:</strong> {loanDetails?.tenure} months</p>
          <p><strong>Interest Rate:</strong> {loanDetails?.interestRate}%</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Applicant Information</h2>
          <p><strong>Address:</strong> {loanDetails?.address}</p>
          <p><strong>Phone:</strong> {loanDetails?.phoneNumber}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <h2 className="text-lg font-semibold mb-2">Guarantor 1</h2>
          <p><strong>Name:</strong> {loanDetails?.guarantor1Name}</p>
          <p><strong>Email:</strong> {loanDetails?.guarantor1Email}</p>
          <p><strong>CNIC:</strong> {loanDetails?.guarantor1CNIC}</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Guarantor 2</h2>
          <p><strong>Name:</strong> {loanDetails?.guarantor2Name}</p>
          <p><strong>Email:</strong> {loanDetails?.guarantor2Email}</p>
          <p><strong>CNIC:</strong> {loanDetails?.guarantor2CNIC}</p>
        </div>
      </div>

      {loanDetails?.userPhoto && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Applicant Photo</h2>
          <img 
            src={loanDetails.userPhoto} 
            alt="Applicant" 
            className="w-32 h-32 object-cover border rounded"
          />
        </div>
      )}

      <div className="mt-6">
        <button 
          onClick={handlePrint}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Print Slip
        </button>
      </div>
    </div>
  );
};

export default SlipGeneration;