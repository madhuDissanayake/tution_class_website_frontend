import { useState, useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Key, Loader, ShieldCheck } from 'lucide-react';

const VerifyEmail = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  
  const { verifyEmail, resendOTP } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate('/login');
    }
  }, [email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      const userData = await verifyEmail(email, otp);
      
      if (userData.role === 'admin') {
        navigate('/admin');
      } else if (userData.role === 'teacher') {
        navigate('/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err || 'Verification failed. Please check the code.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setResending(true);
      setError('');
      setSuccess('');
      await resendOTP(email);
      setSuccess('A new verification code has been sent to your email.');
    } catch (err) {
      setError(err || 'Failed to resend code. Please try again.');
    } finally {
      setResending(false);
    }
  };

  if (!email) return null;

  return (
    <div className="relative flex items-center justify-center min-h-[75vh] py-12 px-4">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-blue-500/10 blur-[80px] -z-10 animate-pulse"></div>

      <div className="glass-panel bg-white/80 dark:bg-slate-900/80 p-8 md:p-10 rounded-3xl w-full max-w-md border border-slate-200 dark:border-slate-800 shadow-sm animate-slide-up">
        <div className="text-center mb-8">
          <div className="inline-flex p-3.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl shadow-sm mb-4">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-semibold text-slate-900 dark:text-white tracking-tight">Verify Email</h2>
          <p className="text-slate-500 text-sm mt-2 font-semibold leading-relaxed">
            We've sent a 6-digit code to <br/>
            <span className="text-blue-600 dark:text-blue-400 font-medium">{email}</span>
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-6 text-sm font-semibold border border-red-100/60 text-center animate-fade-in">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-emerald-50 text-emerald-600 p-4 rounded-2xl mb-6 text-sm font-semibold border border-emerald-100/60 text-center animate-fade-in">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-medium text-slate-600 uppercase tracking-wider mb-2 text-center">Enter Verification Code</label>
            <div className="relative">
              <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                type="text" 
                maxLength="6"
                className="w-full pl-11 pr-4 py-4 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none text-slate-800 dark:text-white bg-slate-50 dark:bg-slate-800 transition-all font-medium text-center text-lg tracking-[0.25em]"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="000000"
                required 
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading || otp.length !== 6}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3.5 rounded-xl shadow-md transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 mr-2 animate-spin" />
                Verifying...
              </>
            ) : (
              'Verify & Continue'
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-slate-500 text-sm font-semibold">
          Didn't receive the code?{' '}
          <button 
            onClick={handleResend}
            disabled={resending}
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium hover:underline transition-colors disabled:opacity-50"
          >
            {resending ? 'Sending...' : 'Resend Code'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default VerifyEmail;
