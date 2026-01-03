import { useEffect, useState } from "react";
import MediaRow from "../components/MediaRow";
import Loader from "../components/Loader";
import Hero from "../components/Hero";
import NewsSlider from "../components/NewsSlider"; // ⬅️ Add this import
import MovieCompanySlider from "../components/Sliders/MovieCompanySlider";
import Trailers from "../components/Trailers";
import { getTrending, getMediaList } from "../services/api";
import PopularActors from "../components/PopularActors";


export default function Home() {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [popularTv, setPopularTv] = useState([]);
  const [loading, setLoading] = useState(true);

  // Set the Browser Tab Title
  useEffect(() => {
    document.title = "Ziloplay - Watch Movies & TV Shows Online";
  }, []);

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
  }, []);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Hero items={trendingMovies} />
          <main className="mt-8">
            <MediaRow title="🔥 Trending Movies" items={trendingMovies} mediaType="movie" />
            <MovieCompanySlider />
            <NewsSlider />
            <PopularActors />

            <MediaRow title="📺 Popular TV Shows" items={popularTv} mediaType="tv" />
            <MediaRow title="🎬 Popular Movies" items={popularMovies} mediaType="movie" />
                        <Trailers />

          </main>
        </>
      )}
    </>
  );
}