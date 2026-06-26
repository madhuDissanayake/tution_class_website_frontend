import { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { PlusCircle, Loader, Trash } from 'lucide-react';
import Map from '../components/ui/Map';

const CreateClass = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialTeacherId = queryParams.get('teacherId') || '';

  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    grade: '',
    medium: '',
    fee: '',
    capacity: '',
    description: '',
    address: '',
    lat: '',
    lng: '',
    isOnline: false,
    groupLink: '',
    teacherId: initialTeacherId,
  });

  const [teachers, setTeachers] = useState([]);

  // Fetch approved teachers
  useEffect(() => {
    if (user && user.role === 'admin') {
      const fetchTeachers = async () => {
        try {
          const config = { headers: { Authorization: `Bearer ${user.token}` } };
          const { data } = await axios.get('/api/admin/approved-teachers', config);
          setTeachers(data);
        } catch (err) {
          console.error('Failed to fetch teachers:', err);
        }
      };
      fetchTeachers();
    } else if (user && user.role !== 'admin') {
      navigate('/dashboard'); // Restrict to admin
    }
  }, [user, navigate]);

  const [schedule, setSchedule] = useState([{ day: 'Monday', startTime: '', endTime: '' }]);
  const [error, setError] = useState(null);
  const [publishing, setPublishing] = useState(false);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleMapClick = (e) => {
    if (e.latLng) {
      setFormData((prev) => ({
        ...prev,
        lat: e.latLng.lat().toFixed(6),
        lng: e.latLng.lng().toFixed(6),
      }));
    }
  };

  const handleAddScheduleRow = () => {
    setSchedule([...schedule, { day: 'Monday', startTime: '', endTime: '' }]);
  };

  const handleRemoveScheduleRow = (idx) => {
    setSchedule(schedule.filter((_, i) => i !== idx));
  };

  const handleScheduleChange = (idx, field, value) => {
    const updated = [...schedule];
    updated[idx][field] = value;
    setSchedule(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !user.token) {
      setError('Please log in to create a class.');
      return;
    }

    if (schedule.length === 0) {
      setError('Please add at least one schedule row.');
      return;
    }

    if (!formData.teacherId) {
      setError('Please select a teacher for this class.');
      return;
    }

    try {
      setPublishing(true);
      setError(null);

      const payload = {
        title: formData.title,
        subject: formData.subject,
        grade: formData.grade,
        medium: formData.medium,
        fee: parseFloat(formData.fee),
        capacity: parseInt(formData.capacity),
        description: formData.description,
        isOnline: formData.isOnline,
        groupLink: formData.isOnline ? formData.groupLink : undefined,
        location: formData.isOnline ? undefined : {
          type: 'Point',
          coordinates: formData.lng && formData.lat ? [parseFloat(formData.lng), parseFloat(formData.lat)] : [],
          address: formData.address,
        },
        schedule: schedule,
        teacherId: formData.teacherId,
      };

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      await axios.post('/api/classes', payload, config);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to create class');
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in relative">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>

      <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 tracking-tight mb-8">Create a New Class</h1>
      <div className="glass-panel bg-white/80 dark:bg-slate-900/60 dark:backdrop-blur-2xl p-8 rounded-3xl shadow-lg border border-slate-200/60 dark:border-slate-700/60 relative z-10">
        
        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 mb-6 flex items-center justify-between animate-fade-in">
            <span className="font-semibold">{error}</span>
            <button onClick={() => setError(null)} className="text-red-700 hover:text-red-900 font-bold ml-4 text-xl leading-none">×</button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Class Title</label>
              <input 
                type="text" 
                name="title"
                className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/50 outline-none text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/50 placeholder-slate-400 dark:placeholder-slate-500 transition-all font-semibold"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Advanced Mathematics for O/L"
                required 
              />
            </div>

            <div className="md:col-span-2 border-b border-slate-100 pb-4 mb-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Assign Teacher</label>
              <select 
                name="teacherId"
                className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/50 outline-none text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/50 placeholder-slate-400 dark:placeholder-slate-500 transition-all font-semibold"
                value={formData.teacherId}
                onChange={handleChange}
                required
              >
                <option value="">Select a Teacher</option>
                {teachers.map(teacher => (
                  <option key={teacher._id} value={teacher._id}>
                    {teacher.name} ({teacher.email})
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Subject</label>
              <select 
                name="subject"
                className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/50 outline-none text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/50 placeholder-slate-400 dark:placeholder-slate-500 transition-all font-semibold"
                value={formData.subject}
                onChange={handleChange}
                required
              >
                <option value="">Select Subject</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Science">Science</option>
                <option value="English">English</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Biology">Biology</option>
                <option value="Accounting">Accounting</option>
                <option value="Business Studies">Business Studies</option>
                <option value="Economics">Economics</option>
                <option value="Sinhala">Sinhala</option>
                <option value="History">History</option>
                <option value="Geography">Geography</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Grade Level</label>
              <select 
                name="grade"
                className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/50 outline-none text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/50 placeholder-slate-400 dark:placeholder-slate-500 transition-all font-semibold"
                value={formData.grade}
                onChange={handleChange}
                required
              >
                <option value="">Select Grade Level</option>
                <option value="Grade 6">Grade 6</option>
                <option value="Grade 7">Grade 7</option>
                <option value="Grade 8">Grade 8</option>
                <option value="Grade 9">Grade 9</option>
                <option value="Grade 10">Grade 10</option>
                <option value="O/L (Ordinary Level)">O/L (Ordinary Level)</option>
                <option value="A/L (Advanced Level)">A/L (Advanced Level)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Medium (Language)</label>
              <select 
                name="medium"
                className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/50 outline-none text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/50 placeholder-slate-400 dark:placeholder-slate-500 transition-all font-semibold"
                value={formData.medium}
                onChange={handleChange}
                required
              >
                <option value="">Select Medium</option>
                <option value="English">English</option>
                <option value="Sinhala">Sinhala</option>
                <option value="Tamil">Tamil</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Monthly Fee (Rs.)</label>
              <input 
                type="number" 
                name="fee"
                className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/50 outline-none text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/50 placeholder-slate-400 dark:placeholder-slate-500 transition-all font-semibold"
                value={formData.fee}
                onChange={handleChange}
                placeholder="e.g. 50"
                required 
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Student Capacity</label>
              <input 
                type="number" 
                name="capacity"
                className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/50 outline-none text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/50 placeholder-slate-400 dark:placeholder-slate-500 transition-all font-semibold"
                value={formData.capacity}
                onChange={handleChange}
                placeholder="e.g. 30"
                required 
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
              <textarea 
                name="description"
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none resize-none text-slate-900 bg-white placeholder-slate-400 font-semibold"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your class..."
                required 
              ></textarea>
            </div>

            {/* Online/Physical Toggle & Location Fields */}
            <div className="md:col-span-2 border-t border-slate-100 dark:border-slate-800 pt-6 mt-2">
              <div className="flex items-center mb-6">
                <input
                  type="checkbox"
                  id="isOnline"
                  name="isOnline"
                  className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
                  checked={formData.isOnline}
                  onChange={handleChange}
                />
                <label htmlFor="isOnline" className="ml-3 text-lg font-bold text-slate-900 dark:text-white">
                  This is an Online Class (Zoom/Meet/WhatsApp)
                </label>
              </div>

              {formData.isOnline ? (
                <div className="animate-fade-in">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Online Class Details</h3>
                  <div className="md:col-span-3">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Group Link (Zoom, WhatsApp, etc.)</label>
                    <input 
                      type="url" 
                      name="groupLink"
                      className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/50 outline-none text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/50 placeholder-slate-400 dark:placeholder-slate-500 transition-all font-semibold"
                      value={formData.groupLink}
                      onChange={handleChange}
                      placeholder="e.g. https://chat.whatsapp.com/..."
                      required={formData.isOnline} 
                    />
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 italic">Students will receive this link once you approve their reservation.</p>
                  </div>
                </div>
              ) : (
                <div className="animate-fade-in">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Physical Class Location Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-3">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Physical Address</label>
                      <input 
                        type="text" 
                        name="address"
                        className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/50 outline-none text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/50 placeholder-slate-400 dark:placeholder-slate-500 transition-all font-semibold"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="e.g. 123, Galle Road, Colombo 03"
                        required={!formData.isOnline} 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Latitude</label>
                      <input 
                        type="number" 
                        step="any"
                        name="lat"
                        className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/50 outline-none text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/50 placeholder-slate-400 dark:placeholder-slate-500 transition-all font-semibold"
                        value={formData.lat}
                        onChange={handleChange}
                        placeholder="e.g. 6.9271"
                        required={!formData.isOnline} 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Longitude</label>
                      <input 
                        type="number" 
                        step="any"
                        name="lng"
                        className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/50 outline-none text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/50 placeholder-slate-400 dark:placeholder-slate-500 transition-all font-semibold"
                        value={formData.lng}
                        onChange={handleChange}
                        placeholder="e.g. 79.8612"
                        required={!formData.isOnline} 
                      />
                    </div>
                  </div>
                  <div className="mt-4 h-64 w-full rounded-2xl overflow-hidden border border-gray-300">
                    <Map 
                      locations={formData.lat && formData.lng ? [{ lat: formData.lat, lng: formData.lng, title: formData.title || 'Class Location' }] : []} 
                      onMapClick={handleMapClick}
                    />
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 italic">Tip: You can also click on the map to automatically set latitude and longitude.</p>
                </div>
              )}
            </div>

            {/* Dynamic Schedule Section */}
            <div className="md:col-span-2 border-t border-slate-100 dark:border-slate-800 pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Class Schedule</h3>
                <button 
                  type="button"
                  onClick={handleAddScheduleRow}
                  className="text-xs bg-indigo-50 hover:bg-primary hover:text-white text-primary font-bold py-2 px-4 rounded-lg transition-colors border border-indigo-100"
                >
                  + Add Day
                </button>
              </div>

              {schedule.length === 0 ? (
                <p className="text-slate-500 dark:text-slate-400 text-sm italic">No schedule rows added. Please add at least one day.</p>
              ) : (
                <div className="space-y-3">
                  {schedule.map((row, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row items-center gap-3 bg-slate-50 dark:bg-slate-800/30 p-3 rounded-lg border border-slate-100 dark:border-slate-800 animate-fade-in animate-duration-300">
                      <div className="w-full sm:w-1/3">
                        <select
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-primary text-slate-900 font-semibold"
                          value={row.day}
                          onChange={(e) => handleScheduleChange(idx, 'day', e.target.value)}
                        >
                          <option value="Monday">Monday</option>
                          <option value="Tuesday">Tuesday</option>
                          <option value="Wednesday">Wednesday</option>
                          <option value="Thursday">Thursday</option>
                          <option value="Friday">Friday</option>
                          <option value="Saturday">Saturday</option>
                          <option value="Sunday">Sunday</option>
                        </select>
                      </div>
                      <div className="w-full sm:w-1/3 flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 shrink-0">Start:</span>
                        <input
                          type="time"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary text-slate-900 bg-white font-semibold"
                          value={row.startTime}
                          onChange={(e) => handleScheduleChange(idx, 'startTime', e.target.value)}
                          required
                        />
                      </div>
                      <div className="w-full sm:w-1/3 flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 shrink-0">End:</span>
                        <input
                          type="time"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary text-slate-900 bg-white font-semibold"
                          value={row.endTime}
                          onChange={(e) => handleScheduleChange(idx, 'endTime', e.target.value)}
                          required
                        />
                      </div>
                      {schedule.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveScheduleRow(idx)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors border border-transparent hover:border-red-100 font-bold shrink-0 self-stretch sm:self-auto flex items-center justify-center"
                          title="Remove row"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          <div className="flex justify-end space-x-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button 
              type="button" 
              onClick={() => navigate('/dashboard')}
              className="px-6 py-2 border border-gray-300 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:bg-slate-800/30 transition-colors"
              disabled={publishing}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-indigo-700 transition-colors shadow flex items-center"
              disabled={publishing}
            >
              {publishing ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Publishing...
                </>
              ) : (
                'Publish Class'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateClass;
