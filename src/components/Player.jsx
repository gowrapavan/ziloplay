import { useState } from "react";
import EpisodeSelector from "./EpisodeSelector";

// Updated server list including VidLink and VidSrc
const Servers = [
  { name: "Videasy", url: (id, s, e, type) => type === 'movie' ? `https://player.videasy.net/movie/${id}` : `https://player.videasy.net/tv/${id}/${s}/${e}`, type: "tmdb" },
  { name: "VidKing", url: (id, s, e, type) => type === 'movie' ? `https://www.vidking.net/embed/movie/${id}` : `https://www.vidking.net/embed/tv/${id}/${s}/${e}`, type: "tmdb" },
  { name: "2Embed", url: (id, s, e, type) => type === 'movie' ? `https://www.2embed.cc/embed/${id}` : `https://www.2embed.cc/embedtv/${id}&s=${s}&e=${e}`, type: "tmdb" },
  { name: "MoviesClub", url: (id, s, e, type) => type === 'movie' ? `https://moviesapi.club/movie/${id}` : `https://moviesapi.club/tv/${id}-${s}-${e}`, type: "imdb" },
  { name: "VidLink", url: (id, s, e, type) => type === 'movie' ? `https://vidlink.pro/movie/${id}` : `https://vidlink.pro/tv/${id}/${s}/${e}`, type: "tmdb" },
  { name: "VidSrc", url: (id, s, e, type) => type === 'movie' ? `https://vidsrc.cc/v2/embed/movie/${id}` : `https://vidsrc.cc/v2/embed/tv/${id}/${s}/${e}`, type: "tmdb" },
  { name: "Flixer", url: (id, s, e, type) => type === 'movie' ? `https://flixer.sh/watch/movie/${id}` : `https://flixer.sh/watch//tv/${id}/${s}/${e}`, type: "tmdb" },
];

export default function Player({ media, mediaType }) {
  const [activeServer, setActiveServer] = useState(0);
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);

  if (!media) return null;

  const handleSelect = (s, e) => {
    setSeason(s);
    setEpisode(e);
  };

  const id = mediaType === 'anime' ? media.mal_id : media.id;
  const imdbId = media.external_ids?.imdb_id;

  const currentServer = Servers[activeServer];
  const serverId = currentServer.type === 'tmdb' ? id : imdbId;
  const src = serverId ? currentServer.url(serverId, season, episode, mediaType) : '';

  return (
    <div className="mb-8">
      {mediaType === 'tv' && (
        <EpisodeSelector
          seasons={media.seasons}
          onSelect={handleSelect}
          activeSeason={season}
          activeEpisode={episode}
        />
      )}

      <div className="flex flex-wrap gap-2 mb-4">
        {Servers.map((s, i) => (
          <button
            key={s.name}
            onClick={() => setActiveServer(i)}
            disabled={s.type === 'imdb' && !imdbId}
            className={`font-semibold py-2 px-4 rounded-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
              activeServer === i
                ? "bg-red-600 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            {s.name}
          </button>
        ))}
      </div>

      <div className="relative pb-[56.25%] h-0 rounded-xl overflow-hidden shadow-2xl bg-black">
        {src ? (
          <iframe
            key={src} // Force re-render on src change
            src={src}
            className="absolute top-0 left-0 w-full h-full"
            allowFullScreen
            title="Media Player"
          ></iframe>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">Select a server to start watching.</div>
        )}
      </div>
    </div>
  );
}
