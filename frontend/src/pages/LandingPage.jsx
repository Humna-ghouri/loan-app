import LoanCalculator from '../components/LoanCalculator';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Loan Categories</h1>
        <LoanCalculator />
      </div>
    </div>
  );
}