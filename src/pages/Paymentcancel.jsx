import { useNavigate } from 'react-router-dom';
import { XCircle } from 'lucide-react';

const PaymentCancel = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex items-center justify-center min-h-[75vh] px-4">
      <div className="glass-panel bg-surface-900/80 p-8 md:p-10 rounded-3xl w-full max-w-md border border-surface-700 shadow-card animate-slide-up text-center">
        <XCircle className="w-10 h-10 mx-auto mb-4 text-red-400" />
        <h2 className="text-xl font-semibold text-white mb-2">Payment cancelled</h2>
        <p className="text-muted-500 text-sm font-semibold mb-6">
          Your registration fee wasn't charged. You can try again whenever you're ready.
        </p>
        <button
          onClick={() => navigate('/payment/teacher-fee')}
          className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-3 rounded-xl transition-all cursor-pointer"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

export default PaymentCancel;