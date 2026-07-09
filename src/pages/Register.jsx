import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Lock, GraduationCap, Briefcase, UserPlus, Loader } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'student',
    teacherDetails: {
      nic: '',
      qualifications: '',
      experience: '',
      subjects: '',
      mediums: [],
      grades: []
    }
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (['nic', 'qualifications', 'experience', 'subjects'].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        teacherDetails: {
          ...prev.teacherDetails,
          [name]: value
        }
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleCheckboxChange = (e, field) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      const currentList = prev.teacherDetails[field] || [];
      const updatedList = checked 
        ? [...currentList, value] 
        : currentList.filter(item => item !== value);
        
      return {
        ...prev,
        teacherDetails: {
          ...prev.teacherDetails,
          [field]: updatedList
        }
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      await register(formData);
      navigate('/login', { state: { message: 'Registration successful! Your account is pending admin approval.' } });
    } catch (err) {
      setError(err || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex items-start justify-center min-h-[75vh] pt-0 pb-12 px-4 mt-2">
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-blue-500/10 blur-[80px] -z-10 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-70 h-70 rounded-full bg-sky-500/10 blur-[75px] -z-10 animate-pulse duration-[6000ms]"></div>

      <div className="glass-panel bg-white/80 dark:bg-slate-900/80 p-8 md:p-10 rounded-3xl w-full max-w-lg border border-slate-200 dark:border-slate-800 shadow-sm animate-slide-up">
        <div className="text-center mb-8">
          <div className="inline-flex p-3.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl shadow-sm mb-4">
            <UserPlus className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-semibold text-slate-900 dark:text-white tracking-tight">Create an Account</h2>
          <p className="text-slate-500 text-sm mt-1.5 font-semibold">Join Sri Lanka's leading tuition marketplace</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-6 text-sm font-semibold border border-red-100/60 text-center animate-fade-in">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-medium text-slate-600 uppercase tracking-wider mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                type="text" 
                name="name"
                className="w-full pl-11 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none text-slate-800 dark:text-white bg-slate-50 dark:bg-slate-800 transition-all font-medium text-sm"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                required 
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 uppercase tracking-wider mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                type="email" 
                name="email"
                className="w-full pl-11 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none text-slate-800 dark:text-white bg-slate-50 dark:bg-slate-800 transition-all font-medium text-sm"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                required 
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 uppercase tracking-wider mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                type="password" 
                name="password"
                className="w-full pl-11 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none text-slate-800 dark:text-white bg-slate-50 dark:bg-slate-800 transition-all font-medium text-sm"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required 
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 uppercase tracking-wider mb-2">Phone Number</label>
            <div className="relative">
              <input 
                type="text" 
                name="phone"
                className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none text-slate-800 dark:text-white bg-slate-50 dark:bg-slate-800 transition-all font-medium text-sm"
                value={formData.phone}
                onChange={handleChange}
                placeholder="07XXXXXXXX"
                required 
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 uppercase tracking-wider mb-2">I am a...</label>
            <div className="grid grid-cols-2 gap-4">
              <label className={`flex flex-col items-center justify-center p-4 rounded-2xl border cursor-pointer transition-all duration-300 ${formData.role === 'student' ? 'border-blue-600 bg-blue-50/40 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 shadow-sm' : 'border-slate-200 dark:border-slate-700 bg-slate-50/40 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400 hover:border-slate-300'}`}>
                <input 
                  type="radio" 
                  name="role" 
                  value="student" 
                  checked={formData.role === 'student'} 
                  onChange={handleChange} 
                  className="sr-only" 
                />
                <GraduationCap className="w-6 h-6 mb-1.5" />
                <span className="text-xs font-medium uppercase tracking-wider">Student</span>
              </label>

              <label className={`flex flex-col items-center justify-center p-4 rounded-2xl border cursor-pointer transition-all duration-300 ${formData.role === 'teacher' ? 'border-sky-600 bg-sky-50/40 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 shadow-sm' : 'border-slate-200 dark:border-slate-700 bg-slate-50/40 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400 hover:border-slate-300'}`}>
                <input 
                  type="radio" 
                  name="role" 
                  value="teacher" 
                  checked={formData.role === 'teacher'} 
                  onChange={handleChange} 
                  className="sr-only" 
                />
                <Briefcase className="w-6 h-6 mb-1.5" />
                <span className="text-xs font-medium uppercase tracking-wider">Teacher</span>
              </label>
            </div>
          </div>

          {formData.role === 'teacher' && (
            <div className="space-y-4 animate-slide-up border-t border-slate-200 dark:border-slate-700 pt-4 mt-4">
              <h3 className="text-sm font-medium text-slate-800 dark:text-white mb-2">Teacher Additional Details</h3>
              <div>
                <label className="block text-xs font-medium text-slate-600 uppercase tracking-wider mb-2">NIC Number</label>
                <input 
                  type="text" 
                  name="nic"
                  className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-sky-500/20 focus:border-sky-600 outline-none text-slate-800 dark:text-white bg-slate-50 dark:bg-slate-800 transition-all font-medium text-sm"
                  value={formData.teacherDetails.nic}
                  onChange={handleChange}
                  placeholder="e.g. 199012345678"
                  required={formData.role === 'teacher'} 
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 uppercase tracking-wider mb-2">Qualifications</label>
                <textarea 
                  name="qualifications"
                  className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-sky-500/20 focus:border-sky-600 outline-none text-slate-800 dark:text-white bg-slate-50 dark:bg-slate-800 transition-all font-medium text-sm"
                  value={formData.teacherDetails.qualifications}
                  onChange={handleChange}
                  placeholder="e.g. BSc in Mathematics"
                  required={formData.role === 'teacher'} 
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 uppercase tracking-wider mb-2">Experience</label>
                <textarea 
                  name="experience"
                  className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-sky-500/20 focus:border-sky-600 outline-none text-slate-800 dark:text-white bg-slate-50 dark:bg-slate-800 transition-all font-medium text-sm"
                  value={formData.teacherDetails.experience}
                  onChange={handleChange}
                  placeholder="e.g. 5 years teaching O/L Mathematics"
                  required={formData.role === 'teacher'} 
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 uppercase tracking-wider mb-2">Subjects You Teach</label>
                <input 
                  type="text" 
                  name="subjects"
                  className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-sky-500/20 focus:border-sky-600 outline-none text-slate-800 dark:text-white bg-slate-50 dark:bg-slate-800 transition-all font-medium text-sm"
                  value={formData.teacherDetails.subjects}
                  onChange={handleChange}
                  placeholder="e.g. Mathematics, Science"
                  required={formData.role === 'teacher'} 
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 uppercase tracking-wider mb-2">Mediums You Teach</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Sinhala', 'English', 'Tamil'].map(medium => (
                    <label key={medium} className="flex items-center space-x-2 p-2 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                      <input 
                        type="checkbox" 
                        value={medium}
                        checked={formData.teacherDetails.mediums?.includes(medium) || false}
                        onChange={(e) => handleCheckboxChange(e, 'mediums')}
                        className="w-4 h-4 text-sky-600 rounded border-slate-300 focus:ring-sky-500"
                      />
                      <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">{medium}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 uppercase tracking-wider mb-2">Grades You Teach</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {['Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Ordinary Level', 'Advanced Level'].map(grade => (
                    <label key={grade} className="flex items-center space-x-2 p-2 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                      <input 
                        type="checkbox" 
                        value={grade}
                        checked={formData.teacherDetails.grades?.includes(grade) || false}
                        onChange={(e) => handleCheckboxChange(e, 'grades')}
                        className="w-4 h-4 text-sky-600 rounded border-slate-300 focus:ring-sky-500"
                      />
                      <span className="text-sm text-slate-700 dark:text-slate-300 font-medium leading-tight">{grade}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3.5 rounded-xl shadow-md transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center cursor-pointer mt-4"
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 mr-2 animate-spin" />
                Creating account...
              </>
            ) : (
              'Sign Up'
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-slate-500 text-sm font-semibold">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium hover:underline transition-colors">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

