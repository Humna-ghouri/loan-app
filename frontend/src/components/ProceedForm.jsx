// // import React, { useState } from 'react';
// // import axios from 'axios';
// // import Swal from 'sweetalert2';

// // export default function ProceedForm({ onClose, loanDetails }) {
// //   const [formData, setFormData] = useState({ name: '', email: '', cnic: '' });
// //   const [isSubmitting, setIsSubmitting] = useState(false);
// //   const [emailError, setEmailError] = useState('');

// //   const validateEmail = (email) => {
// //     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// //     if (!emailRegex.test(email)) {
// //       setEmailError('Invalid email format');
// //       return false;
// //     }
// //     setEmailError('');
// //     return true;
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     if (!validateEmail(formData.email)) return;
// //     setIsSubmitting(true);
// //     try {
// //       const response = await axios.post('http://localhost:5000/api/loans/submit', { name: formData.name, email: formData.email, cnic: formData.cnic, category: loanDetails.category, subcategory: loanDetails.subcategory, emi: loanDetails.emi }, { headers: { 'Content-Type': 'application/json' } });
// //       Swal.fire({
// //         icon: 'success',
// //         title: 'Success!',
// //         html: `<p>Application submitted successfully!</p> ${response.data.tempPassword ? `<p class="text-sm text-gray-500 mt-2">Temporary password: ${response.data.tempPassword}</p>` : '<p class="text-sm text-gray-500 mt-2">Check your email for login credentials</p>'}`,
// //         confirmButtonText: 'OK',
// //       });
// //       onClose();
// //     } catch (error) {
// //       console.error('Submission error:', error);
// //       let errorMessage = error.response?.data?.message || error.message;
// //       if (errorMessage.includes('EAUTH') || errorMessage.includes('credentials')) {
// //         errorMessage = 'Email service configuration error. Contact support.';
// //       }
// //       Swal.fire({ icon: 'error', title: 'Error', html: `<p>${errorMessage}</p><p class="text-sm text-gray-500 mt-2">Please try again or contact support</p>`, confirmButtonText: 'OK' });
// //     } finally {
// //       setIsSubmitting(false);
// //     }
// //   };

// //   return (
// //     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
// //       <div className="bg-white p-6 rounded-lg w-96">
// //         <div className="flex justify-between items-center mb-4">
// //           <h2 className="text-xl font-bold">Loan Application</h2>
// //           <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl" aria-label="Close">
// //             &times;
// //           </button>
// //         </div>
// //         <form onSubmit={handleSubmit}>
// //           <div className="mb-4">
// //             <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
// //             <input type="text" className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
// //           </div>
// //           <div className="mb-4">
// //             <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
// //             <input type="email" className={`w-full p-2 border ${emailError ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500`} value={formData.email} onChange={(e) => { setFormData({ ...formData, email: e.target.value }); setEmailError(''); }} onBlur={() => validateEmail(formData.email)} required />
// //             {emailError && <p className="mt-1 text-sm text-red-600">{emailError}</p>}
// //           </div>
// //           <div className="mb-6">
// //             <label className="block text-sm font-medium text-gray-700 mb-1">CNIC (Without dashes)</label>
// //             <input type="text" placeholder="1234512345671" pattern="[0-9]{13}" className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" value={formData.cnic} onChange={(e) => setFormData({ ...formData, cnic: e.target.value })} required />
// //             <p className="mt-1 text-xs text-gray-500">Format: 1234512345671 (13 digits)</p>
// //           </div>
// //           <button type="submit" disabled={isSubmitting} className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}>
// //             {isSubmitting ? 'Processing...' : 'Submit Application'}
// //           </button>
// //         </form>
// //       </div>
// //     </div>
// //   );
// // }



// // import React, { useState } from 'react';
// // import axios from 'axios';
// // import Swal from 'sweetalert2';

// // export default function ProceedForm({ onClose, loanDetails }) {
// //   const [formData, setFormData] = useState({ name: '', email: '', cnic: '' });
// //   const [isSubmitting, setIsSubmitting] = useState(false);
// //   const [emailError, setEmailError] = useState('');
// //   const [showResetForm, setShowResetForm] = useState(false);
// //   const [resetData, setResetData] = useState({
// //     tempPassword: '', // Initialize with empty string to avoid undefined
// //     newPassword: '',
// //     confirmPassword: ''
// //   });

// //   const validateEmail = (email) => {
// //     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// //     if (!emailRegex.test(email)) {
// //       setEmailError('Invalid email format');
// //       return false;
// //     }
// //     setEmailError('');
// //     return true;
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     if (!validateEmail(formData.email)) return;
// //     setIsSubmitting(true);
// //     try {
// //       const response = await axios.post('http://localhost:5000/api/loans/submit', {
// //         name: formData.name,
// //         email: formData.email,
// //         cnic: formData.cnic,
// //         category: loanDetails.category,
// //         subcategory: loanDetails.subcategory,
// //         emi: loanDetails.emi
// //       }, {
// //         headers: { 'Content-Type': 'application/json' }
// //       });

// //       setResetData({
// //         tempPassword: response.data.tempPassword || '', // Ensure it's never undefined
// //         newPassword: '',
// //         confirmPassword: ''
// //       });
      
// //       Swal.fire({
// //         icon: 'success',
// //         title: 'Success!',
// //         html: `<p>Application submitted successfully!</p>
// //                <p class="text-sm text-gray-500 mt-2">
// //                  Temporary password: ${response.data.tempPassword}
// //                </p>`,
// //         showCancelButton: true,
// //         confirmButtonText: 'OK',
// //         cancelButtonText: 'Reset Password Now',
// //         reverseButtons: true
// //       }).then((result) => {
// //         if (result.isDismissed) {
// //           setShowResetForm(true);
// //         }
// //       });
      
// //     } catch (error) {
// //       console.error('Submission error:', error);
// //       let errorMessage = error.response?.data?.message || error.message;
// //       if (errorMessage.includes('EAUTH') || errorMessage.includes('credentials')) {
// //         errorMessage = 'Email service configuration error. Contact support.';
// //       }
// //       Swal.fire({ 
// //         icon: 'error', 
// //         title: 'Error', 
// //         html: `<p>${errorMessage}</p><p class="text-sm text-gray-500 mt-2">Please try again or contact support</p>`, 
// //         confirmButtonText: 'OK' 
// //       });
// //     } finally {
// //       setIsSubmitting(false);
// //     }
// //   };

// //   const handleResetPassword = async (e) => {
// //     e.preventDefault();
    
// //     // Trim all inputs
// //     const submitData = {
// //       email: formData.email.trim(),
// //       tempPassword: resetData.tempPassword.trim(),
// //       newPassword: resetData.newPassword.trim(),
// //       confirmPassword: resetData.confirmPassword.trim()
// //     };
  
// //     // Validation
// //     if (submitData.newPassword !== submitData.confirmPassword) {
// //       Swal.fire({
// //         icon: 'error',
// //         title: 'Error',
// //         text: 'New password and confirmation do not match',
// //       });
// //       return;
// //     }
  
// //     if (submitData.newPassword.length < 8) {
// //       Swal.fire({
// //         icon: 'error',
// //         title: 'Error',
// //         text: 'Password must be at least 8 characters',
// //       });
// //       return;
// //     }
  
// //     try {
// //       setIsSubmitting(true);
      
// //       const response = await axios.post('http://localhost:5000/api/auth/reset-password', submitData);
      
// //       if (response.data.success) {
// //         // Store token in localStorage
// //         localStorage.setItem('token', response.data.token);
        
// //         // Redirect to dashboard
// //         window.location.href = '/dashboard';
// //       } else {
// //         throw new Error(response.data.message || 'Password reset failed');
// //       }
      
// //     } catch (error) {
// //       console.error('Reset error:', error);
// //       Swal.fire({
// //         icon: 'error',
// //         title: 'Error',
// //         text: error.response?.data?.message || error.message || 'Password reset failed',
// //       });
// //     } finally {
// //       setIsSubmitting(false);
// //     }
// //   };  
// //     return (
// //     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
// //       <div className="bg-white p-6 rounded-lg w-96">
// //         <div className="flex justify-between items-center mb-4">
// //           <h2 className="text-xl font-bold">
// //             {showResetForm ? 'Reset Password' : 'Loan Application'}
// //           </h2>
// //           <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl" aria-label="Close">
// //             &times;
// //           </button>
// //         </div>

// //         {!showResetForm ? (
// //           <form onSubmit={handleSubmit}>
// //             <div className="mb-4">
// //               <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
// //               <input 
// //                 type="text" 
// //                 className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
// //                 value={formData.name} 
// //                 onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
// //                 required 
// //               />
// //             </div>
// //             <div className="mb-4">
// //               <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
// //               <input 
// //                 type="email" 
// //                 className={`w-full p-2 border ${emailError ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500`} 
// //                 value={formData.email} 
// //                 onChange={(e) => { 
// //                   setFormData({ ...formData, email: e.target.value }); 
// //                   setEmailError(''); 
// //                 }} 
// //                 onBlur={() => validateEmail(formData.email)} 
// //                 required 
// //               />
// //               {emailError && <p className="mt-1 text-sm text-red-600">{emailError}</p>}
// //             </div>
// //             <div className="mb-6">
// //               <label className="block text-sm font-medium text-gray-700 mb-1">CNIC (Without dashes)</label>
// //               <input 
// //                 type="text" 
// //                 placeholder="1234512345671" 
// //                 pattern="[0-9]{13}" 
// //                 className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
// //                 value={formData.cnic} 
// //                 onChange={(e) => setFormData({ ...formData, cnic: e.target.value })} 
// //                 required 
// //               />
// //               <p className="mt-1 text-xs text-gray-500">Format: 1234512345671 (13 digits)</p>
// //             </div>
// //             <button 
// //               type="submit" 
// //               disabled={isSubmitting} 
// //               className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
// //             >
// //               {isSubmitting ? 'Processing...' : 'Submit Application'}
// //             </button>
// //           </form>
// //         ) : (
// //           <form onSubmit={handleResetPassword}>
// //             <div className="mb-4">
// //               <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
// //               <input 
// //                 type="email" 
// //                 className="w-full p-2 border border-gray-300 rounded-md" 
// //                 value={formData.email} 
// //                 readOnly 
// //               />
// //             </div>
// //             <div className="mb-4">
// //               <label className="block text-sm font-medium text-gray-700 mb-1">Temporary Password</label>
// //               <input 
// //                 type="text" 
// //                 className="w-full p-2 border border-gray-300 rounded-md" 
// //                 value={resetData.tempPassword || ''} // Ensure value is never undefined
// //                 onChange={(e) => setResetData({...resetData, tempPassword: e.target.value})}
// //                 required 
// //               />
// //             </div>
// //             <div className="mb-4">
// //               <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
// //               <input 
// //                 type="password" 
// //                 className="w-full p-2 border border-gray-300 rounded-md" 
// //                 value={resetData.newPassword} 
// //                 onChange={(e) => setResetData({...resetData, newPassword: e.target.value})}
// //                 required 
// //               />
// //             </div>
// //             <div className="mb-6">
// //               <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
// //               <input 
// //                 type="password" 
// //                 className="w-full p-2 border border-gray-300 rounded-md" 
// //                 value={resetData.confirmPassword} 
// //                 onChange={(e) => setResetData({...resetData, confirmPassword: e.target.value})}
// //                 required 
// //               />
// //             </div>
// //             <button 
// //               type="submit" 
// //               disabled={isSubmitting} 
// //               className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
// //             >
// //               {isSubmitting ? 'Processing...' : 'Reset Password'}
// //             </button>
// //             <button 
// //               type="button" 
// //               onClick={() => setShowResetForm(false)} 
// //               className="w-full mt-2 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
// //             >
// //               Back to Application
// //             </button>
// //           </form>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }

import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

export default function ProceedForm({ onClose, loanDetails }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    cnic: '' 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState('');

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(email)) {
      setEmailError('Invalid email format');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateEmail(formData.email)) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post('http://localhost:5000/api/loans/submit', {
        name: formData.name,
        email: formData.email,
        cnic: formData.cnic,
        category: loanDetails.category,
        subcategory: loanDetails.subcategory,
        emi: loanDetails.emi
      });

      Swal.fire({
        icon: 'success',
        title: 'Application Submitted!',
        html: `
          <p>Your application was submitted successfully!</p>
          <p class="text-sm mt-2">
            Temporary password: <strong>${response.data.tempPassword}</strong>
          </p>
          <p class="text-xs mt-1">Please use this to login and set a permanent password.</p>
        `,
        confirmButtonText: 'Continue to Login'
      }).then(() => {
        navigate('/login');
      });

    } catch (error) {
      console.error('Submission error:', error);
      
      let errorMessage = 'Failed to submit application';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      Swal.fire({
        icon: 'error',
        title: 'Submission Failed',
        text: errorMessage,
        confirmButtonText: 'Try Again'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Loan Application</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              className={`w-full p-2 border ${
                emailError ? 'border-red-500' : 'border-gray-300'
              } rounded-md`}
              value={formData.email}
              onChange={(e) => {
                setFormData({...formData, email: e.target.value});
                setEmailError('');
              }}
              onBlur={() => validateEmail(formData.email)}
              required
            />
            {emailError && (
              <p className="mt-1 text-sm text-red-600">{emailError}</p>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CNIC (Without dashes)
            </label>
            <input
              type="text"
              placeholder="1234512345671"
              pattern="[0-9]{13}"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={formData.cnic}
              onChange={(e) => setFormData({...formData, cnic: e.target.value})}
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              Format: 1234512345671 (13 digits)
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2 px-4 bg-blue-600 text-white rounded-md ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'
            }`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Application'}
          </button>
        </form>
      </div>
    </div>
  );
}