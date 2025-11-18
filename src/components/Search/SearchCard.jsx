import { Link } from 'react-router-dom';
import { IMG_BASE_URL } from '../../services/api';

export default function SearchCard({ item, mediaType }) {
  // Determine the correct link path (handle movies vs tv vs anime)
  const type = mediaType || item.media_type || 'movie';
  
  return (
    <Link 
      to={`/watch/${type}/${item.id}`} 
      className="group relative flex flex-col block"
    >
      {/* ✅ FIX: "aspect-[2/3]" forces a standard poster shape 
         ✅ FIX: "object-cover" crops the image perfectly to fill that shape
      */}
      <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden bg-[#1f1f1f] shadow-lg border border-white/5 transition-all duration-300 group-hover:scale-105 group-hover:border-white/30 group-hover:shadow-red-600/20">
        
        {item.poster_path ? (
          <img
            src={`${IMG_BASE_URL}${item.poster_path}`}
            alt={item.title || item.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs p-2 text-center">
            No Image
          </div>
        )}
        
        {/* Dark Gradient Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Title & Info */}
      <div className="mt-3 px-1">
        <h3 className="text-white text-sm md:text-base font-medium truncate group-hover:text-red-500 transition-colors">
          {item.title || item.name}
        </h3>
        <div className="flex items-center justify-between text-xs text-gray-400 mt-1">
          <span>{new Date(item.release_date || item.first_air_date || Date.now()).getFullYear()}</span>
          <span className="flex items-center text-yellow-500">
            ★ {item.vote_average?.toFixed(1)}
          </span>
        </div>
      </div>
    </Link>
  );
}