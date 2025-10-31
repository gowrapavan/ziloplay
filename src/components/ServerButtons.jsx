import { useState } from "react";

// Server list remains the same
const Servers = [
    { name: "Videasy", url: (id) => `https://player.videasy.net/movie/${id}?overlay=true&color=e50914`, type: "tmdb" },
    { name: "VidKing", url: (id) => `https://www.vidking.net/embed/movie/${id}?color=e50914&autoPlay=true`, type: "tmdb" },
    { name: "WMOVIES", url: (id) => `https://wmovies.one/api/movie.php?tmdb=${id}`, type: "tmdb" },
    { name: "EmbedRU", url: (imdb) => `https://soap2night.cc/embed/movie/${imdb}`, type: "imdb" },
    { name: "VidSrc", url: (imdb) => `https://moviesapi.club/movie/${imdb}`, type: "imdb" },
];

export default function ServerButtons({ tmdbId, imdbId }) {
  const [active, setActive] = useState(0);

  // Return null if IDs are not available yet
  if (!tmdbId && !imdbId) return null;

  return (
    <div className="mb-8">
      <div className="flex flex-wrap gap-2 mb-4">
        {Servers.map((s, i) => (
          <button
            key={s.name}
            onClick={() => setActive(i)}
            className={`font-semibold py-2 px-4 rounded-lg transition-colors duration-300 ${
              active === i
                ? "bg-red-600 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            {s.name}
          </button>
        ))}
      </div>
      <div className="relative pb-[56.25%] h-0 rounded-xl overflow-hidden shadow-2xl">
        <iframe
          src={
            Servers[active].type === "tmdb"
              ? Servers[active].url(tmdbId)
              : Servers[active].url(imdbId)
          }
          className="absolute top-0 left-0 w-full h-full"
          allowFullScreen
          title="Movie Player"
        ></iframe>
      </div>
    </div>
  );
}