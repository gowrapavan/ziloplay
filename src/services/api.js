// API Configuration
// Your new proxy server URL is now the base URL.
const TMDB_BASE_URL = "https://tmbd-wz5v.onrender.com";

// The API_KEY and PROXY are no longer needed here, as your server handles them.

// Base URLs for images (these remain the same)
export const IMG_BASE_URL = "https://image.tmdb.org/t/p/w500";
export const BG_BASE_URL = "https://image.tmdb.org/t/p/original";
export const PROFILE_IMG_BASE_URL = "https://image.tmdb.org/t/p/w185"; // Added for cast/crew profiles

/**
 * INTERNAL HELPER: Extracts the best logo from the images object.
 * Logic: 
 * 1. Checks if logos exist.
 * 2. Prefers English ('en') ISO.
 * 3. Fallback to highest vote_average if English not found.
 * 4. Returns the file_path string or null.
 */
const getBestLogo = (images) => {
  if (!images || !images.logos || images.logos.length === 0) return null;

  // 1) Prefer ENGLISH logo
  let best = images.logos.find(l => l.iso_639_1 === "en");

  // 2) If not found, choose highest vote
  if (!best) {
    best = images.logos.sort((a, b) => b.vote_average - a.vote_average)[0];
  }

  // Return only the file path
  return best ? best.file_path : null;
};

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
export const getMediaList = (mediaType, category, page = 1) => {
  return fetchFromTMDB(`/${mediaType}/${category}`, `page=${page}`);
};
/**
 * Fetches trending media based on popularity.
 * @param {'all' | 'movie' | 'tv'} mediaType - The type of media to fetch.
 * @param {'day' | 'week'} timeWindow - The time window for trending.
 * @returns {Promise<object>}
 */
export const getTrending = (mediaType = 'all', timeWindow = 'week', page = 1) => {
  return fetchFromTMDB(`/trending/${mediaType}/${timeWindow}`, `page=${page}`);
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
 * * UPDATED: Now includes a 'logo' property with the best available PNG logo.
 * * @param {'movie' | 'tv'} mediaType - The type of media.
 * @param {string | number} id - The TMDB ID of the movie or TV show.
 * @returns {Promise<object>}
 */
export const getMediaDetails = async (mediaType, id) => {
  if (mediaType === 'tv') {
    // For TV shows, we use append_to_response as not all granular endpoints exist or are named consistently.
    const params = 'append_to_response=videos,similar,credits,images,watch/providers,recommendations'; // Added recommendations for TV
    const data = await fetchFromTMDB(`/${mediaType}/${id}`, params);

    // Extract logo from the appended images
    const logo = getBestLogo(data.images);

    return {
      ...data,
      logo // Add the logo path directly to the object
    };
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

      // Extract logo using the helper
      const logo = getBestLogo(images);

      // Combine all results into one object, mimicking the 'append_to_response' structure for consistency.
      return {
        ...details,
        videos,
        recommendations, // Direct recommendations object
        credits,
        images,
        logo, // <--- NEW: The extracted logo path
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

/*------------------------------------------------------------------------------- */


/* ------------------------------------------------------------------
   🚀 COMPANY & IMAGE HELPERS (Paste this at the bottom of api.js)
   ------------------------------------------------------------------ */

/**
 * Helper to construct Image URLs dynamically.
 * @param {string} path - The TMDB image path
 * @param {string} size - The size code (e.g., "w300", "original")
 */
export const getImageUrl = (path, size = "w300") => {
  if (!path) return null;
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

/**
 * 1. Fetch Company Details (Name, Logo, Country)
 */
export const fetchCompanyDetails = async (companyId) => {
  const data = await fetchFromTMDB(`/company/${companyId}`);
  if (data.status_code === 34) {
     throw new Error("Company not found");
  }
  return data;
};

/**
 * 2. Fetch MOVIES produced by the Company
 * Sorted by newest releases.
 */
/**
 * 2. Fetch MOVIES produced by the Company
 * Sorted by newest releases.
 * Now supports pagination via the 'page' parameter.
 */
export const fetchCompanyMovies = async (companyId, page = 1) => {
  const params = `with_companies=${companyId}&sort_by=primary_release_date.desc&page=${page}`;
  const data = await fetchFromTMDB('/discover/movie', params);
  
  // Return an object containing results and total pages so UI knows when to stop
  return {
    results: (data.results || []).filter(item => item.poster_path),
    totalPages: data.total_pages || 1
  };
};

/**
 * 3. Fetch TV SHOWS produced by the Company
 * Sorted by newest air dates.
 * Now supports pagination via the 'page' parameter.
 */
export const fetchCompanyTV = async (companyId, page = 1) => {
  const params = `with_companies=${companyId}&sort_by=first_air_date.desc&page=${page}`;
  const data = await fetchFromTMDB('/discover/tv', params);
  
  return {
    results: (data.results || []).filter(item => item.poster_path),
    totalPages: data.total_pages || 1
  };
};


/*------------------------------------------------------------------------------- */


/**
 * Fetches actor details including biography and all movie/TV credits.
 */
export const getActorDetails = async (id) => {
  // Added 'images' here so it comes back in the same object
  const params = "append_to_response=combined_credits,external_ids,images";
  return fetchFromTMDB(`/person/${id}`, params);
};
/**
 * Fetches all available profile photos for a specific actor.
 */
export const getActorImages = (personId) => {
  return fetchFromTMDB(`/person/${personId}/images`);
};

/**
 * Fetches episodes for a specific season of a TV show.
 */
export const getSeasonDetails = (seriesId, seasonNumber) => {
  return fetchFromTMDB(`/tv/${seriesId}/season/${seasonNumber}`);
};


/**
 * Fetches popular actors (people) from TMDB.
 * Uses proxy server – NO API KEY on frontend.
 */
export const getPopularActors = async () => {
  const data = await fetchFromTMDB("/person/popular");
  return data.results || [];
};

export const getPopularDirectors = async () => {
  const popularMovies = await fetchFromTMDB("/movie/popular");
  let directors = [];

  for (let movie of popularMovies.results.slice(0, 10)) { // limit to 10 movies for performance
    const credits = await fetchFromTMDB(`/movie/${movie.id}/credits`);
    const movieDirectors = (credits.crew || []).filter(
      (c) => c.job === "Director" && c.profile_path
    );
    directors.push(...movieDirectors);
  }

  // Remove duplicates by ID
  const uniqueDirectors = Array.from(new Map(directors.map(d => [d.id, d])).values());

  return uniqueDirectors;
};

