import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Loader, Users, BookOpen, Bell, Trash2, Mail, ChevronDown, ChevronRight, Edit, PlusCircle } from 'lucide-react';

const AdminPanel = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [pendingReservations, setPendingReservations] = useState([]);
  const [featuredTutors, setFeaturedTutors] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalClasses: 0, totalReservations: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Teacher Classes State
  const [expandedTeacher, setExpandedTeacher] = useState(null);
  const [teacherClasses, setTeacherClasses] = useState([]);
  const [loadingClasses, setLoadingClasses] = useState(false);

  const approvedTeachers = users.filter(u => u.role === 'teacher' && u.status === 'approved');

  const [newTutor, setNewTutor] = useState({ name: '', subject: '', studentsCount: '', rating: 5, themeColor: 'indigo' });

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };

        const [statsRes, usersRes, tutorsRes, pendingRes, pendingResvRes] = await Promise.all([
          axios.get('/api/admin/stats', config),
          axios.get('/api/admin/users', config),
          axios.get('/api/admin/featured-tutors', config),
          axios.get('/api/admin/pending-users', config),
          axios.get('/api/admin/pending-reservations', config)
        ]);

        setStats({ ...statsRes.data });
        setUsers(usersRes.data);
        setFeaturedTutors(tutorsRes.data);
        setPendingUsers(pendingRes.data);
        setPendingReservations(pendingResvRes.data);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Failed to fetch admin dashboard data');
      } finally {
        setLoading(false);
      }
    };

    if (user && user.token) {
      fetchAdminData();
    }
  }, [user]);

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      setError(null);
      setSuccess(null);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      await axios.delete(`/api/admin/users/${id}`, config);
      setUsers(users.filter((u) => u._id !== id));
      setSuccess('User deleted successfully!');

      setStats(prev => ({
        ...prev,
        totalUsers: Math.max(0, prev.totalUsers - 1)
      }));
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleAddTutor = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      setSuccess(null);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.post('/api/admin/featured-tutors', newTutor, config);
      setFeaturedTutors([data, ...featuredTutors]);
      setSuccess('Tutor added successfully!');
      setNewTutor({ name: '', subject: '', studentsCount: '', rating: 5, themeColor: 'indigo' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add tutor');
    }
  };

  const handleDeleteTutor = async (id) => {
    if (!window.confirm('Delete this featured tutor?')) return;
    try {
      setError(null);
      setSuccess(null);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.delete(`/api/admin/featured-tutors/${id}`, config);
      setFeaturedTutors(featuredTutors.filter(t => t._id !== id));
      setSuccess('Tutor deleted successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete tutor');
    }
  };

  const handleApproveUser = async (id, role) => {
    try {
      setError(null); setSuccess(null);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`/api/admin/approve-user/${id}`, {}, config);
      setPendingUsers(pendingUsers.filter(u => u._id !== id));
      setSuccess('User approved successfully!');
      
      if (role === 'teacher') {
        navigate(`/create-class?teacherId=${id}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to approve user');
    }
  };

  const handleApproveReservation = async (id) => {
    try {
      setError(null); setSuccess(null);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.patch(`/api/reservations/${id}/confirm`, {}, config);
      setPendingReservations(pendingReservations.filter(r => r._id !== id));
      setSuccess('Seat reservation approved successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to approve reservation');
    }
  };

  const fetchTeacherClasses = async (teacherId) => {
    if (expandedTeacher === teacherId) {
      setExpandedTeacher(null);
      return;
    }
    setExpandedTeacher(teacherId);
    setLoadingClasses(true);
    try {
      const { data } = await axios.get(`/api/classes?teacherId=${teacherId}`);
      setTeacherClasses(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingClasses(false);
    }
  };

  const handleDeleteClass = async (classId) => {
    if (!window.confirm('Are you sure you want to delete this class?')) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.delete(`/api/classes/${classId}`, config);
      setTeacherClasses(teacherClasses.filter(c => c._id !== classId));
      setSuccess('Class deleted successfully!');
    } catch (err) {
      console.error(err);
      setError('Failed to delete class');
    }
  };

  const handleRejectUser = async (id) => {
    try {
      setError(null); setSuccess(null);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`/api/admin/reject-user/${id}`, {}, config);
      setPendingUsers(pendingUsers.filter(u => u._id !== id));
      setSuccess('User rejected successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reject user');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4 animate-fade-in">
        <Loader className="w-12 h-12 text-primary animate-spin" />
        <p className="text-gray-500 font-medium animate-pulse">Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto animate-fade-in space-y-8 relative">
      {/* Decorative Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 relative z-10">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 tracking-tight">Admin Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium text-sm">Manage users, classes, and reservations system-wide.</p>
        </div>
      </div>

      {success && (
        <div className="bg-green-50 text-green-700 p-4 rounded-xl border border-green-200 flex items-center justify-between animate-fade-in">
          <span className="font-semibold">{success}</span>
          <button onClick={() => setSuccess(null)} className="text-green-700 hover:text-green-900 font-bold ml-4 text-xl">×</button>
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 flex items-center justify-between animate-fade-in">
          <span className="font-semibold">{error}</span>
          <button onClick={() => setError(null)} className="text-red-700 hover:text-red-900 font-bold ml-4 text-xl">×</button>
        </div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="group relative bg-white dark:bg-slate-900/50 dark:backdrop-blur-xl p-4 rounded-2xl shadow-sm hover:shadow-indigo-500/10 border border-slate-200 dark:border-slate-700 hover:border-indigo-500/30 transition-all duration-300 transform hover:-translate-y-0.5 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative flex items-center space-x-4 z-10">
            <div className="p-3 bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-500/20 dark:to-indigo-500/10 rounded-xl text-indigo-600 dark:text-indigo-400 shadow-inner group-hover:scale-110 transition-transform duration-300">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-slate-500 dark:text-slate-400 font-bold text-[10px] uppercase tracking-wider mb-0.5">Total Users</h3>
              <p className="text-xl font-bold text-slate-900 dark:text-white">{stats.totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="group relative bg-white dark:bg-slate-900/50 dark:backdrop-blur-xl p-4 rounded-2xl shadow-sm hover:shadow-emerald-500/10 border border-slate-200 dark:border-slate-700 hover:border-emerald-500/30 transition-all duration-300 transform hover:-translate-y-0.5 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative flex items-center space-x-4 z-10">
            <div className="p-3 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-500/20 dark:to-emerald-500/10 rounded-xl text-emerald-600 dark:text-emerald-400 shadow-inner group-hover:scale-110 transition-transform duration-300">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-slate-500 dark:text-slate-400 font-bold text-[10px] uppercase tracking-wider mb-0.5">Active Classes</h3>
              <p className="text-xl font-bold text-slate-900 dark:text-white">{stats.totalClasses}</p>
            </div>
          </div>
        </div>

        <div className="group relative bg-white dark:bg-slate-900/50 dark:backdrop-blur-xl p-4 rounded-2xl shadow-sm hover:shadow-purple-500/10 border border-slate-200 dark:border-slate-700 hover:border-purple-500/30 transition-all duration-300 transform hover:-translate-y-0.5 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative flex items-center space-x-4 z-10">
            <div className="p-3 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-500/20 dark:to-purple-500/10 rounded-xl text-purple-600 dark:text-purple-400 shadow-inner group-hover:scale-110 transition-transform duration-300">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-slate-500 dark:text-slate-400 font-bold text-[10px] uppercase tracking-wider mb-0.5">Reservations</h3>
              <p className="text-xl font-bold text-slate-900 dark:text-white">{stats.totalReservations}</p>
            </div>
          </div>
        </div>

      </div>

      <div className="glass-panel bg-white/80 dark:bg-slate-900/60 dark:backdrop-blur-2xl rounded-2xl shadow-md border border-slate-200/60 dark:border-slate-700/60 overflow-hidden relative z-10">
        <div className="p-4 md:p-5 border-b border-slate-200/60 dark:border-slate-700/60 bg-slate-50/50 dark:bg-slate-800/50">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center">
            <span className="w-1.5 h-5 bg-blue-500 rounded-full mr-2.5"></span>
            Manage Users
          </h2>
        </div>
        <div className="overflow-x-auto">
          {users.length === 0 ? (
            <div className="text-center py-8 text-slate-500 dark:text-slate-400">
              <p className="text-sm font-medium">No users found.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-700/50">
                  <th className="p-3 pl-5 font-semibold">Name</th>
                  <th className="p-3 font-semibold">Email</th>
                  <th className="p-3 font-semibold">Role</th>
                  <th className="p-3 pr-5 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors border-b border-slate-50 dark:border-slate-700/50 last:border-0">
                    <td className="p-3 pl-5 text-slate-900 dark:text-white font-medium">
                      {u.name} {u._id === user._id && <span className="text-[10px] text-slate-400 ml-1">(You)</span>}
                    </td>
                    <td className="p-3 text-slate-600 dark:text-slate-300 text-xs">{u.email}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        u.role === 'admin' 
                          ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20' 
                          : u.role === 'teacher' 
                          ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20' 
                          : 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3 pr-5 text-right">
                      {u._id !== user._id ? (
                        <button 
                          onClick={() => handleDeleteUser(u._id)}
                          className="p-1.5 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 inline-flex items-center justify-center cursor-pointer"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      ) : (
                        <span className="text-slate-400 text-xs italic">Protected</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Pending Users Section */}
      <div className="glass-panel bg-white/80 dark:bg-slate-900/60 dark:backdrop-blur-2xl rounded-2xl shadow-md border border-slate-200/60 dark:border-slate-700/60 overflow-hidden relative z-10 mt-6">
        <div className="p-4 md:p-5 border-b border-slate-200/60 dark:border-slate-700/60 bg-amber-50/50 dark:bg-amber-900/10">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center">
            <span className="w-1.5 h-5 bg-amber-500 rounded-full mr-2.5"></span>
            Pending User Approvals
            {pendingUsers.length > 0 && (
              <span className="ml-2 px-1.5 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-bold">
                {pendingUsers.length}
              </span>
            )}
          </h2>
        </div>
        <div className="overflow-x-auto">
          {pendingUsers.length === 0 ? (
            <div className="text-center py-6 text-slate-500 dark:text-slate-400">
              <p className="text-sm font-medium">No pending user approvals.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-700/50">
                  <th className="p-3 pl-5 font-semibold w-1/4">User Details</th>
                  <th className="p-3 font-semibold w-1/3">Professional Info</th>
                  <th className="p-3 font-semibold w-1/4">Teaching Preferences</th>
                  <th className="p-3 pr-5 font-semibold text-right w-1/6">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingUsers.map(u => (
                  <tr key={u._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors border-b border-slate-50 dark:border-slate-700/50 last:border-0 align-top">
                    <td className="p-4 pl-6 text-slate-900 dark:text-white">
                      <div className="font-bold flex flex-wrap items-center gap-2 mb-2">
                        {u.name}
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          u.role === 'teacher' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                        }`}>
                          {u.role}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mb-1"><span className="font-semibold text-slate-400">Email:</span> {u.email}</div>
                      <div className="text-xs text-slate-500 mb-1"><span className="font-semibold text-slate-400">Phone:</span> {u.phone || 'N/A'}</div>
                      {u.role === 'teacher' && u.teacherDetails?.nic && (
                        <div className="text-xs text-slate-500"><span className="font-semibold text-slate-400">NIC:</span> {u.teacherDetails.nic}</div>
                      )}
                    </td>
                    
                    <td className="p-4 text-slate-600 dark:text-slate-300 text-sm">
                      {u.role === 'teacher' ? (
                        <div className="space-y-3">
                          <div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Qualifications</div>
                            <div className="text-xs leading-relaxed">{u.teacherDetails?.qualifications || 'N/A'}</div>
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Experience</div>
                            <div className="text-xs leading-relaxed whitespace-pre-wrap">{u.teacherDetails?.experience || 'N/A'}</div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-xs italic text-slate-400 mt-2">N/A (Student Account)</div>
                      )}
                    </td>

                    <td className="p-4 text-slate-600 dark:text-slate-300 text-sm">
                      {u.role === 'teacher' ? (
                        <div className="space-y-3">
                          <div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Subjects</div>
                            <div className="text-xs font-medium bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded inline-block">
                              {u.teacherDetails?.subjects || 'N/A'}
                            </div>
                          </div>
                          {u.teacherDetails?.mediums?.length > 0 && (
                            <div>
                              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Mediums</div>
                              <div className="flex flex-wrap gap-1">
                                {u.teacherDetails.mediums.map((m, i) => (
                                  <span key={i} className="text-[10px] px-1.5 py-0.5 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 rounded border border-blue-100 dark:border-blue-800">{m}</span>
                                ))}
                              </div>
                            </div>
                          )}
                          {u.teacherDetails?.grades?.length > 0 && (
                            <div>
                              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Grades</div>
                              <div className="flex flex-wrap gap-1">
                                {u.teacherDetails.grades.map((g, i) => (
                                  <span key={i} className="text-[10px] px-1.5 py-0.5 bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400 rounded border border-purple-100 dark:border-purple-800">{g}</span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-xs italic text-slate-400 mt-2">N/A</div>
                      )}
                    </td>

                    <td className="p-4 pr-6 align-middle">
                      <div className="flex flex-col gap-2 items-end justify-center h-full">
                        <button 
                          onClick={() => handleApproveUser(u._id, u.role)}
                          className="w-20 px-2 py-1.5 text-[10px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md shadow-sm transition-colors"
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => handleRejectUser(u._id)}
                          className="w-20 px-2 py-1.5 text-[10px] font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 dark:bg-rose-900/20 dark:hover:bg-rose-900/40 rounded-md transition-colors border border-rose-200 dark:border-rose-800"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Pending Seat Reservations Section */}
      <div className="glass-panel bg-white/80 dark:bg-slate-900/60 dark:backdrop-blur-2xl rounded-2xl shadow-md border border-slate-200/60 dark:border-slate-700/60 overflow-hidden relative z-10 mt-6">
        <div className="p-4 md:p-5 border-b border-slate-200/60 dark:border-slate-700/60 bg-blue-50/50 dark:bg-blue-900/10">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center">
            <span className="w-1.5 h-5 bg-blue-500 rounded-full mr-2.5"></span>
            Pending Seat Reservations
            {pendingReservations.length > 0 && (
              <span className="ml-2 px-1.5 py-0.5 rounded-full bg-blue-500 text-white text-[10px] font-bold">
                {pendingReservations.length}
              </span>
            )}
          </h2>
        </div>
        <div className="overflow-x-auto">
          {pendingReservations.length === 0 ? (
            <div className="text-center py-6 text-slate-500 dark:text-slate-400">
              <p className="text-sm font-medium">No pending seat reservations.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-700/50">
                  <th className="p-3 pl-5 font-semibold w-1/4">Student Details</th>
                  <th className="p-3 font-semibold w-1/2">Class Details</th>
                  <th className="p-3 pr-5 font-semibold text-right w-1/4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingReservations.map(res => (
                  <tr key={res._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors border-b border-slate-50 dark:border-slate-700/50 last:border-0 align-top">
                    <td className="p-4 pl-6 text-slate-900 dark:text-white">
                      <div className="font-bold flex flex-wrap items-center gap-2 mb-1">
                        {res.studentId?.name || 'Unknown Student'}
                      </div>
                      <div className="text-xs text-slate-500 mb-1"><span className="font-semibold text-slate-400">Email:</span> {res.studentId?.email || 'N/A'}</div>
                      <div className="text-xs text-slate-500"><span className="font-semibold text-slate-400">Phone:</span> {res.studentId?.phone || 'N/A'}</div>
                    </td>
                    
                    <td className="p-4 text-slate-600 dark:text-slate-300 text-sm">
                      <div className="font-bold text-slate-900 dark:text-white mb-1">
                        {res.classId?.title || 'Unknown Class'}
                      </div>
                      <div className="flex flex-wrap gap-2 text-[10px] mb-2">
                        <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded">{res.classId?.subject || 'N/A'}</span>
                        <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded">{res.classId?.medium || 'N/A'}</span>
                        <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded">{res.classId?.grade || 'N/A'}</span>
                      </div>
                      <div className="text-xs text-slate-500">
                        Teacher: <span className="font-semibold text-slate-700 dark:text-slate-300">{res.classId?.teacherId?.name || 'Unknown'}</span>
                      </div>
                    </td>

                    <td className="p-4 pr-6 align-middle">
                      <div className="flex flex-col gap-2 items-end justify-center h-full">
                        <button 
                          onClick={() => handleApproveReservation(res._id)}
                          className="w-24 px-2 py-1.5 text-[10px] font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm transition-colors"
                        >
                          Approve Seat
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Manage Teacher Classes Section */}
      <div className="glass-panel bg-white/80 dark:bg-slate-900/60 dark:backdrop-blur-2xl rounded-2xl shadow-md border border-slate-200/60 dark:border-slate-700/60 overflow-hidden mt-6 relative z-10">
        <div className="p-4 md:p-5 border-b border-slate-200/60 dark:border-slate-700/60 bg-indigo-50/50 dark:bg-indigo-900/10">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center">
            <span className="w-1.5 h-5 bg-indigo-500 rounded-full mr-2.5"></span>
            Manage Teacher Classes
            <span className="ml-2 px-1.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-400 text-[10px] font-bold">
              {approvedTeachers.length} Approved
            </span>
          </h2>
        </div>
        <div className="overflow-x-auto">
          {approvedTeachers.length === 0 ? (
            <div className="text-center py-8 text-slate-500 dark:text-slate-400">
              <p className="font-medium">No approved teachers found.</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {approvedTeachers.map(teacher => (
                <div key={teacher._id} className="border-b border-slate-100 dark:border-slate-700/50 last:border-0">
                  {/* Teacher Row */}
                  <div className="p-4 hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4 cursor-pointer flex-1" onClick={() => fetchTeacherClasses(teacher._id)}>
                      <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 rounded-lg">
                        {expandedTeacher === teacher._id ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">{teacher.name}</div>
                        <div className="text-xs text-slate-500">{teacher.email} • {teacher.phone || 'No phone'}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => navigate(`/create-class?teacherId=${teacher._id}`)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-500/10 dark:hover:bg-indigo-500/20 rounded-lg border border-indigo-200 dark:border-indigo-500/20 transition-colors"
                      >
                        <PlusCircle className="w-4 h-4" /> Add Class
                      </button>
                    </div>
                  </div>

                  {/* Expanded Classes Area */}
                  {expandedTeacher === teacher._id && (
                    <div className="p-4 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-700/50 animate-fade-in">
                      {loadingClasses ? (
                        <div className="flex justify-center py-4"><Loader className="w-5 h-5 animate-spin text-indigo-500" /></div>
                      ) : teacherClasses.length === 0 ? (
                        <div className="text-center py-4 text-sm text-slate-500 dark:text-slate-400 italic">No classes assigned to this teacher yet.</div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {teacherClasses.map(cls => (
                            <div key={cls._id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-xl shadow-sm">
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1">{cls.title}</h4>
                                <div className="flex gap-1 shrink-0">
                                  <button onClick={() => navigate(`/edit-class/${cls._id}`)} className="p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-md transition-colors" title="Edit Class">
                                    <Edit className="w-3.5 h-3.5" />
                                  </button>
                                  <button onClick={() => handleDeleteClass(cls._id)} className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition-colors" title="Delete Class">
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                              <div className="text-xs text-slate-600 dark:text-slate-300 mb-1 font-medium">{cls.subject} • {cls.grade}</div>
                              <div className="text-[10px] text-slate-500 flex justify-between">
                                <span>{cls.isOnline ? 'Online' : 'Physical'}</span>
                                <span className="font-semibold">Rs. {cls.fee}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Featured Tutors Management Section */}
      <div className="glass-panel bg-white/80 dark:bg-slate-900/60 dark:backdrop-blur-2xl rounded-2xl shadow-md border border-slate-200/60 dark:border-slate-700/60 overflow-hidden mt-6 relative z-10">
        <div className="p-4 md:p-5 border-b border-slate-200/60 dark:border-slate-700/60 bg-slate-50/50 dark:bg-slate-800/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center">
            <span className="w-1.5 h-5 bg-purple-500 rounded-full mr-2.5"></span>
            Manage Top Tier Tutors
          </h2>
        </div>
        
        {/* Add Tutor Form */}
        <div className="p-4 md:p-5 bg-white dark:bg-slate-900/80 border-b border-slate-200/60 dark:border-slate-700/60">
          <form onSubmit={handleAddTutor} className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <input type="text" placeholder="Tutor Name" required value={newTutor.name} onChange={(e) => setNewTutor({...newTutor, name: e.target.value})} className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-medium text-sm" />
            <input type="text" placeholder="Subject" required value={newTutor.subject} onChange={(e) => setNewTutor({...newTutor, subject: e.target.value})} className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-medium text-sm" />
            <input type="text" placeholder="Students (e.g. 2k+)" required value={newTutor.studentsCount} onChange={(e) => setNewTutor({...newTutor, studentsCount: e.target.value})} className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-medium text-sm" />
            <select value={newTutor.themeColor} onChange={(e) => setNewTutor({...newTutor, themeColor: e.target.value})} className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-medium text-sm cursor-pointer">
              <option value="indigo">Indigo</option>
              <option value="pink">Pink</option>
              <option value="emerald">Emerald</option>
              <option value="blue">Blue</option>
              <option value="purple">Purple</option>
              <option value="rose">Rose</option>
            </select>
            <button type="submit" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 text-sm">Add Tutor</button>
          </form>
        </div>

        {/* Tutors List */}
        <div className="overflow-x-auto">
          {featuredTutors.length === 0 ? (
            <div className="text-center py-8 text-slate-500 dark:text-slate-400">No featured tutors found.</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-sm border-b border-slate-100 dark:border-slate-700/50">
                  <th className="p-4 pl-6 font-semibold">Name</th>
                  <th className="p-4 font-semibold">Subject</th>
                  <th className="p-4 font-semibold">Students</th>
                  <th className="p-4 font-semibold">Color</th>
                  <th className="p-4 pr-6 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {featuredTutors.map(t => (
                  <tr key={t._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 border-b border-slate-50 dark:border-slate-700/50 transition-colors">
                    <td className="p-4 pl-6 font-semibold text-slate-900 dark:text-white">{t.name}</td>
                    <td className="p-4 text-slate-600 dark:text-slate-300">{t.subject}</td>
                    <td className="p-4 text-slate-600 dark:text-slate-300">{t.studentsCount}</td>
                    <td className="p-4 text-slate-600 dark:text-slate-300 capitalize">{t.themeColor}</td>
                    <td className="p-4 pr-6 text-right">
                      <button onClick={() => handleDeleteTutor(t._id)} className="p-2 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors bg-white dark:bg-slate-800 inline-flex" title="Delete Tutor">
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

    </div>
  );
};

export default AdminPanel;
