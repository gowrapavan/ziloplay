import { useEffect, useState } from "react";
import MediaRow from "../components/MediaRow";
import Loader from "../components/Loader";
import { getTopAnime } from "../services/jikan";

export default function Anime() {
  const [popular, setPopular] = useState([]);
  const [airing, setAiring] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnime() {
      try {
        const [popularData, airingData, upcomingData] = await Promise.all([
          getTopAnime('bypopularity'),
          getTopAnime('airing'),
          getTopAnime('upcoming'),
        ]);
        setPopular(popularData);
        setAiring(airingData);
        setUpcoming(upcomingData);
      } catch (error) {
        console.error("Failed to fetch anime:", error);
      } finally {
        setLoading(false);
      }
    }
    loadAnime();
  }, []);

  // Note: Search functionality would require a different implementation for Anime
  // since the handleSearch prop from Header is tied to the TMDB API.
  // For simplicity, we'll omit anime search on this page for now.

  if (loading) return <Loader />;

  return (
    <div>
      <main className="pt-24">
        <h1 className="text-3xl font-bold text-white text-center mb-8">Anime</h1>
        <>
            <MediaRow title="🔥 Most Popular" items={popular} mediaType="anime" />
            <MediaRow title="📺 Currently Airing" items={airing} mediaType="anime" />
            <MediaRow title="🍿 Upcoming" items={upcoming} mediaType="anime" />
        </>
      </main>
    </div>
  );
}