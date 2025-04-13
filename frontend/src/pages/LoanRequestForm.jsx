import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const LoanRequestForm = () => {
    const [formData, setFormData] = useState({
        guarantor1Name: '',
        guarantor1Email: '',
        guarantor1Location: '',
        guarantor1CNIC: '',
        guarantor2Name: '',
        guarantor2Email: '',
        guarantor2Location: '',
        guarantor2CNIC: '',
        address: '',
        phoneNumber: '',
        appointmentDate: '', // ADDED THIS MISSING FIELD
        userPhoto: null,
        userPhotoUrl: '',
    });

    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    const loanTerms = {
        amount: 50000,
        tenure: 12,
        interestRate: 10,
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleImageClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData((prev) => ({
                ...prev,
                userPhoto: file,
                userPhotoUrl: URL.createObjectURL(file),
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            const formDataToSend = new FormData();

            // Append all text fields
            Object.keys(formData).forEach(key => {
                if (key !== 'userPhoto' && key !== 'userPhotoUrl') {
                    formDataToSend.append(key, formData[key]);
                }
            });

            // Append the file
            if (formData.userPhoto) {
                formDataToSend.append('userPhoto', formData.userPhoto);
            }

            const response = await axios.post(
                'http://localhost:5000/api/loans/submit',
                formDataToSend,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    withCredentials: true,
                }
            );

            await Swal.fire({
                title: 'Success!',
                text: 'Loan request submitted successfully',
                icon: 'success',
                confirmButtonText: 'OK'
            });

            navigate(response.data.redirectUrl, {
                state: {
                    loanId: response.data.loanId,
                    loanDetails: loanTerms,
                },
            });
        } catch (err) {
            let errorMsg = 'Failed to submit loan request';
            if (err.response?.data?.message) {
                errorMsg = err.response.data.message;
            }
            setError(errorMsg);

            await Swal.fire({
                title: 'Error!',
                text: errorMsg,
                icon: 'error',
                confirmButtonText: 'OK'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6 text-center">Loan Request Form</h1>

            {error && (
                <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">{error}</div>
            )}

            <div className="mb-4 p-4 bg-gray-100 rounded">
                <h2 className="text-lg font-semibold mb-2">Loan Details</h2>
                <p><strong>Loan Amount:</strong> {loanTerms.amount} PKR</p>
                <p><strong>Loan Tenure:</strong> {loanTerms.tenure} months</p>
                <p><strong>Interest Rate:</strong> {loanTerms.interestRate}%</p>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                {/* Guarantor 1 Details */}
                <div className="border p-4 rounded">
                    <h2 className="text-lg font-semibold mb-2">Guarantor 1</h2>
                    <label className="block mb-1">Name</label>
                    <input
                        type="text"
                        name="guarantor1Name"
                        value={formData.guarantor1Name}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    />
                    <label className="block mb-1">Email</label>
                    <input
                        type="email"
                        name="guarantor1Email"
                        value={formData.guarantor1Email}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    />
                    <label className="block mb-1">Location</label>
                    <input
                        type="text"
                        name="guarantor1Location"
                        value={formData.guarantor1Location}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    />
                    <label className="block mb-1">CNIC</label>
                    <input
                        type="text"
                        name="guarantor1CNIC"
                        value={formData.guarantor1CNIC}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    />
                </div>

                {/* Guarantor 2 Details */}
                <div className="border p-4 rounded">
                    <h2 className="text-lg font-semibold mb-2">Guarantor 2</h2>
                    <label className="block mb-1">Name</label>
                    <input
                        type="text"
                        name="guarantor2Name"
                        value={formData.guarantor2Name}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                    <label className="block mb-1">Email</label>
                    <input
                        type="email"
                        name="guarantor2Email"
                        value={formData.guarantor2Email}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                    <label className="block mb-1">Location</label>
                    <input
                        type="text"
                        name="guarantor2Location"
                        value={formData.guarantor2Location}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                    <label className="block mb-1">CNIC</label>
                    <input
                        type="text"
                        name="guarantor2CNIC"
                        value={formData.guarantor2CNIC}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>

                {/* Personal Information */}
                <div className="col-span-2 border p-4 rounded">
                    <label className="block mb-1">Address</label>
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    />
                    <label className="block mb-1">Phone Number</label>
                    <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    />
                    {/* ADDED APPOINTMENT DATE FIELD */}
                    <label className="block mb-1">Appointment Date</label>
                    <input
                        type="date"
                        name="appointmentDate"
                        value={formData.appointmentDate}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                        min={new Date().toISOString().split('T')[0]} // Set min date to today
                    />
                </div>

                {/* User Photo Upload */}
                <div className="col-span-2 border p-4 rounded">
                    <label className="block mb-1">User Photo</label>
                    <div
                        onClick={handleImageClick}
                        className="w-[150px] h-[150px] border border-dashed border-gray-400 flex justify-center items-center cursor-pointer mb-2.5"
                    >
                        {formData.userPhotoUrl ? (
                            <img
                                src={formData.userPhotoUrl}
                                alt="User Preview"
                                className="max-w-full max-h-full"
                            />
                        ) : (
                            <span>Choose Image</span>
                        )}
                    </div>
                    <input
                        type="file"
                        name="userPhoto"
                        onChange={handleFileChange}
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        required
                    />
                </div>

                <div className="col-span-2">
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-blue-400"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Request'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default LoanRequestForm;