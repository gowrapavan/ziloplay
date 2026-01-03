import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getActorDetails, PROFILE_IMG_BASE_URL, BG_BASE_URL } from "../services/api";
import MediaRow from "../components/MediaRow";
import Loader from "../components/Loader";

// Enhanced Lightbox for Gallery Images
const ImageModal = ({ src, onClose }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 backdrop-blur-md" onClick={onClose}>
    <button className="absolute top-10 right-10 text-white text-5xl font-light hover:text-red-500 transition-colors" onClick={onClose}>&times;</button>
    <img src={src} className="max-h-[90vh] max-w-full rounded-md shadow-2xl object-contain ring-1 ring-white/10" alt="Actor Full View" />
  </div>
);

export default function ActorDetails() {
  const { id } = useParams();
  const [actor, setActor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImg, setSelectedImg] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const CHAR_LIMIT = 600;

  useEffect(() => {
    window.scrollTo(0, 0);
    async function load() {
      setLoading(true);
      try {
        const data = await getActorDetails(id);
        setActor(data);
        document.title = `${data.name} - Ziloplay`;
      } catch (err) {
        console.error("Error loading actor details:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) return <Loader />;
  if (!actor) return <p className="text-center pt-20 text-gray-400">Actor profile not found.</p>;

  // Filter and sort filmography credits
  const getUniqueCredits = (credits) => {
    const uniqueMap = new Map();
    credits.forEach((item) => {
      if (!uniqueMap.has(item.id)) uniqueMap.set(item.id, item);
    });
    return Array.from(uniqueMap.values()).sort((a, b) => {
      const dateA = new Date(a.release_date || a.first_air_date || 0);
      const dateB = new Date(b.release_date || b.first_air_date || 0);
      return dateB - dateA;
    });
  };

  const movieCredits = getUniqueCredits(actor.combined_credits?.cast.filter(c => c.media_type === 'movie') || []);
  const tvCredits = getUniqueCredits(actor.combined_credits?.cast.filter(c => c.media_type === 'tv') || []);
  
  // MAP FIX: Access the 'profiles' array directly from the actor object (based on your API response)
  const actorPhotos = actor.profiles || actor.images?.profiles || [];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-20 overflow-x-hidden">
      {selectedImg && <ImageModal src={selectedImg} onClose={() => setSelectedImg(null)} />}

      {/* 1. Immersive Header Backdrop */}
      <div className="relative h-[45vh] w-full overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center blur-3xl opacity-40 scale-110 transform"
          style={{ backgroundImage: `url(${PROFILE_IMG_BASE_URL}${actor.profile_path})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/70 to-transparent" />
      </div>

      {/* 2. Main Content Section */}
      <div className="max-w-7xl mx-auto px-5 -mt-48 relative z-10">
        <div className="flex flex-col md:flex-row gap-8 md:gap-14 items-center md:items-start">
          
          {/* Main Actor Image */}
          <div className="flex-shrink-0">
            <img
              src={`${PROFILE_IMG_BASE_URL}${actor.profile_path}`}
              alt={actor.name}
              className="w-60 md:w-80 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] border-[6px] border-[#161616] object-cover aspect-[2/3]"
              onError={(e) => { e.target.src = 'https://placehold.co/600x900/1f2937/9ca3af?text=No+Photo'; }}
            />
          </div>

          {/* Bio & Details */}
          <div className="flex-1 text-center md:text-left pt-6 md:pt-14">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-4 text-white drop-shadow-lg">
              {actor.name}
            </h1>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-10">
              {actor.birthday && (
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">Birthday</span>
                  <span className="bg-[#161616] px-4 py-2 rounded-xl text-xs font-semibold border border-white/5">{actor.birthday}</span>
                </div>
              )}
              {actor.place_of_birth && (
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">Born In</span>
                  <span className="bg-[#161616] px-4 py-2 rounded-xl text-xs font-semibold border border-white/5">{actor.place_of_birth}</span>
                </div>
              )}
            </div>

            <div className="bg-[#161616]/60 p-7 rounded-3xl border border-white/10 backdrop-blur-xl max-w-3xl ring-1 ring-white/5">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-1 w-6 bg-red-600 rounded-full" />
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Personal Biography</h3>
              </div>
              <p className="text-gray-300 leading-relaxed text-sm md:text-[1.05rem] font-medium italic opacity-90">
                {actor.biography ? (
                  <>
                    {isExpanded || actor.biography.length <= CHAR_LIMIT
                      ? actor.biography
                      : `${actor.biography.substring(0, CHAR_LIMIT)}...`}
                    
                    {actor.biography.length > CHAR_LIMIT && (
                      <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="ml-2 text-red-500 hover:text-red-400 font-bold uppercase text-xs tracking-wider transition-colors"
                      >
                        {isExpanded ? "Show Less" : "Read More"}
                      </button>
                    )}
                  </>
                ) : (
                  `Full biography for ${actor.name} is not currently available.`
                )}
              </p>
            </div>
          </div>
        </div>

        {/* 3. Photos Gallery Section */}
        {actorPhotos.length > 0 && (
          <section className="mt-24">
            <div className="flex items-baseline gap-4 mb-8">
              <h2 className="text-3xl font-bold tracking-tight">Gallery</h2>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{actorPhotos.length} Shots</span>
            </div>
            
            <div className="flex overflow-x-auto gap-5 pb-8 scrollbar-hide px-2">
              {actorPhotos.map((img, index) => (
                <div 
                  key={index} 
                  className="flex-shrink-0 w-36 md:w-56 cursor-zoom-in group relative"
                  onClick={() => setSelectedImg(`${BG_BASE_URL}${img.file_path}`)}
                >
                  <div className="absolute inset-0 bg-red-600 rounded-2xl scale-95 opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300" />
                  <img 
                    src={`${PROFILE_IMG_BASE_URL}${img.file_path}`} 
                    className="relative w-full h-full object-cover aspect-[2/3] rounded-2xl shadow-xl ring-1 ring-white/10 group-hover:rotate-1 transition-transform duration-300"
                    alt={`Portrait ${index + 1}`}
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 4. Filmography Sections */}
        <div className="mt-20 space-y-24">
     {movieCredits.length > 0 && (
  <MediaRow
    title={`Featured Movies (${movieCredits.length})`}
    items={movieCredits}
    mediaType="movie"
  />
)}

{tvCredits.length > 0 && (
  <MediaRow
    title={`TV Series & Shows (${tvCredits.length})`}
    items={tvCredits}
    mediaType="tv"
  />
)}

        </div>
      </div>
    </div>
  );
}