import { IMG_BASE_URL } from "../services/api";
import { Link } from "react-router-dom";

export default function MediaCard({ item, mediaType }) { // mediaType is the fallback
  // A search result 'item' has its own media_type. Use it first.
  // Otherwise, use the mediaType prop passed from the MediaRow.
  const itemMediaType = item.media_type || mediaType;

  // Determine the correct ID and link path
  const id = itemMediaType === 'anime' ? item.mal_id : item.id;
  const linkTo = `/watch/${itemMediaType}/${id}`;
  
  const title = item.title || item.name;
  const posterPath = item.poster_path || item.images?.jpg?.image_url;

  // Don't render a card if it doesn't have an ID to link to.
  if (!id) {
    return null;
  }

  return (
    <Link to={linkTo} className="group relative w-40 sm:w-48 flex-shrink-0">
      <img
        src={
          posterPath
            ? (posterPath.startsWith('https://') ? posterPath : IMG_BASE_URL + posterPath)
            : "https://via.placeholder.com/500x750?text=No+Image"
        }
        alt={title}
        className="rounded-lg shadow-lg group-hover:scale-105 group-hover:brightness-75 transition-transform duration-300"
      />
      <div className="absolute inset-0 flex items-end p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <p className="text-sm font-semibold">{title}</p>
      </div>
    </Link>
  );
}