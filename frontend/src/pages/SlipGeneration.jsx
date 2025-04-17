import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaPrint } from 'react-icons/fa';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const SlipGeneration = () => {
    const { loanRequestId } = useParams();
    const navigate = useNavigate();
    const [loanDetails, setLoanDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchLoanDetails = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return navigate('/login');

            const response = await axios.get(
                `${apiUrl}/api/loans/details/${loanRequestId}`,
                {
                    headers: { 
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.success) {
                setLoanDetails(response.data.data);
            } else {
                setError(response.data.message || 'Loan details not available');
            }
        } catch (err) {
            console.error('Fetch error:', err);
            setError(err.response?.data?.message || 'Failed to load details');
            if (err.response?.status === 401) {
                localStorage.removeItem('token');
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchLoanDetails(); }, [loanRequestId, navigate]);

    const formatDate = (dateString) => {
        if (!dateString) return 'Not specified';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    if (loading) return <div className="text-center p-8">Loading loan details...</div>;
    if (error) return <div className="text-red-500 text-center p-8">{error}</div>;
    if (!loanDetails) return <div className="text-center p-8">No loan details found</div>;

    return (
        <div className="max-w-4xl mx-auto p-6 print:p-0">
            <div className="bg-white p-8 rounded-lg shadow-md print:shadow-none">
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                    <h1 className="text-2xl font-bold">Loan Application Slip</h1>
                    <div className="text-right">
                        <p className="font-semibold">Token #: {loanDetails.tokenNumber}</p>
                        <p>Status: <span className="font-medium capitalize">{loanDetails.status}</span></p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                        <h2 className="text-lg font-semibold mb-3 border-b pb-2">Applicant Details</h2>
                        <p><span className="font-medium">Name:</span> {loanDetails.applicantName}</p>
                        <p><span className="font-medium">Email:</span> {loanDetails.applicantEmail}</p>
                        <p><span className="font-medium">CNIC:</span> {loanDetails.applicantCNIC}</p>
                        <p><span className="font-medium">Phone:</span> {loanDetails.phoneNumber}</p>
                        <p><span className="font-medium">Address:</span> {loanDetails.address}, {loanDetails.city}</p>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold mb-3 border-b pb-2">Loan Details</h2>
                        <p><span className="font-medium">Amount:</span> {loanDetails.amount} PKR</p>
                        <p><span className="font-medium">Tenure:</span> {loanDetails.tenure} months</p>
                        <p><span className="font-medium">Interest Rate:</span> {loanDetails.interestRate}%</p>
                        <p><span className="font-medium">Appointment:</span> {formatDate(loanDetails.appointmentDate)}</p>
                    </div>
                </div>

                {loanDetails.qrCode && (
                    <div className="flex justify-center mb-6">
                        <img src={loanDetails.qrCode} alt="QR Code" className="w-32 h-32" />
                    </div>
                )}

                {loanDetails.userPhoto && (
                    <div className="flex justify-center mb-6">
                        <img 
                            src={loanDetails.userPhoto} 
                            alt="Applicant" 
                            className="w-32 h-32 object-cover rounded-full border-2 border-gray-200"
                        />
                    </div>
                )}

                <div className="mt-8 text-center">
                    <button
                        onClick={() => window.print()}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center mx-auto"
                    >
                        <FaPrint className="mr-2" />
                        Print Slip
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SlipGeneration;