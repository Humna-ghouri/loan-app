import { useState } from 'react';
import PasswordResetModal from './PasswordResetModal';

function LoanApplicationForm() {
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetData, setResetData] = useState(null);

  const handleSubmit = async (formData) => {
    try {
      const response = await axios.post('/api/loans/submit', formData);
      
      if (response.data.requiresPasswordReset) {
        setResetData({
          email: formData.email,
          tempPassword: response.data.tempPassword // For development
        });
        setShowResetModal(true);
      }
    } catch (error) {
      // Handle error
    }
  };

  return (
    <>
      {/* Your existing form */}
      
      {showResetModal && (
        <PasswordResetModal
          email={resetData.email}
          tempPassword={resetData.tempPassword}
          onSuccess={() => {
            setShowResetModal(false);
            // Redirect to dashboard or show success message
          }}
          onClose={() => setShowResetModal(false)}
        />
      )}
    </>
  );
}