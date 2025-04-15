import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaDownload } from 'react-icons/fa';

const SlipGeneration = () => {
  const { loanRequestId } = useParams();
  const [loanDetails, setLoanDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLoanDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/loans/details/${loanRequestId}`,
          { 
            withCredentials: true,
            validateStatus: (status) => status < 500
          }
        );
        
        if (response.data.success) {
          setLoanDetails(response.data.data);
        } else {
          setError(response.data.message || 'Loan details not found');
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.response?.data?.message || 'Failed to fetch loan details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchLoanDetails();
  }, [loanRequestId]);

  const downloadSlip = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/pdf/${loanRequestId}`,
        {
          responseType: 'blob',
          withCredentials: true,
          headers: {
            'Accept': 'application/pdf' // Explicitly ask for PDF
          }
        }
      );
  
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download', 
        `loan-slip-${loanDetails?.tokenNumber || loanRequestId}.pdf`
      );
      document.body.appendChild(link);
      link.click();
      
      // Clean up after 1 second
      setTimeout(() => {
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 1000);
  
    } catch (error) {
      console.error('Download error:', error);
      if (error.response?.data) {
        // If server sent error details
        const errorMsg = typeof error.response.data === 'object' 
          ? error.response.data.message 
          : error.response.data;
        setError(errorMsg || 'PDF download failed');
      } else {
        setError('Failed to download PDF. Please try again.');
      }
    }
  };
  if (loading) return <div className="text-center p-8">Loading slip details...</div>;
  if (error) return <div className="text-red-500 text-center p-8">{error}</div>;
  if (!loanDetails) return <div className="text-center p-8">No loan details found</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white p-8 rounded-lg shadow-md">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h1 className="text-2xl font-bold">Loan Application Slip</h1>
          <div className="text-right">
            <p className="font-semibold">Token Number:</p>
            <p className="text-lg">{loanDetails.tokenNumber || loanDetails._id || 'N/A'}</p>
          </div>
        </div>

        {/* QR Code Section */}
        {loanDetails.qrCode && (
          <div className="flex justify-end mb-6">
            <img 
              src={loanDetails.qrCode} 
              alt="QR Code" 
              className="w-24 h-24"
            />
          </div>
        )}

        {/* Appointment Details */}
        <div className="mb-6 p-4 bg-gray-100 rounded">
          <h2 className="text-lg font-semibold mb-2">Appointment Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p><strong>Date:</strong> {loanDetails.formattedAppointmentDate || 'Not specified'}</p>
              <p><strong>Time:</strong> {loanDetails.formattedAppointmentTime || '10:00 AM - 3:00 PM'}</p>
            </div>
            <div>
              <p><strong>Location:</strong></p>
              <p>Main Branch, 123 Finance Street</p>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h2 className="text-lg font-semibold mb-2">Personal Information</h2>
            <p><strong>Address:</strong> {loanDetails.address}</p>
            <p><strong>Phone:</strong> {loanDetails.phoneNumber}</p>
          </div>
          
          {loanDetails.userPhoto && (
            <div className="flex justify-center md:justify-end">
              <div className="text-center">
                <p className="font-semibold mb-2">User Photo</p>
                <img 
                  src={loanDetails.userPhoto} 
                  alt="User" 
                  className="w-32 h-32 object-cover rounded mx-auto"
                />
              </div>
            </div>
          )}
        </div>

        {/* Guarantors Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="border p-4 rounded">
            <h3 className="font-semibold mb-2">Guarantor 1</h3>
            <p><strong>Name:</strong> {loanDetails.guarantor1Name}</p>
            <p><strong>Email:</strong> {loanDetails.guarantor1Email}</p>
            <p><strong>CNIC:</strong> {loanDetails.guarantor1CNIC}</p>
            <p><strong>Location:</strong> {loanDetails.guarantor1Location}</p>
          </div>
          <div className="border p-4 rounded">
            <h3 className="font-semibold mb-2">Guarantor 2</h3>
            <p><strong>Name:</strong> {loanDetails.guarantor2Name}</p>
            <p><strong>Email:</strong> {loanDetails.guarantor2Email}</p>
            <p><strong>CNIC:</strong> {loanDetails.guarantor2CNIC}</p>
            <p><strong>Location:</strong> {loanDetails.guarantor2Location}</p>
          </div>
        </div>

        {/* Loan Terms */}
        <div className="p-4 bg-gray-100 rounded">
          <h2 className="text-lg font-semibold mb-2">Loan Terms</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p><strong>Amount:</strong></p>
              <p>{loanDetails.amount} PKR</p>
            </div>
            <div>
              <p><strong>Tenure:</strong></p>
              <p>{loanDetails.tenure} months</p>
            </div>
            <div>
              <p><strong>Interest Rate:</strong></p>
              <p>{loanDetails.interestRate}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Download Button */}
      <div className="mt-6 text-center">
        <button
          onClick={downloadSlip}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 flex items-center justify-center mx-auto"
        >
          <FaDownload className="mr-2" />
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default SlipGeneration;