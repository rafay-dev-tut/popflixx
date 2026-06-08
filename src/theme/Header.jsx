// src/theme/header.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom'; 
import logo from '../assets/POPFLiX.svg'; 

function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showAgeGate, setShowAgeGate] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const savedAgeGroup = localStorage.getItem('popflix_age_group');
    if (!savedAgeGroup) {
      setShowAgeGate(true);
    }

    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAgeSelection = (type) => {
    if (type === 'under18') {
      localStorage.setItem('popflix_age_group', 'kids');
      window.dispatchEvent(new Event('ageGroupChanged'));
      navigate('/movies?kidsMode=true');
    } else {
      localStorage.setItem('popflix_age_group', 'adult');
      window.dispatchEvent(new Event('ageGroupChanged'));
    }
    setShowAgeGate(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const cleanQuery = searchQuery.trim();

    if (cleanQuery) {
      if (location.pathname === '/tv-shows') {
        navigate(`/tv-shows?search=${encodeURIComponent(cleanQuery)}`);
      } else {
        navigate(`/movies?search=${encodeURIComponent(cleanQuery)}`);
      }
      setIsMobileMenuOpen(false); 
    } else {
      if (location.pathname === '/tv-shows') {
        navigate('/tv-shows');
      } else {
        navigate('/movies');
      }
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <header 
        className={`sticky top-0 z-50 w-full transition-all duration-300 border-b ${
          isScrolled 
            ? "bg-[#050508]/90 backdrop-blur-md border-gray-900/80 shadow-xl" 
            : "bg-[#050508] border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link to="/" className="block">
              <img 
                src={logo} 
                alt="POPFLIX Logo" 
                className="h-7 w-auto object-contain transition-all duration-300 hover:drop-shadow-[0_0_10px_rgba(132,25,25,0.6)] hover:scale-102" 
              />
            </Link>
          </div>

          {/* ── DESKTOP NAVIGATION SYSTEM ── */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className={`relative font-semibold text-xs uppercase tracking-wider transition-colors duration-200 py-1 ${isActive('/') ? "text-white" : "text-gray-400 hover:text-white"}`}>
              Home
              {isActive('/') && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#841919] rounded-full" />}
            </Link>
            
            <Link to="/movies" className={`relative font-semibold text-xs uppercase tracking-wider transition-colors duration-200 py-1 ${isActive('/movies') ? "text-white" : "text-gray-400 hover:text-white"}`}>
              Movies
              {isActive('/movies') && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#841919] rounded-full" />}
            </Link>

            <Link to="/tv-shows" className={`relative font-semibold text-xs uppercase tracking-wider transition-colors duration-200 py-1 ${isActive('/tv-shows') ? "text-white" : "text-gray-400 hover:text-white"}`}>
              TV Shows
              {isActive('/tv-shows') && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#841919] rounded-full" />}
            </Link>

            <Link to="/subscription" className={`relative font-semibold text-xs uppercase tracking-wider transition-colors duration-200 py-1 ${isActive('/subscription') ? "text-white" : "text-gray-400 hover:text-white"}`}>
              Subscription
              {isActive('/subscription') && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#841919] rounded-full" />}
            </Link>
          </nav>

          {/* Right Section / Input Terminal */}
          <div className="flex items-center gap-3 sm:gap-4 flex-grow md:flex-grow-0 justify-end">
            <form onSubmit={handleSearchSubmit} className="relative w-full max-w-[160px] sm:max-w-[220px] md:max-w-[260px] transition-all duration-300 focus-within:max-w-[180px] sm:focus-within:max-w-[250px] md:focus-within:max-w-[300px]">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={location.pathname === '/tv-shows' ? "Search series..." : "Search movies..."}
                className="w-full bg-gray-900/40 text-white pl-9 pr-4 py-1.5 rounded-full text-xs font-medium placeholder-gray-600 border border-gray-800/80 focus:outline-none focus:bg-[#0b0c10] focus:border-[#841919]/60 focus:ring-1 focus:ring-[#841919]/40 transition-all duration-300"
              />
            </form>

            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-gray-400 hover:text-white focus:outline-none p-1.5 rounded-lg bg-gray-900/20 border border-gray-900/40 hover:bg-gray-900/60 transition-all"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Drawer Backdrop Layer */}
        <div className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden ${isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`} onClick={() => setIsMobileMenuOpen(false)} />

        {/* ── MOBILE SIDEBAR SYSTEM (Explicit Dark Architecture) ── */}
        <div className={`fixed top-0 right-0 h-full w-[280px] bg-[#050508] text-white border-l border-gray-900 shadow-2xl p-6 z-50 transform transition-transform duration-300 ease-in-out flex flex-col justify-between md:hidden ${isMobileMenuOpen ? "translate-x-0 !visible" : "translate-x-full !invisible"}`}>
          <div>
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-900/60">
              <span className="text-xs uppercase font-extrabold text-gray-400 tracking-widest">Navigation</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-400 hover:text-white bg-gray-900/60 p-1.5 rounded-full border border-gray-800/40">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <nav className="flex flex-col gap-3">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className={`font-bold text-sm tracking-wide p-3 rounded-xl transition-all ${isActive('/') ? "bg-[#841919]/20 text-white border-l-4 border-[#841919]" : "text-gray-400 hover:bg-gray-900/40 hover:text-white"}`}>Home</Link>
              <Link to="/movies" onClick={() => setIsMobileMenuOpen(false)} className={`font-bold text-sm tracking-wide p-3 rounded-xl transition-all ${isActive('/movies') ? "bg-[#841919]/20 text-white border-l-4 border-[#841919]" : "text-gray-300 hover:bg-gray-900/40 hover:text-white"}`}>Movies</Link>
              <Link to="/tv-shows" onClick={() => setIsMobileMenuOpen(false)} className={`font-bold text-sm tracking-wide p-3 rounded-xl transition-all ${isActive('/tv-shows') ? "bg-[#841919]/20 text-white border-l-4 border-[#841919]" : "text-gray-300 hover:bg-gray-900/40 hover:text-white"}`}>TV Shows</Link>
              <Link to="/subscription" onClick={() => setIsMobileMenuOpen(false)} className={`font-bold text-sm tracking-wide p-3 rounded-xl transition-all ${isActive('/subscription') ? "bg-[#841919]/20 text-white border-l-4 border-[#841919]" : "text-gray-300 hover:bg-gray-900/40 hover:text-white"}`}>Subscription</Link>
            </nav>
          </div>
          
          <div className="pt-4 border-t border-gray-900/60 text-center">
            <p className="text-[10px] text-gray-500 font-medium tracking-wide">POPFLIX v2.1 • Age Filter Ready</p>
          </div>
        </div>
      </header>

      {/* ── 🔞 AGE GATEWAY PANEL MIDDLEWARE ── */}
      {showAgeGate && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#020204]/90 backdrop-blur-xl">
          <div className="bg-[#0b0c10] border border-gray-900 rounded-2xl max-w-md w-full p-6 text-center shadow-[0_0_50px_rgba(132,25,25,0.15)]">
            <div className="w-16 h-16 bg-[#841919]/10 border border-[#841919]/30 rounded-full flex items-center justify-center mx-auto mb-4 text-xl">🍿</div>
            <h3 className="text-lg font-extrabold text-white uppercase tracking-wider mb-2">Select Viewing Experience</h3>
            <p className="text-xs text-gray-400 max-w-xs mx-auto mb-6 leading-relaxed">Welcome to POPFLIX. Please select your age group to filter your streaming environment properly.</p>
            <div className="flex flex-col gap-3">
              <button onClick={() => handleAgeSelection('adult')} className="w-full bg-[#841919] hover:bg-[#a62222] text-white font-bold text-xs uppercase tracking-wider py-3 px-4 rounded-xl transition-all">
                Adult Mode (18+ Unrestricted)
              </button>
              <button onClick={() => handleAgeSelection('under18')} className="w-full bg-gray-900 hover:bg-gray-800 text-gray-300 font-bold text-xs uppercase tracking-wider py-3 px-4 rounded-xl border border-gray-800 transition-all">
                Kids & Family Mode (Under 18)
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Header;