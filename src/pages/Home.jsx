import { useEffect, useState } from "react";
import MediaRow from "../components/MediaRow";
import Loader from "../components/Loader";
import Hero from "../components/Hero";
import Trailers from "../components/Trailers"; // ⬅️ add this import
import { getTrending, getMediaList } from "../services/api";

export default function Home() {
  // State for the page's own content
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [popularTv, setPopularTv] = useState([]);
  const [loading, setLoading] = useState(true);

  // Effect to fetch initial page data once on mount
  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [trendingData, popularMovieData, popularTvData] = await Promise.all([
          getTrending('movie', 'week'),
          getMediaList('movie', 'popular'),
          getMediaList('tv', 'popular'),
        ]);
        setTrendingMovies(trendingData.results);
        setPopularMovies(popularMovieData.results);
        setPopularTv(popularTvData.results);
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []); // Empty dependency array means this runs only once

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          {/* Hero slideshow now uses the trending movies data */}
          <Hero items={trendingMovies} />

          {/* Main content with media rows */}
          <main className="mt-8">
            <MediaRow title="🔥 Trending Movies" items={trendingMovies} mediaType="movie" />
                    <Trailers />

            <MediaRow title="📺 Popular TV Shows" items={popularTv} mediaType="tv" />
            <MediaRow title="🎬 Popular Movies" items={popularMovies} mediaType="movie" />
          </main>
        </>
      )}
    </>
  );
}