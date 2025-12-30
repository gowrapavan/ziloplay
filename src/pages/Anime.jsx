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
    let isMounted = true;

    async function loadAnime() {
      try {
        setLoading(true);
        
        // 1. Load Popular
        const popularRes = await getTopAnime('bypopularity');
        // Wait 800ms to avoid 429 errors
        await new Promise(r => setTimeout(r, 800));
        
        // 2. Load Airing (Fixed the undefined reference error)
        const airingRes = await getTopAnime('airing');
        await new Promise(r => setTimeout(r, 800));
        
        // 3. Load Upcoming
        const upcomingRes = await getTopAnime('upcoming');

        if (isMounted) {
          // Normalize Jikan response objects into MediaRow format
          const normalize = (res) => (res?.data || []).map(item => ({
            ...item,
            id: item.mal_id, 
            title: item.title,
            poster_path: item.images?.webp?.image_url || item.images?.jpg?.image_url
          }));

          setPopular(normalize(popularRes));
          setAiring(normalize(airingRes));
          setUpcoming(normalize(upcomingRes));
        }
      } catch (error) {
        console.error("Failed to fetch anime:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadAnime();
    return () => { isMounted = false; };
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-[#111]">
      <main className="pt-24 pb-12">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="h-8 w-1.5 bg-red-600 rounded-full" />
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter">
            Anime <span className="text-red-600">Central</span>
          </h1>
        </div>
        
        <div className="space-y-4">
            {popular.length > 0 && <MediaRow title="🔥 Most Popular" items={popular} mediaType="anime" />}
            {airing.length > 0 && <MediaRow title="📺 Currently Airing" items={airing} mediaType="anime" />}
            {upcoming.length > 0 && <MediaRow title="🍿 Upcoming" items={upcoming} mediaType="anime" />}
        </div>
      </main>
    </div>
  );
}