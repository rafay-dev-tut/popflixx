// src/pages/MovieDetails.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchMovieDetails, fetchMovieVideos, getImageUrl, fetchRelatedMovies } from '../services/api';

// ── FIXED IMPORT: Bundled authService standard object import ──
import { authService } from '../services/authLocalStorage';

function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [relatedMovies, setRelatedMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Default Par "Trailer" tab active rahega
  const [activeTab, setActiveTab] = useState("trailer");
  
  // Server 1 Default (vidsrc_me)
  const [serverKey, setServerKey] = useState("vidsrc_me");
  const [iframeKey, setIframeKey] = useState(0); 
  const [showShield, setShowShield] = useState(true);
  const playerRef = useRef(null);

  useEffect(() => {
    const getMovieDetails = async () => {
      setLoading(true);
      try {
        const details = await fetchMovieDetails(id);
        const videoKey = await fetchMovieVideos(id);
        const related = await fetchRelatedMovies(id);
        
        setMovie(details);
        setTrailerKey(videoKey);
        setRelatedMovies(related || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    getMovieDetails();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setShowShield(true);
  }, [id]);

  const handleServerChange = (newServer) => {
    setServerKey(newServer);
    setIframeKey(prev => prev + 1); 
    setShowShield(true);
  };

  // ── LOGIC FOR TRACKING HISTORY ──
  const handleStartWatching = () => {
    if (movie) {
      authService.updateMovieHistory(movie.id, movie.title, movie.poster_path, 'continue');
    }
  };

  const handleMarkAsWatched = () => {
    if (movie) {
      authService.updateMovieHistory(movie.id, movie.title, movie.poster_path, 'watched');
      alert("Movie marked as Watched entirely!");
    }
  };

  // Immersive Loading Screen
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[75vh] bg-black text-white px-4">
        <div className="relative flex items-center justify-center mb-6">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#841919]"></div>
          <div className="absolute rounded-full h-10 w-10 bg-[#841919]/20 animate-ping"></div>
        </div>
        <h3 className="text-lg sm:text-xl font-bold tracking-wide text-gray-200 text-center animate-pulse">
          Please be patient with us while we fetch your stream...
        </h3>
        <p className="text-xs text-gray-500 mt-2 text-center">Optimizing fast routing cloud layers</p>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="text-center py-20 text-white">
        <h2 className="text-xl font-semibold">Movie not found!</h2>
        <Link to="/" className="text-[#841919] mt-4 inline-block hover:underline">Go back Home</Link>
      </div>
    );
  }

  const movieSources = {
    vidsrc_me: `https://vidsrc.me/embed/movie?tmdb=${movie.id}`,
    autoembed: `https://player.autoembed.cc/embed/movie/${movie.id}`,
    multiembed: `https://multiembed.mov/?video_id=${movie.id}&tmdb=1`,
    smashy: `https://embed.smashystream.com/playere.php?tmdb=${movie.id}`,
  };

  const servers = [
    { key: "vidsrc_me",  label: "VIP Server 1 (Recommended)", icon: "👑" },
    { key: "autoembed",  label: "VIP Server 2 (High Speed)", icon: "🚀" },
    { key: "multiembed", label: "VIP Server 3 (Multi-Cloud)", icon: "⚡" },
    { key: "smashy",     label: "VIP Server 4 (Secure-Node)", icon: "🛡️" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-10 text-white selection:bg-[#841919]">

      {/* Manual Dynamic History Modifiers Buttons Row */}
      <div className="flex justify-end gap-2 mb-4">
        <button 
          onClick={handleMarkAsWatched}
          className="bg-green-800/80 hover:bg-green-700 border border-green-600 px-3 py-1.5 rounded-lg font-bold text-xs transition-all"
        >
          ✓ Mark as Fully Watched
        </button>
      </div>

      {/* ── Tab Buttons ── */}
      <div className="flex gap-2 mb-0">
        <button
          onClick={() => setActiveTab("trailer")}
          className={`flex-1 sm:flex-none px-6 py-3 rounded-t-xl font-bold text-xs sm:text-sm tracking-wide transition-all ${
            activeTab === "trailer"
              ? 'bg-[#841919] text-white shadow-lg'
              : 'bg-gray-900 text-gray-400 hover:bg-gray-800'
          }`}
        >
          🎬 Watch Trailer
        </button>
        <button
          onClick={() => {
            setActiveTab("fullMovie");
            handleStartWatching(); // Automatically pushes it into Continue Watching row
          }}
          className={`flex-1 sm:flex-none px-6 py-3 rounded-t-xl font-bold text-xs sm:text-sm tracking-wide transition-all ${
            activeTab === "fullMovie"
              ? 'bg-[#841919] text-white shadow-lg'
              : 'bg-gray-900 text-gray-400 hover:bg-gray-800'
          }`}
        >
          ⭐ Play Full Movie
        </button>
      </div>

      {/* ── Player Box (50% Extra Bigger Height Aspect Ratio on Mobile) ── */}
      <div
        ref={playerRef}
        className="w-full rounded-b-xl rounded-tl-none rounded-tr-xl overflow-hidden bg-black shadow-2xl border border-gray-800 relative z-10 aspect-[4/5] sm:aspect-[16/9]"
      >
        {activeTab === "trailer" ? (
          trailerKey ? (
            <iframe
              key={`trailer-${trailerKey}`}
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&playsinline=1`}
              title="Movie Trailer"
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm bg-gray-950">
              ❌ Trailer not available. Please switch to "Play Full Movie" tab.
            </div>
          )
        ) : (
          <div className="w-full h-full relative">
            {/* Anti-Redirect Click Shield */}
            {showShield && (
              <div 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowShield(false); 
                  handleStartWatching(); // Double check and push sequence tracking live
                }} 
                className="absolute inset-0 z-50 cursor-pointer bg-black/60 flex items-center justify-center backdrop-blur-[2px]"
              >
                <div className="bg-black/90 px-6 py-4 rounded-xl border border-gray-700 text-xs sm:text-sm text-gray-200 pointer-events-none text-center shadow-2xl max-w-xs sm:max-w-md">
                  <div className="text-lg font-bold text-[#841919] mb-1">🛡️ Anti-Redirect Shield Active</div>
                  <p className="text-gray-400 text-xs mb-3">Harmful popups and redirects are strictly isolated.</p>
                  <span className="bg-[#841919] px-4 py-1.5 rounded-md font-semibold text-white text-xs inline-block animate-pulse">
                    Click to Initialize Stream
                  </span>
                </div>
              </div>
            )}
            <iframe
              key={`movie-${serverKey}-${iframeKey}`}
              className="w-full h-full bg-black"
              src={movieSources[serverKey]}
              title="Full Movie Player"
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              referrerPolicy="origin"
              sandbox="allow-forms allow-pointer-lock allow-same-origin allow-scripts"
            />
          </div>
        )}
      </div>

      {/* ── Server Selector ── */}
      {activeTab === "fullMovie" && (
        <div className="mt-4 mb-6 bg-gray-900/60 p-4 rounded-xl border border-gray-800">
          <div className="flex flex-col gap-3">
            <span className="text-xs sm:text-sm font-semibold text-gray-300 pl-1">
              🛠️ Experiencing playback issues? Switch to an alternative stream provider below:
            </span>
            
            {/* Mobile View: Professional Dropdown Menu */}
            <div className="block sm:hidden relative">
              <select
                value={serverKey}
                onChange={(e) => handleServerChange(e.target.value)}
                className="w-full bg-gray-950 border-2 border-gray-800 text-gray-200 rounded-lg px-4 py-3 text-sm font-bold focus:outline-none focus:border-[#841919] transition-all cursor-pointer appearance-none"
                style={{ backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '16px' }}
              >
                {servers.map((s) => (
                  <option key={s.key} value={s.key} className="bg-gray-950 text-white py-2">
                    {s.icon} {s.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Desktop View: Grid Buttons Layout */}
            <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-2">
              {servers.map((s) => (
                <button
                  key={s.key}
                  onClick={() => handleServerChange(s.key)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold border transition-all ${
                    serverKey === s.key
                      ? 'bg-[#841919] border-[#841919] text-white shadow-md scale-102'
                      : 'bg-gray-950 border-gray-800 text-gray-400 hover:border-gray-600 hover:text-white'
                  }`}
                >
                  <span>{s.icon}</span>
                  <span className="truncate">{s.label}</span>
                  {serverKey === s.key && <span className="ml-auto w-2 h-2 rounded-full bg-green-400 inline-block animate-pulse"></span>}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Movie Info Section ── */}
      <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-start mt-6 bg-gray-900/20 p-4 rounded-2xl border border-gray-800/40">
        {/* Poster */}
        <div className="w-28 sm:w-48 md:w-64 mx-auto sm:mx-0 flex-shrink-0 rounded-xl overflow-hidden shadow-2xl border border-gray-800">
          <img
            src={getImageUrl(movie.poster_path)}
            alt={movie.title}
            className="w-full h-auto object-cover"
          />
        </div>

        {/* Details */}
        <div className="flex-grow min-w-0 w-full">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mb-1 text-center sm:text-left text-gray-100">
            {movie.title}
          </h1>
          {movie.tagline && (
            <p className="text-gray-400 text-xs sm:text-sm italic mb-3 text-center sm:text-left">"{movie.tagline}"</p>
          )}

          {/* Badges */}
          <div className="flex flex-wrap gap-2 items-center justify-center sm:justify-start text-xs font-bold mb-5">
            <span className="bg-[#841919] text-white px-3 py-1.5 rounded-md shadow">
              ⭐ {movie.vote_average?.toFixed(1)} / 10
            </span>
            <span className="bg-gray-800 text-gray-300 px-3 py-1.5 rounded-md">
              📅 {movie.release_date?.split('-')[0]}
            </span>
            {movie.runtime && (
              <span className="bg-gray-800 text-gray-300 px-3 py-1.5 rounded-md">
                ⏳ {movie.runtime} min
              </span>
            )}
          </div>

          {/* Overview */}
          <div className="mb-5">
            <h3 className="text-lg font-bold border-b border-gray-800 pb-2 mb-3 tracking-wide text-gray-200">
              Overview
            </h3>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed text-justify sm:text-left">{movie.overview}</p>
          </div>

          {/* Genres */}
          {movie.genres?.length > 0 && (
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">Genres</h4>
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                {movie.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="text-xs bg-gray-900 border border-gray-800 px-4 py-1.5 rounded-full text-gray-300 font-medium shadow-sm"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Related Movies Section ── */}
      {relatedMovies.length > 0 && (
        <div className="mt-12 sm:mt-16">
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-wide mb-6 border-l-4 border-[#841919] pl-3">
            🔥 Related Movies
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {relatedMovies.slice(0, 10).map((m) => (
              <Link 
                to={`/movie/${m.id}`} 
                key={m.id} 
                className="group bg-gray-900/40 rounded-xl overflow-hidden border border-gray-800/60 hover:border-[#841919] transition-all duration-300 flex flex-col hover:shadow-xl"
              >
                <div className="aspect-[2/3] overflow-hidden relative bg-gray-950">
                  {m.poster_path ? (
                    <img 
                      src={getImageUrl(m.poster_path)} 
                      alt={m.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs text-center p-2">
                      No Poster
                    </div>
                  )}
                  <div className="absolute top-2 right-2 bg-black/80 px-2 py-0.5 rounded text-[10px] font-bold text-yellow-500 backdrop-blur-sm">
                    ⭐ {m.vote_average?.toFixed(1)}
                  </div>
                </div>
                <div className="p-3 flex-grow flex flex-col justify-between">
                  <h3 className="text-xs sm:text-sm font-bold text-gray-200 line-clamp-1 group-hover:text-[#841919] transition-colors">
                    {m.title}
                  </h3>
                  <p className="text-[11px] text-gray-500 mt-1">
                    {m.release_date ? m.release_date.split('-')[0] : 'N/A'}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

export default MovieDetails;