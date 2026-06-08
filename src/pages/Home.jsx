// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  fetchPopularMovies, 
  fetchBollywoodMovies, 
  fetchHollywoodMovies, 
  fetchWebSeries, 
  fetchDramas, 
  getImageUrl 
} from '../services/api';
import { authService } from '../services/authLocalStorage';

function Home() {
  const [trending, setTrending] = useState([]);
  const [bollywood, setBollywood] = useState([]);
  const [Hollywood, setHollywood] = useState([]);
  const [webSeries, setWebSeries] = useState([]);
  const [dramas, setDramas] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Local Storage Database states for tracking rails
  const [continueWatching, setContinueWatching] = useState([]);
  const [watched, setWatched] = useState([]);

  useEffect(() => {
    const getAllData = async () => {
      try {
        setLoading(true);
        
        // Load local tracking states first
        const userData = authService.getCurrentUser();
        if (userData && userData.history) {
          setContinueWatching(userData.history.continueWatching || []);
          setWatched(userData.history.watched || []);
        }
        
        // Parallel data fetching for fast speed
        const [resPopular, resBollywood, resHollywood, resWeb, resDramas] = await Promise.all([
          fetchPopularMovies(),
          fetchBollywoodMovies(),
          fetchHollywoodMovies(),
          fetchWebSeries(),
          fetchDramas()
        ]);

        if (resPopular?.results) setTrending(resPopular.results);
        if (resBollywood?.results) setBollywood(resBollywood.results);
        if (resHollywood?.results) setHollywood(resHollywood.results);
        if (resWeb?.results) setWebSeries(resWeb.results);
        if (resDramas?.results) setDramas(resDramas.results);

      } catch (error) {
        console.error("Error loading home page content:", error);
      } finally {
        setLoading(false);
      }
    };

    getAllData();
  }, []);

  // Intercept element click to trigger dynamic relational history simulation
  const handleMediaAction = (item, forceType = null) => {
    const title = item.title || item.name;
    const posterPath = item.poster_path || item.posterPath;
    
    // ── 🎯 100% SECURE ROUTE FALLBACK DETECTOR ──
    let mediaType = 'movie';

    if (forceType) {
      mediaType = forceType;
    } else if (item.type === 'tv' || item.type === 'movie') {
      mediaType = item.type; // Direct check from Local Storage payload schema
    } else if (item.first_air_date || item.media_type === 'tv' || !item.title) {
      mediaType = 'tv'; // Fallback detection matrix based on dynamic parameters
    }

    // Explicit protection wrapper to avoid broken paths
    if (mediaType !== 'tv' && mediaType !== 'movie') {
      mediaType = 'movie';
    }

    // Save tracking history via authService with absolute verified key attributes
    if (authService && authService.trackMedia) {
      authService.trackMedia(item.id, title, posterPath, mediaType, 'continue');
    }
    
    // Smooth scrolling view ports adjustment
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Perfect structural navigation redirection
    navigate(`/${mediaType}/${item.id}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#0c0d10]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#841919]"></div>
      </div>
    );
  }

  const heroMovie = trending.length > 0 ? trending[0] : null;

  // Reusable Movie Row Component (Original layout framework intact)
  const MovieRow = ({ title, items, isHistoryRow = false, forceType = null }) => {
    if (!items || items.length === 0) return null;
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-10">
        <h2 className="text-lg sm:text-2xl font-bold text-white border-l-4 border-[#841919] pl-3 tracking-wide mb-5">
          {title}
        </h2>
        
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x md:grid md:grid-cols-4 lg:grid-cols-5 md:overflow-x-visible md:pb-0">
          {items.slice(0, 10).map((item) => {
            // Determine dynamic individual tag for clean metadata presentation layer
            let currentTag = 'Movie 🎬';
            if (forceType === 'tv' || item.type === 'tv' || item.first_air_date) {
              currentTag = 'TV Series 📺';
            }

            return (
              <div 
                onClick={() => handleMediaAction(item, forceType)}
                key={item.id}
                className="min-w-[140px] sm:min-w-[180px] md:min-w-0 bg-[#14151a] rounded-xl overflow-hidden shadow-xl group hover:scale-[1.03] transition-all duration-300 border border-gray-900 hover:border-[#841919]/50 flex flex-col snap-start cursor-pointer"
              >
                <div className="relative overflow-hidden aspect-[2/3] pointer-events-none">
                  <img 
                    src={getImageUrl(item.poster_path || item.posterPath)} 
                    alt={item.title || item.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute top-2 right-2 bg-black/75 backdrop-blur-md text-yellow-400 font-bold text-[10px] sm:text-xs px-2 py-0.5 rounded flex items-center gap-1 shadow-md">
                    ⭐ {item.vote_average ? Number(item.vote_average).toFixed(1) : '8.1'}
                  </div>
                </div>

                <div className="p-3 flex flex-col justify-between flex-grow bg-gradient-to-b from-[#14151a] to-[#0f1013] pointer-events-none">
                  <h3 className="font-semibold text-xs sm:text-sm text-gray-200 line-clamp-1 group-hover:text-[#841919] transition-colors duration-200">
                    {item.title || item.name}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-gray-500 mt-1 font-medium">
                    {currentTag}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-[#0c0d10] min-h-screen text-gray-100 pb-16 overflow-x-hidden">
      
      {/* HERO BANNER (Cinematic Header Hero) */}
      {heroMovie && (
        <div className="relative h-[65vh] sm:h-[80vh] w-full overflow-hidden">
          <div className="absolute inset-0">
            <img 
              src={getImageUrl(heroMovie.backdrop_path || heroMovie.poster_path)} 
              alt={heroMovie.title}
              className="w-full h-full object-cover object-top filter brightness-[0.4]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c0d10] via-transparent to-black/30" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0c0d10] via-[#0c0d10]/40 to-transparent" />
          </div>

          <div className="absolute bottom-0 left-0 max-w-4xl px-4 sm:px-12 pb-10 md:pb-16 z-10 space-y-3 sm:space-y-4">
            <span className="bg-[#841919] text-white text-[10px] sm:text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded">
              Trending Choice
            </span>
            <h1 className="text-2xl sm:text-4xl md:text-6xl font-black tracking-tight text-white line-clamp-2 drop-shadow-lg">
              {heroMovie.title}
            </h1>
            <div className="flex items-center gap-4 text-xs sm:text-sm font-medium">
              <span className="text-yellow-400 flex items-center gap-1">
                ⭐ {heroMovie.vote_average ? heroMovie.vote_average.toFixed(1) : 'N/A'}
              </span>
              <span className="text-gray-400">
                {heroMovie.release_date ? heroMovie.release_date.split('-')[0] : 'N/A'}
              </span>
            </div>
            <p className="text-gray-300 text-xs sm:text-sm md:text-base line-clamp-2 sm:line-clamp-3 max-w-xl font-light leading-relaxed">
              {heroMovie.overview}
            </p>
            <div className="pt-2">
              <button 
                onClick={() => handleMediaAction(heroMovie, 'movie')}
                className="inline-flex items-center justify-center bg-[#841919] hover:bg-[#a62222] text-white text-xs sm:text-sm font-semibold px-5 py-2.5 sm:px-6 sm:py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-[#841919]/30 gap-2"
              >
                <span>▶</span> Watch Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HORIZONTAL ROWS */}
      <div className="space-y-4 md:space-y-8 -mt-10 sm:-mt-16 relative z-20">
        {continueWatching.length > 0 && (
          <MovieRow title="🍿 Continue Watching" items={continueWatching} isHistoryRow={true} />
        )}
        {watched.length > 0 && (
          <MovieRow title="✅ Already Watched Collection" items={watched} isHistoryRow={true} />
        )}
        
        <MovieRow title="🔥 Popular Movies" items={trending} forceType="movie" />
        <MovieRow title="🎬 Hollywood Blockbusters" items={Hollywood} forceType="movie" />
        <MovieRow title="🕌 Bollywood Hits" items={bollywood} forceType="movie" />
        <MovieRow title="📺 Top Web Series" items={webSeries} forceType="tv" />
        <MovieRow title="🎭 Drama & K-Dramas Zone" items={dramas} forceType="tv" />
      </div>

    </div>
  );
}

export default Home;