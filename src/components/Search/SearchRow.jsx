import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { IMG_BASE_URL } from '../../services/api';

export default function MediaRow({ items = [] }) {
  const rowRef = useRef(null);

  const scroll = (direction) => {
    if (rowRef.current) {
      const { clientWidth } = rowRef.current;
      const scrollAmount = direction === 'left' ? -clientWidth / 1.5 : clientWidth / 1.5;
      rowRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (!items.length) return null;

  return (
    <div className="relative group">
      {/* Left Arrow */}
      <button 
        onClick={() => scroll('left')}
        className="absolute left-0 top-0 bottom-0 z-40 w-12 bg-black/50 hover:bg-black/70 hidden group-hover:flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm rounded-r-lg"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
      </button>

      {/* Scroll Container */}
      <div 
        ref={rowRef}
        className="flex items-start gap-4 overflow-x-auto scrollbar-hide pb-4 px-4 scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {items.map((item) => (
          <Link 
            key={item.id} 
            to={`/watch/${item.media_type || 'movie'}/${item.id}`}
            className="flex-none w-[160px] md:w-[200px] transition-transform duration-300 hover:scale-105"
          >
            {/* IMAGE CONTAINER - Enforces Aspect Ratio */}
            <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden bg-gray-800 shadow-lg border border-white/10 group-hover:border-white/30">
              {item.poster_path ? (
                <img
                  src={`${IMG_BASE_URL}${item.poster_path}`}
                  alt={item.title || item.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs text-center p-2">
                  No Image
                </div>
              )}
              
              {/* Dark Gradient Overlay on bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Title */}
            <div className="mt-2 px-1">
              <h3 className="text-white text-sm md:text-base font-medium truncate">
                {item.title || item.name}
              </h3>
              <p className="text-gray-400 text-xs">
                {new Date(item.release_date || item.first_air_date || Date.now()).getFullYear()}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Right Arrow */}
      <button 
        onClick={() => scroll('right')}
        className="absolute right-0 top-0 bottom-0 z-40 w-12 bg-black/50 hover:bg-black/70 hidden group-hover:flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm rounded-l-lg"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
      </button>
    </div>
  );
}