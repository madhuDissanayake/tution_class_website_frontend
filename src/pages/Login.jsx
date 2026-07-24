import { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Mail, Lock, LogIn, Loader } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [successMessage, setSuccessMessage] = useState(location.state?.message || '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      const userData = await login(email, password);

      if (userData.requiresPayment) {
        navigate('/payment/teacher-fee');
        return;
      }

      if (userData.role === 'admin') {
        navigate('/admin');
      } else if (userData.role === 'teacher') {
        navigate('/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      if (err.emailUnverified) {
        navigate('/verify-email', { state: { email: err.email } });
      } else {
        setError(err.message || err || 'Invalid email or password');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex items-start justify-center min-h-[65vh] pt-0 pb-12 px-4 mt-2">
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-primary/10 blur-[80px] -z-10 animate-pulse"></div>
      <div className="absolute top-1/3 left-1/3 w-60 h-60 rounded-full bg-sky-500/10 blur-[60px] -z-10 animate-pulse duration-[5000ms]"></div>

      <div className="glass-panel bg-white p-6 md:p-8 rounded-2xl w-full max-w-sm border border-slate-200 shadow-card animate-slide-up">
        <div className="text-center mb-6">
          <div className="inline-flex p-3 bg-primary/10 text-primary rounded-xl shadow-sm mb-3">
            <LogIn className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-semibold text-slate-900 tracking-tight">Welcome Back</h2>
          <p className="text-slate-900 text-sm mt-1.5 font-semibold">Sign in to your TuitionHub account</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-5 text-sm font-semibold border border-red-100/60 text-center animate-fade-in">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-50 text-green-600 p-3 rounded-xl mb-5 text-sm font-semibold border border-green-100/60 text-center animate-fade-in">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-medium text-slate-800 uppercase tracking-wider mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-900 w-5 h-5" />
              <input
                type="email"
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-slate-900 bg-slate-50 transition-all font-medium text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-800 uppercase tracking-wider mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-900 w-5 h-5" />
              <input
                type="password"
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-slate-900 bg-slate-50 transition-all font-medium text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            <div className="text-right mt-2">
              <Link to="/forgot-password" className="text-xs font-medium text-primary hover:text-primary-dark transition-colors">Forgot Password?</Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-3 text-sm rounded-lg shadow-glow-primary transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center cursor-pointer"
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 mr-2 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-slate-900 text-sm font-semibold">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary hover:text-primary-dark font-medium hover:underline transition-colors">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;