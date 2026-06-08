import axios from 'axios';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY || '204aa4b3666847e0d703930da9824bac'; 
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_URL = 'https://image.tmdb.org/t/p/w500';

// ── HELPER FUNCTION FOR AGE FILTERING ──
// Yeh helper function check karega agar kids mode active hai toh TMDB generic filters apply karega.
const getAgeFilterParams = () => {
  const ageGroup = localStorage.getItem('popflix_age_group');
  if (ageGroup === 'kids') {
    // US Rating System ke mutabik: Sirf G, PG, aur PG-13 tak ki movies allow hongi (R-Rated block)
    return '&certification_country=US&certification.lte=PG-13';
  }
  return '';
};

// 1. Popular Movies
export const fetchPopularMovies = async (page = 1) => {
  try {
    const ageFilter = getAgeFilterParams();
    // Agar kids mode active hai, toh discover route family friendly parameters ke sath zyada behtar kaam karta hai
    let url = ageFilter 
      ? `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&page=${page}${ageFilter}`
      : `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=${page}`;

    const response = await axios.get(url);
    return response.data; 
  } catch (error) {
    console.error("Error fetching popular movies:", error);
    return { results: [], total_pages: 1 };
  }
};

// 2. Bollywood Movies (Hindi language)
export const fetchBollywoodMovies = async (page = 1) => {
  try {
    const ageFilter = getAgeFilterParams();
    const response = await axios.get(
      `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_original_language=hi&sort_by=popularity.desc&page=${page}${ageFilter}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching Bollywood movies:", error);
    return { results: [] };
  }
};

// 3. Hollywood Movies (English language)
export const fetchHollywoodMovies = async (page = 1) => {
  try {
    const ageFilter = getAgeFilterParams();
    const response = await axios.get(
      `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_original_language=en&sort_by=popularity.desc&page=${page}${ageFilter}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching Hollywood movies:", error);
    return { results: [] };
  }
};

// 4. Web Series (TV Shows)
export const fetchWebSeries = async (page = 1) => {
  try {
    const ageGroup = localStorage.getItem('popflix_age_group');
    let url = `${BASE_URL}/tv/popular?api_key=${API_KEY}&language=en-US&page=${page}`;
    
    // TV shows ke liye TMDB TV Ratings (TV-G, TV-PG, TV-14) use hoti hain
    if (ageGroup === 'kids') {
      url = `${BASE_URL}/discover/tv?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&certification_country=US&certification.lte=TV-14&page=${page}`;
    }

    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching web series:", error);
    return { results: [] };
  }
};

// 5. Dramas (Urdu, Hindi, Korean Mixed)
export const fetchDramas = async (page = 1) => {
  try {
    const ageGroup = localStorage.getItem('popflix_age_group');
    let tvRatingFilter = '';
    if (ageGroup === 'kids') {
      tvRatingFilter = '&certification_country=US&certification.lte=TV-14';
    }
    
    const response = await axios.get(
      `${BASE_URL}/discover/tv?api_key=${API_KEY}&with_original_language=ur|hi|ko&sort_by=popularity.desc&page=${page}${tvRatingFilter}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching dramas:", error);
    return { results: [] };
  }
};

// 6. Filtered Movies by Genre
export const fetchFilteredMovies = async (genreId, page = 1) => {
  try {
    const ageFilter = getAgeFilterParams();
    let url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&page=${page}${ageFilter}`;
    if (genreId) url += `&with_genres=${genreId}`;
    
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error filtering movies:", error);
    return { results: [], total_pages: 1 };
  }
};

// 7. Genres List
export const fetchGenres = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`);
    const ageGroup = localStorage.getItem('popflix_age_group');
    
    // Agar Kids mode active hy tou genres ki list mein se b explicit genres hide kr dain gay
    if (ageGroup === 'kids') {
      const blockedGenreIds = [27, 53, 9648]; // Horror (27), Thriller (53), Mystery (9648) hidden for kids
      return response.data.genres.filter(genre => !blockedGenreIds.includes(genre.id));
    }
    
    return response.data.genres;
  } catch (error) {
    console.error("Error fetching genres:", error);
    return [];
  }
};

// 8. Movie Details
export const fetchMovieDetails = async (movieId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=en-US&append_to_response=external_ids`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    return null;
  }
};

// 9. Movie Videos / Trailer
export const fetchMovieVideos = async (movieId) => {
  try {
    const response = await axios.get(`${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}&language=en-US`);
    const trailer = response.data.results.find(
      (video) => video.type === 'Trailer' && video.site === 'YouTube'
    );
    return trailer ? trailer.key : response.data.results[0]?.key || null;
  } catch (error) {
    console.error("Error fetching movie videos:", error);
    return null;
  }
};

// 10. Search Movies
export const searchMovies = async (query, page = 1) => {
  try {
    if (!query) return { results: [], total_pages: 1 };
    const response = await axios.get(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(query)}&page=${page}`
    );
    
    // Search directly filtering capability locally check if kids mode is on
    const ageGroup = localStorage.getItem('popflix_age_group');
    if (ageGroup === 'kids' && response.data.results) {
      // client side block backup for direct search items that contain mature adult themes
      const familyFriendlyResults = response.data.results.filter(movie => !movie.adult);
      return { ...response.data, results: familyFriendlyResults };
    }

    return response.data;
  } catch (error) {
    console.error("Error searching movies:", error);
    return { results: [], total_pages: 1 };
  }
};

// 11. Related Movies (Recommendations)
export const fetchRelatedMovies = async (movieId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/movie/${movieId}/recommendations?api_key=${API_KEY}&language=en-US`
    );
    
    const ageGroup = localStorage.getItem('popflix_age_group');
    if (ageGroup === 'kids' && response.data.results) {
      return response.data.results.filter(movie => !movie.adult);
    }
    
    return response.data.results; 
  } catch (error) {
    console.error("Error fetching related movies:", error);
    return [];
  }
};

// 12. Related Web Series / Dramas (TV Recommendations)
export const fetchRelatedTVShows = async (tvId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/tv/${tvId}/recommendations?api_key=${API_KEY}&language=en-US`
    );
    return response.data.results; 
  } catch (error) {
    console.error("Error fetching related TV shows:", error);
    return [];
  }
};

// Image URL helper
export const getImageUrl = (posterPath) => {
  return posterPath ? `${IMAGE_URL}${posterPath}` : 'https://via.placeholder.com/500x750?text=No+Image';
};

// 13. TV Show / Web Series Details
export const fetchTVDetails = async (tvId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/tv/${tvId}?api_key=${API_KEY}&language=en-US&append_to_response=external_ids`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching TV details:", error);
    return null;
  }
};

// 14. TV Season Details (To get episodes list)
export const fetchTVSeasonDetails = async (tvId, seasonNumber) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/tv/${tvId}/season/${seasonNumber}?api_key=${API_KEY}&language=en-US`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching TV season details:", error);
    return null;
  }
};

// 15. TV Show Videos (Trailers)
export const fetchTVVideos = async (tvId) => {
  try {
    const response = await axios.get(`${BASE_URL}/tv/${tvId}/videos?api_key=${API_KEY}&language=en-US`);
    const trailer = response.data.results.find(
      (video) => video.type === 'Trailer' && video.site === 'YouTube'
    );
    return trailer ? trailer.key : response.data.results[0]?.key || null;
  } catch (error) {
    console.error("Error fetching TV videos:", error);
    return null;
  }
};