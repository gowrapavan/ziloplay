import { Link } from "react-router-dom";
import { PROFILE_IMG_BASE_URL } from "../../services/api";

export default function ActorCard({ actor }) {
  if (!actor?.id) return null;

  const name = actor.name;
  const department = actor.known_for_department || "Acting";

  const imageUrl = actor.profile_path
    ? PROFILE_IMG_BASE_URL + actor.profile_path
    : "https://via.placeholder.com/500x750?text=No+Image";

  return (
    <Link
      to={`/actor/${actor.id}`}
      className="group relative w-40 sm:w-48 flex-shrink-0 block"
      aria-label={`View actor ${name}`}
    >
      {/* Card Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-l bg-gray-800 shadow-md ring-1 ring-white/10">
        
        {/* Image */}
        <img
          src={imageUrl}
          alt={name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
        />

        {/* Hover Overlay (same as MediaCard) */}
        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="transform translate-y-2 transition-transform duration-300 group-hover:translate-y-0">
            <h3 className="line-clamp-2 text-sm font-bold text-white leading-tight">
              {name}
            </h3>

            <div className="mt-1 text-xs uppercase tracking-wide text-gray-300">
              {department}
            </div>
          </div>
        </div>

      </div>
    </Link>
  );
}
