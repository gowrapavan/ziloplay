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
  // 1️⃣ NEW STATE for Top Rated
  const [topRatedMovies, setTopRatedMovies] = useState([]); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        // 2️⃣ ADD 'top_rated' fetch to Promise.all
        const [trendingData, popularMovieData, popularTvData, topRatedData] = await Promise.all([
          getTrending('movie', 'week'),
          getMediaList('movie', 'popular'),
          getMediaList('tv', 'popular'),
          getMediaList('movie', 'top_rated'), // Fetches Top Rated Movies
        ]);

        setTrendingMovies(trendingData.results);
        setPopularMovies(popularMovieData.results);
        setPopularTv(popularTvData.results);
        // 3️⃣ SET the state
        setTopRatedMovies(topRatedData.results); 
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

        {/* 👇 THIS SCRIPT FIXES THE "NETLIFY" NAME ISSUE */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "ZiloPlay",
            "alternateName": ["Zilo Play", "ZiloPlay Stream"],
            "url": "https://ziloplay.netlify.app/",
            "potentialAction": {
              "@type": "SearchAction",
              "target": {
                "@type": "EntryPoint",
                "urlTemplate": "https://ziloplay.netlify.app/search?q={search_term_string}"
              },
              "query-input": "required name=search_term_string"
            }
          })}
        </script>
      </Helmet>

      {loading ? (
        <Loader />
      ) : (
        <>
          <Hero items={trendingMovies} />
          <main className="mt-8">            
            <MediaRow title="🔥 Trending Movies" items={trendingMovies} mediaType="movie" category="trending" />
            <ContinueWatchingRow /> 
            <MovieCompanySlider />
            <NewsSlider />
            <PopularActors />                       
            <MediaRow title="⭐ Top Rated Masterpieces" items={topRatedMovies} mediaType="movie" category="top_rated" />              
            <MediaRow title="📺 Popular TV Shows" items={popularTv} mediaType="tv" category="popular" />
            <MediaRow title="🎬 Popular Movies" items={popularMovies} mediaType="movie" category="popular" />
            <PopularDirectors />
            <Trailers />
          </main>
        </>
      )}
    </>
  );
}