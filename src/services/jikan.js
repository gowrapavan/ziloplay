export const JIKAN_BASE = 'https://api.jikan.moe/v4';

async function fetchJikan(endpoint) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(`${JIKAN_BASE}${endpoint}`, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        'User-Agent': 'HiAnime-App/1.0',
        'Cache-Control': 'no-cache',
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please wait a moment and try again.');
      }
      if (response.status >= 500) {
        throw new Error('Server error. Please try again in a few moments.');
      }
      throw new Error(`Jikan API error: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timeout. The server is taking too long to respond.');
    }
    throw error;
  }
}

export const jikanApi = {
  getTopAiring: () => fetchJikan('/top/anime?filter=airing&limit=20'),
  getMostPopular: () => fetchJikan('/top/anime?filter=bypopularity&limit=20'),
  getUpcoming: () => fetchJikan('/top/anime?filter=upcoming&limit=20'),
  getAnimeDetails: (malId) => fetchJikan(`/anime/${malId}/full`),
  getAnimeRecommendations: (malId) => fetchJikan(`/anime/${malId}/recommendations`),
};

// Explicitly export functions to fix the SyntaxError in Anime.jsx
export const getTopAnime = async (filter) => {
    if (filter === 'airing') return jikanApi.getTopAiring();
    if (filter === 'upcoming') return jikanApi.getUpcoming();
    return jikanApi.getMostPopular();
};

export const getAnimeDetails = (id) => jikanApi.getAnimeDetails(id);
export const getAnimeRecommendations = (id) => jikanApi.getAnimeRecommendations(id);