import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BG_BASE_URL, IMG_BASE_URL, getMediaDetails } from '../services/api'; 

export default function Hero({ items = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [batchIndex, setBatchIndex] = useState(0); 
  
  // State for logo handling
  const [activeLogo, setActiveLogo] = useState(null); 
  const [isLoadingLogo, setIsLoadingLogo] = useState(true); // Start as loading

  const ITEMS_PER_BATCH = 10; 

  // Calculate the items to show based on the current batch
  const heroItems = items.slice(
    batchIndex * ITEMS_PER_BATCH,
    (batchIndex + 1) * ITEMS_PER_BATCH
  );

  const currentItem = heroItems[currentIndex];

  // --- LOGO FETCHING LOGIC ---
  useEffect(() => {
    if (!currentItem) return;

    // 1. Reset state immediately when slide changes
    setActiveLogo(null);
    setIsLoadingLogo(true); // Hide everything while we check

    // 2. If item already has a logo (passed from parent), use it
    if (currentItem.logo) {
      setActiveLogo(currentItem.logo);
      setIsLoadingLogo(false);
      return;
    }

    // 3. Fetch specific details to get the logo
    const fetchLogo = async () => {
      try {
        const type = currentItem.media_type || 'movie'; 
        const details = await getMediaDetails(type, currentItem.id);
        if (details.logo) {
          setActiveLogo(details.logo);
        }
      } catch (err) {
        console.error("Error fetching logo:", err);
      } finally {
        // Reveal the result (Logo or Text) only after fetch is done
        setIsLoadingLogo(false);
      }
    };

    fetchLogo();

  }, [currentItem]); 

  // --- AUTO SLIDE LOGIC ---
  useEffect(() => {
    if (heroItems.length === 0) return;
    const timer = setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % heroItems.length);
    }, 8000);
    return () => clearTimeout(timer);
  }, [currentIndex, heroItems.length]);

  // --- BATCH HANDLERS ---
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

  // Helper: Truncate text
  const truncate = (str, n) => {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
  };

  return (
    <div className="relative w-full h-[70vh] md:h-[95vh] overflow-hidden bg-[#121212] text-white font-sans group">
      
      {/* ================= 1. BACKGROUND LAYER ================= */}
      {heroItems.map((item, index) => (
        <div
          key={item.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <div
            className="absolute inset-0 bg-cover bg-top md:bg-center transition-transform duration-[10000ms] ease-linear scale-105 group-hover:scale-110"
            style={{
              backgroundImage: `url('${BG_BASE_URL}${item.backdrop_path}')`,
            }}
          />
          {/* Gradients */}
          <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
          <div className="md:hidden absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/80 to-transparent" />
        </div>
      ))}

      {/* ================= 2. CONTENT LAYER ================= */}
      <div className="absolute z-20 inset-0 flex flex-col justify-end md:justify-center pb-16 md:pb-0 px-6 md:px-16 w-full md:w-[60%]">
        <div className="flex flex-col items-center md:items-start space-y-4 animate-fadeIn text-center md:text-left">
          
          {/* --- LOGO AREA (Fixed Height to prevent layout jump) --- */}
          {/* We reserve height so layout stays stable. */}
          <div className="min-h-[80px] md:min-h-[140px] flex items-end md:items-center justify-center md:justify-start mb-2">
            
            {isLoadingLogo ? (
              // 1. LOADING STATE: Render NOTHING (Invisible)
              <div className="opacity-0">Loading...</div> 
            ) : activeLogo ? (
              // 2. LOGO FOUND: Render Logo
              <img 
                src={`${IMG_BASE_URL}${activeLogo}`} 
                alt={currentItem.title}
                className="max-h-[80px] md:max-h-[140px] max-w-[250px] md:max-w-[400px] object-contain drop-shadow-xl animate-fadeIn"
              />
            ) : (
              // 3. NO LOGO FOUND (Fallback): Render Text
              <h1 className="text-3xl md:text-6xl font-black uppercase leading-none drop-shadow-2xl tracking-wide">
                {currentItem.title || currentItem.name}
              </h1>
            )}

          </div>

          {/* Metadata - SIZE REDUCED */}
          <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 text-[10px] md:text-xs font-bold text-gray-300">
            <span>{new Date(currentItem.release_date || currentItem.first_air_date || Date.now()).getFullYear()}</span>
            <span className="text-gray-500">•</span>
            <span className="border border-gray-500 px-2 py-0.5 rounded text-[10px]">U/A 16+</span>
            <span className="text-gray-500">•</span>
            <span>{currentItem.vote_average ? currentItem.vote_average.toFixed(1) : "NR"} Rating</span>
            <span className="text-gray-500">•</span>
            <span>{currentItem.original_language ? currentItem.original_language.toUpperCase() : "EN"}</span>
          </div>

          {/* Description - SIZE REDUCED */}
          <p className="text-gray-300 text-xs md:text-base leading-relaxed line-clamp-3 drop-shadow-md max-w-xl md:pr-10">
            {truncate(currentItem.overview, 180)}
          </p>

          {/* Buttons - SIZE SLIGHTLY REDUCED */}
          <div className="flex items-center gap-3 pt-2 w-full md:w-auto justify-center md:justify-start">
            <Link
              to={`/watch/movie/${currentItem.id}`}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-pink-600 hover:from-blue-700 hover:to-pink-700 text-white py-2.5 px-8 rounded-lg font-bold text-sm md:text-base shadow-lg transition-transform transform hover:scale-105"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              Watch Now
            </Link>

            <button className="w-10 h-10 md:w-11 md:h-11 flex items-center justify-center bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-lg border border-white/30 transition">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ================= 3. THUMBNAIL & BATCH NAVIGATION ================= */}
      <div className="absolute z-30 bottom-4 right-4 hidden md:flex items-end gap-2 pl-10 bg-gradient-to-l from-black/90 to-transparent p-3 rounded-l-xl">
        {batchIndex > 0 && (
          <button 
            onClick={handlePrevBatch}
            className="w-8 h-14 mb-[1px] flex items-center justify-center bg-white/10 hover:bg-white/30 rounded transition"
          >
             <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
             </svg>
          </button>
        )}
        {heroItems.map((item, index) => (
          <div
            key={item.id}
            onClick={() => setCurrentIndex(index)}
            className={`relative cursor-pointer transition-all duration-300 ease-out rounded overflow-hidden ${
              index === currentIndex 
                ? 'w-32 h-16 border-2 border-white opacity-100 scale-105' 
                : 'w-24 h-14 border border-transparent opacity-50 hover:opacity-100'
            }`}
          >
            <img
              src={`${BG_BASE_URL}${item.backdrop_path}`}
              alt={item.title}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
        {(batchIndex + 1) * ITEMS_PER_BATCH < items.length && (
          <button 
            onClick={handleNextBatch}
            className="w-8 h-14 mb-[1px] flex items-center justify-center bg-white/10 hover:bg-white/30 rounded transition"
          >
             <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
             </svg>
          </button>
        )}
      </div>

      {/* Mobile Dots */}
      <div className="md:hidden absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {heroItems.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'bg-white w-6' : 'bg-white/30 w-1.5'
            }`}
          />
        ))}
      </div>

    </div>
  );
}