// Jikan API Configuration
const JIKAN_BASE_URL = "https://api.jikan.moe/v4";

/**
 * A generic function to fetch data from the Jikan API.
 * @param {string} endpoint - The Jikan API endpoint (e.g., '/top/anime').
 * @returns {Promise<object>} - The JSON response from the API.
 */
const fetchFromJikan = async (endpoint) => {
  const url = `${JIKAN_BASE_URL}${endpoint}`;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.error("Jikan API request failed with status:", res.status);
      throw new Error(`Failed to fetch data from Jikan`);
    }
    // The Jikan API wraps results in a 'data' object.
    const responseData = await res.json();
    return responseData.data;
  } catch (error) {
    console.error("Error in fetchFromJikan:", error);
    return []; // Return an empty array on error
  }
};

// --- EXPORTED JIKAN API FUNCTIONS ---

/**
 * Fetches top anime lists by category.
 * @param {'airing' | 'upcoming' | 'bypopularity' | 'favorite'} filter - The category to fetch.
 * @returns {Promise<Array>}
 */
export const getTopAnime = (filter = 'bypopularity') => {
  return fetchFromJikan(`/top/anime?filter=${filter}&limit=20`);
};

/**
 * Fetches detailed information for a specific anime.
 * @param {string | number} id - The MyAnimeList ID of the anime.
 * @returns {Promise<object>}
 */
export const getAnimeDetails = (id) => {
  return fetchFromJikan(`/anime/${id}/full`);
};

/**
 * Fetches recommended anime based on a given anime ID.
 * @param {string | number} id - The MyAnimeList ID of the anime.
 * @returns {Promise<Array>}
 */
export const getAnimeRecommendations = async (id) => {
    const recommendations = await fetchFromJikan(`/anime/${id}/recommendations`);
    // The recommendation data is nested, so we map over it to get the entry details
    return recommendations.map(rec => rec.entry) || [];
};