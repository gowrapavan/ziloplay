import { useEffect, useState } from "react";
import MediaRow from "../components/MediaRow";
import Loader from "../components/Loader";
import { getMediaList, getTrending, searchMedia } from "../services/api";

export default function Movies() {
  const [popular, setPopular] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [trending, setTrending] = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMovies() {
      try {
        const [popularData, topRatedData, upcomingData, trendingData] = await Promise.all([
          getMediaList('movie', 'popular'),
          getMediaList('movie', 'top_rated'),
          getMediaList('movie', 'upcoming'),
          getTrending('movie', 'week'),
        ]);
        setPopular(popularData.results);
        setTopRated(topRatedData.results);
        setUpcoming(upcomingData.results);
        setTrending(trendingData.results);
      } catch (error) {
        console.error("Failed to fetch movies:", error);
      } finally {
        setLoading(false);
      }
    }
    loadMovies();
  }, []);

  async function handleSearch(query) {
    if (!query) {
      setSearchResults(null);
      return;
    }
    setLoading(true);
    const res = await searchMedia(query);
    setSearchResults(res.results.filter(item => item.media_type === 'movie' && item.poster_path));
    setLoading(false);
  }

  if (loading) return <Loader />;

  return (
    <div>
      <main className="pt-24">
        <h1 className="text-3xl font-bold text-white text-center mb-8">Movies</h1>
        {searchResults ? (
          <MediaRow title="Search Results" items={searchResults} mediaType="movie" />
        ) : (
          <>
            <MediaRow title="🔥 Trending This Week" items={trending} mediaType="movie" />
            <MediaRow title="🎬 Popular Movies" items={popular} mediaType="movie" />
            <MediaRow title="⭐ Top Rated Movies" items={topRated} mediaType="movie" />
            <MediaRow title="🍿 Upcoming Movies" items={upcoming} mediaType="movie" />
          </>
        )}
      </main>
    </div>
  );
}