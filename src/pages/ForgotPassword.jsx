import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Mail, Key, Lock, Loader, RotateCcw } from 'lucide-react';

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      await axios.post(import.meta.env.VITE_API_URL + '/api/auth/forgot-password', { email });
      setSuccess('A password reset code has been sent to your email.');
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset code. Check if email exists.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      await axios.post(import.meta.env.VITE_API_URL + '/api/auth/reset-password', { email, otp, newPassword });
      setSuccess('Password has been reset successfully. Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. Invalid code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-[75vh] py-12 px-4">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-primary/10 blur-[80px] -z-10 animate-pulse"></div>

      <div className="glass-panel bg-surface-900/80 p-8 md:p-10 rounded-3xl w-full max-w-md border border-surface-700 shadow-card animate-slide-up">
        <div className="text-center mb-8">
          <div className="inline-flex p-3.5 bg-primary-dark/30 text-primary-light rounded-2xl shadow-sm mb-4">
            <RotateCcw className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-semibold text-white tracking-tight">
            {step === 1 ? 'Reset Password' : 'New Password'}
          </h2>
          <p className="text-slate-900 text-sm mt-2 font-semibold leading-relaxed">
            {step === 1 
              ? "Enter your email and we'll send you a code to reset your password."
              : `Enter the code sent to ${email} and your new password.`}
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

        {step === 1 ? (
          <form onSubmit={handleRequestOTP} className="space-y-6">
            <div>
              <label className="block text-xs font-medium text-slate-800 uppercase tracking-wider mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-900 w-5 h-5" />
                <input 
                  type="email" 
                  className="w-full pl-11 pr-4 py-3 border border-surface-600 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-white bg-surface-800 transition-all font-medium text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required 
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading || !email}
              className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-3.5 rounded-xl shadow-glow-primary transition-all duration-300 flex items-center justify-center cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? <Loader className="w-5 h-5 animate-spin" /> : 'Send Reset Code'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-slate-800 uppercase tracking-wider mb-2">Reset Code</label>
              <div className="relative">
                <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-900 w-5 h-5" />
                <input 
                  type="text" 
                  maxLength="6"
                  className="w-full pl-11 pr-4 py-3 border border-surface-600 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-white bg-surface-800 transition-all font-medium tracking-[0.25em]"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="000000"
                  required 
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-800 uppercase tracking-wider mb-2">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-900 w-5 h-5" />
                <input 
                  type="password" 
                  className="w-full pl-11 pr-4 py-3 border border-surface-600 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-white bg-surface-800 transition-all font-medium text-sm"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  required 
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading || otp.length !== 6 || !newPassword}
              className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-3.5 rounded-xl shadow-glow-primary transition-all duration-300 flex items-center justify-center cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed mt-4"
            >
              {loading ? <Loader className="w-5 h-5 animate-spin" /> : 'Update Password'}
            </button>
          </form>
        )}

        <p className="mt-8 text-center text-slate-900 text-sm font-semibold">
          Remember your password?{' '}
          <Link to="/login" className="text-primary-light hover:text-white font-medium hover:underline transition-colors">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
