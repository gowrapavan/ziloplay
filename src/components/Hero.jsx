import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BG_BASE_URL, IMG_BASE_URL, getMediaDetails } from '../services/api'; 
import { useStorage } from '../hooks/useStorage'; 

export default function Hero({ items = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [batchIndex, setBatchIndex] = useState(0); 
  const [activeLogo, setActiveLogo] = useState(null); 
  const [isLoadingLogo, setIsLoadingLogo] = useState(true);

  const { watchlist, toggleWatchlist } = useStorage();

  const ITEMS_PER_BATCH = 10; 
  const heroItems = items.slice(
    batchIndex * ITEMS_PER_BATCH,
    (batchIndex + 1) * ITEMS_PER_BATCH
  );

  const currentItem = heroItems[currentIndex];
  const isSaved = currentItem && watchlist.some(i => i.id.toString() === currentItem.id.toString());

  useEffect(() => {
    if (!currentItem) return;
    setActiveLogo(null);
    setIsLoadingLogo(true);

    if (currentItem.logo) {
      setActiveLogo(currentItem.logo);
      setIsLoadingLogo(false);
      return;
    }

    const fetchLogo = async () => {
      try {
        const type = currentItem.media_type || 'movie'; 
        const details = await getMediaDetails(type, currentItem.id);
        if (details.logo) setActiveLogo(details.logo);
      } catch (err) {
        console.error("Error fetching logo:", err);
      } finally {
        setIsLoadingLogo(false);
      }
    };
    fetchLogo();
  }, [currentItem]); 

  useEffect(() => {
    if (heroItems.length === 0) return;
    const timer = setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % heroItems.length);
    }, 8000);
    return () => clearTimeout(timer);
  }, [currentIndex, heroItems.length]);

  const handleNextBatch = () => {
    if ((batchIndex + 1) * ITEMS_PER_BATCH < items.length) {
      setBatchIndex((prev) => prev + 1);
      setCurrentIndex(0);
    }
  };

  const handlePrevBatch = () => {
    if (batchIndex > 0) {
      setBatchIndex((prev) => prev - 1);
      setCurrentIndex(0);
    }
  };

  if (heroItems.length === 0) return null;

  const truncate = (str, n) => str?.length > n ? str.substr(0, n - 1) + "..." : str;

  return (
    <div className="relative w-full h-[70vh] md:h-screen overflow-hidden bg-[#121212] text-white font-sans group">
      
      {/* 1. BACKGROUND LAYER */}
      {heroItems.map((item, index) => (
        <div
          key={item.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <div
            className="absolute inset-0 bg-cover bg-top md:bg-center transition-transform duration-[10000ms] ease-linear scale-105 group-hover:scale-110"
            style={{ backgroundImage: `url('${BG_BASE_URL}${item.backdrop_path}')` }}
          />
          <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
          <div className="md:hidden absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/80 to-transparent" />
        </div>
      ))}

     {/* 2. CONTENT LAYER */}
      <div className="absolute z-20 inset-0 flex flex-col justify-end md:justify-center pb-16 md:pb-0 px-6 md:px-16 w-full md:w-[60%]">
        <div className="flex flex-col items-center md:items-start space-y-4 animate-fadeIn text-center md:text-left">
          
          <div className="min-h-[80px] md:min-h-[140px] flex items-end md:items-center justify-center md:justify-start mb-2">
            {isLoadingLogo ? (
              <div className="opacity-0">Loading...</div> 
            ) : activeLogo ? (
              <img 
                src={`${IMG_BASE_URL}${activeLogo}`} 
                alt={currentItem.title}
                className="max-h-[80px] md:max-h-[140px] max-w-[250px] md:max-w-[400px] object-contain drop-shadow-xl animate-fadeIn"
              />
            ) : (
              <h1 className="text-3xl md:text-6xl font-black uppercase leading-none drop-shadow-2xl tracking-wide">
                {currentItem.title || currentItem.name}
              </h1>
            )}
          </div>

          {/* Metadata */}
          <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 text-[10px] md:text-xs font-bold text-gray-300">
            <span>{new Date(currentItem.release_date || currentItem.first_air_date || Date.now()).getFullYear()}</span>
            <span className="text-gray-500">•</span>
            <span className="border border-gray-500 px-2 py-0.5 rounded text-[10px]">U/A 16+</span>
            <span className="text-gray-500">•</span>
            <span>{currentItem.vote_average ? currentItem.vote_average.toFixed(1) : "NR"} Rating</span>
            <span className="text-gray-500">•</span>
            <span>{currentItem.original_language ? currentItem.original_language.toUpperCase() : "EN"}</span>
          </div>

          <p className="text-gray-300 text-xs md:text-base leading-relaxed line-clamp-3 drop-shadow-md max-w-xl md:pr-10">
            {truncate(currentItem.overview, 180)}
          </p>

{/* Buttons */}
<div className="flex items-center gap-2 pt-6 w-full md:w-auto justify-center md:justify-start">
  <Link
    to={`/watch/${currentItem.media_type || 'movie'}/${currentItem.id}`}
    className="relative group flex-1 md:flex-none flex items-center justify-center gap-3 py-3 px-12 rounded-[4px] font-bold text-sm md:text-base transition-all duration-300 overflow-hidden bg-[#e31a27] hover:bg-[#ff1f2d] shadow-[0_4px_20px_rgba(227,26,39,0.3)]"
  >
    {/* Subtle White Glow on Hover (Prime Style Highlight) */}
    <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-gradient-to-tr from-white via-transparent to-transparent transition-opacity duration-300" />
    
    {/* Content */}
    <span className="relative z-10 flex items-center gap-2 text-white">
      <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
        <path d="M8 5v14l11-7z" />
      </svg>
      <span className="tracking-wide text-base">Watch Now</span>
    </span>
  </Link>

  {/* Watchlist Button - Clean Square-Round (Prime Style) */}
  <button 
    onClick={() => toggleWatchlist({ ...currentItem, mediaType: currentItem.media_type || 'movie' })}
    className={`relative w-12 h-12 flex items-center justify-center rounded-[4px] transition-all duration-300 group border-2 ${
      isSaved 
      ? "bg-white border-white text-[#e31a27]" 
      : "bg-black/20 backdrop-blur-md border-white/40 text-white hover:bg-white/10 hover:border-white"
    }`}
    title={isSaved ? "Remove from Watchlist" : "Add to Watchlist"}
  >
    {isSaved ? (
      <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    ) : (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    )}
  </button>
</div>
        </div>
      </div>

      {/* 3. THUMBNAIL NAVIGATION - Lifted to accommodate Scroll Toggle */}
      <div className="absolute z-30 bottom-12 right-6 hidden md:flex items-end gap-2 pl-10 bg-gradient-to-l from-black/60 to-transparent p-4 rounded-l-2xl">
        {batchIndex > 0 && (
          <button onClick={handlePrevBatch} className="w-8 h-14 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded transition backdrop-blur-sm">
             <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
             </svg>
          </button>
        )}
        {heroItems.map((item, index) => (
          <div
            key={item.id}
            onClick={() => setCurrentIndex(index)}
            className={`relative cursor-pointer transition-all duration-500 ease-out rounded overflow-hidden ${
              index === currentIndex ? 'w-32 h-18 border-2 border-red-600 scale-105 z-10 shadow-xl' : 'w-24 h-14 border border-white/5 opacity-40 hover:opacity-100'
            }`}
          >
            <img src={`${BG_BASE_URL}${item.backdrop_path}`} alt={item.title} className="w-full h-full object-cover" />
          </div>
        ))}
        {(batchIndex + 1) * ITEMS_PER_BATCH < items.length && (
          <button onClick={handleNextBatch} className="w-8 h-14 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded transition backdrop-blur-sm">
             <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
             </svg>
          </button>
        )}
      </div>

      {/* 4. SCROLL TOGGLE - Positioned UNDER thumbnails */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 hidden md:flex flex-col items-center gap-1 opacity-190 hover:opacity-100 transition-opacity">
        <div className="animate-bounce">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Mobile Dots */}
      <div className="md:hidden absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {heroItems.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-1 transition-all duration-300 ${
              index === currentIndex ? 'bg-red-600 w-6' : 'bg-white/30 w-1.5'
            }`}
          />
        ))}
      </div>
    </div>
  );
}