import MediaCard from "./MediaCard";

export default function MediaRow({ title, items, mediaType }) {
  if (!items || !items.length) {
    return null;
  }

  return (
    <section className="mb-8">
      {/* Container for the red bar and title */}
      <div className="flex items-center gap-3 px-5 mb-5">
        <div className="h-7 w-1 bg-red-600 rounded-full" />
        <h2 className="text-xl md:text-2xl font-bold text-gray-200 uppercase tracking-tight">
          {title}
        </h2>
      </div>

      <div className="flex overflow-x-auto gap-4 px-5 pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
        {items.map((item) => (
          <MediaCard key={item.id || item.mal_id} item={item} mediaType={mediaType} />
        ))}
        {/* Spacer for the end of the scroll */}
        <div className="flex-shrink-0 w-1"></div>
      </div>
    </section>
  );
}