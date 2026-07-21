import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { PlusCircle, Edit, Trash2, Book, Calendar, Loader, FileText, Compass, Sparkles, AlertCircle, Users, Video, Wallet, ArrowUpRight, Landmark } from 'lucide-react';
import axios from 'axios';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // ── Teacher earnings/wallet state ──
  const [earnings, setEarnings] = useState(null);
  const [earningsLoading, setEarningsLoading] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [withdrawError, setWithdrawError] = useState(null);
  const [payoutForm, setPayoutForm] = useState({ bankName: '', accountName: '', accountNumber: '', branch: '' });
  const [payoutLoading, setPayoutLoading] = useState(false);
  const [payoutError, setPayoutError] = useState(null);

  const authConfig = user?.token ? { headers: { Authorization: `Bearer ${user.token}` } } : null;

  useEffect(() => {
    if (!user) return;

    if (user.role === 'admin') {
      navigate('/admin');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };

        if (user.role === 'teacher') {
          const { data: classes } = await axios.get(import.meta.env.VITE_API_URL + `/api/classes?teacherId=${user._id}&includeAll=true`, config);
          setData(classes);
        } else if (user.role === 'student') {
          const { data: reservations } = await axios.get(import.meta.env.VITE_API_URL + '/api/reservations/my', config);
          setData(reservations);
        }
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, navigate]);

  const fetchEarnings = async () => {
    if (!user || user.role !== 'teacher' || user.status !== 'approved') return;
    try {
      setEarningsLoading(true);
      const { data } = await axios.get(import.meta.env.VITE_API_URL + '/api/earnings/my', authConfig);
      setEarnings(data);
      setPayoutForm(data.payoutDetails?.accountNumber ? data.payoutDetails : payoutForm);
    } catch (err) {
      console.error('Failed to fetch earnings', err);
    } finally {
      setEarningsLoading(false);
    }
  };

  useEffect(() => {
    fetchEarnings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleDeleteClass = async (classId) => {
    if (!window.confirm('Are you sure you want to delete this class?')) return;

    try {
      setError(null);
      setSuccess(null);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      await axios.delete(import.meta.env.VITE_API_URL + `/api/classes/${classId}`, config);
      setData(data.filter((c) => c._id !== classId));
      setSuccess('Class deleted successfully!');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to delete class');
    }
  };

  const handleCancelReservation = async (reservationId) => {
    if (!window.confirm('Are you sure you want to cancel this reservation?')) return;

    try {
      setError(null);
      setSuccess(null);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      await axios.patch(import.meta.env.VITE_API_URL + `/api/reservations/${reservationId}/cancel`, {}, config);
      setData(data.map((res) => res._id === reservationId ? { ...res, status: 'cancelled' } : res));
      setSuccess('Reservation cancelled successfully!');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to cancel reservation');
    }
  };

  const handleSavePayoutDetails = async (e) => {
    e.preventDefault();
    try {
      setPayoutLoading(true);
      setPayoutError(null);
      await axios.put(import.meta.env.VITE_API_URL + '/api/earnings/payout-details', payoutForm, authConfig);
      setShowPayoutModal(false);
      await fetchEarnings();
    } catch (err) {
      setPayoutError(err.response?.data?.message || 'Failed to save payout details');
    } finally {
      setPayoutLoading(false);
    }
  };

  const handleRequestWithdrawal = async (e) => {
    e.preventDefault();
    try {
      setWithdrawLoading(true);
      setWithdrawError(null);
      await axios.post(
        import.meta.env.VITE_API_URL + '/api/earnings/withdraw',
        { amount: Number(withdrawAmount) },
        authConfig
      );
      setShowWithdrawModal(false);
      setWithdrawAmount('');
      setSuccess('Withdrawal request submitted! Admin will process it shortly.');
      await fetchEarnings();
    } catch (err) {
      setWithdrawError(err.response?.data?.message || 'Failed to submit withdrawal request');
    } finally {
      setWithdrawLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto text-center mt-20 p-8 bg-surface-800 rounded-3xl border border-surface-600 shadow-card animate-fade-in">
        <Sparkles className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse" />
        <p className="text-xl text-muted-400 mb-6 font-medium">Please log in to view your dashboard.</p>
        <Link to="/login" className="bg-primary hover:bg-primary-dark text-white font-semibold py-3.5 px-8 rounded-2xl shadow-glow-primary transition-all inline-block">
          Log In
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <Loader className="w-12 h-12 text-primary animate-spin" />
        <p className="text-muted-500 font-medium animate-pulse">Loading your dashboard...</p>
      </div>
    );
  }

  const renderStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-green inline-block"></span>
            confirmed
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
            <span className="w-2 h-2 rounded-full bg-slate-400 inline-block"></span>
            cancelled
          </span>
        );
      case 'pending':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200/50 dark:border-amber-800">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse-yellow inline-block"></span>
            pending
          </span>
        );
    }
  };

  const renderWithdrawalStatusBadge = (status) => {
    const map = {
      pending: 'bg-amber-50 text-amber-700 border-amber-200/50',
      approved: 'bg-blue-50 text-blue-700 border-blue-200/50',
      paid: 'bg-emerald-50 text-emerald-700 border-emerald-200/50',
      rejected: 'bg-rose-50 text-rose-700 border-rose-200/50'
    };
    return (
      <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${map[status] || map.pending}`}>
        {status}
      </span>
    );
  };

  const renderPendingState = (role) => (
    <div className="max-w-xl mx-auto text-center mt-20 p-10 bg-surface-800 rounded-3xl border border-surface-600 shadow-card animate-fade-in">
      <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-6" />
      <h2 className="text-3xl font-black text-white mb-4 tracking-tight">Account Pending Approval</h2>
      <p className="text-muted-400 font-medium text-lg">Your {role} account registration has been received and is currently pending admin approval. You will gain access to your dashboard once an admin verifies your details.</p>
    </div>
  );

  const renderRejectedState = (role) => (
    <div className="max-w-xl mx-auto text-center mt-20 p-10 bg-surface-800 rounded-3xl border border-surface-600 shadow-card animate-fade-in">
      <AlertCircle className="w-16 h-16 text-rose-500 mx-auto mb-6" />
      <h2 className="text-3xl font-black text-white mb-4 tracking-tight">Account Rejected</h2>
      <p className="text-muted-400 font-medium text-lg">Your {role} account registration was rejected by an administrator. Please contact support for more information.</p>
    </div>
  );

  const renderEarningsCard = () => (
    <div className="bg-surface-900 rounded-2xl overflow-hidden shadow-card border border-surface-600">
      <div className="p-4 md:p-5 border-b border-surface-600 flex items-center justify-between bg-surface-800/50">
        <h2 className="text-lg md:text-xl font-semibold text-white flex items-center gap-2">
          <Wallet className="w-5 h-5 text-primary-light" /> Earnings Wallet
        </h2>
        <span className="text-xs bg-primary-dark/30 text-primary-light border border-primary-dark/50 font-semibold px-2.5 py-1 rounded-full">
          You keep 90% · 10% platform fee
        </span>
      </div>
      <div className="p-4 md:p-6 space-y-6">
        {earningsLoading && !earnings ? (
          <div className="flex justify-center py-6"><Loader className="w-6 h-6 animate-spin text-primary" /></div>
        ) : earnings ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-surface-800/50 border border-surface-700 p-4 rounded-xl text-center">
                <span className="text-[10px] text-white opacity-50 font-medium uppercase tracking-[1px] block mb-1">Available</span>
                <span className="text-xl text-white font-black">Rs. {earnings.wallet.available.toLocaleString()}</span>
              </div>
              <div className="bg-surface-800/50 border border-surface-700 p-4 rounded-xl text-center">
                <span className="text-[10px] text-white opacity-50 font-medium uppercase tracking-[1px] block mb-1">Pending Payout</span>
                <span className="text-xl text-white font-black">Rs. {earnings.wallet.pendingWithdrawal.toLocaleString()}</span>
              </div>
              <div className="bg-surface-800/50 border border-surface-700 p-4 rounded-xl text-center">
                <span className="text-[10px] text-white opacity-50 font-medium uppercase tracking-[1px] block mb-1">Total Earned</span>
                <span className="text-xl text-white font-black">Rs. {earnings.wallet.totalEarned.toLocaleString()}</span>
              </div>
              <div className="bg-surface-800/50 border border-surface-700 p-4 rounded-xl text-center">
                <span className="text-[10px] text-white opacity-50 font-medium uppercase tracking-[1px] block mb-1">Total Withdrawn</span>
                <span className="text-xl text-white font-black">Rs. {earnings.wallet.totalWithdrawn.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowWithdrawModal(true)}
                disabled={earnings.wallet.available < earnings.minWithdrawalAmount}
                className="flex-1 bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-5 rounded-xl shadow-glow-primary transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                <ArrowUpRight className="w-4 h-4" /> Request Withdrawal
              </button>
              <button
                onClick={() => setShowPayoutModal(true)}
                className="flex-1 bg-surface-800 hover:bg-surface-700 text-white font-medium py-3 px-5 rounded-xl border border-surface-600 transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                <Landmark className="w-4 h-4" /> {earnings.payoutDetails?.accountNumber ? 'Update' : 'Add'} Bank Details
              </button>
            </div>
            {earnings.wallet.available < earnings.minWithdrawalAmount && (
              <p className="text-xs text-muted-500 font-medium">Minimum withdrawal amount is Rs. {earnings.minWithdrawalAmount}.</p>
            )}

            {earnings.withdrawals?.length > 0 && (
              <div className="pt-4 border-t border-surface-700">
                <h4 className="text-sm font-semibold text-white mb-3">Withdrawal History</h4>
                <div className="space-y-2">
                  {earnings.withdrawals.map((w) => (
                    <div key={w._id} className="flex items-center justify-between bg-surface-800/50 border border-surface-700 rounded-xl px-4 py-2.5">
                      <div>
                        <span className="text-white font-semibold text-sm">Rs. {w.amount.toLocaleString()}</span>
                        <span className="text-muted-500 text-[10px] font-medium ml-2">{new Date(w.createdAt).toLocaleDateString()}</span>
                      </div>
                      {renderWithdrawalStatusBadge(w.status)}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : null}
      </div>
    </div>
  );

  const renderTeacherDashboard = () => {
    if (user.status === 'pending' || !user.status) return renderPendingState('teacher');
    if (user.status === 'rejected') return renderRejectedState('teacher');

    return (
    <div className="space-y-8 animate-slide-up pb-6 pt-0 px-4 md:px-0 -mt-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-4">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-surface-700 bg-surface-800 flex items-center justify-center overflow-hidden shrink-0 shadow-lg">
            {user.profilePicture ? (
              <img src={`${import.meta.env.VITE_API_URL}${user.profilePicture}`} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-2xl font-black text-white">{user.name.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <div className="space-y-1">
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
              Teacher <span className="text-primary-light">Dashboard</span>
            </h1>
            <p className="text-muted-400 font-medium text-lg">Welcome back, <span className="text-primary-light font-medium">{user.name}</span>! Let's inspire your classes today.</p>
          </div>
        </div>
        <Link
          to="/teacher/create-class"
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold px-5 py-2.5 rounded-xl shadow-md shadow-indigo-500/20 transition-all shrink-0 text-sm"
        >
          <PlusCircle className="w-4 h-4" /> Create New Class
        </Link>
      </div>

      {renderEarningsCard()}

      <div className="bg-surface-900 rounded-2xl overflow-hidden shadow-card border border-surface-600">
        <div className="p-4 md:p-5 border-b border-surface-600 flex items-center justify-between bg-surface-800/50">
          <h2 className="text-lg md:text-xl font-semibold text-white flex items-center gap-2">
            My Classes
            <span className="text-xs bg-primary-dark/30 text-primary-light border border-primary-dark/50 font-semibold px-2.5 py-1 rounded-full">
              {data.length} Total
            </span>
          </h2>
        </div>
        <div className="p-4 md:p-6">
          {data.length === 0 ? (
            <div className="text-center py-10 text-muted-400 space-y-6 animate-fade-in max-w-sm mx-auto">
              <div className="w-16 h-16 bg-surface-800 rounded-2xl flex items-center justify-center text-primary-light mx-auto border border-surface-600">
                <Compass className="w-8 h-8 animate-spin-slow" />
              </div>
              <div className="space-y-2">
                <p className="text-lg font-medium text-white">No classes yet.</p>
                <p className="text-sm">Create your first class and submit it for admin approval.</p>
              </div>
              <Link to="/teacher/create-class" className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-all text-sm">
                <PlusCircle className="w-4 h-4" /> Create First Class
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.map((cls, idx) => (
                <div key={cls._id} className="bg-surface-800 border border-surface-600 rounded-2xl overflow-hidden hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between min-h-[260px] group relative">

                  <div className="p-5 space-y-3 relative z-10">
                    <div className="flex justify-between items-start flex-wrap gap-1">
                      <span className="bg-primary text-white shadow-sm text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider">
                        {cls.subject}
                      </span>
                      <div className="flex items-center gap-1.5">
                        {cls.status === 'pending' && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">⏳ Pending</span>
                        )}
                        {cls.status === 'rejected' && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">✗ Rejected</span>
                        )}
                        {(cls.status === 'published' || !cls.status) && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">✓ Live</span>
                        )}
                        <span className="text-white text-[10px] font-medium bg-surface-700 px-2.5 py-1 rounded-lg border border-surface-500">
                          {cls.medium}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-white line-clamp-2 mt-2 group-hover:text-primary-light transition-colors">
                        {cls.title}
                      </h3>
                      <p className="text-muted-400 text-sm line-clamp-2 mt-2 leading-relaxed font-medium">
                        {cls.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center text-muted-400 text-xs font-medium gap-3 pt-2">
                      <div className="flex items-center bg-surface-900/50 px-2.5 py-1.5 rounded-lg border border-surface-700">
                        <Book className="w-3.5 h-3.5 mr-1.5 text-primary-light" /> {cls.grade}
                      </div>
                      <div className="flex items-center bg-surface-900/50 px-2.5 py-1.5 rounded-lg border border-surface-700">
                        <Calendar className="w-3.5 h-3.5 mr-1.5 text-primary-light" /> {cls.schedule?.length || 0} Slots
                      </div>
                      <div className="flex items-center bg-surface-900/50 px-2.5 py-1.5 rounded-lg border border-surface-700">
                        <Users className="w-3.5 h-3.5 mr-1.5 text-emerald-500" /> {cls.availableSeats} / {cls.capacity} Free
                      </div>
                    </div>
                  </div>

                  <div className="bg-surface-800/50 px-5 py-3 border-t border-surface-700 flex justify-between items-center relative z-10">
                    <span className="text-xl font-black text-white">Rs. {cls.fee}<span className="text-muted-500 text-[10px] font-medium ml-1 uppercase">/mo</span></span>
                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/manage-students/${cls._id}`}
                        className="p-2.5 text-emerald-600 hover:text-white transition-all bg-emerald-50 hover:bg-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 dark:hover:bg-emerald-600 dark:hover:text-white rounded-xl border border-emerald-100 dark:border-emerald-800 shadow-sm block"
                        title="Manage Students"
                      >
                        <Users className="w-4.5 h-4.5" />
                      </Link>
                      <Link
                        to={`/class/${cls._id}`}
                        className="p-2.5 text-blue-600 hover:text-white transition-all bg-blue-50 hover:bg-blue-600 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-600 dark:hover:text-white rounded-xl border border-blue-100 dark:border-blue-800 shadow-sm"
                        title="View Class"
                      >
                        <FileText className="w-4.5 h-4.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
    );
  };

  const renderStudentDashboard = () => {
    if (user.status === 'pending' || !user.status) return renderPendingState('student');
    if (user.status === 'rejected') return renderRejectedState('student');

    return (
    <div className="space-y-6 animate-slide-up pb-6 pt-0 px-4 md:px-0 -mt-6">
      {/* Dashboard Banner */}
      <div className="relative overflow-hidden bg-primary/5 rounded-2xl p-6 mb-6 border border-primary/20 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">

        {/* Banner Image Background */}
        <div className="absolute right-0 top-0 bottom-0 w-full md:w-1/2 lg:w-5/12 z-0 hidden md:block opacity-90">
          <div className="absolute inset-0 bg-gradient-to-r from-surface-950 via-surface-950/80 to-transparent z-10"></div>
          <img src="/images/student_dashboard_banner.png" alt="Student Dashboard" className="w-full h-full object-cover object-left" />
        </div>

        {/* Content */}
        <div className="space-y-4 relative z-10 max-w-xl w-full">
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            Student <span className="text-primary-light">Dashboard</span>
          </h1>
          <p className="text-muted-400 font-medium text-lg">
            Welcome back, <span className="text-primary-light font-semibold">{user.name}</span>! Track and manage your reservations.
          </p>
          <div className="pt-2">
            <Link
              to="/search"
              className="bg-primary hover:bg-primary-dark text-white inline-flex items-center px-6 py-3.5 rounded-2xl transition-all shadow-glow-primary transform hover:-translate-y-0.5 font-medium text-sm cursor-pointer w-max"
            >
              Find New Classes
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-surface-900 rounded-2xl overflow-hidden shadow-card border border-surface-600">
        <div className="p-4 md:p-5 border-b border-surface-600 flex items-center justify-between bg-surface-800/50">
          <h2 className="text-lg md:text-xl font-semibold text-white flex items-center gap-2">
            My Reservations
            <span className="text-xs bg-primary-dark/30 text-primary-light border border-primary-dark/50 font-semibold px-2.5 py-1 rounded-full">
              {data.length} Seats
            </span>
          </h2>
        </div>
        <div className="p-4 md:p-6">
          {data.length === 0 ? (
            <div className="text-center py-10 text-muted-400 space-y-6 max-w-sm mx-auto">
              <div className="w-16 h-16 bg-surface-800 rounded-2xl flex items-center justify-center text-primary-light mx-auto border border-surface-600 shadow-card">
                <Compass className="w-8 h-8 animate-spin-slow" />
              </div>
              <div className="space-y-2">
                <p className="text-lg font-medium text-white">You haven't reserved any classes.</p>
                <p className="text-sm">Explore catalog of amazing tutors and lock in your seat today.</p>
              </div>
              <Link to="/search" className="bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-glow-primary inline-block text-sm">
                Browse available classes
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {data.map((res) => {
                const cls = res.classId;
                if (!cls) return null;
                return (
                  <div key={res._id} className="bg-surface-800 border border-surface-600 rounded-2xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 group hover:-translate-y-0.5 hover:shadow-card-hover transition-all duration-300 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 bg-primary-light h-full"></div>
                    <div className="space-y-3 w-full pl-2 relative z-10">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="text-lg md:text-xl font-semibold text-white group-hover:text-primary-light transition-colors">
                          {cls.title}
                        </h3>
                        {renderStatusBadge(res.status)}
                      </div>

                      <div className="flex flex-wrap gap-4 text-xs font-medium text-muted-400">
                        <span className="bg-surface-900/50 px-2.5 py-1 rounded-lg border border-surface-700">
                          Subject: {cls.subject}
                        </span>
                        <span className="bg-surface-900/50 px-2.5 py-1 rounded-lg border border-surface-700">
                          Medium: {cls.medium}
                        </span>
                        <span className="bg-surface-900/50 px-2.5 py-1 rounded-lg border border-surface-700">
                          Grade: {cls.grade}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-muted-500 text-xs font-semibold pt-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-muted-500"></span>
                        Teacher: <span className="text-white font-medium">{cls.teacherId?.name || 'Unknown Teacher'}</span>
                        {cls.teacherId?.email && <span className="font-normal">({cls.teacherId.email})</span>}
                      </div>
                    </div>

                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto shrink-0 border-t md:border-t-0 border-surface-700 pt-4 md:pt-0 gap-4 relative z-10">
                      <div className="text-left md:text-right">
                        <span className="text-2xl font-black text-white block">Rs. {cls.fee}</span>
                        <span className="text-muted-500 text-[10px] font-medium block uppercase tracking-wider">per month</span>
                      </div>

                      <div className="flex gap-2 items-center">
                        {res.status === 'confirmed' && cls.isOnline && cls.groupLink && (
                          <a
                            href={cls.groupLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-emerald-900/20 hover:bg-emerald-600 hover:text-white text-emerald-400 font-semibold py-2 px-4 rounded-xl transition-all border border-emerald-800 hover:border-emerald-600 text-xs flex items-center gap-1"
                          >
                            <Video className="w-3.5 h-3.5" /> Join Group
                          </a>
                        )}
                        {res.status !== 'cancelled' && (
                          <button
                            onClick={() => handleCancelReservation(res._id)}
                            className="bg-rose-900/20 hover:bg-rose-600 hover:text-white text-rose-400 font-semibold py-2 px-4 rounded-xl transition-all border border-rose-800 hover:border-rose-600 text-xs cursor-pointer"
                          >
                            Cancel Seat
                          </button>
                        )}
                        <Link
                          to={`/class/${cls._id}`}
                          className="bg-primary/20 hover:bg-primary hover:text-white text-primary-light font-semibold py-2 px-4 rounded-xl transition-all border border-primary-dark/50 hover:border-primary text-xs"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 md:px-0 min-h-[80vh]">
      {success && (
        <div className="bg-emerald-50 text-emerald-800 p-5 rounded-2xl border border-emerald-100 shadow-sm mb-6 flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2 font-medium">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            <span>{success}</span>
          </div>
          <button onClick={() => setSuccess(null)} className="text-emerald-800 hover:text-emerald-950 font-black text-xl leading-none">×</button>
        </div>
      )}

      {error && (
        <div className="bg-rose-50 text-rose-800 p-5 rounded-2xl border border-rose-100 shadow-sm mb-6 flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2 font-medium">
            <AlertCircle className="w-5 h-5 text-rose-600" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)} className="text-rose-800 hover:text-rose-950 font-black text-xl leading-none">×</button>
        </div>
      )}

      {user.role === 'teacher' ? renderTeacherDashboard() : renderStudentDashboard()}

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface-950/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-surface-900 border border-surface-700 rounded-3xl p-6 md:p-8 w-full max-w-md shadow-2xl relative">
            <button onClick={() => setShowWithdrawModal(false)} className="absolute top-4 right-4 p-2 bg-surface-800 hover:bg-surface-700 rounded-full text-muted-400 transition-colors">×</button>
            <h3 className="text-xl font-black text-white mb-1">Request Withdrawal</h3>
            <p className="text-muted-500 text-sm font-medium mb-6">
              Available balance: Rs. {earnings?.wallet.available.toLocaleString()}
            </p>

            {withdrawError && (
              <div className="bg-rose-50 text-rose-600 p-3 rounded-xl mb-4 text-xs font-medium border border-rose-100 text-center">
                {withdrawError}
              </div>
            )}

            <form onSubmit={handleRequestWithdrawal} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-muted-400 uppercase tracking-wider mb-2">Amount (Rs.)</label>
                <input
                  type="number"
                  min={earnings?.minWithdrawalAmount || 500}
                  max={earnings?.wallet.available || 0}
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full px-4 py-3 border border-surface-600 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-white bg-surface-800 font-medium text-sm"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={withdrawLoading}
                className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {withdrawLoading ? <Loader className="w-4 h-4 animate-spin" /> : 'Submit Request'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Payout Details Modal */}
      {showPayoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface-950/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-surface-900 border border-surface-700 rounded-3xl p-6 md:p-8 w-full max-w-md shadow-2xl relative">
            <button onClick={() => setShowPayoutModal(false)} className="absolute top-4 right-4 p-2 bg-surface-800 hover:bg-surface-700 rounded-full text-muted-400 transition-colors">×</button>
            <h3 className="text-xl font-black text-white mb-1">Bank / Payout Details</h3>
            <p className="text-muted-500 text-sm font-medium mb-6">Used when we process your withdrawal requests.</p>

            {payoutError && (
              <div className="bg-rose-50 text-rose-600 p-3 rounded-xl mb-4 text-xs font-medium border border-rose-100 text-center">
                {payoutError}
              </div>
            )}

            <form onSubmit={handleSavePayoutDetails} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-muted-400 uppercase tracking-wider mb-2">Bank Name</label>
                <input
                  type="text"
                  value={payoutForm.bankName}
                  onChange={(e) => setPayoutForm({ ...payoutForm, bankName: e.target.value })}
                  className="w-full px-4 py-3 border border-surface-600 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-white bg-surface-800 font-medium text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-400 uppercase tracking-wider mb-2">Account Holder Name</label>
                <input
                  type="text"
                  value={payoutForm.accountName}
                  onChange={(e) => setPayoutForm({ ...payoutForm, accountName: e.target.value })}
                  className="w-full px-4 py-3 border border-surface-600 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-white bg-surface-800 font-medium text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-400 uppercase tracking-wider mb-2">Account Number</label>
                <input
                  type="text"
                  value={payoutForm.accountNumber}
                  onChange={(e) => setPayoutForm({ ...payoutForm, accountNumber: e.target.value })}
                  className="w-full px-4 py-3 border border-surface-600 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-white bg-surface-800 font-medium text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-400 uppercase tracking-wider mb-2">Branch (optional)</label>
                <input
                  type="text"
                  value={payoutForm.branch}
                  onChange={(e) => setPayoutForm({ ...payoutForm, branch: e.target.value })}
                  className="w-full px-4 py-3 border border-surface-600 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-white bg-surface-800 font-medium text-sm"
                />
              </div>
              <button
                type="submit"
                disabled={payoutLoading}
                className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {payoutLoading ? <Loader className="w-4 h-4 animate-spin" /> : 'Save Details'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;