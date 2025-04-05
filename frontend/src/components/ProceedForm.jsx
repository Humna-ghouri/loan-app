// import { useState } from 'react'

// export default function ProceedForm({ onClose, loanDetails }) {
//   const [formData, setFormData] = useState({
//     cnic: '',
//     email: '',
//     name: ''
//   })

//   const handleSubmit = (e) => {
//     e.preventDefault()
//     const applicationData = {
//       ...formData,
//       ...loanDetails
//     }
//     console.log('Application Data:', applicationData)
//     alert('Application submitted successfully!')
//     onClose()
//   }

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white p-6 rounded-lg w-96">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-bold">Application Form</h2>
//           <button onClick={onClose} className="text-gray-500">✕</button>
//         </div>
        
//         <div className="mb-4 p-3 bg-blue-50 rounded">
//           <p><strong>Loan:</strong> {loanDetails.category} - {loanDetails.subcategory}</p>
//           <p><strong>Monthly EMI:</strong> PKR {loanDetails.emi}</p>
//         </div>

//         <form onSubmit={handleSubmit}>
//           <div className="mb-3">
//             <label className="block mb-1">CNIC</label>
//             <input
//               type="text"
//               placeholder="XXXXX-XXXXXXX-X"
//               className="border p-2 w-full rounded"
//               value={formData.cnic}
//               onChange={(e) => setFormData({...formData, cnic: e.target.value})}
//               required
//             />
//           </div>

//           <div className="mb-3">
//             <label className="block mb-1">Email</label>
//             <input
//               type="email"
//               placeholder="your@email.com"
//               className="border p-2 w-full rounded"
//               value={formData.email}
//               onChange={(e) => setFormData({...formData, email: e.target.value})}
//               required
//             />
//           </div>

//           <div className="mb-4">
//             <label className="block mb-1">Full Name</label>
//             <input
//               type="text"
//               placeholder="Your Name"
//               className="border p-2 w-full rounded"
//               value={formData.name}
//               onChange={(e) => setFormData({...formData, name: e.target.value})}
//               required
//             />
//           </div>

//           <button 
//             type="submit" 
//             className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700"
//           >
//             Submit Application
//           </button>
//         </form>
//       </div>
//     </div>
//   )
// }
// import { useState } from 'react';

// export default function ProceedForm({ onClose, loanDetails }) {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     cnic: ''
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     try {
//       const response = await fetch('http://localhost:5000/api/loans/submit', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           ...formData,
//           category: loanDetails.category,
//           subcategory: loanDetails.subcategory,
//           emi: loanDetails.emi
//         })
//       });

//       const data = await response.json();
      
//       if (!response.ok) {
//         throw new Error(data.message || 'Failed to submit application');
//       }

//       alert('Application submitted successfully!');
//       onClose();
//     } catch (error) {
//       alert(`Error: ${error.message}`);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };



// import { useState } from 'react';

// export default function ProceedForm({ onClose, loanDetails }) {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     cnic: ''
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [emailError, setEmailError] = useState('');

//   // Simple but effective email validation
//   const validateEmail = (email) => {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
//     if (!emailRegex.test(email)) {
//       setEmailError('Please enter a valid email address');
//       return false;
//     }
    
//     // Quick check for common fake email providers
//     const fakeDomains = [
//       'mailinator.com', 'tempmail.com', 
//       '10minutemail.com', 'fakeinbox.com',
//       'yopmail.com', 'guerrillamail.com'
//     ];
    
//     if (fakeDomains.some(domain => email.includes(domain))) {
//       setEmailError('Temporary email services are not allowed');
//       return false;
//     }
    
//     setEmailError('');
//     return true;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     // Validate email before submission
//     if (!validateEmail(formData.email)) {
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       const response = await fetch('http://localhost:5000/api/loans/submit', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           ...formData,
//           ...loanDetails
//         })
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || 'Submission failed');
//       }

//       alert('Application submitted successfully!');
//       onClose();
//     } catch (error) {
//       alert(`Error: ${error.message}`);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white p-6 rounded-lg w-96">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-bold">Loan Application</h2>
//           <button 
//             onClick={onClose} 
//             className="text-gray-500 hover:text-gray-700"
//           >
//             ✕
//           </button>
//         </div>

//         <form onSubmit={handleSubmit}>
//           <div className="mb-4">
//             <label className="block text-sm font-medium mb-1">Full Name</label>
//             <input
//               type="text"
//               className="w-full p-2 border rounded"
//               value={formData.name}
//               onChange={(e) => setFormData({...formData, name: e.target.value})}
//               required
//             />
//           </div>

//           <div className="mb-4">
//             <label className="block text-sm font-medium mb-1">Email</label>
//             <input
//               type="email"
//               className={`w-full p-2 border rounded ${emailError ? 'border-red-500' : ''}`}
//               value={formData.email}
//               onChange={(e) => {
//                 setFormData({...formData, email: e.target.value});
//                 setEmailError(''); // Clear error when typing
//               }}
//               onBlur={() => validateEmail(formData.email)}
//               required
//             />
//             {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
//           </div>

//           <div className="mb-4">
//             <label className="block text-sm font-medium mb-1">CNIC</label>
//             <input
//               type="text"
//               placeholder="XXXXX-XXXXXXX-X"
//               className="w-full p-2 border rounded"
//               value={formData.cnic}
//               onChange={(e) => setFormData({...formData, cnic: e.target.value})}
//               required
//             />
//           </div>

//           <button
//             type="submit"
//             className={`w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 ${isSubmitting ? 'opacity-50' : ''}`}
//             disabled={isSubmitting}
//           >
//             {isSubmitting ? 'Submitting...' : 'Submit Application'}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }
// frontend/src/components/ProceedForm.js
import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function ProceedForm({ onClose, loanDetails }) {
  const [formData, setFormData] = useState({ name: '', email: '', cnic: '' });
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
    if (!validateEmail(formData.email)) return;
    setIsSubmitting(true);
    try {
      const response = await axios.post('http://localhost:5000/api/loans/submit', { name: formData.name, email: formData.email, cnic: formData.cnic, category: loanDetails.category, subcategory: loanDetails.subcategory, emi: loanDetails.emi }, { headers: { 'Content-Type': 'application/json' } });
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        html: `<p>Application submitted successfully!</p> ${response.data.tempPassword ? `<p class="text-sm text-gray-500 mt-2">Temporary password: ${response.data.tempPassword}</p>` : '<p class="text-sm text-gray-500 mt-2">Check your email for login credentials</p>'}`,
        confirmButtonText: 'OK',
      });
      onClose();
    } catch (error) {
      console.error('Submission error:', error);
      let errorMessage = error.response?.data?.message || error.message;
      if (errorMessage.includes('EAUTH') || errorMessage.includes('credentials')) {
        errorMessage = 'Email service configuration error. Contact support.';
      }
      Swal.fire({ icon: 'error', title: 'Error', html: `<p>${errorMessage}</p><p class="text-sm text-gray-500 mt-2">Please try again or contact support</p>`, confirmButtonText: 'OK' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Loan Application</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl" aria-label="Close">
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input type="text" className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" className={`w-full p-2 border ${emailError ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500`} value={formData.email} onChange={(e) => { setFormData({ ...formData, email: e.target.value }); setEmailError(''); }} onBlur={() => validateEmail(formData.email)} required />
            {emailError && <p className="mt-1 text-sm text-red-600">{emailError}</p>}
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">CNIC (Without dashes)</label>
            <input type="text" placeholder="1234512345671" pattern="[0-9]{13}" className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" value={formData.cnic} onChange={(e) => setFormData({ ...formData, cnic: e.target.value })} required />
            <p className="mt-1 text-xs text-gray-500">Format: 1234512345671 (13 digits)</p>
          </div>
          <button type="submit" disabled={isSubmitting} className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}>
            {isSubmitting ? 'Processing...' : 'Submit Application'}
          </button>
        </form>
      </div>
    </div>
  );
}