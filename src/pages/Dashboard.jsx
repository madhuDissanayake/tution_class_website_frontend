import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { PlusCircle, Edit, Trash2, Book, Calendar, Loader, FileText, Compass, Sparkles, AlertCircle, Users, Video } from 'lucide-react';
import axios from 'axios';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

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
          const { data: classes } = await axios.get(`/api/classes?teacherId=${user._id}`, config);
          setData(classes);
        } else if (user.role === 'student') {
          const { data: reservations } = await axios.get('/api/reservations/my', config);
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

      await axios.delete(`/api/classes/${classId}`, config);
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

      await axios.patch(`/api/reservations/${reservationId}/cancel`, {}, config);
      setData(data.map((res) => res._id === reservationId ? { ...res, status: 'cancelled' } : res));
      setSuccess('Reservation cancelled successfully!');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to cancel reservation');
    }
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto text-center mt-20 p-8 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm animate-fade-in">
        <Sparkles className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-pulse" />
        <p className="text-xl text-slate-600 dark:text-slate-300 mb-6 font-medium">Please log in to view your dashboard.</p>
        <Link to="/login" className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3.5 px-8 rounded-2xl shadow-md transition-all inline-block">
          Log In
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <Loader className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="text-slate-500 font-medium animate-pulse">Loading your dashboard...</p>
      </div>
    );
  }

  const renderStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-green inline-block"></span>
            confirmed
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
            <span className="w-2 h-2 rounded-full bg-slate-400 inline-block"></span>
            cancelled
          </span>
        );
      case 'pending':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200/50 dark:border-amber-800">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse-yellow inline-block"></span>
            pending
          </span>
        );
    }
  };

  const renderPendingState = (role) => (
    <div className="max-w-xl mx-auto text-center mt-20 p-10 bg-amber-50 dark:bg-slate-800 rounded-3xl border border-amber-200 dark:border-slate-700 shadow-sm animate-fade-in">
      <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-6" />
      <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">Account Pending Approval</h2>
      <p className="text-slate-600 dark:text-slate-300 font-medium text-lg">Your {role} account registration has been received and is currently pending admin approval. You will gain access to your dashboard once an admin verifies your details.</p>
    </div>
  );

  const renderRejectedState = (role) => (
    <div className="max-w-xl mx-auto text-center mt-20 p-10 bg-rose-50 dark:bg-slate-800 rounded-3xl border border-rose-200 dark:border-slate-700 shadow-sm animate-fade-in">
      <AlertCircle className="w-16 h-16 text-rose-500 mx-auto mb-6" />
      <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">Account Rejected</h2>
      <p className="text-slate-600 dark:text-slate-300 font-medium text-lg">Your {role} account registration was rejected by an administrator. Please contact support for more information.</p>
    </div>
  );

  const renderTeacherDashboard = () => {
    if (user.status === 'pending' || !user.status) return renderPendingState('teacher');
    if (user.status === 'rejected') return renderRejectedState('teacher');

    return (
    <div className="space-y-8 animate-slide-up pb-6 pt-0 px-4 md:px-0 -mt-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-4">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Teacher <span className="text-blue-600">Dashboard</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">Welcome back, <span className="text-blue-600 dark:text-blue-400 font-bold">{user.name}</span>! Let's inspire your classes today.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800">
        <div className="p-4 md:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
          <h2 className="text-lg md:text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            Your Active Classes 
            <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800 font-extrabold px-2.5 py-1 rounded-full">
              {data.length} Total
            </span>
          </h2>
        </div>
        <div className="p-4 md:p-6">
          {data.length === 0 ? (
            <div className="text-center py-10 text-slate-500 dark:text-slate-400 space-y-6 animate-fade-in max-w-sm mx-auto">
              <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-blue-500 mx-auto border border-slate-200 dark:border-slate-700">
                <Compass className="w-8 h-8 animate-spin-slow" />
              </div>
              <div className="space-y-2">
                <p className="text-lg font-bold text-slate-900 dark:text-white">No classes assigned yet.</p>
                <p className="text-sm">An admin will assign classes to your account soon.</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.map((cls, idx) => (
                <div key={cls._id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between min-h-[260px] group relative">
                  
                  <div className="p-5 space-y-3 relative z-10">
                    <div className="flex justify-between items-start">
                      <span className="bg-blue-600 text-white shadow-sm text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider">
                        {cls.subject}
                      </span>
                      <span className="text-slate-600 dark:text-slate-300 text-[10px] font-bold bg-slate-100 dark:bg-slate-700 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-600">
                        {cls.medium}
                      </span>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-extrabold text-slate-900 dark:text-white line-clamp-2 mt-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {cls.title}
                      </h3>
                      <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 mt-2 leading-relaxed font-medium">
                        {cls.description}
                      </p>
                    </div>
                    
                    <div className="flex flex-wrap items-center text-slate-600 dark:text-slate-300 text-xs font-bold gap-3 pt-2">
                      <div className="flex items-center bg-slate-50 dark:bg-slate-900/50 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
                        <Book className="w-3.5 h-3.5 mr-1.5 text-blue-500" /> {cls.grade}
                      </div>
                      <div className="flex items-center bg-slate-50 dark:bg-slate-900/50 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
                        <Calendar className="w-3.5 h-3.5 mr-1.5 text-indigo-500" /> {cls.schedule?.length || 0} Slots
                      </div>
                      <div className="flex items-center bg-slate-50 dark:bg-slate-900/50 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
                        <Users className="w-3.5 h-3.5 mr-1.5 text-emerald-500" /> {cls.availableSeats} / {cls.capacity} Free
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-slate-50 dark:bg-slate-800/50 px-5 py-3 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center relative z-10">
                    <span className="text-xl font-black text-slate-900 dark:text-white">Rs. {cls.fee}<span className="text-slate-500 dark:text-slate-400 text-[10px] font-bold ml-1 uppercase">/mo</span></span>
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
      <div className="relative overflow-hidden bg-blue-50 dark:bg-slate-800 rounded-2xl p-6 mb-6 border border-blue-100 dark:border-slate-700 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        
        {/* Banner Image Background */}
        <div className="absolute right-0 top-0 bottom-0 w-full md:w-1/2 lg:w-5/12 z-0 hidden md:block opacity-90">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50 dark:from-slate-800 via-blue-50/80 dark:via-slate-800/80 to-transparent z-10"></div>
          <img src="/images/student_dashboard_banner.png" alt="Student Dashboard" className="w-full h-full object-cover object-left" />
        </div>

        {/* Content */}
        <div className="space-y-4 relative z-10 max-w-xl w-full">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Student <span className="text-blue-600">Dashboard</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-300 font-medium text-lg">
            Welcome back, <span className="text-blue-700 dark:text-blue-400 font-extrabold">{user.name}</span>! Track and manage your reservations.
          </p>
          <div className="pt-2">
            <Link 
              to="/search" 
              className="bg-blue-600 hover:bg-blue-700 text-white inline-flex items-center px-6 py-3.5 rounded-2xl transition-all shadow-md transform hover:-translate-y-0.5 font-bold text-sm cursor-pointer w-max"
            >
              Find New Classes
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800">
        <div className="p-4 md:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
          <h2 className="text-lg md:text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            My Reservations 
            <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800 font-extrabold px-2.5 py-1 rounded-full">
              {data.length} Seats
            </span>
          </h2>
        </div>
        <div className="p-4 md:p-6">
          {data.length === 0 ? (
            <div className="text-center py-10 text-slate-500 dark:text-slate-400 space-y-6 max-w-sm mx-auto">
              <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-blue-500 mx-auto border border-slate-200 dark:border-slate-700 shadow-sm">
                <Compass className="w-8 h-8 animate-spin-slow" />
              </div>
              <div className="space-y-2">
                <p className="text-lg font-bold text-slate-900 dark:text-white">You haven't reserved any classes.</p>
                <p className="text-sm">Explore catalog of amazing tutors and lock in your seat today.</p>
              </div>
              <Link to="/search" className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3 px-6 rounded-xl transition-all shadow-md inline-block text-sm">
                Browse available classes
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {data.map((res) => {
                const cls = res.classId;
                if (!cls) return null;
                return (
                  <div key={res._id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 group hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 bg-blue-500 h-full"></div>
                    <div className="space-y-3 w-full pl-2 relative z-10">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="text-lg md:text-xl font-extrabold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {cls.title}
                        </h3>
                        {renderStatusBadge(res.status)}
                      </div>
                      
                      <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-600 dark:text-slate-300">
                        <span className="bg-slate-50 dark:bg-slate-900/50 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                          Subject: {cls.subject}
                        </span>
                        <span className="bg-slate-50 dark:bg-slate-900/50 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                          Medium: {cls.medium}
                        </span>
                        <span className="bg-slate-50 dark:bg-slate-900/50 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                          Grade: {cls.grade}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-semibold pt-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                        Teacher: <span className="text-slate-700 dark:text-slate-200 font-bold">{cls.teacherId?.name || 'Unknown Teacher'}</span> 
                        {cls.teacherId?.email && <span className="font-normal">({cls.teacherId.email})</span>}
                      </div>
                    </div>

                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto shrink-0 border-t md:border-t-0 border-slate-100 dark:border-slate-700 pt-4 md:pt-0 gap-4 relative z-10">
                      <div className="text-left md:text-right">
                        <span className="text-2xl font-black text-slate-900 dark:text-white block">Rs. {cls.fee}</span>
                        <span className="text-slate-500 dark:text-slate-400 text-[10px] font-bold block uppercase tracking-wider">per month</span>
                      </div>
                      
                      <div className="flex gap-2 items-center">
                        {res.status === 'confirmed' && cls.isOnline && cls.groupLink && (
                          <a 
                            href={cls.groupLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-600 hover:text-white text-emerald-600 dark:text-emerald-400 font-extrabold py-2 px-4 rounded-xl transition-all border border-emerald-200 dark:border-emerald-800 hover:border-emerald-600 text-xs flex items-center gap-1"
                          >
                            <Video className="w-3.5 h-3.5" /> Join Group
                          </a>
                        )}
                        {res.status !== 'cancelled' && (
                          <button
                            onClick={() => handleCancelReservation(res._id)}
                            className="bg-rose-50 dark:bg-rose-900/20 hover:bg-rose-600 hover:text-white text-rose-600 dark:text-rose-400 font-extrabold py-2 px-4 rounded-xl transition-all border border-rose-200 dark:border-rose-800 hover:border-rose-600 text-xs cursor-pointer"
                          >
                            Cancel Seat
                          </button>
                        )}
                        <Link 
                          to={`/class/${cls._id}`} 
                          className="bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-600 hover:text-white text-blue-600 dark:text-blue-400 font-extrabold py-2 px-4 rounded-xl transition-all border border-blue-200 dark:border-blue-800 hover:border-blue-600 text-xs"
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
          <div className="flex items-center gap-2 font-bold">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            <span>{success}</span>
          </div>
          <button onClick={() => setSuccess(null)} className="text-emerald-800 hover:text-emerald-950 font-black text-xl leading-none">×</button>
        </div>
      )}
      
      {error && (
        <div className="bg-rose-50 text-rose-800 p-5 rounded-2xl border border-rose-100 shadow-sm mb-6 flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2 font-bold">
            <AlertCircle className="w-5 h-5 text-rose-600" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)} className="text-rose-800 hover:text-rose-950 font-black text-xl leading-none">×</button>
        </div>
      )}

      {user.role === 'teacher' ? renderTeacherDashboard() : renderStudentDashboard()}
    </div>
  );
};

export default Dashboard;
