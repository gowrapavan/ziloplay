import ActorCard from "./ActorCard";

export default function ActorRow({ title, actors }) {
  if (!actors || !actors.length) {
    return null;
  }

  return (
<section className="mt-10 mb-8">
      {/* Title Bar */}
      <div className="flex items-center gap-3 px-5 mb-5">
        <div className="h-7 w-1 bg-red-600 rounded-full" />
        <h2 className="text-xl md:text-2xl font-bold text-gray-200 uppercase tracking-tight">
          {title}
        </h2>
      </div>

      {/* Scroll Row */}
      <div className="flex overflow-x-auto gap-4 px-5 pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
        {actors.map((actor) => (
          <ActorCard key={actor.id} actor={actor} />
        ))}
        <div className="flex-shrink-0 w-1" />
      </div>
    </section>
  );
}
