import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Bell, Loader, CheckCheck, AlertCircle, Sparkles, User, Mail, CheckCircle, MessageCircle, Send, BookOpen } from 'lucide-react';
import axios from 'axios';

const Notifications = () => {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [processingUser, setProcessingUser] = useState(null);

  useEffect(() => {
    if (!user || !user.token) return;

    const fetchNotifications = async () => {
      try {
        setLoading(true);
        setError(null);
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.get(import.meta.env.VITE_API_URL + '/api/notifications', config);
        setNotifications(data);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Failed to fetch notifications');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [user]);

  const markAsRead = async (id) => {
    if (!user || !user.token) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(import.meta.env.VITE_API_URL + `/api/notifications/${id}/read`, {}, config);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  const approveReservation = async (reservationId, notificationId) => {
    if (!user || !user.token) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.patch(import.meta.env.VITE_API_URL + `/api/reservations/${reservationId}/confirm`, {}, config);
      setNotifications(prev => prev.map(n => {
        if (n._id === notificationId && n.relatedId) {
          return { ...n, relatedId: { ...n.relatedId, status: 'confirmed' } };
        }
        return n;
      }));
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to approve reservation');
    }
  };

  const handleApproveTeacher = async (subjectUserId, notificationId) => {
    try {
      setProcessingUser(subjectUserId);
      setError(null);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(import.meta.env.VITE_API_URL + `/api/admin/approve-user/${subjectUserId}`, {}, config);
      setNotifications(prev =>
        prev.map(n =>
          n.subjectUserId?._id === subjectUserId
            ? { ...n, isRead: true, _teacherStatus: 'approved' }
            : n
        )
      );
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to approve teacher');
    } finally {
      setProcessingUser(null);
    }
  };

  const handleRejectTeacher = async (subjectUserId, notificationId) => {
    if (!window.confirm('Are you sure you want to reject this teacher registration?')) return;
    try {
      setProcessingUser(subjectUserId);
      setError(null);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(import.meta.env.VITE_API_URL + `/api/admin/reject-user/${subjectUserId}`, {}, config);
      setNotifications(prev =>
        prev.map(n =>
          n.subjectUserId?._id === subjectUserId
            ? { ...n, isRead: true, _teacherStatus: 'rejected' }
            : n
        )
      );
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to reject teacher');
    } finally {
      setProcessingUser(null);
    }
  };

  const handleReply = async (notification) => {
    if (!replyMessage.trim()) return;
    try {
      setSendingReply(true);
      setError(null);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post(import.meta.env.VITE_API_URL + '/api/notifications/message', {
        receiverId: notification.senderId._id,
        classId: notification.classId?._id,
        message: replyMessage
      }, config);
      setReplyingTo(null);
      setReplyMessage('');
      if (!notification.isRead) markAsRead(notification._id);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to send reply');
    } finally {
      setSendingReply(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto text-center mt-20 p-8 glass-panel rounded-3xl border border-indigo-50/50 animate-fade-in shadow-xl">
        <Bell className="w-12 h-12 text-slate-800 mx-auto mb-4 animate-bounce" />
        <p className="text-xl text-slate-800 mb-6 font-medium">Please log in to view your notifications.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <Loader className="w-12 h-12 text-primary animate-spin" />
        <p className="text-slate-900 font-medium animate-pulse">Checking for notifications...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-slide-up">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl text-slate-900 shadow-md shadow-indigo-500/10">
            <Bell className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-2xl font-medium text-slate-900 tracking-tight drop-shadow-sm">Notifications</h1>
            <p className="text-xs text-slate-800 font-semibold uppercase tracking-wider">Your live stream inbox</p>
          </div>
        </div>
        
        {notifications.some(n => !n.isRead) && (
          <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-medium px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
            {notifications.filter(n => !n.isRead).length} New
          </span>
        )}
      </div>
      
      {error && (
        <div className="bg-rose-50 text-rose-800 p-5 rounded-2xl border border-rose-100 shadow-md shadow-rose-500/5 flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2 font-medium">
            <AlertCircle className="w-5 h-5 text-rose-600" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)} className="text-rose-800 hover:text-rose-950 font-black text-xl leading-none">×</button>
        </div>
      )}

      <div className="glass-panel rounded-2xl overflow-hidden shadow-lg border border-white/10 bg-white/5 backdrop-blur-md">
        {notifications.length === 0 ? (
          <div className="p-12 text-center text-slate-800 space-y-3 animate-fade-in">
            <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-slate-900 mx-auto shadow-inner">
              <CheckCheck className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <p className="text-base font-medium text-slate-900">All Caught Up!</p>
              <p className="text-xs text-slate-800 font-medium">You have no new notifications in your inbox.</p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-white/10">
            {notifications.map(note => (
              <div 
                key={note._id} 
                className={`p-4 md:p-5 flex justify-between items-start transition-all duration-300 relative group overflow-hidden ${note.isRead ? 'bg-transparent' : 'bg-indigo-500/10'}`}
              >
                {!note.isRead && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500" />
                )}

                <div className="flex items-start gap-3 w-full">
                  <div className={`p-2 rounded-lg border shrink-0 mt-0.5 ${note.isRead ? 'bg-slate-100 border-slate-200 text-slate-900' : 'bg-indigo-50 border-indigo-200 text-indigo-600 shadow-sm shadow-indigo-500/10'}`}>
                    {note.type === 'message' ? <MessageCircle className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
                  </div>
                  <div className="pr-3 flex-1 min-w-0">
                    <p className={`text-sm leading-relaxed ${note.isRead ? 'font-medium text-slate-900' : 'font-medium text-slate-900'}`}>
                      {note.message}
                    </p>
                    
                    {note.type === 'reservation_request' && note.relatedId && note.relatedId.studentId && (
                      <div className="mt-2 mb-1 bg-slate-50 border border-slate-200 rounded-lg p-2.5 flex flex-wrap gap-3 items-center">
                        <div className="flex items-center gap-1.5 text-xs text-slate-800">
                          <User className="w-3.5 h-3.5 text-indigo-400" />
                          <span className="font-medium">{note.relatedId.studentId.name}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-800">
                          <Mail className="w-3.5 h-3.5 text-purple-400" />
                          <span>{note.relatedId.studentId.email}</span>
                        </div>
                        <div className="flex-1 text-right">
                          {note.relatedId.status === 'pending' ? (
                            <button
                              onClick={() => approveReservation(note.relatedId._id, note._id)}
                              className="bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-slate-900 border border-emerald-500/30 font-medium text-[10px] px-3 py-1 rounded-md transition-all shadow-sm"
                            >
                              Approve Seat
                            </button>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-emerald-400 text-[10px] font-medium px-2 py-0.5 bg-emerald-500/10 rounded-md border border-emerald-500/20">
                              <CheckCircle className="w-3 h-3" /> Approved
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {note.type === 'registration_request' && note.subjectUserId && (
                      <div className="mt-3 mb-1 bg-amber-50 border border-amber-200 rounded-xl p-3 space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 bg-amber-500/20 rounded-full flex items-center justify-center shrink-0">
                              <User className="w-3.5 h-3.5 text-amber-400" />
                            </div>
                            <div>
                              <div className="text-[9px] text-slate-900 uppercase tracking-wider">Name</div>
                              <div className="text-xs font-semibold text-slate-900">{note.subjectUserId.name}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 bg-purple-500/20 rounded-full flex items-center justify-center shrink-0">
                              <Mail className="w-3.5 h-3.5 text-purple-400" />
                            </div>
                            <div className="min-w-0">
                              <div className="text-[9px] text-slate-900 uppercase tracking-wider">Email</div>
                              <div className="text-xs font-medium text-slate-900 truncate">{note.subjectUserId.email}</div>
                            </div>
                          </div>
                          {note.subjectUserId.phone && (
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 bg-sky-500/20 rounded-full flex items-center justify-center shrink-0 text-sky-400 text-[11px]">📞</div>
                              <div>
                                <div className="text-[9px] text-slate-900 uppercase tracking-wider">Phone</div>
                                <div className="text-xs font-medium text-slate-900">{note.subjectUserId.phone}</div>
                              </div>
                            </div>
                          )}
                          {note.subjectUserId.teacherDetails?.nic && (
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 bg-rose-500/20 rounded-full flex items-center justify-center shrink-0 text-rose-400 text-[11px]">🪪</div>
                              <div>
                                <div className="text-[9px] text-slate-900 uppercase tracking-wider">NIC</div>
                                <div className="text-xs font-medium text-slate-900">{note.subjectUserId.teacherDetails.nic}</div>
                              </div>
                            </div>
                          )}
                        </div>

                        {(note.subjectUserId.teacherDetails?.qualifications || note.subjectUserId.teacherDetails?.subjects) && (
                          <div className="bg-white/5 rounded-lg p-2 space-y-1 border border-white/5 text-xs">
                            {note.subjectUserId.teacherDetails?.subjects && (
                              <div>
                                <span className="text-[9px] text-slate-900 uppercase tracking-wider mr-1">Subjects: </span>
                                <span className="font-medium text-slate-900">{note.subjectUserId.teacherDetails.subjects}</span>
                              </div>
                            )}
                            {note.subjectUserId.teacherDetails?.qualifications && (
                              <div>
                                <span className="text-[9px] text-slate-900 uppercase tracking-wider mr-1">Qualifications: </span>
                                <span className="text-slate-800">{note.subjectUserId.teacherDetails.qualifications}</span>
                              </div>
                            )}
                          </div>
                        )}

                        {(() => {
                          const status = note._teacherStatus || note.subjectUserId.status;
                          if (status === 'approved') return (
                            <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
                              <CheckCircle className="w-4 h-4" /> Teacher Approved ✓
                            </div>
                          );
                          if (status === 'rejected') return (
                            <div className="flex items-center gap-2 text-rose-400 text-xs font-semibold">
                              <AlertCircle className="w-4 h-4" /> Teacher Rejected
                            </div>
                          );
                          return (
                            <div className="flex items-center gap-2 flex-wrap">
                              <button
                                onClick={() => handleApproveTeacher(note.subjectUserId._id, note._id)}
                                disabled={processingUser === note.subjectUserId._id}
                                className="flex items-center gap-1.5 bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-slate-900 border border-emerald-500/30 font-semibold text-[11px] px-3 py-1.5 rounded-lg transition-all shadow-sm disabled:opacity-50 cursor-pointer"
                              >
                                {processingUser === note.subjectUserId._id
                                  ? <Loader className="w-3 h-3 animate-spin" />
                                  : <CheckCircle className="w-3 h-3" />}
                                Approve Teacher
                              </button>
                              <button
                                onClick={() => handleRejectTeacher(note.subjectUserId._id, note._id)}
                                disabled={processingUser === note.subjectUserId._id}
                                className="flex items-center gap-1.5 bg-rose-500/10 hover:bg-rose-500/30 text-rose-400 hover:text-rose-300 border border-rose-500/20 font-semibold text-[11px] px-3 py-1.5 rounded-lg transition-all disabled:opacity-50 cursor-pointer"
                              >
                                Reject
                              </button>
                              <a
                                href="/admin#pending-users"
                                className="ml-auto text-[10px] text-indigo-400 hover:text-indigo-300 underline underline-offset-2 transition-colors"
                              >
                                View all pending →
                              </a>
                            </div>
                          );
                        })()}
                      </div>
                    )}
                    
                    {note.type === 'class_approval_request' && (
                      <div className="mt-3 mb-1 bg-purple-500/5 border border-purple-500/20 rounded-xl p-3 space-y-3">
                        <div className="flex items-start gap-2">
                          <div className="w-7 h-7 bg-purple-500/20 rounded-full flex items-center justify-center shrink-0">
                            <BookOpen className="w-3.5 h-3.5 text-purple-400" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-[9px] text-slate-900 uppercase tracking-wider">Class Approval Required</div>
                            <div className="text-xs font-semibold text-slate-900 mt-0.5 leading-relaxed">
                              {note.message.replace('Teacher ', '').replace(' submitted a new class for approval:', '').trim()}
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-end pt-1">
                          <a
                            href="/admin#pending-classes"
                            className="inline-flex items-center gap-1.5 bg-purple-500/20 hover:bg-purple-500 text-purple-300 hover:text-slate-900 border border-purple-500/30 font-semibold text-[11px] px-4 py-1.5 rounded-lg transition-all shadow-sm"
                          >
                            Review in Admin →
                          </a>
                        </div>
                      </div>
                    )}

                    {note.type === 'message' && note.senderId && (
                      <div className="mt-2 mb-1 bg-white/5 border border-white/10 rounded-lg p-2.5 flex flex-col gap-2.5">
                        <div className="flex items-center gap-1.5 text-xs text-slate-800">
                          <User className="w-3.5 h-3.5 text-indigo-400" />
                          <span className="font-medium">From: {note.senderId.name}</span>
                          {note.classId && <span className="text-slate-900">| Class: {note.classId.title}</span>}
                        </div>
                        
                        {replyingTo === note._id ? (
                          <div className="flex gap-2">
                            <input 
                              type="text" 
                              className="flex-1 bg-white/10 border border-white/20 rounded-md px-3 py-1.5 text-xs text-slate-900 outline-none focus:border-indigo-400"
                              placeholder="Type your reply..."
                              value={replyMessage}
                              onChange={(e) => setReplyMessage(e.target.value)}
                              autoFocus
                            />
                            <button 
                              onClick={() => handleReply(note)}
                              disabled={sendingReply}
                              className="bg-indigo-500 hover:bg-indigo-600 text-slate-900 px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1 transition-colors disabled:opacity-50"
                            >
                              {sendingReply ? <Loader className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                            </button>
                            <button 
                              onClick={() => { setReplyingTo(null); setReplyMessage(''); }}
                              className="text-slate-800 hover:text-slate-900 px-2 font-medium text-xs"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div>
                            <button 
                              onClick={() => setReplyingTo(note._id)}
                              className="bg-indigo-500/20 hover:bg-indigo-500 text-indigo-300 hover:text-slate-900 border border-indigo-500/30 font-medium text-[10px] px-3 py-1 rounded-md transition-all shadow-sm flex items-center gap-1 w-fit"
                            >
                              <MessageCircle className="w-3 h-3" /> Reply
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    <span className="text-[9px] text-slate-900 font-medium uppercase tracking-wider block mt-1.5">
                      {new Date(note.createdAt).toLocaleDateString(undefined, { weekday: 'long', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                {!note.isRead && (
                  <button 
                    onClick={() => markAsRead(note._id)}
                    className="flex items-center gap-1 bg-indigo-500/20 hover:bg-indigo-500 text-indigo-300 hover:text-slate-900 font-medium text-[10px] px-2.5 py-1.5 rounded-md transition-all border border-indigo-500/30 hover:border-indigo-400 cursor-pointer shadow-sm whitespace-nowrap ml-3 shrink-0 mt-0.5"
                  >
                    <CheckCheck className="w-3 h-3" />
                    Mark Read
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
