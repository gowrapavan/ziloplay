import { useEffect, useState } from "react";
import MediaRow from "../components/MediaRow";
import Loader from "../components/Loader";
import { getMediaList, getTrending, searchMedia } from "../services/api";

export default function TvShows() {
  const [popular, setPopular] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [onTheAir, setOnTheAir] = useState([]);
  const [trending, setTrending] = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTvShows() {
      try {
        const [popularData, topRatedData, onTheAirData, trendingData] = await Promise.all([
          getMediaList('tv', 'popular'),
          getMediaList('tv', 'top_rated'),
          getMediaList('tv', 'on_the_air'),
          getTrending('tv', 'week'),
        ]);
        setPopular(popularData.results);
        setTopRated(topRatedData.results);
        setOnTheAir(onTheAirData.results);
        setTrending(trendingData.results);
      } catch (error) {
        console.error("Failed to fetch TV shows:", error);
      } finally {
        setLoading(false);
      }
    }
    loadTvShows();
  }, []);

  async function handleSearch(query) {
    if (!query) {
      setSearchResults(null);
      return;
    }
    setLoading(true);
    const res = await searchMedia(query);
    setSearchResults(res.results.filter(item => item.media_type === 'tv' && item.poster_path));
    setLoading(false);
  }

  if (loading) return <Loader />;

  return (
    <div>
      <main className="pt-24">
        <h1 className="text-3xl font-bold text-white text-center mb-8">TV Shows</h1>
        {searchResults ? (
          <MediaRow title="Search Results" items={searchResults} mediaType="tv" />
        ) : (
          <>
            <MediaRow title="🔥 Trending This Week" items={trending} mediaType="tv" />
            <MediaRow title="📺 Popular TV Shows" items={popular} mediaType="tv" />
            <MediaRow title="⭐ Top Rated TV Shows" items={topRated} mediaType="tv" />
            <MediaRow title="📡 Currently Airing" items={onTheAir} mediaType="tv" />
          </>
        )}
      </main>
    </div>
  );
}