export default function EpisodeSelector({ seasons, onSelect, activeSeason, activeEpisode }) {
  if (!seasons || seasons.length === 0) return null;

  const currentSeason = seasons.find(s => s.season_number === activeSeason);
  const episodes = currentSeason ? Array.from({ length: currentSeason.episode_count }, (_, i) => i + 1) : [];

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="flex-shrink-0">
        <label htmlFor="season-select" className="block text-sm font-medium text-gray-400 mb-1">Season</label>
        <select
          id="season-select"
          value={activeSeason}
          onChange={(e) => onSelect(Number(e.target.value), 1)}
          className="bg-gray-800 text-white rounded-md p-2 w-full md:w-40"
        >
          {seasons
            .filter(s => s.season_number > 0) // Filter out "Specials" season
            .map(s => (
              <option key={s.id} value={s.season_number}>
                {s.name}
              </option>
          ))}
        </select>
      </div>

      <div className="flex-1 min-w-0">
        <label htmlFor="episode-select" className="block text-sm font-medium text-gray-400 mb-1">Episode</label>
        <div className="flex overflow-x-auto gap-2 pb-2">
            {episodes.map(episode => (
                <button
                    key={episode}
                    onClick={() => onSelect(activeSeason, episode)}
                    className={`flex-shrink-0 w-10 h-10 rounded-md transition-colors ${
                        activeEpisode === episode 
                        ? 'bg-red-600 text-white font-bold' 
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                >
                    {episode}
                </button>
            ))}
        </div>
      </div>
    </div>
  );
}