import { useStorage } from "../hooks/useStorage";
import MediaCard from "../components/MediaCard";

export default function Watchlist() {
  const { watchlist } = useStorage();

  return (
    <div className="min-h-screen bg-[#111] pt-24 px-5 md:px-10 pb-10">
      {/* Page Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="h-8 w-1.5 bg-red-600 rounded-full" />
        <h1 className="text-3xl md:text-4xl font-bold text-white uppercase tracking-tight">
          My Watchlist
        </h1>
      </div>

      {watchlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <span className="text-6xl mb-4">📂</span>
          <p className="text-xl font-medium">Your watchlist is empty.</p>
          <p className="text-sm mt-2 text-gray-500">Add movies or TV shows to see them here.</p>
        </div>
      ) : (
        /* The Grid - Uses the same spacing as your Search/Category pages */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-8">
          {watchlist.map((item) => (
            <MediaCard 
              key={item.id} 
              item={item} 
              mediaType={item.mediaType} 
            />
          ))}
        </div>
      )}
    </div>
  );
}