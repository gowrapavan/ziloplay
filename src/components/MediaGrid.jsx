import SearchCard from "./Search/SearchCard";

export default function MediaGrid({ items, mediaType }) {
  if (!items || items.length === 0) {
    return <p className="text-gray-400 text-center py-20 text-lg">No items to display.</p>;
  }

  return (
    // Added gap-y-8 for vertical spacing and pb-20 for bottom scrolling space
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-8 pb-20">
      {items.map((item) => (
        <SearchCard key={item.id || item.mal_id} item={item} mediaType={mediaType} />
      ))}
    </div>
  );
}