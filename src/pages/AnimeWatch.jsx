import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import MediaRow from "../components/MediaRow";
import { jikanApi } from "../services/jikan";

export default function AnimeWatch() {
  const { id } = useParams();
  const [media, setMedia] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    async function loadAnimeData() {
      try {
        setLoading(true);
        
        // 1. Fetch Details (Accessing .data property per JikanResponse interface)
        const detailResponse = await jikanApi.getAnimeDetails(Number(id));
        const animeData = detailResponse.data; 

        // 2. Delay to respect Jikan's strict rate limits
        await new Promise(r => setTimeout(r, 600)); 

        // 3. Fetch Recommendations
        const recResponse = await jikanApi.getAnimeRecommendations(Number(id));
        
        // 4. Map the 'entry' objects for MediaRow compatibility
        const normalizedRecs = (recResponse.data || []).map(item => ({
          id: item.entry.mal_id,
          title: item.entry.title,
          poster_path: item.entry.images?.jpg?.large_image_url || item.entry.images?.jpg?.image_url,
          vote_average: 0
        }));

        setMedia(animeData);
        setRecommendations(normalizedRecs);
        document.title = `Watch ${animeData.title} | Ziloplay`;
      } catch (error) {
        console.error("Failed to load anime content:", error);
      } finally {
        setLoading(false);
      }
    }

    loadAnimeData();
  }, [id]);

  if (loading) return <Loader />;
  if (!media) return <div className="pt-32 text-center text-red-600 font-bold uppercase tracking-widest">Anime Not Found</div>;

  return (
    <div className="bg-[#0a0a0a] min-h-screen pb-20 text-white font-poppins">
      <div className="relative h-[50vh] md:h-[70vh] w-full overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-top opacity-30 blur-lg scale-110" 
          style={{ backgroundImage: `url('${media.images?.jpg?.large_image_url}')` }} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent" />
      </div>

      <div className="px-5 md:px-12 max-w-[1440px] mx-auto -mt-40 md:-mt-80 relative z-10">
        <div className="flex flex-col md:flex-row gap-10 items-center md:items-start">
          <div className="w-52 md:w-80 flex-shrink-0 rounded-3xl overflow-hidden shadow-2xl border border-white/10 ring-1 ring-white/10">
            <img 
              src={media.images?.jpg?.large_image_url} 
              alt={media.title} 
              className="w-full object-cover aspect-[2/3]"
            />
          </div>
          
          <div className="flex-1 text-center md:text-left space-y-6 pt-4">
            <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter leading-none">
              {media.title}
            </h1>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-5 text-gray-400 font-bold text-xs uppercase tracking-[0.2em]">
              <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-red-600 rounded-full" /> {media.year || 'N/A'}</span>
              <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-red-600 rounded-full" /> ★ {media.score || '0.0'}</span>
              <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-red-600 rounded-full" /> {media.duration}</span>
            </div>

            <div className="flex flex-wrap justify-center md:justify-start gap-2">
              {media.genres?.map(genre => (
                <span key={genre.mal_id} className="border border-white/10 bg-white/5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-gray-300">
                  {genre.name}
                </span>
              ))}
            </div>

            <p className="text-gray-400 text-sm leading-relaxed max-w-3xl font-medium line-clamp-6 md:line-clamp-none">
              {media.synopsis}
            </p>
          </div>
        </div>

        <div className="mt-20">
          <h2 className="text-xl font-black uppercase tracking-[0.3em] text-white mb-8 flex items-center gap-3">
             <span className="h-6 w-1 bg-red-600 rounded-full" /> Watch Now
          </h2>
          <div className="aspect-video bg-black rounded-[2rem] overflow-hidden shadow-2xl border border-white/5 ring-1 ring-white/10 flex flex-col items-center justify-center relative group">
             {media.trailer?.embed_url ? (
               <iframe 
                src={media.trailer.embed_url} 
                className="w-full h-full" 
                frameBorder="0" 
                allowFullScreen 
                title="Anime Preview" 
              />
             ) : (
               <div className="text-center space-y-4">
                 <p className="text-gray-500 font-black uppercase tracking-[0.2em] text-sm">Player Integration Coming Soon</p>
               </div>
             )}
          </div>
        </div>

        {recommendations.length > 0 && (
          <div className="mt-32 pt-16 border-t border-white/5">
            <MediaRow 
              title="You Might Also Like" 
              items={recommendations} 
              mediaType="anime" 
            />
          </div>
        )}
      </div>
    </div>
  );
}