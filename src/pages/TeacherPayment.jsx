import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from '../api/axios'; // your configured axios instance with baseURL + auth token interceptor
import { ShieldCheck, Loader } from 'lucide-react';

const PAYHERE_SCRIPT_ID = 'payhere-checkout-script';

const loadPayHereScript = () =>
  new Promise((resolve, reject) => {
    if (document.getElementById(PAYHERE_SCRIPT_ID)) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.id = PAYHERE_SCRIPT_ID;
    script.src = 'https://www.payhere.lk/lib/payhere.js';
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });

const TeacherPayment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    loadPayHereScript().catch(() => setError('Failed to load payment gateway. Refresh and try again.'));
  }, []);

  const handlePay = async () => {
    try {
      setLoading(true);
      setError('');

      const { data } = await axios.post('/api/payment/teacher/initiate');

      const payload = {
        ...data,
        merchant_id: data.merchant_id || import.meta.env.VITE_PAYHERE_MERCHANT_ID
      };

      window.payhere.onCompleted = function (orderId) {
        navigate('/payment/success', { state: { orderId } });
      };

      window.payhere.onDismissed = function () {
        setLoading(false);
        setError('Payment was cancelled.');
      };

      window.payhere.onError = function (error) {
        setLoading(false);
        setError('Payment error: ' + error);
      };

      window.payhere.startPayment(payload);
    } catch (err) {
      setLoading(false);
      console.log(error)
      setError(err?.response?.data?.message || 'Could not start payment. Please try again.');
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-[75vh] px-4">
      <div className="glass-panel bg-surface-900/80 p-8 md:p-10 rounded-3xl w-full max-w-md border border-surface-700 shadow-card animate-slide-up text-center">
        <div className="inline-flex p-3.5 bg-primary-dark/30 text-primary-light rounded-2xl shadow-sm mb-4">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-semibold text-white tracking-tight mb-2">Complete Your Registration</h2>
        <p className="text-slate-900 text-sm font-semibold mb-6">
          A one-time registration fee of <span className="text-white">Rs. 1,000</span> is required before your
          teacher account can be reviewed by our admin team.
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-6 text-sm font-semibold border border-red-100/60 text-center">
            {error}
          </div>
        )}

        <button
          onClick={handlePay}
          disabled={loading}
          className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-3.5 rounded-xl shadow-glow-primary transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center cursor-pointer"
        >
          {loading ? (
            <>
              <Loader className="w-5 h-5 mr-2 animate-spin" />
              Redirecting to PayHere...
            </>
          ) : (
            'Pay Rs. 1,000 with PayHere'
          )}
        </button>

        <p className="mt-6 text-xs text-slate-900 font-medium">
          Signed in as {user?.email}. You'll be redirected back here once payment is confirmed.
        </p>
      </div>
    </div>
  );
};

export default TeacherPayment;