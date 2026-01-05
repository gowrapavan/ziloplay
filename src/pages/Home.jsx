import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async"; // ⬅️ Import Helmet
import MediaRow from "../components/MediaRow";
import Loader from "../components/Loader";
import Hero from "../components/Hero";
import NewsSlider from "../components/NewsSlider";
import MovieCompanySlider from "../components/Sliders/MovieCompanySlider";
import ContinueWatchingRow from "../components/Home_Page/ContinueWatchingRow";
import Trailers from "../components/Trailers";
import { getTrending, getMediaList } from "../services/api";
import PopularActors from "../components/Home_Page/PopularActors";
import PopularDirectors from "../components/Home_Page/PopularDirectors";

export default function Home() {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [popularTv, setPopularTv] = useState([]);
  const [loading, setLoading] = useState(true);

  // ❌ Removed the manual useEffect for document.title
  // Helmet handles this better below

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
      {/* 🚀 SEO Configuration for Home Page */}
      <Helmet>
        <title>ZiloPlay - Watch Movies, TV Shows & Anime Online</title>
        <meta 
          name="description" 
          content="Stream the latest movies, trending TV shows, and anime on ZiloPlay. Explore popular actors, trailers, and news." 
        />
        <link rel="canonical" href="https://ziloplay.netlify.app/" />
      </Helmet>

      {loading ? (
        <Loader />
      ) : (
        <>
          <Hero items={trendingMovies} />
          <main className="mt-8">
            <MediaRow title="🔥 Trending Movies" items={trendingMovies} mediaType="movie" />
            <ContinueWatchingRow /> {/* ⬅️ Add it here */}
            <MovieCompanySlider />
            <NewsSlider />
            <PopularActors />
            
            <MediaRow title="📺 Popular TV Shows" items={popularTv} mediaType="tv" />
            <MediaRow title="🎬 Popular Movies" items={popularMovies} mediaType="movie" />
            <PopularDirectors />
            <Trailers />
          </main>
        </>
      )}
    </>
  );
}