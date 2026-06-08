import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchTVDetails, fetchTVVideos, getImageUrl, fetchRelatedTVShows } from '../services/api'; // Make sure these helpers exist in your api.js

// ── FIXED IMPORT: Bundled authService standard object import ──
import { authService } from '../services/authLocalStorage';

function TVDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [show, setShow] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [relatedShows, setRelatedShows] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Default episode state tracking
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);

  // Tab State: Default Par "Trailer" tab active rahega
  const [activeTab, setActiveTab] = useState("trailer");
  
  // Multi-server pool array for TV Streams
  const [serverKey, setServerKey] = useState("vidsrc_cc");
  const [iframeKey, setIframeKey] = useState(0); 
  const [showShield, setShowShield] = useState(true);
  const playerRef = useRef(null);

  useEffect(() => {
    const getTVDetails = async () => {
      setLoading(true);
      try {
        // dynamic API calls for TV Show details
        const details = await fetchTVDetails(id);
        const videoKey = await fetchTVVideos(id);
        const related = await fetchRelatedTVShows(id);
        
        setShow(details);
        setTrailerKey(videoKey);
        setRelatedShows(related || []);
      } catch (error) {
        console.error("Error fetching TV data:", error);
      } finally {
        loading(false);
      }
    };
    getTVDetails();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setShowShield(true);
  }, [id]);

  const handleServerChange = (newServer) => {
    setServerKey(newServer);
    setIframeKey(prev => prev + 1); 
    setShowShield(true);
  };

  // ── LOGIC FOR TRACKING WATCH HISTORY ──
  const handleStartWatching = () => {
    if (show) {
      // Pushes the TV show state along with current season & episode into local storage history
      authService.updateMovieHistory(
        show.id, 
        `${show.name} - S${season}E${episode}`, 
        show.poster_path, 
        'continue'
      );
    }
  };

  const handleMarkAsWatched = () => {
    if (show) {
      authService.updateMovieHistory(
        show.id, 
        `${show.name} - S${season}E${episode}`, 
        show.poster_path, 
        'watched'
      );
      alert(`Season ${season} Episode ${episode} marked as Watched entirely!`);
    }
  };

  // Automatically reset stream structure safely when season or episode changes
  const handleEpisodeChange = (newEpisode) => {
    setEpisode(Number(newEpisode));
    setIframeKey(prev => prev + 1);
    setShowShield(true);
  };

  const handleSeasonChange = (newSeason) => {
    setSeason(Number(newSeason));
    setEpisode(1); // Reset back to episode 1 on season switch
    setIframeKey(prev => prev + 1);
    setShowShield(true);
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
          Please be patient with us while we fetch your TV stream...
        </h3>
        <p className="text-xs text-gray-500 mt-2 text-center">Optimizing fast routing cloud layers</p>
      </div>
    );
  }

  if (!show) {
    return (
      <div className="text-center py-20 text-white">
        <h2 className="text-xl font-semibold">TV Show not found!</h2>
        <Link to="/tv-shows" className="text-[#841919] mt-4 inline-block hover:underline">Go back to TV Shows</Link>
      </div>
    );
  }

  // Multi-Server Routing Endpoints for TV Shows
  const tvSources = {
    vidsrc_cc: `https://vidsrc.cc/v2/embed/tv/${show.id}/${season}/${episode}`,
    vidsrc_me: `https://vidsrc.me/embed/tv?tmdb=${show.id}&season=${season}&episode=${episode}`,
    autoembed: `https://player.autoembed.cc/embed/tv/${show.id}/${season}/${episode}`,
    smashy: `https://embed.smashystream.com/playere.php?tmdb=${show.id}&season=${season}&episode=${episode}`,
  };

  const servers = [
    { key: "vidsrc_cc",  label: "VIP Server 1 (Pro-Stream)", icon: "👑" },
    { key: "vidsrc_me",  label: "VIP Server 2 (High Speed)", icon: "🚀" },
    { key: "autoembed",  label: "VIP Server 3 (Multi-Cloud)", icon: "⚡" },
    { key: "smashy",     label: "VIP Server 4 (Secure-Node)", icon: "🛡️" },
  ];

  // Helper arrays for populating dynamic select inputs based on show metadata if available, otherwise defaults to 10/20
  const totalSeasons = show.number_of_seasons ? Array.from({ length: show.number_of_seasons }, (_, i) => i + 1) : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const totalEpisodes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25];

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-10 text-white selection:bg-[#841919]">
      
      {/* Safe back anchor mechanism */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <button 
          onClick={() => navigate('/tv-shows')} 
          className="text-[11px] font-extrabold uppercase tracking-widest text-gray-400 hover:text-white flex items-center gap-2 bg-gray-900/40 hover:bg-gray-900/80 px-4 py-2 rounded-xl border border-gray-800/60 transition-all"
        >
          ← Back to TV Shows
        </button>

        {/* Manual Dynamic History Modifiers Buttons Row */}
        <button 
          onClick={handleMarkAsWatched}
          className="bg-green-800/80 hover:bg-green-700 border border-green-600 px-3 py-1.5 rounded-lg font-bold text-xs transition-all self-end sm:self-auto"
        >
          ✓ Mark Episode as Watched
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
            setActiveTab("fullShow");
            handleStartWatching(); // Automatically pushes it into Continue Watching row
          }}
          className={`flex-1 sm:flex-none px-6 py-3 rounded-t-xl font-bold text-xs sm:text-sm tracking-wide transition-all ${
            activeTab === "fullShow"
              ? 'bg-[#841919] text-white shadow-lg'
              : 'bg-gray-900 text-gray-400 hover:bg-gray-800'
          }`}
        >
          ⭐ Play Full Episode
        </button>
      </div>

      {/* ── Player Box ── */}
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
              title="TV Show Trailer"
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm bg-gray-950">
              ❌ Trailer not available. Please switch to "Play Full Episode" tab.
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
                  handleStartWatching(); // Double check sequence pipeline tracking
                }} 
                className="absolute inset-0 z-50 cursor-pointer bg-black/60 flex items-center justify-center backdrop-blur-[2px]"
              >
                <div className="bg-black/90 px-6 py-4 rounded-xl border border-gray-700 text-xs sm:text-sm text-gray-200 pointer-events-none text-center shadow-2xl max-w-xs sm:max-w-md">
                  <div className="text-lg font-bold text-[#841919] mb-1">🛡️ Anti-Redirect Shield Active</div>
                  <p className="text-gray-400 text-xs mb-3">Harmful popups and redirects are strictly isolated.</p>
                  <span className="bg-[#841919] px-4 py-1.5 rounded-md font-semibold text-white text-xs inline-block animate-pulse">
                    Click to Initialize Stream (S{season}:E{episode})
                  </span>
                </div>
              </div>
            )}
            
            {/* ── FIXED: Added critical allow="fullscreen" attributes and expanded sandbox tokens ── */}
            <iframe
              key={`tv-${serverKey}-${iframeKey}-${season}-${episode}`}
              className="w-full h-full bg-black"
              src={tvSources[serverKey]}
              title="Full TV Stream Engine"
              frameBorder="0"
              scrolling="no"
              allow="autoplay; fullscreen; picture-in-picture; webkitallowfullscreen; mozallowfullscreen"
              allowFullScreen={true}
              webkitallowfullscreen="true"
              mozallowfullscreen="true"
              referrerPolicy="origin"
              sandbox="allow-forms allow-pointer-lock allow-same-origin allow-scripts allow-modals allow-popups allow-popups-to-escape-sandbox"
            />
          </div>
        )}
      </div>

      {/* ── Season & Episode Selectors + Server Switcher Layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4 mb-6">
        
        {/* Episode Context Iterators */}
        <div className="lg:col-span-1 grid grid-cols-2 gap-3 bg-gray-900/60 p-4 rounded-xl border border-gray-800 h-fit">
          <div>
            <label className="block text-[10px] uppercase text-gray-500 font-extrabold mb-1.5 tracking-wider">Season</label>
            <select 
              value={season} 
              onChange={(e) => handleSeasonChange(e.target.value)}
              className="w-full bg-gray-950 border border-gray-800 text-xs font-bold text-gray-300 px-3 py-2.5 rounded-xl focus:outline-none focus:border-[#841919] transition-all cursor-pointer"
            >
              {totalSeasons.map(s => <option key={s} value={s}>Season {s}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-[10px] uppercase text-gray-500 font-extrabold mb-1.5 tracking-wider">Episode</label>
            <select 
              value={episode} 
              onChange={(e) => handleEpisodeChange(e.target.value)}
              className="w-full bg-gray-950 border border-gray-800 text-xs font-bold text-gray-300 px-3 py-2.5 rounded-xl focus:outline-none focus:border-[#841919] transition-all cursor-pointer"
            >
              {totalEpisodes.map(e => <option key={e} value={e}>Episode {e}</option>)}
            </select>
          </div>
        </div>

        {/* Server Selector Panel */}
        <div className="lg:col-span-2 bg-gray-900/60 p-4 rounded-xl border border-gray-800 flex flex-col justify-center gap-3">
          <span className="text-xs font-semibold text-gray-300 pl-1">
            🛠️ Experiencing playback issues? Switch to an alternative server stream below:
          </span>
          
          {/* Mobile Dropdown View */}
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

          {/* Desktop Grid Buttons View */}
          <div className="hidden sm:grid grid-cols-2 gap-2">
            {servers.map((s) => (
              <button
                key={s.key}
                onClick={() => handleServerChange(s.key)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold border transition-all ${
                  serverKey === s.key
                    ? 'bg-[#841919] border-[#841919] text-white shadow-md'
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

      {/* ── TV Show Metadata Info Section ── */}
      <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-start mt-6 bg-gray-900/20 p-4 rounded-2xl border border-gray-800/40">
        {/* Poster Grid */}
        <div className="w-28 sm:w-48 md:w-64 mx-auto sm:mx-0 flex-shrink-0 rounded-xl overflow-hidden shadow-2xl border border-gray-800">
          <img
            src={getImageUrl(show.poster_path)}
            alt={show.name}
            className="w-full h-auto object-cover"
          />
        </div>

        {/* Detailed Panels */}
        <div className="flex-grow min-w-0 w-full">
          <div className="flex mb-2 justify-center sm:justify-start">
            <span className="text-[9px] bg-[#841919]/10 text-[#a62222] border border-[#841919]/30 px-3 py-1 rounded-full font-extrabold uppercase tracking-widest">
              TV Streaming Node Active
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mb-1 text-center sm:text-left text-gray-100">
            {show.name}
          </h1>
          {show.tagline && (
            <p className="text-gray-400 text-xs sm:text-sm italic mb-3 text-center sm:text-left">"{show.tagline}"</p>
          )}

          {/* Metadata Badges */}
          <div className="flex flex-wrap gap-2 items-center justify-center sm:justify-start text-xs font-bold mb-5">
            <span className="bg-[#841919] text-white px-3 py-1.5 rounded-md shadow">
              ⭐ {show.vote_average?.toFixed(1)} / 10
            </span>
            <span className="bg-gray-800 text-gray-300 px-3 py-1.5 rounded-md">
              📅 {show.first_air_date?.split('-')[0]}
            </span>
            {show.number_of_seasons && (
              <span className="bg-gray-800 text-gray-300 px-3 py-1.5 rounded-md">
                📺 {show.number_of_seasons} Seasons
              </span>
            )}
            {show.number_of_episodes && (
              <span className="bg-gray-800 text-gray-300 px-3 py-1.5 rounded-md">
                🎞️ {show.number_of_episodes} Episodes
              </span>
            )}
          </div>

          {/* Overview */}
          <div className="mb-5">
            <h3 className="text-lg font-bold border-b border-gray-800 pb-2 mb-3 tracking-wide text-gray-200">
              Overview
            </h3>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed text-justify sm:text-left">{show.overview}</p>
          </div>

          {/* Genres Badge Loop */}
          {show.genres?.length > 0 && (
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">Genres</h4>
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                {show.genres.map((genre) => (
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

      {/* ── Related TV Shows Section ── */}
      {relatedShows.length > 0 && (
        <div className="mt-12 sm:mt-16">
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-wide mb-6 border-l-4 border-[#841919] pl-3">
            🔥 Related TV Shows
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {relatedShows.slice(0, 10).map((s) => (
              <Link 
                to={`/tv/${s.id}`} 
                key={s.id} 
                className="group bg-gray-900/40 rounded-xl overflow-hidden border border-gray-800/60 hover:border-[#841919] transition-all duration-300 flex flex-col hover:shadow-xl"
              >
                <div className="aspect-[2/3] overflow-hidden relative bg-gray-950">
                  {s.poster_path ? (
                    <img 
                      src={getImageUrl(s.poster_path)} 
                      alt={s.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs text-center p-2">
                      No Poster
                    </div>
                  )}
                  <div className="absolute top-2 right-2 bg-black/80 px-2 py-0.5 rounded text-[10px] font-bold text-yellow-500 backdrop-blur-sm">
                    ⭐ {s.vote_average?.toFixed(1)}
                  </div>
                </div>
                <div className="p-3 flex-grow flex flex-col justify-between">
                  <h3 className="text-xs sm:text-sm font-bold text-gray-200 line-clamp-1 group-hover:text-[#841919] transition-colors">
                    {s.name}
                  </h3>
                  <p className="text-[11px] text-gray-500 mt-1">
                    {s.first_air_date ? s.first_air_date.split('-')[0] : 'N/A'}
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

export default TVDetails;