import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Bell, User as UserIcon, LogOut, Menu, X, GraduationCap, Wallet } from 'lucide-react';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import Logo from '../ui/Logo';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 15) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!user || !user.token) {
      setUnreadCount(0);
      return;
    }

    const fetchUnreadCount = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.get(import.meta.env.VITE_API_URL + '/api/notifications', config);
        const unread = data.filter((n) => !n.isRead).length;
        setUnreadCount(unread);
      } catch (err) {
        console.error('Failed to fetch notifications for navbar count', err);
      }
    };

    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 10000);
    return () => clearInterval(interval);
  }, [user]);

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-500 border-b ${
      isScrolled 
        ? 'bg-white/90 backdrop-blur-xl border-slate-200 shadow-md py-1.5' 
        : 'bg-white/80 backdrop-blur-2xl border-slate-200 shadow-sm py-2'
    }`}>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className={`flex justify-between items-center ${user?.role === 'teacher' ? 'h-20' : 'h-14'}`}>
          
          {/* Logo Brand */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative group-hover:scale-105 transition-transform duration-500 flex items-center justify-center">
              <Logo className={`text-primary ${user?.role === 'teacher' ? 'w-10 h-10 md:w-12 md:h-12' : 'w-9 h-9 md:w-11 md:h-11'}`} />
            </div>
            <span className={`font-black tracking-tight text-slate-900 flex items-center ${user?.role === 'teacher' ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl'}`}>
              Tuition
              <span className="text-primary ml-1">Hub</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className={`hidden md:flex items-center ${user?.role === 'teacher' ? 'space-x-10' : 'space-x-4 lg:space-x-6'}`}>
            {(!user || (user.role !== 'teacher' && user.role !== 'admin')) && (
              <Link 
                to="/" 
                className={`font-black tracking-wide transition-all duration-300 ${user?.role === 'teacher' ? 'text-base px-4 py-2' : 'text-sm px-3 py-1.5'} rounded-lg ${
                  isActive('/') 
                    ? `bg-brand-from/10 text-brand-to border-b-2 border-brand-from` 
                    : `text-slate-900 font-semibold hover:text-brand-to hover:bg-slate-50 border-b-2 border-transparent`
                }`}
              >
                Home
              </Link>
            )}
            {(!user || (user.role !== 'teacher' && user.role !== 'admin')) && (
              <Link 
                to="/search" 
                className={`font-black tracking-wide transition-all duration-300 ${user?.role === 'teacher' ? 'text-base px-4 py-2' : 'text-sm px-3 py-1.5'} rounded-lg ${
                  isActive('/search') 
                    ? `bg-brand-from/10 text-brand-to border-b-2 border-brand-from` 
                    : `text-slate-900 font-semibold hover:text-brand-to hover:bg-slate-50 border-b-2 border-transparent`
                }`}
              >
                Find Classes
              </Link>
            )}
            <Link 
              to="/about" 
              className={`font-black tracking-wide transition-all duration-300 ${user?.role === 'teacher' ? 'text-base px-4 py-2' : 'text-sm px-3 py-1.5'} rounded-lg ${
                isActive('/about') 
                  ? `bg-brand-from/10 text-brand-to border-b-2 border-brand-from` 
                  : `text-slate-900 font-semibold hover:text-brand-to hover:bg-slate-50 border-b-2 border-transparent`
              }`}
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className={`font-black tracking-wide transition-all duration-300 ${user?.role === 'teacher' ? 'text-base px-4 py-2' : 'text-sm px-3 py-1.5'} rounded-lg ${
                isActive('/contact') 
                  ? `bg-brand-from/10 text-brand-to border-b-2 border-brand-from` 
                  : `text-slate-900 font-semibold hover:text-brand-to hover:bg-slate-50 border-b-2 border-transparent`
              }`}
            >
              Contact
            </Link>
          </div>
          
          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <>
                {user.role === 'admin' && (
  <>
    <Link
      to="/admin"
      className={`h-8 px-4 flex items-center justify-center gap-1.5 rounded-full font-black text-[10px] uppercase tracking-wider transition-all duration-300 shadow-sm ${
        isActive('/admin')
          ? 'bg-primary text-slate-900 shadow-primary/30'
          : 'text-primary-light bg-primary/10 border border-primary/20 hover:bg-primary/20'
      }`}
    >
      Admin Panel
    </Link>
    <Link
      to="/admin/earnings"
      className={`h-8 px-4 flex items-center justify-center gap-1.5 rounded-full font-black text-[10px] uppercase tracking-wider transition-all duration-300 shadow-sm ${
        isActive('/admin/earnings')
          ? 'bg-emerald-500 text-slate-900 shadow-emerald-500/30'
          : 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20'
      }`}
    >
      <Wallet className="w-3.5 h-3.5" />
      Earnings & Payouts
    </Link>
  </>
)}
                {user.role === 'teacher' && (
                  <Link 
                    to="/dashboard" 
                    className={`${user?.role === 'teacher' ? 'h-10 px-5 text-xs' : 'h-8 px-4 text-[10px]'} flex items-center justify-center gap-2 text-primary-light hover:bg-primary/20 rounded-full bg-primary/10 font-black uppercase tracking-wider transition-all duration-300`}
                  >
                    <GraduationCap className={user?.role === 'teacher' ? 'w-5 h-5' : 'w-4 h-4'} />
                    Teacher Dashboard
                  </Link>
                )}
                {user.role === 'student' && (
                  <Link 
                    to="/dashboard" 
                    className={`${user?.role === 'teacher' ? 'h-10 px-5 text-xs' : 'h-8 px-4 text-[10px]'} flex items-center justify-center gap-2 text-secondary-light hover:bg-secondary/20 rounded-full bg-secondary/10 font-black uppercase tracking-wider transition-all duration-300`}
                  >
                    <UserIcon className={user?.role === 'teacher' ? 'w-5 h-5' : 'w-4 h-4'} />
                    My Dashboard
                  </Link>
                )}
                
                {/* Notification Bell */}
                <Link 
                  to="/notifications" 
                  className={`${user?.role === 'teacher' ? 'h-10 w-10' : 'h-8 w-8'} flex items-center justify-center text-slate-900 font-semibold hover:text-primary rounded-full bg-slate-50 border border-slate-300 transition-all duration-300 relative group shadow-sm`}
                >
                  <Bell className={`${user?.role === 'teacher' ? 'w-5 h-5' : 'w-4 h-4'} group-hover:text-primary transition-colors`} />
                  {unreadCount > 0 && (
                    <span className={`absolute -top-1.5 -right-1.5 ${user?.role === 'teacher' ? 'min-w-5 h-5 px-1.5 text-[10px]' : 'min-w-4 h-4 px-1 text-[9px]'} bg-red-500 rounded-full border-2 border-white font-black text-white flex items-center justify-center shadow-md`}>
                      {unreadCount}
                    </span>
                  )}
                </Link>
                
                {/* User profile avatar pill */}
                <div className={`${user?.role === 'teacher' ? 'h-10 px-4' : 'h-8 px-3'} flex items-center space-x-2.5 bg-slate-50 rounded-full border border-slate-300 shadow-sm`}>
                  <div className={`${user?.role === 'teacher' ? 'w-6 h-6' : 'w-5 h-5'} bg-primary rounded-full flex items-center justify-center text-slate-900 ${user?.role === 'teacher' ? 'text-xs' : 'text-[10px]'} font-black`}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className={`${user?.role === 'teacher' ? 'text-xs' : 'text-[10px]'} font-black text-slate-900`}>{user.name}</span>
                </div>
                
                {/* Logout Button */}
                <button 
                  onClick={handleLogout} 
                  className={`${user?.role === 'teacher' ? 'h-10 w-10' : 'h-8 w-8'} flex items-center justify-center text-slate-900 font-semibold hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-all duration-300 cursor-pointer shadow-sm border border-transparent hover:border-red-100 dark:hover:border-red-900/30`}
                  title="Logout"
                >
                  <LogOut className={user?.role === 'teacher' ? 'w-5 h-5' : 'w-4 h-4'} />
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className={`h-8 flex items-center justify-center text-primary-light bg-primary/10 border border-primary/20 hover:bg-primary/20 px-5 rounded-full font-black text-[10px] uppercase tracking-wider transition-all duration-300 shadow-sm`}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className={`h-8 flex items-center justify-center bg-primary hover:bg-primary-dark text-white px-5 rounded-full font-black text-[10px] uppercase tracking-wider shadow-sm transition-all duration-300`}
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburguer Toggle */}
          <div className="md:hidden flex items-center space-x-2.5">
            {user && (
              <Link 
                to="/notifications" 
                className="text-slate-900 font-semibold p-2 rounded-xl bg-slate-50 border border-slate-300 relative"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-4.5 h-4.5 bg-red-500 rounded-full border border-white text-[9px] font-black text-slate-900 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Link>
            )}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-semibold hover:bg-slate-200 transition-colors cursor-pointer"
            >
              {isMobileMenuOpen ? <X className="w-5.5 h-5.5" /> : <Menu className="w-5.5 h-5.5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Slide-down Glassmorphic Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 mt-1 bg-white/95 backdrop-blur-2xl border-b border-slate-200 shadow-2xl py-6 px-6 space-y-5">
          <div className="flex flex-col space-y-2">
            {(!user || (user.role !== 'teacher' && user.role !== 'admin')) && (
              <Link 
                to="/" 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-xl text-sm font-black uppercase tracking-wide ${
                  isActive('/') ? 'bg-brand-from/10 text-brand-to' : 'text-slate-900 font-semibold hover:bg-slate-50'
                }`}
              >
                Home
              </Link>
            )}
            {(!user || (user.role !== 'teacher' && user.role !== 'admin')) && (
              <Link 
                to="/search" 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-xl text-sm font-black uppercase tracking-wide ${
                  isActive('/search') ? 'bg-brand-from/10 text-brand-to' : 'text-slate-900 font-semibold hover:bg-slate-50'
                }`}
              >
                Find Classes
              </Link>
            )}
            <Link 
              to="/about" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={`px-4 py-3 rounded-xl text-sm font-black uppercase tracking-wide ${
                isActive('/about') ? 'bg-brand-from/10 text-brand-to' : 'text-slate-900 font-semibold hover:bg-slate-50'
              }`}
            >
              About
            </Link>
            <Link 
              to="/contact" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={`px-4 py-3 rounded-xl text-sm font-black uppercase tracking-wide ${
                isActive('/contact') ? 'bg-brand-from/10 text-brand-to' : 'text-slate-900 font-semibold hover:bg-slate-50'
              }`}
            >
              Contact
            </Link>
          </div>

          <div className="h-[1px] bg-slate-200 dark:bg-slate-800"></div>

          <div className="flex flex-col space-y-3">
            {user ? (
              <>
                <div className="flex items-center space-x-3 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-300">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-slate-900 text-sm font-black shadow-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-black text-slate-900">{user.name}</span>
                    <span className="text-[10px] text-slate-900 font-semibold font-medium uppercase tracking-wider">{user.role}</span>
                  </div>
                </div>

                {user.role === 'admin' && (
                  <Link 
                    to="/admin" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 w-full py-3 bg-primary/10 text-blue-700 dark:text-blue-400 text-sm font-medium rounded-xl"
                  >
                    Admin Panel
                  </Link>
                )}
                {user.role === 'teacher' && (
                  <Link 
                    to="/dashboard" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 w-full py-3 bg-primary/10 text-blue-700 dark:text-blue-400 text-sm font-medium rounded-xl"
                  >
                    <GraduationCap className="w-4.5 h-4.5" />
                    Teacher Dashboard
                  </Link>
                )}
                {user.role === 'student' && (
                  <Link 
                    to="/dashboard" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 w-full py-3 bg-secondary/10 text-emerald-700 dark:text-emerald-400 text-sm font-medium rounded-xl"
                  >
                    <UserIcon className="w-4.5 h-4.5" />
                    My Dashboard
                  </Link>
                )}

                <button 
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-medium rounded-xl transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Link 
                  to="/login" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="py-3 text-center text-primary-light bg-primary/10 border border-primary/20 hover:bg-primary/20 font-black text-sm rounded-xl transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="py-3 text-center bg-primary hover:bg-primary-dark text-white font-black text-sm rounded-xl shadow-md"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
