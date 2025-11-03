// API Configuration
// Your new proxy server URL is now the base URL.
const TMDB_BASE_URL = "https://tmbd-wz5v.onrender.com";

// The API_KEY and PROXY are no longer needed here, as your server handles them.

// Base URLs for images (these remain the same)
export const IMG_BASE_URL = "https://image.tmdb.org/t/p/w500";
export const BG_BASE_URL = "https://image.tmdb.org/t/p/original";
export const PROFILE_IMG_BASE_URL = "https://image.tmdb.org/t/p/w185"; // Added for cast/crew profiles

/**
 * A generic function to fetch data from your TMDB proxy server.
 * @param {string} endpoint - The TMDB API endpoint (e.g., '/movie/popular').
 * @param {string} [params=""] - Additional query parameters (e.g., 'query=Inception').
 * @returns {Promise<object>} - The JSON response from the API.
 */
const fetchFromTMDB = async (endpoint, params = "") => {
  // Construct the URL to call your own server.
  // The api_key is automatically added by your server.
  const url = `${TMDB_BASE_URL}${endpoint}?language=en-US&${params}`;

  try {
    // Fetch directly from your server URL.
    const res = await fetch(url);
    if (!res.ok) {
      console.error("API request failed with status:", res.status);
      throw new Error(`Failed to fetch data from your TMDB proxy`);
    }
    return res.json();
  } catch (error) {
    console.error("Error in fetchFromTMDB:", error);
    // Return a default object with an empty results array on error
    return { results: [], error: error.message };
  }
};

// --- EXPORTED API FUNCTIONS ---

/**
 * Fetches lists of media (movies or TV shows) by category.
 * @param {'movie' | 'tv'} mediaType - The type of media to fetch.
 * @param {'popular' | 'top_rated' | 'upcoming' | 'on_the_air' | 'now_playing'} category - The category to fetch.
 * @returns {Promise<object>}
 */
export const getMediaList = (mediaType, category) => {
  return fetchFromTMDB(`/${mediaType}/${category}`);
};

/**
 * Fetches trending media based on popularity.
 * @param {'all' | 'movie' | 'tv'} mediaType - The type of media to fetch.
 * @param {'day' | 'week'} timeWindow - The time window for trending.
 * @returns {Promise<object>}
 */
export const getTrending = (mediaType = 'all', timeWindow = 'week') => {
  return fetchFromTMDB(`/trending/${mediaType}/${timeWindow}`);
};

/**
 * ✨ NEW: Fetches movies currently playing in theaters.
 * This is the best way to get newly released movies.
 * @returns {Promise<object>}
 */
export const getNowPlaying = () => {
  return fetchFromTMDB('/movie/now_playing');
};

/**
 * Fetches detailed information for a specific movie or TV show.
 * This function now uses more granular API calls for 'movie' media types
 * and combines them into a single response object.
 * @param {'movie' | 'tv'} mediaType - The type of media.
 * @param {string | number} id - The TMDB ID of the movie or TV show.
 * @returns {Promise<object>}
 */
export const getMediaDetails = async (mediaType, id) => {
  if (mediaType === 'tv') {
    // For TV shows, we use append_to_response as not all granular endpoints exist or are named consistently.
    const params = 'append_to_response=videos,similar,credits,images,watch/providers,recommendations'; // Added recommendations for TV
    return fetchFromTMDB(`/${mediaType}/${id}`, params);
  }

  if (mediaType === 'movie') {
    // For movies, we use the granular endpoints as requested and combine the results.
    try {
      const [details, videos, recommendations, credits, images, providers] = await Promise.all([
        fetchFromTMDB(`/movie/${id}`),
        fetchFromTMDB(`/movie/${id}/videos`),
        fetchFromTMDB(`/movie/${id}/recommendations`), // Fetching recommendations directly
        fetchFromTMDB(`/movie/${id}/credits`),
        fetchFromTMDB(`/movie/${id}/images`),
        fetchFromTMDB(`/movie/${id}/watch/providers`)
      ]);

      // Combine all results into one object, mimicking the 'append_to_response' structure for consistency.
      return {
        ...details,
        videos,
        recommendations, // Direct recommendations object
        credits,
        images,
        "watch/providers": providers // Use the key directly for watch providers
      };
    } catch (error) {
      console.error("Failed to fetch movie details with granular API calls:", error);
      throw error; // Re-throw to be caught by the calling component
    }
  }

  // Fallback for unsupported media types or if neither 'movie' nor 'tv'
  console.warn(`Unsupported media type for getMediaDetails: ${mediaType}`);
  return fetchFromTMDB(`/${mediaType}/${id}`);
};

/**
 * Searches for movies, TV shows, and people.
 * @param {string} query - The search term.
 * @returns {Promise<object>}
 */
export const searchMedia = (query) => {
  const params = `query=${encodeURIComponent(query)}`;
  return fetchFromTMDB('/search/multi', params);
};

/**
 * Fetches many upcoming unreleased movie trailers
 * Combines /movie/upcoming + multiple /discover/movie pages.
 * Ensures only future release dates and valid YouTube trailers.
 * @returns {Promise<object[]>}
 
export const getUpcomingMovieTrailers = async () => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const trailers = [];
    const seen = new Set();

    const fetchTrailers = async (movies) => {
      const validMovies = movies.filter(
        (m) =>
          m.release_date &&
          new Date(m.release_date) > new Date() &&
          !seen.has(m.id)
      );

      const promises = validMovies.map(async (movie) => {
        const videos = await fetchFromTMDB(`/movie/${movie.id}/videos`);
        const trailer = (videos.results || []).find(
          (v) => v.type === "Trailer" && v.site === "YouTube"
        );
        if (trailer) {
          seen.add(movie.id);
          return {
            id: movie.id,
            title: movie.title,
            videoKey: trailer.key,
            backdrop: movie.backdrop_path,
            poster: movie.poster_path,
            release_date: movie.release_date,
          };
        }
        return null;
      });
      return (await Promise.all(promises)).filter(Boolean);
    };

    // 1️⃣ Built-in Upcoming endpoint
    const upcoming = await fetchFromTMDB(`/movie/upcoming`, `language=en-US&page=1`);
    const upcomingMovies = upcoming.results || [];
    trailers.push(...(await fetchTrailers(upcomingMovies)));

    // 2️⃣ Discover API — fetch more pages for broader coverage
    for (let page = 1; page <= 5; page++) {
      const discover = await fetchFromTMDB(
        `/discover/movie`,
        [
          `language=en-US`,
          `region=US`,
          `sort_by=primary_release_date.asc`,
          `primary_release_date.gte=${today}`,
          `with_release_type=2|3|4|5|6`,
          `include_adult=false`,
          `include_video=true`,
          `page=${page}`,
        ].join("&")
      );
      const movies = discover.results || [];
      trailers.push(...(await fetchTrailers(movies)));

      if (trailers.length >= 20) break; // stop after 20 trailers
    }

    // Remove duplicates & return top 20
    return Array.from(new Map(trailers.map((m) => [m.id, m])).values()).slice(0, 20);
  } catch (err) {
    console.error("Failed to fetch unreleased movie trailers:", err);
    return [];
  }
};
*/


/**
 * Fetches many upcoming unreleased movie trailers
 * Combines /movie/upcoming + multiple /discover/movie pages.
 * Ensures only future release dates and valid YouTube trailers.
 * @returns {Promise<object[]>}
 */
export const getUpcomingMovieTrailers = async () => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const trailers = [];
    const seen = new Set();

    const fetchTrailers = async (movies) => {
      const validMovies = movies.filter(
        (m) =>
          m.release_date &&
          new Date(m.release_date) > new Date() &&
          !seen.has(m.id)
      );

      const promises = validMovies.map(async (movie) => {
        const videos = await fetchFromTMDB(`/movie/${movie.id}/videos`);
        const trailer = (videos.results || []).find(
          (v) => v.type === "Trailer" && v.site === "YouTube"
        );
        if (trailer) {
          seen.add(movie.id);
          return {
            id: movie.id,
            title: movie.title,
            videoKey: trailer.key,
            backdrop: movie.backdrop_path,
            poster: movie.poster_path,
            release_date: movie.release_date,
          };
        }
        return null;
      });
      return (await Promise.all(promises)).filter(Boolean);
    };

    // 1️⃣ Built-in Upcoming endpoint
    const upcoming = await fetchFromTMDB(`/movie/upcoming`, `language=en-US&page=1`);
    const upcomingMovies = upcoming.results || [];
    trailers.push(...(await fetchTrailers(upcomingMovies)));

    // 2️⃣ Discover API — fetch more pages for broader coverage
    // UPDATED: Loop 10 pages, aiming for 30 trailers
    for (let page = 1; page <= 10; page++) {
      const discover = await fetchFromTMDB(
        `/discover/movie`,
        [
          `language=en-US`,
          `with_original_language=en`, // <-- FIX #1: Ensures movie is English
          // `region=US`, // <-- FIX #2: Removed to get more movies (UK, AU, CA, etc.)
          `sort_by=primary_release_date.asc`,
          `primary_release_date.gte=${today}`,
          `with_release_type=2|3|4|5|6`,
          `include_adult=false`,
          `include_video=true`,
          `page=${page}`,
        ].join("&")
      );
      const movies = discover.results || [];
      trailers.push(...(await fetchTrailers(movies)));

      // UPDATED: Stop after 30 trailers
      if (trailers.length >= 30) break; 
    }

    // Remove duplicates & return top 30
    // UPDATED: Slice 30
    return Array.from(new Map(trailers.map((m) => [m.id, m])).values()).slice(0, 30);
  } catch (err) {
    console.error("Failed to fetch unreleased movie trailers:", err);
    return [];
  }
};