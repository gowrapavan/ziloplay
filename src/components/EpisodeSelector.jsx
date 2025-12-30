import { useState, useEffect, useRef } from "react";
import { getSeasonDetails } from "../services/api";

export default function EpisodeSelector({ seriesId, seasons, onSelect, activeSeason, activeEpisode }) {
  const [viewMode, setViewMode] = useState("list");
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // State for tracking open dropdowns
  const [isSeasonOpen, setIsSeasonOpen] = useState(false);
  const [isEpisodeOpen, setIsEpisodeOpen] = useState(false);

  // Reference to the main container
  const containerRef = useRef(null);

  // FIX: Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // If the click is NOT inside our container, close both dropdowns
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsSeasonOpen(false);
        setIsEpisodeOpen(false);
      }
    };

    // Attach the listener to the document
    document.addEventListener("mousedown", handleClickOutside);
    
    // Clean up the listener when the component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!seriesId) return;
    async function fetchEpisodes() {
      setLoading(true);
      try {
        const data = await getSeasonDetails(seriesId, activeSeason);
        setEpisodes(data.episodes || []);
      } catch (err) {
        console.error("Failed to fetch season details:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchEpisodes();
  }, [seriesId, activeSeason]);

  const activeEpData = episodes.find(e => e.episode_number === activeEpisode);
  const activeSeasonData = seasons.find(s => s.season_number === activeSeason);

  if (!seasons || seasons.length === 0) return null;

  return (
    <div 
      ref={containerRef} 
      className="bg-[#161616]/40 p-4 md:p-6 rounded-2xl border border-white/5 backdrop-blur-md mb-6 relative z-[100]"
    >
      {/* Header with Switcher Icons */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="h-5 w-1 bg-red-600 rounded-full" />
          <h3 className="text-[11px] md:text-xs font-black uppercase tracking-[0.2em] text-gray-400">Select Episode</h3>
        </div>
        <div className="flex bg-[#0a0a0a] p-1 rounded-xl border border-white/5">
          <button onClick={() => setViewMode("list")} className={`p-1.5 md:p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-red-600 text-white" : "text-gray-500 hover:text-gray-300"}`}>
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <button onClick={() => setViewMode("grid")} className={`p-1.5 md:p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-red-600 text-white" : "text-gray-500 hover:text-gray-300"}`}>
             <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        {/* CUSTOM SEASON SELECTOR */}
        <div className="flex-1 relative">
          <label className="block text-[9px] uppercase tracking-widest text-gray-500 font-black mb-1.5">Season</label>
          <div 
            onClick={() => { setIsSeasonOpen(!isSeasonOpen); setIsEpisodeOpen(false); }} 
            className="bg-[#0a0a0a] text-white rounded-xl py-2.5 px-4 w-full border border-white/10 flex justify-between items-center cursor-pointer font-bold text-xs"
          >
            <span>{activeSeasonData?.name || `Season ${activeSeason}`}</span>
            <svg className={`w-3 h-3 transition-transform ${isSeasonOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeWidth="3" /></svg>
          </div>
          {isSeasonOpen && (
            <div className="absolute top-[105%] left-0 w-full bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)] max-h-[200px] overflow-y-auto scrollbar-hide z-[120]">
              {seasons.filter(s => s.season_number > 0).map((s) => (
                <div
                  key={s.id}
                  onClick={() => { onSelect(s.season_number, 1); setIsSeasonOpen(false); }}
                  className={`px-4 py-3 text-xs font-bold cursor-pointer transition-colors ${activeSeason === s.season_number ? 'bg-red-600 text-white' : 'text-gray-400 hover:bg-red-600/20 hover:text-white'}`}
                >
                  {s.name}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CUSTOM EPISODE SELECTOR */}
        {viewMode === "list" && (
          <div className="flex-[3] relative">
            <label className="block text-[9px] uppercase tracking-widest text-gray-500 font-black mb-1.5">Episode Name</label>
            <div 
              onClick={() => { setIsEpisodeOpen(!isEpisodeOpen); setIsSeasonOpen(false); }} 
              className="bg-[#0a0a0a] text-white rounded-xl py-2.5 px-4 w-full border border-white/10 flex justify-between items-center cursor-pointer font-bold text-xs"
            >
              <span className="truncate">{activeEpData ? `${activeEpData.episode_number}. ${activeEpData.name}` : "Loading..."}</span>
              <svg className={`w-3 h-3 transition-transform ${isEpisodeOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeWidth="3" /></svg>
            </div>
            {isEpisodeOpen && (
              <div className="absolute top-[105%] left-0 w-full bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)] max-h-[250px] overflow-y-auto scrollbar-hide z-[120]">
                {episodes.map((ep) => (
                  <div
                    key={ep.id}
                    onClick={() => { onSelect(activeSeason, ep.episode_number); setIsEpisodeOpen(false); }}
                    className={`px-4 py-3 text-xs font-bold cursor-pointer transition-colors border-b border-white/5 last:border-0 ${activeEpisode === ep.episode_number ? 'bg-red-600 text-white' : 'text-gray-400 hover:bg-red-600/20 hover:text-white'}`}
                  >
                    {ep.episode_number}. {ep.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* GRID MODE logic remains the same */}
      {viewMode === "grid" && (
        <div className="flex overflow-x-auto gap-2 mt-4 scrollbar-hide">
          {episodes.map(ep => (
            <button key={ep.id} onClick={() => onSelect(activeSeason, ep.episode_number)} className={`flex-shrink-0 w-10 h-10 rounded-xl border text-xs font-black transition-all ${activeEpisode === ep.episode_number ? 'bg-red-600 border-red-500 text-white shadow-[0_0_15px_rgba(229,9,20,0.3)]' : 'bg-[#0a0a0a] border-white/5 text-gray-400 hover:border-red-600/50'}`}>
              {ep.episode_number}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}