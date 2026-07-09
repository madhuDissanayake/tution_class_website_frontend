import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Bell, Loader, CheckCheck, AlertCircle, Sparkles, User, Mail, CheckCircle, MessageCircle, Send } from 'lucide-react';
import axios from 'axios';

const Notifications = () => {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

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
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      await axios.put(import.meta.env.VITE_API_URL + `/api/notifications/${id}/read`, {}, config);
      setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to mark notification as read');
    }
  };

  const approveReservation = async (reservationId, notificationId) => {
    if (!user || !user.token) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      await axios.patch(import.meta.env.VITE_API_URL + `/api/reservations/${reservationId}/confirm`, {}, config);
      
      setNotifications(notifications.map(n => {
        if (n._id === notificationId && n.relatedId) {
          return {
            ...n,
            relatedId: { ...n.relatedId, status: 'confirmed' }
          };
        }
        return n;
      }));
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to approve reservation');
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
      
      // Optionally show a success toast here
      // Marking this notification as read since we replied
      if (!notification.isRead) {
        markAsRead(notification._id);
      }
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
        <Bell className="w-12 h-12 text-slate-300 mx-auto mb-4 animate-bounce" />
        <p className="text-xl text-gray-600 mb-6 font-medium">Please log in to view your notifications.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <Loader className="w-12 h-12 text-primary animate-spin" />
        <p className="text-gray-500 font-medium animate-pulse">Checking for notifications...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-slide-up">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl text-white shadow-md shadow-indigo-500/10">
            <Bell className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-2xl font-medium text-white tracking-tight drop-shadow-sm">Notifications</h1>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Your live stream inbox</p>
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
          <div className="p-12 text-center text-slate-400 space-y-3 animate-fade-in">
            <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-slate-500 mx-auto shadow-inner">
              <CheckCheck className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <p className="text-base font-medium text-white">All Caught Up!</p>
              <p className="text-xs text-slate-400 font-medium">You have no new notifications in your inbox.</p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-white/10">
            {notifications.map(note => (
              <div 
                key={note._id} 
                className={`p-4 md:p-5 flex justify-between items-center transition-all duration-300 relative group overflow-hidden ${note.isRead ? 'bg-transparent' : 'bg-indigo-500/10'}`}
              >
                {!note.isRead && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500" />
                )}

                <div className="flex items-center gap-3 w-full">
                  <div className={`p-2 rounded-lg border shrink-0 ${note.isRead ? 'bg-white/5 border-white/10 text-slate-400' : 'bg-indigo-500/20 border-indigo-500/30 text-indigo-400 shadow-sm shadow-indigo-500/10'}`}>
                    {note.type === 'message' ? <MessageCircle className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
                  </div>
                  <div className="pr-3 flex-1">
                    <p className={`text-sm leading-relaxed ${note.isRead ? 'font-medium text-slate-400' : 'font-medium text-white'}`}>
                      {note.message}
                    </p>
                    
                    {note.type === 'reservation_request' && note.relatedId && note.relatedId.studentId && (
                      <div className="mt-2 mb-1 bg-white/5 border border-white/10 rounded-lg p-2.5 flex flex-wrap gap-3 items-center">
                        <div className="flex items-center gap-1.5 text-xs text-slate-300">
                          <User className="w-3.5 h-3.5 text-indigo-400" />
                          <span className="font-medium">{note.relatedId.studentId.name}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-300">
                          <Mail className="w-3.5 h-3.5 text-purple-400" />
                          <span>{note.relatedId.studentId.email}</span>
                        </div>
                        <div className="flex-1 text-right">
                          {note.relatedId.status === 'pending' ? (
                            <button
                              onClick={() => approveReservation(note.relatedId._id, note._id)}
                              className="bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-white border border-emerald-500/30 font-medium text-[10px] px-3 py-1 rounded-md transition-all shadow-sm"
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

                    {note.type === 'message' && note.senderId && (
                      <div className="mt-2 mb-1 bg-white/5 border border-white/10 rounded-lg p-2.5 flex flex-col gap-2.5">
                        <div className="flex items-center gap-1.5 text-xs text-slate-300">
                          <User className="w-3.5 h-3.5 text-indigo-400" />
                          <span className="font-medium">From: {note.senderId.name}</span>
                          {note.classId && <span className="text-slate-500">| Class: {note.classId.title}</span>}
                        </div>
                        
                        {replyingTo === note._id ? (
                          <div className="flex gap-2">
                            <input 
                              type="text" 
                              className="flex-1 bg-white/10 border border-white/20 rounded-md px-3 py-1.5 text-xs text-white outline-none focus:border-indigo-400"
                              placeholder="Type your reply..."
                              value={replyMessage}
                              onChange={(e) => setReplyMessage(e.target.value)}
                              autoFocus
                            />
                            <button 
                              onClick={() => handleReply(note)}
                              disabled={sendingReply}
                              className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1 transition-colors disabled:opacity-50"
                            >
                              {sendingReply ? <Loader className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                            </button>
                            <button 
                              onClick={() => { setReplyingTo(null); setReplyMessage(''); }}
                              className="text-slate-400 hover:text-white px-2 font-medium text-xs"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div>
                            <button 
                              onClick={() => setReplyingTo(note._id)}
                              className="bg-indigo-500/20 hover:bg-indigo-500 text-indigo-300 hover:text-white border border-indigo-500/30 font-medium text-[10px] px-3 py-1 rounded-md transition-all shadow-sm flex items-center gap-1 w-fit"
                            >
                              <MessageCircle className="w-3 h-3" /> Reply
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    <span className="text-[9px] text-slate-500 font-medium uppercase tracking-wider block mt-1.5">
                      {new Date(note.createdAt).toLocaleDateString(undefined, { weekday: 'long', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                {!note.isRead && (
                  <button 
                    onClick={() => markAsRead(note._id)}
                    className="flex items-center gap-1 bg-indigo-500/20 hover:bg-indigo-500 text-indigo-300 hover:text-white font-medium text-[10px] px-2.5 py-1.5 rounded-md transition-all border border-indigo-500/30 hover:border-indigo-400 cursor-pointer shadow-sm whitespace-nowrap group-hover:-translate-y-0.5 ml-3"
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
