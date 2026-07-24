import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { CheckCircle2, Clock, Loader } from 'lucide-react';

const POLL_INTERVAL_MS = 3000;
const MAX_ATTEMPTS = 10;

const PaymentSuccess = () => {
  const [status, setStatus] = useState('checking'); // checking | completed | pending | error
  const navigate = useNavigate();

  useEffect(() => {
    let attempts = 0;
    let timer;

    const poll = async () => {
      try {
        const { data } = await axios.get('/api/payment/teacher/status');
        if (data.status === 'completed') {
          setStatus('completed');
          return;
        }
        attempts += 1;
        if (attempts >= MAX_ATTEMPTS) {
          setStatus('pending');
          return;
        }
        timer = setTimeout(poll, POLL_INTERVAL_MS);
      } catch {
        setStatus('error');
      }
    };

    poll();
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative flex items-center justify-center min-h-[75vh] px-4">
      <div className="glass-panel bg-surface-900/80 p-8 md:p-10 rounded-3xl w-full max-w-md border border-surface-700 shadow-card animate-slide-up text-center">
        {status === 'checking' && (
          <>
            <Loader className="w-8 h-8 mx-auto mb-4 animate-spin text-primary-light" />
            <h2 className="text-xl font-semibold text-white mb-2">Confirming your payment...</h2>
            <p className="text-slate-900 text-sm font-semibold">This usually takes a few seconds.</p>
          </>
        )}

        {status === 'completed' && (
          <>
            <CheckCircle2 className="w-10 h-10 mx-auto mb-4 text-green-400" />
            <h2 className="text-xl font-semibold text-white mb-2">Payment confirmed!</h2>
            <p className="text-slate-900 text-sm font-semibold mb-6">
              Your registration fee has been received. Your account is now with our admin team for review.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-3 rounded-xl transition-all cursor-pointer"
            >
              Go to Login
            </button>
          </>
        )}

        {status === 'pending' && (
          <>
            <Clock className="w-10 h-10 mx-auto mb-4 text-yellow-400" />
            <h2 className="text-xl font-semibold text-white mb-2">Still processing</h2>
            <p className="text-slate-900 text-sm font-semibold">
              PayHere is confirming your payment. This can take a few minutes — check back or refresh shortly.
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <h2 className="text-xl font-semibold text-white mb-2">Couldn't confirm payment status</h2>
            <p className="text-slate-900 text-sm font-semibold">Please refresh this page in a moment.</p>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;