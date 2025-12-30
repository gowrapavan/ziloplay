import { useState } from "react";
import EpisodeSelector from "./EpisodeSelector";

const Servers = [
  { name: "VidLink", url: (id, s, e, type) => type === 'movie' ? `https://vidlink.pro/movie/${id}` : `https://vidlink.pro/tv/${id}/${s}/${e}`, type: "tmdb" },
  { name: "VidSrc", url: (id, s, e, type) => type === 'movie' ? `https://vidsrc.cc/v2/embed/movie/${id}` : `https://vidsrc.cc/v2/embed/tv/${id}/${s}/${e}`, type: "tmdb" },
  { name: "Videasy", url: (id, s, e, type) => type === 'movie' ? `https://player.videasy.net/movie/${id}` : `https://player.videasy.net/tv/${id}/${s}/${e}`, type: "tmdb" },
  { name: "VidKing", url: (id, s, e, type) => type === 'movie' ? `https://www.vidking.net/embed/movie/${id}` : `https://www.vidking.net/embed/tv/${id}/${s}/${e}`, type: "tmdb" },
  { name: "2Embed", url: (id, s, e, type) => type === 'movie' ? `https://www.2embed.cc/embed/${id}` : `https://www.2embed.cc/embedtv/${id}&s=${s}&e=${e}`, type: "tmdb" },
  { name: "MoviesClub", url: (id, s, e, type) => type === 'movie' ? `https://moviesapi.club/movie/${id}` : `https://moviesapi.club/tv/${id}-${s}-${e}`, type: "imdb" },
  { name: "Flixer", url: (id, s, e, type) => type === 'movie' ? `https://flixer.sh/watch/movie/${id}` : `https://flixer.sh/watch/tv/${id}/${s}/${e}`, type: "tmdb" },
];

export default function Player({ media, mediaType }) {
  const [activeServer, setActiveServer] = useState(0);
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);

  if (!media) return null;

  const handleEpisodeSelect = (s, e) => {
    setSeason(s);
    setEpisode(e);
  };

  const id = mediaType === 'anime' ? media.mal_id : media.id;
  const imdbId = media.external_ids?.imdb_id;

  const currentServer = Servers[activeServer];
  const serverId = currentServer.type === 'tmdb' ? id : imdbId;
  const src = serverId ? currentServer.url(serverId, season, episode, mediaType) : '';

  return (
    // Reduced container margin-bottom to fix the gap
    <div className="mb-2 space-y-3 md:space-y-4">
      
      {/* 1. TV Episode Selector */}
      {mediaType === 'tv' && media.seasons && (
        <EpisodeSelector
          seriesId={id}
          seasons={media.seasons}
          activeSeason={season}
          activeEpisode={episode}
          onSelect={handleEpisodeSelect}
        />
      )}

      {/* 2. Server Selection UI */}
      <div className="bg-[#161616]/40 p-4 md:p-6 rounded-3xl border border-white/5 backdrop-blur-md">
        <div className="flex items-center gap-3 mb-5">
          <div className="h-5 w-1 bg-red-600 rounded-full" />
          <h3 className="text-[11px] md:text-xs font-black uppercase tracking-[0.2em] text-gray-400">
            Switch Server
          </h3>
        </div>

        <div className="flex flex-wrap gap-2 md:gap-3">
          {Servers.map((s, i) => (
            <button
              key={s.name}
              onClick={() => setActiveServer(i)}
              disabled={s.type === 'imdb' && !imdbId}
              className={`relative flex items-center gap-2 font-bold py-2 px-4 md:py-3 md:px-5 rounded-xl transition-all duration-300 border text-[11px] md:text-sm ${
                activeServer === i
                  ? "bg-red-600 border-red-500 text-white shadow-[0_0_20px_rgba(229,9,20,0.3)]"
                  : "bg-[#0a0a0a] border-white/10 text-gray-400 hover:border-red-600/50 hover:text-white"
              } disabled:opacity-30 disabled:cursor-not-allowed`}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      {/* 3. The Player Container - Rounded curves on desktop, flush on mobile */}
      <div className="relative -mx-5 md:mx-0"> 
        <div className="relative pb-[56.25%] h-0 rounded-none md:rounded-[2rem] overflow-hidden shadow-2xl bg-black border-y md:border border-white/5">
          {src ? (
            <iframe
              key={src}
              src={src}
              className="absolute top-0 left-0 w-full h-full"
              allowFullScreen
              title="ZiloPlay Player"
              frameBorder="0"
            ></iframe>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
              <p className="text-sm font-medium tracking-wide">Select an episode to start.</p>
            </div>
          )}
        </div>
      </div>

      {/* 4. Tips & Watching Status - Matched exactly to image_db2e56.png */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-4 px-2">
        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.15em] text-gray-500">
          <span className="hover:text-white cursor-help transition-colors">Ads? Try VidLink or VidSrc</span>
          <span className="h-1 w-1 bg-gray-700 rounded-full" />
          <span className="text-gray-400">Watching S{season} E{episode}</span>
        </div>
        
        <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 bg-white/5 px-4 py-2 rounded-full border border-white/10 uppercase tracking-tighter shadow-sm">
          <span>Server:</span>
          <span className="text-red-500">{currentServer.name}</span>
        </div>
      </div>
    </div>
  );
}