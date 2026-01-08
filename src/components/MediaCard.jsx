import { IMG_BASE_URL } from "../services/api";
import { Link } from "react-router-dom";

export default function MediaCard({ item, mediaType }) {
  // 1. Logic Extraction
  const itemMediaType = item.media_type || mediaType;
  const id = itemMediaType === 'anime' ? item.mal_id : item.id;
  
  // Handle Title variants
  const title = item.title || item.name || item.english_title;
  
  // Handle Image variants
  const posterPath = item.poster_path || item.images?.jpg?.image_url;
  
  // Handle Date variants (release_date vs first_air_date vs anime year)
  const date = item.release_date || item.first_air_date || item.aired?.from;
  const year = date ? new Date(date).getFullYear() : "";

  // Handle Rating variants (TMDB vote_average vs MAL score)
  const rawRating = item.vote_average || item.score;
  const rating = rawRating ? rawRating.toFixed(1) : null;

  const AdCard = () => (
  <a 
    href="https://anipop.netlify.app" 
    target="_blank" 
    rel="noopener noreferrer"
    className="relative group overflow-hidden rounded-xl bg-gradient-to-br from-red-900/40 to-black border border-white/10 hover:border-red-600 transition-all duration-300 flex flex-col items-center justify-center p-4 h-full min-h-[250px]"
  >
    <div className="text-center">
      <h3 className="text-red-600 font-black text-xl mb-2 italic">AniPop</h3>
      <p className="text-gray-300 text-xs font-medium uppercase tracking-widest mb-4">
        Watch Anime Here
      </p>
      <div className="px-4 py-2 bg-red-600 text-white text-[10px] font-bold rounded-full uppercase group-hover:scale-110 transition-transform">
        Visit Site
      </div>
    </div>
    {/* Optional background glow */}
    <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-red-600/20 blur-3xl rounded-full group-hover:bg-red-600/40 transition-all" />
  </a>
);

  // Safety check
  if (!id) return null;

  const linkTo = `/watch/${itemMediaType}/${id}`;

  // Helper to resolve image URL
  const getImageUrl = () => {
    if (!posterPath) return "https://via.placeholder.com/500x750?text=No+Image";
    return posterPath.startsWith('http') ? posterPath : IMG_BASE_URL + posterPath;
  };

  return (
    <Link 
      to={linkTo} 
      className="group relative w-40 sm:w-48 flex-shrink-0 block"
      aria-label={`View details for ${title}`}
    >
      {/* Card Container with Aspect Ratio */}
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-l bg-gray-800 shadow-md ring-1 ring-white/10">
        
        {/* Background Image */}
        <img
          src={getImageUrl()}
          alt={title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
        />

        {/* Rating Badge (Top Right) */}
        {rating && (
          <div className="absolute right-2 top-2 z-10 flex items-center gap-1 rounded-md bg-black/60 px-1.5 py-0.5 text-xs font-bold text-yellow-400 backdrop-blur-sm">
            <span>★</span>
            <span>{rating}</span>
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          
          {/* Text Content */}
          <div className="transform translate-y-2 transition-transform duration-300 group-hover:translate-y-0">
            <h3 className="line-clamp-2 text-sm font-bold text-white leading-tight">
              {title}
            </h3>
            
            <div className="mt-1 flex items-center gap-2 text-xs text-gray-300">
              {year && <span>{year}</span>}
              <span className="h-1 w-1 rounded-full bg-gray-500"></span>
              <span className="uppercase">{itemMediaType === 'tv' ? 'Series' : itemMediaType}</span>
            </div>
          </div>
          
        </div>
      </div>
    </Link>
  );
}