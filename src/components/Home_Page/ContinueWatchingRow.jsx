import { useStorage } from "../../hooks/useStorage";
import MediaCard from "../MediaCard";

export default function ContinueWatchingRow() {
  const { continueWatching } = useStorage();

  if (continueWatching.length === 0) return null;

  return (
    <section className="mb-8">
      {/* Matches standard MediaRow header exactly */}
      <div className="flex items-center gap-3 px-5 mb-5">
        <div className="h-7 w-1 bg-red-600 rounded-full" />
        <h2 className="text-xl md:text-2xl font-bold text-gray-200 uppercase tracking-tight flex items-center gap-2">
          <span>🍿</span> Continue Watching
        </h2>
      </div>

      {/* Matches standard MediaRow scroll container exactly */}
      <div className="flex overflow-x-auto gap-4 px-5 pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
        {continueWatching.map((item) => (
          /* FIX: Added overflow-hidden and rounded-lg to clip the progress bar */
          <div 
            key={item.id} 
            className="relative flex-shrink-0 rounded-lg overflow-hidden group shadow-lg"
          >
            {/* The Badge - Z-index ensures it stays above the poster but below the hover overlay if needed */}
            {item.mediaType === 'tv' && (
              <div className="absolute top-2 left-2 z-20 bg-red-600 text-white text-[10px] px-2 py-0.5 rounded font-bold shadow-md">
                S{item.season} E{item.episode}
              </div>
            )}
            
            {/* The Main Media Card */}
            <MediaCard item={item} mediaType={item.mediaType} />
            
            {/* Progress Bar - Positioned at the very bottom, clipped by parent's overflow-hidden */}
            <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gray-900/80 z-20">
               <div 
                 className="h-full bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.8)]"
                 style={{ width: '100%' }}
               ></div>
            </div>
          </div>
        ))}
        {/* Spacer for the end of the scroll matches your standard MediaRow */}
        <div className="flex-shrink-0 w-1"></div>
      </div>
    </section>
  );
}