// frontend/src/components/LoanCalculator.js
import React, { useState } from 'react';
import ProceedForm from './ProceedForm';

const categories = {
  Wedding: ['Valima', 'Furniture', 'Valima Food', 'Jahez'],
  'Home Construction': ['Structure', 'Finishing', 'Loan'],
  'Business Startup': ['Buy Stall', 'Advance Rent', 'Shop Assets', 'Shop Machinery'],
  Education: ['University Fees', 'Child Fees Loan'],
};

const maxLoans = {
  Wedding: 500000,
  'Home Construction': 1000000,
  'Business Startup': 1000000,
  Education: 0,
};

export default function LoanCalculator() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [deposit, setDeposit] = useState(0);
  const [period, setPeriod] = useState(3);
  const [emi, setEmi] = useState(0);
  const [showPopup, setShowPopup] = useState(false);

  const calculateEMI = () => {
    if (!selectedCategory) {
      alert('Please select a category');
      return;
    }
    const loanAmount = maxLoans[selectedCategory] - deposit;
    const interestRate = 0.1;
    const monthlyRate = interestRate / 12;
    const months = period * 12;
    const calculatedEMI = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    setEmi(calculatedEMI.toFixed(2));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-4">Loan Calculator</h2>
      <div className="space-y-4">
        <div>
          <label className="block mb-1">Category</label>
          <select className="border p-2 w-full" value={selectedCategory} onChange={(e) => { setSelectedCategory(e.target.value); setSelectedSubcategory(''); }}>
            <option value="">Select</option>
            {Object.keys(categories).map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        {selectedCategory && (
          <div>
            <label className="block mb-1">Subcategory</label>
            <select className="border p-2 w-full" value={selectedSubcategory} onChange={(e) => setSelectedSubcategory(e.target.value)}>
              <option value="">Select</option>
              {categories[selectedCategory].map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          </div>
        )}
        <div>
          <label className="block mb-1">Initial Deposit (PKR)</label>
          <input type="number" className="border p-2 w-full" value={deposit} onChange={(e) => setDeposit(Number(e.target.value))} />
        </div>
        <div>
          <label className="block mb-1">Loan Period (Years)</label>
          <select className="border p-2 w-full" value={period} onChange={(e) => setPeriod(Number(e.target.value))}>
            <option value="3">3</option>
            <option value="5">5</option>
          </select>
        </div>
        <button onClick={calculateEMI} className="bg-green-600 text-white px-4 py-2 rounded">
          Calculate
        </button>
        {emi > 0 && (
          <div className="p-4 bg-gray-100 rounded">
            <p>Monthly EMI: PKR {emi}</p>
          </div>
        )}
        <button onClick={() => { if (emi <= 0) { alert('Please calculate EMI first'); return; } setShowPopup(true); }} className="bg-blue-600 text-white px-4 py-2 rounded block w-full mt-4">
          Proceed
        </button>
      </div>
      {showPopup && <ProceedForm onClose={() => setShowPopup(false)} loanDetails={{ category: selectedCategory, subcategory: selectedSubcategory, emi: emi }} />}
    </div>
  );
}