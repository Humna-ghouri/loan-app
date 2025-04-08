import React, { useState } from 'react';

const loanTypes = [
  {
    type: 'Wedding Loans',
    subcategories: ['Valima', 'Furniture', 'Valima Food', 'Jahez'],
    maxAmount: 500000, // PKR 5 Lakh
    loanPeriod: 3, // years
  },
  {
    type: 'Home Construction Loans',
    subcategories: ['Structure', 'Finishing', 'Loan'],
    maxAmount: 1000000, // PKR 10 Lakh
    loanPeriod: 5, // years
  },
  {
    type: 'Business Startup Loans',
    subcategories: ['Buy Stall', 'Advance Rent for Shop', 'Shop Assets', 'Shop Machinery'],
    maxAmount: 1000000, // PKR 10 Lakh
    loanPeriod: 5, // years
  },
  {
    type: 'Education Loans',
    subcategories: ['University Fees', 'Child Fees Loan'],
    maxAmount: null, // Based on requirement
    loanPeriod: 4, // years
  },
];

const LoanCalculator = () => {
  const [loanType, setLoanType] = useState(loanTypes[0]); // Default to the first loan type
  const [loanData, setLoanData] = useState({
    amount: '',
    tenure: loanType.loanPeriod * 12, // Tenure in months
    interestRate: 10,
    subcategory: loanType.subcategories[0], // Default subcategory
  });
  const [emi, setEmi] = useState(0);

  const calculateEMI = () => {
    const { amount, tenure, interestRate } = loanData;
    const principal = parseFloat(amount);
    const monthlyInterest = interestRate / 12 / 100;
    const emiValue =
      (principal * monthlyInterest * Math.pow(1 + monthlyInterest, tenure)) /
      (Math.pow(1 + monthlyInterest, tenure) - 1);

    if (!isNaN(emiValue)) setEmi(emiValue.toFixed(2));
  };

  const handleChange = (e) => {
    if (e.target.name === 'loanType') {
      const selectedLoanType = loanTypes.find((type) => type.type === e.target.value);
      setLoanType(selectedLoanType);
      setLoanData({
        ...loanData,
        tenure: selectedLoanType.loanPeriod * 12,
        subcategory: selectedLoanType.subcategories[0],
      });
    } else {
      setLoanData({
        ...loanData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    calculateEMI();
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Loan Calculator</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Loan Type</label>
          <select
            name="loanType"
            value={loanType.type}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          >
            {loanTypes.map((type) => (
              <option key={type.type} value={type.type}>
                {type.type}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1">Subcategory</label>
          <select
            name="subcategory"
            value={loanData.subcategory}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          >
            {loanType.subcategories.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1">Loan Amount (PKR)</label>
          <input
            type="number"
            name="amount"
            value={loanData.amount}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
            max={loanType.maxAmount || undefined} // Apply max if defined
          />
          {loanType.maxAmount && (
            <p className="text-sm text-gray-500">Max: PKR {loanType.maxAmount}</p>
          )}
        </div>
        <div>
          <label className="block mb-1">Loan Tenure (months)</label>
          <input
            type="number"
            name="tenure"
            value={loanData.tenure}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            readOnly // Make tenure read-only
          />
        </div>
        <div>
          <label className="block mb-1">Interest Rate (% p.a.)</label>
          <input
            type="number"
            name="interestRate"
            value={loanData.interestRate}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            step="0.1"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Calculate EMI
        </button>
      </form>
      {emi > 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded">
          <h2 className="font-bold mb-2">Loan Summary</h2>
          <p>Monthly EMI: PKR {emi}</p>
        </div>
      )}
    </div>
  );
};

export default LoanCalculator;