import MediaCard from "./MediaCard";

export default function MediaRow({ title, items, mediaType }) {
  if (!items || !items.length) {
    return null;
  }

  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold m-5 text-gray-200">{title}</h2>
      <div className="flex overflow-x-auto gap-4 px-5 pb-4">
        {items.map((item) => (
          <MediaCard key={item.id || item.mal_id} item={item} mediaType={mediaType} />
        ))}
        <div className="flex-shrink-0 w-1"></div>
      </div>
    </section>
  );
}