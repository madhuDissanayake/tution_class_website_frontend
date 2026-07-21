import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import {
  BookOpen, MapPin, Video, Clock, PlusCircle, Trash2,
  Loader, CheckCircle, AlertCircle, ChevronLeft, Info
} from 'lucide-react';

const SUBJECTS = ['Mathematics', 'Science', 'Physics', 'Chemistry', 'Biology', 'English', 'Sinhala', 'Tamil', 'History', 'Geography', 'ICT', 'Art', 'Music', 'Commerce', 'Economics', 'Other'];
const GRADES = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11 (O/L)', 'Grade 12 (A/L)', 'Grade 13 (A/L)'];
const MEDIUMS = ['Sinhala', 'English', 'Tamil'];
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const TeacherCreateClass = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    subject: '',
    grade: '',
    medium: '',
    description: '',
    fee: '',
    capacity: '',
    isOnline: false,
    groupLink: '',
    lat: '',
    lng: '',
    address: '',
  });
  const [schedule, setSchedule] = useState([{ day: 'Monday', startTime: '08:00', endTime: '10:00' }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  // Redirect if not approved teacher
  if (!user || user.role !== 'teacher' || user.status !== 'approved') {
    return (
      <div className="max-w-lg mx-auto mt-20 text-center p-8 bg-surface-800 rounded-3xl border border-surface-600 animate-fade-in">
        <AlertCircle className="w-14 h-14 text-amber-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-3">Access Denied</h2>
        <p className="text-slate-400">Only approved teachers can create classes.</p>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const addScheduleSlot = () => {
    setSchedule(prev => [...prev, { day: 'Monday', startTime: '08:00', endTime: '10:00' }]);
  };

  const removeScheduleSlot = (idx) => {
    setSchedule(prev => prev.filter((_, i) => i !== idx));
  };

  const updateSchedule = (idx, field, value) => {
    setSchedule(prev => prev.map((s, i) => i === idx ? { ...s, [field]: value } : s));
  };

  const handleMapClick = () => {
    // Simple lat/lng helper
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setForm(prev => ({
            ...prev,
            lat: pos.coords.latitude.toFixed(6),
            lng: pos.coords.longitude.toFixed(6)
          }));
        },
        () => setError('Could not get your location. Please enter manually.')
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.title || !form.subject || !form.grade || !form.medium || !form.fee || !form.capacity) {
      return setError('Please fill in all required fields.');
    }
    if (!form.isOnline && (!form.lat || !form.lng)) {
      return setError('Location coordinates are required for physical classes.');
    }
    if (schedule.length === 0) {
      return setError('Please add at least one schedule slot.');
    }

    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const payload = {
        ...form,
        fee: Number(form.fee),
        capacity: Number(form.capacity),
        schedule,
      };
      await axios.post(import.meta.env.VITE_API_URL + '/api/classes', payload, config);
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit class.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto mt-20 text-center p-10 bg-surface-800 rounded-3xl border border-emerald-500/30 shadow-lg animate-fade-in">
        <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/30">
          <CheckCircle className="w-10 h-10 text-emerald-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-3">Class Submitted!</h2>
        <p className="text-slate-400 mb-2">Your class has been submitted for admin approval.</p>
        <p className="text-slate-500 text-sm mb-8">You will be notified once it's reviewed. Until then, it won't be visible to students.</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2.5 rounded-xl transition-all"
          >
            Go to Dashboard
          </button>
          <button
            onClick={() => { setSubmitted(false); setForm({ title: '', subject: '', grade: '', medium: '', description: '', fee: '', capacity: '', isOnline: false, groupLink: '', lat: '', lng: '', address: '' }); setSchedule([{ day: 'Monday', startTime: '08:00', endTime: '10:00' }]); }}
            className="bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-2.5 rounded-xl transition-all border border-white/10"
          >
            Create Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto animate-fade-in py-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate('/dashboard')}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">Create a New Class</h1>
          <p className="text-slate-400 text-sm mt-0.5">Fill in the details. Admin will review and publish your class.</p>
        </div>
      </div>

      {/* Notice Banner */}
      <div className="flex items-start gap-3 bg-indigo-500/10 border border-indigo-500/30 rounded-xl p-4 mb-6">
        <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
        <p className="text-sm text-indigo-300">
          Your class will be submitted for <strong>admin approval</strong> and will go live once approved. You'll receive a notification.
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-xl p-4 mb-6">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-surface-800/60 rounded-2xl border border-surface-600 p-5 space-y-4">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-400" /> Basic Information
          </h2>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Class Title <span className="text-rose-400">*</span></label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Advanced Mathematics for O/L"
              className="w-full bg-surface-700 border border-surface-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Subject <span className="text-rose-400">*</span></label>
              <select name="subject" value={form.subject} onChange={handleChange}
                className="w-full bg-surface-700 border border-surface-500 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors">
                <option value="">Select subject</option>
                {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Grade Level <span className="text-rose-400">*</span></label>
              <select name="grade" value={form.grade} onChange={handleChange}
                className="w-full bg-surface-700 border border-surface-500 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors">
                <option value="">Select grade</option>
                {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Medium <span className="text-rose-400">*</span></label>
              <select name="medium" value={form.medium} onChange={handleChange}
                className="w-full bg-surface-700 border border-surface-500 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors">
                <option value="">Select medium</option>
                {MEDIUMS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="Describe what students will learn, class structure, etc."
              className="w-full bg-surface-700 border border-surface-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Monthly Fee (Rs.) <span className="text-rose-400">*</span></label>
              <input
                type="number"
                name="fee"
                value={form.fee}
                onChange={handleChange}
                min="0"
                placeholder="e.g. 3500"
                className="w-full bg-surface-700 border border-surface-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Student Capacity <span className="text-rose-400">*</span></label>
              <input
                type="number"
                name="capacity"
                value={form.capacity}
                onChange={handleChange}
                min="1"
                placeholder="e.g. 30"
                className="w-full bg-surface-700 border border-surface-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Class Type */}
        <div className="bg-surface-800/60 rounded-2xl border border-surface-600 p-5 space-y-4">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Video className="w-4 h-4 text-purple-400" /> Class Type
          </h2>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className={`relative w-12 h-6 rounded-full transition-colors ${form.isOnline ? 'bg-indigo-600' : 'bg-surface-500'}`}>
                <input type="checkbox" name="isOnline" checked={form.isOnline} onChange={handleChange} className="sr-only" />
                <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.isOnline ? 'translate-x-6' : 'translate-x-0'}`} />
              </div>
              <span className="text-sm font-medium text-slate-200">{form.isOnline ? '🌐 Online Class' : '📍 Physical Class'}</span>
            </label>
          </div>

          {form.isOnline ? (
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Group / Meeting Link</label>
              <input
                type="url"
                name="groupLink"
                value={form.groupLink}
                onChange={handleChange}
                placeholder="https://meet.google.com/... or WhatsApp link"
                className="w-full bg-surface-700 border border-surface-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Address</label>
                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="e.g. 123 Main St, Colombo"
                  className="w-full bg-surface-700 border border-surface-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Latitude <span className="text-rose-400">*</span></label>
                  <input
                    type="number"
                    name="lat"
                    value={form.lat}
                    onChange={handleChange}
                    step="any"
                    placeholder="6.9271"
                    className="w-full bg-surface-700 border border-surface-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Longitude <span className="text-rose-400">*</span></label>
                  <input
                    type="number"
                    name="lng"
                    value={form.lng}
                    onChange={handleChange}
                    step="any"
                    placeholder="79.8612"
                    className="w-full bg-surface-700 border border-surface-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={handleMapClick}
                className="flex items-center gap-2 text-xs text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 px-3 py-1.5 rounded-lg transition-all"
              >
                <MapPin className="w-3.5 h-3.5" /> Use My Current Location
              </button>
            </div>
          )}
        </div>

        {/* Schedule */}
        <div className="bg-surface-800/60 rounded-2xl border border-surface-600 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" /> Schedule
            </h2>
            <button
              type="button"
              onClick={addScheduleSlot}
              className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 px-3 py-1.5 rounded-lg transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5" /> Add Day
            </button>
          </div>

          {schedule.map((slot, idx) => (
            <div key={idx} className="flex items-center gap-3 flex-wrap">
              <select
                value={slot.day}
                onChange={(e) => updateSchedule(idx, 'day', e.target.value)}
                className="bg-surface-700 border border-surface-500 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 flex-1 min-w-[120px]"
              >
                {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <input
                type="time"
                value={slot.startTime}
                onChange={(e) => updateSchedule(idx, 'startTime', e.target.value)}
                className="bg-surface-700 border border-surface-500 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
              <span className="text-slate-500 text-xs">to</span>
              <input
                type="time"
                value={slot.endTime}
                onChange={(e) => updateSchedule(idx, 'endTime', e.target.value)}
                className="bg-surface-700 border border-surface-500 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
              {schedule.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeScheduleSlot(idx)}
                  className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3.5 rounded-2xl shadow-lg shadow-indigo-500/20 transition-all disabled:opacity-50 text-sm"
        >
          {loading ? (
            <><Loader className="w-4 h-4 animate-spin" /> Submitting...</>
          ) : (
            <><BookOpen className="w-4 h-4" /> Submit Class for Approval</>
          )}
        </button>
      </form>
    </div>
  );
};

export default TeacherCreateClass;
