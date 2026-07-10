import { Link, useNavigate } from 'react-router-dom';
import { Search, BookOpen, GraduationCap, ArrowRight, Star, Users, Video, MapPin, CheckCircle, ChevronDown } from 'lucide-react';
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
        const { data } = await axios.get(import.meta.env.VITE_API_URL + '/api/classes?isPopular=true');
        setPopularClasses(data.slice(0, 4));
      } catch (error) {
        console.error("Failed to fetch popular classes", error);
      } finally {
        setLoadingClasses(false);
      }
    };
    
    fetchPopularClasses();
  }, []);

  useEffect(() => {
    const fetchFeaturedTutors = async () => {
      try {
        const { data } = await axios.get(import.meta.env.VITE_API_URL + '/api/admin/featured-tutors/public');
        setFeaturedTutors(data);
      } catch (error) {
        console.error("Failed to fetch featured tutors", error);
      } finally {
        setLoadingTutors(false);
      }
    };
    
    fetchFeaturedTutors();
  }, []);

  return (
    <div className="w-full bg-surface-950 overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-6 lg:pt-8 pb-16 px-6 lg:pb-24 bg-gradient-to-b from-indigo-950/40 via-surface-950 to-surface-950">
        
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 w-full relative z-10">
          
          {/* Left Text Content */}
          <div className="w-full lg:w-[45%] space-y-6 lg:space-y-8 animate-fade-in z-10 text-center lg:text-left flex flex-col items-center lg:items-start">
            <h1 className="text-3xl lg:text-4xl xl:text-5xl font-extrabold text-white leading-[1.25] lg:leading-[1.3] tracking-tight">
              Find the Perfect <br className="hidden lg:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-from to-brand-to font-extrabold">
                Tuition Class
              </span>
            </h1>

            <p className="text-base lg:text-lg text-muted-400 font-medium leading-loose max-w-lg">
              Find the perfect class, book your seat instantly, and start learning. Whether you prefer physical classrooms or online sessions, we have you covered.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              <Link 
                to="/search" 
                className="w-full sm:w-auto bg-gradient-to-r from-brand-from to-brand-to text-white font-bold px-8 py-4 rounded-xl shadow-glow-primary hover:opacity-90 hover:-translate-y-[2px] transition-all duration-200 flex items-center justify-center group border border-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-from focus-visible:ring-offset-2 focus-visible:ring-offset-surface-950"
              >
                <Search className="w-5 h-5 mr-2" />
                <span>Find Classes Now</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-4 text-white/90 font-medium text-[13px]">
              <div className="flex items-center px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm shadow-sm transition-colors hover:bg-white/10">
                <CheckCircle className="w-4 h-4 mr-1.5 text-secondary"/> Verified Tutors
              </div>
              <div className="flex items-center px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm shadow-sm transition-colors hover:bg-white/10">
                <CheckCircle className="w-4 h-4 mr-1.5 text-secondary"/> Instant Booking
              </div>
              <div className="flex items-center px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm shadow-sm transition-colors hover:bg-white/10">
                <CheckCircle className="w-4 h-4 mr-1.5 text-secondary"/> Secure Platform
              </div>
            </div>


          </div>

          {/* Right Image/Illustration */}
          <div className="w-full lg:w-[45%] relative z-0 mt-12 lg:mt-0 flex justify-center">
            <div className="relative w-full max-w-[500px] aspect-[4/3]">
              {/* Main Image */}
              <div className="w-full h-full rounded-[2rem] overflow-hidden shadow-card border-[6px] border-surface-800 relative z-10 group">
                <img 
                  src="/images/authentic_tuition.png" 
                  alt="Sri Lankan Students collaborating" 
                  onError={(e) => { e.target.src = getSubjectImage('default'); }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Background Decoration */}
              <div className="absolute -inset-4 border border-primary/20 rounded-[2.5rem] -z-10 transform rotate-3"></div>

              {/* Floating Stats Card: Students */}
              <div className="absolute -bottom-4 left-2 sm:-left-4 md:-bottom-8 md:-left-8 bg-surface-900/90 backdrop-blur-xl border border-surface-600 p-4 md:p-5 rounded-2xl shadow-card z-20 flex items-center gap-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-3 rounded-xl shadow-inner text-white">
                  <Star className="w-6 h-6 fill-current" />
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <h4 className="text-xl md:text-2xl font-black text-white leading-none">500+</h4>
                    <span className="text-xs font-bold text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded-md">4.8★</span>
                  </div>
                  <p className="text-xs md:text-[13px] font-bold text-muted-400 mt-1 uppercase tracking-wider">Active Students</p>
                </div>
              </div>

              {/* Floating Stats Card: Tutors */}
              <div className="absolute -top-4 right-2 sm:-right-4 md:-top-6 md:-right-6 bg-surface-900/90 backdrop-blur-xl border border-surface-600 p-3 md:p-4 rounded-2xl shadow-card z-20 flex items-center gap-3 animate-slide-up" style={{ animationDelay: '0.3s' }}>
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full border-2 border-surface-800 bg-primary/20 flex items-center justify-center text-primary-light"><Users className="w-4 h-4"/></div>
                </div>
                <div>
                  <h4 className="text-base md:text-lg font-black text-white leading-none">50+</h4>
                  <p className="text-[11px] md:text-xs font-bold text-muted-400 mt-1 uppercase tracking-wider">Verified Tutors</p>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Scroll Indicator */}
        <div 
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center justify-center opacity-70 hover:opacity-100 transition-opacity cursor-pointer animate-bounce z-20"
          onClick={() => window.scrollTo({ top: window.innerHeight - 80, behavior: 'smooth' })}
          aria-label="Scroll down"
        >
          <ChevronDown className="w-8 h-8 text-brand-to/70" />
        </div>
      </section>

      {/* Most Popular Classes Section */}
      <section className="py-20 px-6 bg-surface-950 border-b border-surface-600">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div className="text-center md:text-left mb-6 md:mb-0">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                Most Popular Classes
              </h2>
              <p className="text-muted-400 font-medium">
                Explore the top-rated classes that students are loving right now.
              </p>
            </div>
            <Link to="/search" className="inline-flex items-center group font-medium rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-from focus-visible:ring-offset-2 focus-visible:ring-offset-surface-950 px-2 py-1 -ml-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-from to-brand-to group-hover:opacity-80 transition-opacity">View All Classes</span>
              <ArrowRight className="w-4 h-4 ml-1 text-brand-to group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loadingClasses ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-surface-800 rounded-2xl overflow-hidden shadow-card border border-surface-600 animate-pulse">
                  <div className="h-32 bg-surface-700"></div>
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-surface-700 rounded-md w-3/4 mt-1"></div>
                    <div className="h-3 bg-surface-700 rounded-md w-1/2 mb-4"></div>
                    <div className="pt-3 border-t border-surface-600 flex justify-between items-center mt-6">
                       <div className="h-4 bg-surface-700 rounded-md w-10"></div>
                       <div className="h-6 bg-surface-700 rounded-md w-16"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : popularClasses.length === 0 ? (
               <div className="col-span-full text-center py-10 text-muted-500">More classes coming soon!</div>
            ) : (
              popularClasses.map(cls => (
                <Link key={cls._id} to={`/class/${cls._id}`} className="group bg-surface-800 rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover hover:bg-surface-700 hover:-translate-y-1 transition-all duration-300 border border-surface-600 block">
                  <div className="h-32 relative overflow-hidden bg-surface-900">
                    <img 
                      src={cls.image || getSubjectImage(cls.subject)} 
                      alt={cls.title} 
                      onError={(e) => { e.target.src = getSubjectImage('default'); }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface-950/90 to-transparent"></div>
                    <div className="absolute bottom-3 left-3 bg-black/40 backdrop-blur-md text-white px-2.5 py-0.5 rounded-lg text-[10px] font-medium border border-white/10">
                      {cls.medium} Medium
                    </div>
                    <div className={`absolute top-3 right-3 backdrop-blur-md text-white px-2 py-1 rounded-md text-[10px] font-medium shadow-sm border border-white/20 ${cls.availableSeats > 0 ? 'bg-primary/80' : 'bg-red-500/80'}`}>
                      {cls.availableSeats > 0 ? `${cls.availableSeats} Seats Left` : 'Fully Booked'}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-base font-bold text-white line-clamp-2 mb-1 group-hover:text-primary-light transition-colors">{cls.title}</h3>
                    <p className="text-xs text-muted-400 font-semibold mb-3">By {cls.teacherId?.name || 'Unknown Teacher'}</p>
                    
                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-surface-600">
                      <div className="flex items-center">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-1" />
                        <span className="text-xs font-black text-white">
                          {cls.avgRating ? cls.avgRating.toFixed(1) : 'New'}
                        </span>
                      </div>
                      <span className="bg-primary-dark/50 text-primary-light text-xs font-black px-2 py-1 rounded-lg">
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

      {/* Featured Tutors Section */}
      <section className="py-20 px-6 bg-surface-900 border-b border-surface-600">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col text-center items-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Meet Our Featured Tutors
            </h2>
            <p className="text-muted-400 font-medium max-w-2xl">
              Learn from the best. Our top-rated tutors are here to guide you to academic excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loadingTutors ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-surface-800 rounded-2xl p-6 shadow-card border border-surface-600 flex flex-col items-center text-center animate-pulse">
                  <div className="w-20 h-20 rounded-full bg-surface-700 mb-4"></div>
                  <div className="h-5 bg-surface-700 rounded-md w-3/4 mb-3"></div>
                  <div className="h-3 bg-surface-700 rounded-md w-1/2 mb-6"></div>
                  <div className="flex justify-center w-full pt-4 border-t border-surface-600">
                    <div className="h-4 bg-surface-700 rounded-md w-2/3"></div>
                  </div>
                </div>
              ))
            ) : featuredTutors.length === 0 ? (
               <div className="col-span-full text-center py-10 text-muted-500">No featured tutors available at the moment.</div>
            ) : (
              featuredTutors.map(tutor => (
                <div key={tutor._id} className="group bg-surface-800 rounded-2xl p-6 shadow-card hover:shadow-card-hover hover:bg-surface-700 hover:-translate-y-1 transition-all duration-300 border border-surface-600 flex flex-col items-center text-center">
                  <div className={`w-20 h-20 rounded-full mb-4 flex items-center justify-center text-3xl shadow-lg font-bold
                    ${tutor.themeColor === 'indigo' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : ''}
                    ${tutor.themeColor === 'pink' ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30' : ''}
                    ${tutor.themeColor === 'emerald' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : ''}
                    ${tutor.themeColor === 'blue' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : ''}
                    ${tutor.themeColor === 'purple' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : ''}
                    ${tutor.themeColor === 'rose' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : ''}
                    ${tutor.themeColor === 'teal' ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30' : ''}
                    ${tutor.themeColor === 'cyan' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : ''}
                    ${!['indigo','pink','emerald','blue','purple','rose','teal','cyan'].includes(tutor.themeColor) ? 'bg-primary/20 text-primary-light border border-primary/30' : ''}
                  `}>
                    {tutor.name.charAt(0).toUpperCase()}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1 group-hover:text-primary-light transition-colors">{tutor.name}</h3>
                  <p className="text-sm text-muted-400 font-medium mb-4">{tutor.subject} Specialist</p>
                  
                  <div className="flex items-center gap-4 mt-auto pt-4 border-t border-surface-600 w-full justify-center">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400 mr-1.5" />
                      <span className="text-sm font-black text-white">{tutor.rating ? tutor.rating.toFixed(1) : '5.0'}</span>
                    </div>
                    <div className="w-1 h-1 rounded-full bg-surface-500"></div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 text-primary-light mr-1.5" />
                      <span className="text-sm font-black text-white">{tutor.studentsCount} Students</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Interactive Classes Section */}
      <section className="py-20 px-6 bg-surface-950">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
            
            <div className="w-full lg:w-1/2 space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                Physical & Online Classes, <br/>All in One Place
              </h2>
              <p className="text-lg text-muted-400 font-medium">
                Our platform streamlines your learning journey. Easily find nearby physical classes or enroll in high-quality virtual sessions from the comfort of your home.
              </p>
              
              <ul className="space-y-4 pt-2">
                <li className="flex items-start">
                  <div className="mt-1 bg-primary-dark/30 p-2 rounded-lg text-primary-light mr-4 shadow-sm border border-primary-dark/50">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Location-based Classes</h4>
                    <p className="text-sm text-muted-400 mt-1 leading-relaxed">Find nearby physical classes and tutors conducting sessions in your area easily.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mt-1 bg-primary-dark/30 p-2 rounded-lg text-primary-light mr-4 shadow-sm border border-primary-dark/50">
                    <Search className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Find Your Best Fit</h4>
                    <p className="text-sm text-muted-400 mt-1 leading-relaxed">Search for physical and online classes to suit your personal preferences perfectly.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mt-1 bg-primary-dark/30 p-2 rounded-lg text-primary-light mr-4 shadow-sm border border-primary-dark/50">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Details & Instant Booking</h4>
                    <p className="text-sm text-muted-400 mt-1 leading-relaxed">View teachers, class times, and monthly fees. Book available seats instantly.</p>
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="w-full lg:w-1/2">
              <div className="rounded-2xl overflow-hidden shadow-card border border-surface-600 relative">
                <img 
                  src="/images/srilankan_student_studying.png" 
                  alt="Sri Lankan Students studying" 
                  onError={(e) => { e.target.src = getSubjectImage('default'); }}
                  className="w-full h-[450px] object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-950/90 via-surface-950/20 to-transparent flex flex-col justify-end p-8 pointer-events-none">
                  <h3 className="text-white text-2xl font-bold">Seamless Learning Experience</h3>
                  <p className="text-muted-400 mt-2 font-medium">Empowering students with modern educational tools.</p>
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
