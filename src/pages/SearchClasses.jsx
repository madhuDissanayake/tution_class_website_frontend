import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Search as SearchIcon, MapPin, Book, Star, Map as MapIcon, List, Loader, Calendar, Layers, Globe } from 'lucide-react';
import Map from '../components/ui/Map';

const renderStars = (rating) => {
  const stars = [];
  const roundedRating = Math.round(rating || 0);
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Star 
        key={i} 
        className={`w-4 h-4 transition-all duration-300 ${i <= roundedRating ? 'text-amber-500 fill-amber-500 drop-shadow-[0_0_4px_rgba(245,158,11,0.5)]' : 'text-slate-200'}`} 
      />
    );
  }
  return stars;
};

const getSubjectImage = (subject) => {
  const subjectMap = {
    'Mathematics': 'https://images.unsplash.com/photo-1509228468518-180dd4864904?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'Science': 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'English': 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'Physics': 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'Chemistry': 'https://images.unsplash.com/photo-1603126852883-ea2b6ee3c08a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'Biology': 'https://images.unsplash.com/photo-1530213786676-41ce9f48a1b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'Computer Science': 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'Business Studies': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'Accounting': 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'Economics': 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'Sinhala': 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'History': 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'Geography': 'https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  };
  return subjectMap[subject] || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
};

const SearchClasses = () => {
  const [classes, setClasses] = useState([]);
  const [search, setSearch] = useState('');
  const [subject, setSubject] = useState('');
  const [grade, setGrade] = useState('');
  const [medium, setMedium] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await axios.get(import.meta.env.VITE_API_URL + '/api/classes', {
          params: { search, subject, grade, medium },
        });
        setClasses(data);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Failed to fetch classes');
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, [search, subject, grade, medium]);

  return (
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 animate-fade-in py-6 px-6 md:px-0">
      {/* Sidebar Filters */}
      <div className="w-full md:w-1/4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm h-fit">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-8 flex items-center">
          <Layers className="w-6 h-6 mr-3 text-blue-600" />
          Filter Classes
        </h2>
        <div className="space-y-5">
          <div>
            <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2">Search Query</label>
            <div className="relative">
              <SearchIcon className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-blue-500 w-4.5 h-4.5" />
              <input 
                type="text" 
                className="w-full pl-11 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm font-semibold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 transition-all placeholder-slate-400"
                placeholder="Search tuition..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2">Subject</label>
            <select 
              className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-white cursor-pointer transition-all"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            >
              <option value="">All Subjects</option>
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
            <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2">Grade Level</label>
            <select 
              className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-white cursor-pointer transition-all"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
            >
              <option value="">All Grades</option>
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
            <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2">Medium</label>
            <select 
              className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-white cursor-pointer transition-all"
              value={medium}
              onChange={(e) => setMedium(e.target.value)}
            >
              <option value="">All Mediums</option>
              <option value="Sinhala">Sinhala</option>
              <option value="English">English</option>
              <option value="Tamil">Tamil</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results List */}
      <div className="w-full md:w-3/4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 tracking-tight">
            Search Results <span className="text-blue-600">({loading ? '...' : classes.length})</span>
          </h2>
          <div className="bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl flex space-x-1 border border-slate-200 dark:border-slate-700 shadow-sm">
            <button 
              onClick={() => setViewMode('list')} 
              className={`flex items-center px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all duration-300 ${viewMode === 'list' ? 'bg-blue-600 shadow-md text-white' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700'}`}
            >
              <List className="w-4 h-4 mr-2" /> List
            </button>
            <button 
              onClick={() => setViewMode('map')} 
              className={`flex items-center px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all duration-300 ${viewMode === 'map' ? 'bg-blue-600 shadow-md text-white' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700'}`}
            >
              <MapIcon className="w-4 h-4 mr-2" /> Map
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-4">
            <Loader className="w-12 h-12 text-blue-600 animate-spin" />
            <p className="text-slate-500 font-bold animate-pulse text-sm">Searching class databases...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-center font-bold border border-red-100/60 animate-fade-in text-sm">
            {error}
          </div>
        ) : classes.length === 0 ? (
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-16 text-center shadow-sm animate-fade-in">
            <p className="text-2xl font-black text-slate-900 dark:text-white mb-3">No classes found</p>
            <p className="text-slate-500 font-medium text-sm max-w-md mx-auto leading-relaxed">We couldn't find any classes matching your criteria. Try adjusting your search queries or subject filters.</p>
          </div>
        ) : viewMode === 'list' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {classes.map((cls) => {
              return (
                <div key={cls._id} className="group bg-white dark:bg-slate-800 rounded-3xl overflow-hidden hover:shadow-lg hover:border-blue-500/20 hover:-translate-y-1.5 duration-300 flex flex-col justify-between border border-slate-100 dark:border-slate-700">
                  <div>
                    <div className="h-40 relative flex items-center justify-center overflow-hidden bg-slate-200 dark:bg-slate-700">
                      <img 
                        src={cls.image || getSubjectImage(cls.subject)} 
                        alt={cls.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent"></div>
                      <div className="absolute bottom-3 left-3 bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-xl text-xs font-bold flex items-center shadow-sm border border-white/20">
                        <Globe className="w-3.5 h-3.5 mr-1" /> {cls.medium} Medium
                      </div>
                      <div className={`absolute top-3 right-3 backdrop-blur-md text-white px-2.5 py-1 rounded-md text-xs font-bold shadow-sm border border-white/20 ${cls.availableSeats > 0 ? 'bg-blue-600/80' : 'bg-red-500/80'}`}>
                        {cls.availableSeats > 0 ? `${cls.availableSeats} Seats Left` : 'Fully Booked'}
                      </div>
                    </div>
                    <div className="p-6 pb-2">
                      <div className="flex justify-between items-start mb-2 gap-2">
                        <h3 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight line-clamp-1 group-hover:text-blue-600 transition-colors duration-300">{cls.title}</h3>
                        <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold px-3 py-1 rounded-full shrink-0 shadow-sm border border-blue-100 dark:border-blue-800">Rs. {cls.fee}/mo</span>
                      </div>
                      
                      <div className="flex items-center mb-4">
                        <div className="flex mr-2">
                          {renderStars(cls.avgRating)}
                        </div>
                        <span className="text-slate-500 text-xs font-bold mt-0.5">
                          {cls.avgRating ? `${cls.avgRating.toFixed(1)} (${cls.reviewCount || 0} reviews)` : 'No reviews'}
                        </span>
                      </div>

                      <div className="flex items-center text-slate-500 text-xs font-bold mb-4 gap-4">
                        <div className="flex items-center"><Book className="w-4 h-4 mr-1 text-blue-500" /> {cls.subject}</div>
                        <div className="flex items-center"><Calendar className="w-4 h-4 mr-1 text-blue-500" /> {cls.grade}</div>
                      </div>
                      <p className="text-slate-400 text-xs font-semibold">By {cls.teacherId?.name || 'Unknown Teacher'}</p>
                    </div>
                  </div>
                  <div className="p-6 pt-2">
                    <Link to={`/class/${cls._id}`} className="block w-full text-center bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-600 text-blue-600 dark:text-blue-400 hover:text-white font-bold py-2.5 rounded-xl transition-all border border-blue-100 dark:border-blue-800 hover:scale-[1.02] active:scale-98 duration-300 text-sm">
                      View Details
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="h-[550px] w-full rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md">
            <Map 
              locations={classes
                .filter(c => c.location?.coordinates && c.location.coordinates.length >= 2)
                .map(c => ({ 
                  lat: c.location.coordinates[1], 
                  lng: c.location.coordinates[0], 
                  title: c.title 
                }))} 
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchClasses;
