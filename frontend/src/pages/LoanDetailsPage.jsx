import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function LoanDetailsPage() {
  const [guarantors, setGuarantors] = useState([
    { name: '', email: '', location: '', cnic: '', relationship: '' },
    { name: '', email: '', location: '', cnic: '', relationship: '' }
  ]);
  const [documents, setDocuments] = useState({
    statement: '',
    salarySheet: '',
    address: '',
    phoneNumber: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGuarantorChange = (index, field, value) => {
    const updatedGuarantors = [...guarantors];
    updatedGuarantors[index][field] = value;
    setGuarantors(updatedGuarantors);
  };

  const handleDocumentChange = (field, value) => {
    setDocuments({
      ...documents,
      [field]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/loans/submit-details', {
        guarantors,
        documents
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Loan details submitted successfully'
      });
      navigate('/dashboard');
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Failed to submit details'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Loan Application Details</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">Guarantors Information</h2>
              {guarantors.map((guarantor, index) => (
                <div key={index} className="mb-6 p-4 border rounded">
                  <h3 className="font-medium mb-3">Guarantor {index + 1}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded"
                        value={guarantor.name}
                        onChange={(e) => handleGuarantorChange(index, 'name', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        className="w-full p-2 border rounded"
                        value={guarantor.email}
                        onChange={(e) => handleGuarantorChange(index, 'email', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-1">Location</label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded"
                        value={guarantor.location}
                        onChange={(e) => handleGuarantorChange(index, 'location', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-1">CNIC</label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded"
                        value={guarantor.cnic}
                        onChange={(e) => handleGuarantorChange(index, 'cnic', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-1">Relationship</label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded"
                        value={guarantor.relationship}
                        onChange={(e) => handleGuarantorChange(index, 'relationship', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-4">Documents & Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-1">Bank Statement (URL)</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    value={documents.statement}
                    onChange={(e) => handleDocumentChange('statement', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Salary Sheet (URL)</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    value={documents.salarySheet}
                    onChange={(e) => handleDocumentChange('salarySheet', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Address</label>
                  <textarea
                    className="w-full p-2 border rounded"
                    value={documents.address}
                    onChange={(e) => handleDocumentChange('address', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    value={documents.phoneNumber}
                    onChange={(e) => handleDocumentChange('phoneNumber', e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 ${loading ? 'opacity-70' : ''}`}
            >
              {loading ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}