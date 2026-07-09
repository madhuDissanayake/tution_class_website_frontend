import { Link, useNavigate } from 'react-router-dom';
import { Search, BookOpen, GraduationCap, ArrowRight, Star, Users, Video, MapPin, CheckCircle } from 'lucide-react';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

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

const Home = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [featuredTutors, setFeaturedTutors] = useState([]);
  const [loadingTutors, setLoadingTutors] = useState(true);
  const [popularClasses, setPopularClasses] = useState([]);
  const [loadingClasses, setLoadingClasses] = useState(true);

  useEffect(() => {
    if (user?.role === 'admin') {
      navigate('/admin', { replace: true });
    } else if (user?.role === 'teacher') {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchPopularClasses = async () => {
      try {
        const { data } = await axios.get(import.meta.env.VITE_API_URL + '/api/classes');
        // Simple sorting by reviews/rating
        const sorted = data.sort((a, b) => {
          const scoreA = (a.avgRating || 0) * (a.reviewCount || 1);
          const scoreB = (b.avgRating || 0) * (b.reviewCount || 1);
          return scoreB - scoreA;
        });
        setPopularClasses(sorted.slice(0, 4));
      } catch (error) {
        console.error("Failed to fetch popular classes", error);
      } finally {
        setLoadingClasses(false);
      }
    };
    
    fetchPopularClasses();
  }, []);

  return (
    <div className="w-full bg-slate-50 dark:bg-slate-900 overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-4 lg:pt-8 pb-16 px-6 lg:pb-24">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-blue-500/10 dark:bg-blue-600/10 blur-[100px] rounded-full pointer-events-none"></div>
        
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 w-full relative z-10">
          
          {/* Left Text Content */}
          <div className="w-full lg:w-[45%] space-y-6 lg:space-y-8 animate-fade-in z-10 text-center lg:text-left flex flex-col items-center lg:items-start">
            <h1 className="text-3xl lg:text-4xl xl:text-5xl font-semibold text-slate-900 dark:text-white leading-[1.15]">
              Find the Perfect <br className="hidden lg:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                Tuition Class
              </span>
            </h1>

            <p className="text-base lg:text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed max-w-lg">
              Find the perfect class, book your seat instantly, and start learning. Whether you prefer physical classrooms or online sessions, we have you covered.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              <Link 
                to="/search" 
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center group"
              >
                <Search className="w-5 h-5 mr-2" />
                <span>Find Classes Now</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            <div className="flex items-center gap-6 pt-4 text-slate-500 dark:text-slate-400 font-medium text-sm">
              <div className="flex items-center"><CheckCircle className="w-4 h-4 mr-1 text-emerald-500"/> Verified Tutors</div>
              <div className="flex items-center"><CheckCircle className="w-4 h-4 mr-1 text-emerald-500"/> Instant Booking</div>
              <div className="flex items-center"><CheckCircle className="w-4 h-4 mr-1 text-emerald-500"/> Secure Platform</div>
            </div>
          </div>

          {/* Right Image/Illustration */}
          <div className="w-full lg:w-[45%] relative z-0 mt-12 lg:mt-0 flex justify-center">
            <div className="relative w-full max-w-[480px] h-[300px] md:h-[360px] lg:h-[400px]">
              {/* Main Image */}
              <div className="w-full h-full rounded-[2rem] overflow-hidden shadow-2xl shadow-blue-900/10 dark:shadow-black/40 border-[6px] border-white dark:border-slate-800 relative z-10">
                <img 
                  src="/images/srilankan_hero_students.png" 
                  alt="Sri Lankan Students collaborating" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Background Decoration */}
              <div className="absolute -inset-4 border border-blue-200 dark:border-blue-500/20 rounded-[2.5rem] -z-10 transform rotate-3"></div>
            </div>
          </div>

        </div>
      </section>

      {/* Most Popular Classes Section */}
      <section className="py-20 px-6 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div className="text-center md:text-left mb-6 md:mb-0">
              <h2 className="text-3xl md:text-4xl font-medium text-slate-900 dark:text-white mb-3">
                Most Popular Classes
              </h2>
              <p className="text-slate-600 dark:text-slate-400 font-medium">
                Explore the top-rated classes that students are loving right now.
              </p>
            </div>
            <Link to="/search" className="inline-flex items-center text-blue-600 dark:text-blue-400 font-medium hover:underline">
              View All Classes <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loadingClasses ? (
               <div className="col-span-full text-center py-10 text-slate-500 animate-pulse">Loading Popular Classes...</div>
            ) : popularClasses.length === 0 ? (
               <div className="col-span-full text-center py-10 text-slate-500">More classes coming soon!</div>
            ) : (
              popularClasses.map(cls => (
                <Link key={cls._id} to={`/class/${cls._id}`} className="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-200 dark:border-slate-700 block">
                  <div className="h-32 relative overflow-hidden bg-slate-200 dark:bg-slate-700">
                    <img 
                      src={cls.image || getSubjectImage(cls.subject)} 
                      alt={cls.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                    <div className="absolute bottom-3 left-3 bg-white/20 backdrop-blur-md text-white px-2.5 py-0.5 rounded-lg text-[10px] font-medium border border-white/20">
                      {cls.medium} Medium
                    </div>
                    <div className={`absolute top-3 right-3 backdrop-blur-md text-white px-2 py-1 rounded-md text-[10px] font-medium shadow-sm border border-white/20 ${cls.availableSeats > 0 ? 'bg-blue-600/80' : 'bg-red-500/80'}`}>
                      {cls.availableSeats > 0 ? `${cls.availableSeats} Seats Left` : 'Fully Booked'}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-base font-semibold text-slate-900 dark:text-white line-clamp-2 mb-1 group-hover:text-blue-600 transition-colors">{cls.title}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mb-3">By {cls.teacherId?.name || 'Unknown Teacher'}</p>
                    
                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100 dark:border-slate-700">
                      <div className="flex items-center">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-1" />
                        <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                          {cls.avgRating ? cls.avgRating.toFixed(1) : 'New'}
                        </span>
                      </div>
                      <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-semibold px-2 py-1 rounded-lg">
                        Rs. {cls.fee}
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Interactive Classes Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
            
            <div className="w-full lg:w-1/2 space-y-6">
              <h2 className="text-3xl md:text-4xl font-medium text-slate-900 dark:text-white leading-tight">
                Physical & Online Classes, <br/>All in One Place
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 font-medium">
                Our platform streamlines your learning journey. Easily find nearby physical classes or enroll in high-quality virtual sessions from the comfort of your home.
              </p>
              
              <ul className="space-y-4 pt-2">
                <li className="flex items-start">
                  <div className="mt-1 bg-blue-100 dark:bg-blue-900/50 p-2 rounded-lg text-blue-600 dark:text-blue-400 mr-4 shadow-sm border border-blue-200 dark:border-blue-800">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-white">Location-based Classes</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">Find nearby physical classes and tutors conducting sessions in your area easily.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mt-1 bg-blue-100 dark:bg-blue-900/50 p-2 rounded-lg text-blue-600 dark:text-blue-400 mr-4 shadow-sm border border-blue-200 dark:border-blue-800">
                    <Search className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-white">Find Your Best Fit</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">Search for physical and online classes to suit your personal preferences perfectly.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mt-1 bg-blue-100 dark:bg-blue-900/50 p-2 rounded-lg text-blue-600 dark:text-blue-400 mr-4 shadow-sm border border-blue-200 dark:border-blue-800">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-white">Details & Instant Booking</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">View teachers, class times, and monthly fees. Book available seats instantly.</p>
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="w-full lg:w-1/2">
              <div className="rounded-2xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-700 relative">
                <img 
                  src="/images/srilankan_student_studying.png" 
                  alt="Sri Lankan Students studying" 
                  className="w-full h-[450px] object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent flex flex-col justify-end p-8 pointer-events-none">
                  <h3 className="text-white text-2xl font-medium">Seamless Learning Experience</h3>
                  <p className="text-slate-300 mt-2 font-medium">Empowering students with modern educational tools.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
