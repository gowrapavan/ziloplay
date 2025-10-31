import MediaCard from "./MediaCard";

export default function MediaGrid({ items, mediaType }) {
  if (!items || items.length === 0) {
    return <p className="text-gray-400 text-center py-8">No items to display in this category.</p>;
  }

  return (
    // Responsive grid: 2 columns on mobile, scaling up to 6 on large desktops
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {items.map((item) => (
        <MediaCard key={item.id || item.mal_id} item={item} mediaType={mediaType} />
      ))}
    </div>
  );
}

