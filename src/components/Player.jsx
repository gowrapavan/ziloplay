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
  const imdbId = media.external_ids?.imdb_id || media.imdb_id;

  const currentServer = Servers[activeServer];
  const serverId = currentServer.type === 'tmdb' ? id : imdbId;
  const src = serverId ? currentServer.url(serverId, season, episode, mediaType) : '';

  return (
    <div className="mb-6 space-y-4">
      
      {/* 0. Browser Disclaimer - Reduced Rounding */}
      <div className="bg-red-600/10 border border-red-600/20 rounded-md p-3 text-center mx-1">
        <p className="text-[10px] md:text-xs font-bold text-red-500 uppercase tracking-widest">
          Tip: Use <span className="text-white underline">JioSphere</span> or <span className="text-white underline">Brave Browser</span> to block all ads.
        </p>
      </div>

      {/* 1. TV Episode Selector */}
      {mediaType === 'tv' && media.seasons && (
        <div className="mx-1">
          <EpisodeSelector
            seriesId={id}
            seasons={media.seasons}
            activeSeason={season}
            activeEpisode={episode}
            onSelect={handleEpisodeSelect}
          />
        </div>
      )}

      {/* 2. Server Selection UI - Changed from rounded-[2rem] to rounded-md */}
      <div className="bg-[#161616]/60 p-4 md:p-6 rounded-md border border-white/5 backdrop-blur-xl mx-1 shadow-xl">
        <div className="flex items-center gap-3 mb-5">
          <div className="h-5 w-1 bg-red-600 rounded-sm animate-pulse" />
          <h3 className="text-[11px] md:text-xs font-black uppercase tracking-[0.2em] text-gray-400">
            Switch Server
          </h3>
        </div>

        <div className="flex flex-wrap gap-2 md:gap-3">
          {Servers.map((s, i) => {
            const isDisabled = s.type === 'imdb' && !imdbId;
            return (
              <button
                key={s.name}
                onClick={() => setActiveServer(i)}
                disabled={isDisabled}
                className={`font-black px-5 py-2.5 text-[10px] md:text-xs transition-all duration-300 rounded-sm border ${
                  activeServer === i
                    ? "bg-red-600 border-red-500 text-white shadow-[0_5px_15px_rgba(229,9,20,0.3)]"
                    : "bg-black/40 border-white/10 text-gray-400 hover:border-red-600/50 hover:text-white"
                } ${isDisabled ? "opacity-20 cursor-not-allowed" : "active:scale-95"}`}
              >
                {s.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. The Player Container - Reduced rounding for a sharper look */}
      <div className="w-full px-1"> 
        <div className="relative w-full aspect-video rounded-md overflow-hidden shadow-2xl bg-black border border-white/5">
          {src ? (
            <iframe
              key={src} 
              src={src}
              className="absolute top-0 left-0 w-full h-full"
              allowFullScreen
              title="ZiloPlay Player"
              frameBorder="0"
              scrolling="no"
            ></iframe>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 bg-[#0a0a0a]">
               <div className="w-10 h-10 border-2 border-red-600/20 border-t-red-600 rounded-full animate-spin mb-4" />
               <p className="text-xs font-bold uppercase tracking-widest italic">
                {!serverId && currentServer.type === 'imdb' 
                  ? "IMDB ID missing" 
                  : "Establishing Connection..."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 4. Tips & Watching Status - Changed to rounded-md */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-2 px-4">
        <div className="flex items-center gap-3 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
          <span className="bg-white/5 px-2 py-1 rounded-sm text-gray-400">AD-FREE TIPS</span>
          <span className="h-1 w-1 bg-gray-800 rounded-full" />
          <span className="text-red-500/80">
            {mediaType === 'movie' ? "Watching Movie" : `Season ${season} • Episode ${episode}`}
          </span>
        </div>
        
        <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 bg-white/5 px-5 py-2 rounded-md border border-white/10 uppercase tracking-widest">
          <span className="opacity-50 text-[8px]">Active:</span>
          <span className="text-white">{currentServer.name}</span>
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
        </div>
      </div>
    </div>
  );
}