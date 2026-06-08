import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { fetchPopularMovies, fetchFilteredMovies, fetchGenres, searchMovies, getImageUrl } from '../services/api';

function Movies() {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(""); 
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate(); 

  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('search') || "";

  useEffect(() => {
    const getGenresData = async () => {
      const genresList = await fetchGenres();
      if (genresList) setGenres(genresList);
    };
    getGenresData();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      setSelectedGenre(""); 
      setCurrentPage(1);
    }
  }, [searchQuery]);

  useEffect(() => {
    const fetchMoviesData = async () => {
      try {
        setLoading(true);
        let data;

        if (searchQuery) {
          data = await searchMovies(searchQuery, currentPage);
        } else if (selectedGenre) {
          data = await fetchFilteredMovies(selectedGenre, currentPage);
        } else {
          data = await fetchPopularMovies(currentPage);
        }

        if (data && data.results) {
          setMovies(data.results);
          setTotalPages(data.total_pages > 500 ? 500 : data.total_pages);
        } else {
          setMovies([]);
        }
      } catch (error) {
        console.error("Error loading movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMoviesData();
  }, [searchQuery, selectedGenre, currentPage]); 

  const handleGenreChange = (genreId) => {
    setSelectedGenre(genreId);
    setCurrentPage(1); 
    if (searchQuery) {
      navigate('/movies'); 
    }
  };

  return (
    <div className="bg-[#0c0d10] min-h-screen text-gray-100 pb-16 overflow-x-hidden">
      
      {/* 🎬 VIP MINI-HERO SECTION */}
      <div className="relative h-[25vh] sm:h-[35vh] w-full overflow-hidden flex items-center bg-gradient-to-b from-black/60 to-transparent">
        <div className="absolute inset-0 bg-gradient-to-r from-[#841919]/10 via-transparent to-transparent z-0" />
        <div className="max-w-7xl mx-auto w-full px-6 z-10">
          <span className="bg-[#841919] text-white text-[10px] sm:text-xs font-bold uppercase tracking-widest px-3 py-1 rounded mb-3 inline-block">
            {searchQuery ? "Search Results" : "Popflix Hub"}
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white drop-shadow-lg">
            {searchQuery 
              ? `🔎 "${searchQuery}"` 
              : selectedGenre 
                ? `🍿 ${genres.find(g => g.id === selectedGenre)?.name} Movies`
                : "🍿 Explore Movies"
            }
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm max-w-xl mt-2 font-light leading-relaxed">
            {selectedGenre 
              ? `Browse through our handpicked collection of top-rated ${genres.find(g => g.id === selectedGenre)?.name.toLowerCase()} blockbusters.`
              : "Discover latest global cinematic trends, top charts, and curated genre classics instantly."
            }
          </p>
        </div>
      </div>

      {/* 🏷️ PREMIUM SCROLLABLE GENRE CHIPS */}
      <div className="max-w-7xl mx-auto px-6 mb-8 -mt-4 relative z-20">
        <div className="overflow-x-auto pb-3 scrollbar-hide">
          <div className="flex gap-2.5 min-w-max">
            <button
              onClick={() => handleGenreChange("")}
              className={`px-5 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-300 border cursor-pointer ${
                selectedGenre === "" && !searchQuery
                  ? 'bg-[#841919] border-[#841919] text-white shadow-lg shadow-[#841919]/20'
                  : 'bg-[#14151a] border-gray-900 text-gray-400 hover:text-white hover:border-gray-800'
              }`}
            >
              All Movies
            </button>
            
            {genres.map((genre) => (
              <button
                key={genre.id}
                onClick={() => handleGenreChange(genre.id)}
                className={`px-5 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-300 border cursor-pointer ${
                  selectedGenre === genre.id
                    ? 'bg-[#841919] border-[#841919] text-white shadow-lg shadow-[#841919]/20'
                    : 'bg-[#14151a] border-gray-900 text-gray-400 hover:text-white hover:border-gray-800'
                }`}
              >
                {genre.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 🏛️ MAIN MOVIES LIST AREA */}
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Heading Badge */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-white border-l-4 border-[#841919] pl-3 tracking-wide">
            {searchQuery ? "Matching Assets" : "Catalog Directory"}
          </h2>
          <span className="text-xs text-gray-400 bg-[#14151a] px-3 py-1.5 rounded-lg border border-gray-900">
            Page {currentPage} / {totalPages}
          </span>
        </div>

        {/* LOADING STATE */}
        {loading ? (
          <div className="flex justify-center items-center min-h-[40vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#841919]"></div>
          </div>
        ) : movies.length === 0 ? (
          <div className="text-center py-20 text-gray-500 font-medium">
            No items match your selected filters. Please try another query!
          </div>
        ) : (
          <>
            {/* VIP CINEMA RESPONSIVE GRID */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {movies.map((movie) => (
                <Link 
                  to={`/movie/${movie.id}`} 
                  key={movie.id}
                  className="bg-[#14151a] rounded-xl overflow-hidden shadow-xl group hover:scale-[1.03] transition-all duration-300 border border-gray-900 hover:border-[#841919]/50 flex flex-col h-full cursor-pointer"
                >
                  <div className="relative overflow-hidden aspect-[2/3]">
                    {movie.poster_path ? (
                      <img 
                        src={getImageUrl(movie.poster_path)} 
                        alt={movie.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#14151a] flex items-center justify-center text-xs text-gray-600 p-4 text-center">
                        No Poster Available
                      </div>
                    )}
                    <div className="absolute top-3 right-3 bg-black/75 backdrop-blur-md text-yellow-400 font-bold text-xs px-2 py-1 rounded-md flex items-center gap-1 shadow-md">
                      ⭐ {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
                    </div>
                  </div>

                  {/* Exact Match Content Styling Like Home Row Cards */}
                  <div className="p-4 flex flex-col justify-between flex-grow bg-gradient-to-b from-[#14151a] to-[#0f1013]">
                    <h3 className="font-semibold text-sm text-gray-200 line-clamp-1 group-hover:text-[#841919] transition-colors duration-200">
                      {movie.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 font-medium">
                      {movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            {/* 🕹️ NEW PREMIUM PAGINATION */}
            <div className="flex justify-center items-center gap-3 mt-14 pt-6 border-t border-gray-900">
              <button
                onClick={() => {
                  setCurrentPage((prev) => Math.max(prev - 1, 1));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                disabled={currentPage === 1}
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all duration-200 bg-[#14151a] border border-gray-900 text-gray-400 hover:text-white hover:border-gray-700 disabled:opacity-30 disabled:hover:text-gray-400 cursor-pointer disabled:cursor-not-allowed"
              >
                ◀ Prev
              </button>
              
              <div className="hidden sm:flex items-center gap-1.5">
                {[...Array(Math.min(totalPages, 5))].map((_, idx) => {
                  let pageNum = currentPage <= 3 ? idx + 1 : currentPage - 2 + idx;
                  if (pageNum > totalPages) return null;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => {
                        setCurrentPage(pageNum);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={`h-9 w-9 text-xs font-bold rounded-lg transition-all duration-200 border cursor-pointer ${
                        currentPage === pageNum
                          ? 'bg-[#841919] border-[#841919] text-white shadow-md'
                          : 'bg-[#14151a] border-gray-900 text-gray-400 hover:text-white hover:border-gray-700'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <span className="sm:hidden text-xs font-semibold text-gray-400 px-2">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() => {
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all duration-200 bg-[#14151a] border border-gray-900 text-gray-400 hover:text-white hover:border-gray-700 disabled:opacity-30 disabled:hover:text-gray-400 cursor-pointer disabled:cursor-not-allowed"
              >
                Next ▶
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Movies;