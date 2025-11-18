import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchMedia } from '../services/api';
import Loader from '../components/Loader';
import SearchGrid from '../components/Search/SearchGrid';
import SearchRow from '../components/Search/SearchRow';

export default function Search() {
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  
  const query = searchParams.get('query');

  useEffect(() => {
    if (query) {
      async function performSearch() {
        setLoading(true);
        const res = await searchMedia(query);
        // Filter to ensure we only show items with posters and valid media types
        const filtered = res.results.filter(
          (item) => (item.media_type === 'movie' || item.media_type === 'tv') && item.poster_path
        );
        setResults(filtered);
        setLoading(false);
      }
      performSearch();
    } else {
      setResults([]);
    }
  }, [query]);

  const movies = results.filter(item => item.media_type === 'movie');
  const tvShows = results.filter(item => item.media_type === 'tv');

  const renderResults = () => {
    if (loading) return <Loader />;
    
    if (results.length === 0 && query) {
      return (
        <div className="flex flex-col items-center justify-center mt-20 opacity-50">
           <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
           <p className="text-xl font-medium">No results found for "{query}"</p>
        </div>
      );
    }

    if (activeFilter === 'all') {
      return (
        <div className="space-y-12 pb-20">
          {movies.length > 0 && (
            <section>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 pl-4 border-l-4 border-[#E50914]">Movies</h2>
              <SearchRow items={movies} />
            </section>
          )}
          {tvShows.length > 0 && (
            <section>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 pl-4 border-l-4 border-[#E50914]">TV Shows</h2>
              <SearchRow items={tvShows} />
            </section>
          )}
        </div>
      );
    }
    
    if (activeFilter === 'movie') return <SearchGrid items={movies} />;
    if (activeFilter === 'tv') return <SearchGrid items={tvShows} />;
  };

  return (
    // Increased top padding to handle fixed header
    <div className="min-h-screen pt-28 md:pt-32 px-4 md:px-8 bg-[#121212] text-white">
      {query && (
        <h1 className="text-2xl md:text-4xl font-bold mb-8 text-gray-200">
          Results for <span className="text-white">"{query}"</span>
        </h1>
      )}
      
      {/* Filter Tabs */}
      {results.length > 0 && (
        <div className="flex gap-6 border-b border-white/10 mb-10 overflow-x-auto">
          {[
            { id: 'all', label: 'All' },
            { id: 'movie', label: `Movies (${movies.length})` },
            { id: 'tv', label: `TV Shows (${tvShows.length})` }
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)} 
              className={`pb-4 px-2 text-sm md:text-base font-medium transition-all relative whitespace-nowrap ${
                activeFilter === tab.id 
                ? 'text-white' 
                : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {tab.label}
              {activeFilter === tab.id && (
                <span className="absolute bottom-0 left-0 w-full h-1 bg-[#E50914] rounded-t-full shadow-[0_-2px_10px_rgba(229,9,20,0.5)]"></span>
              )}
            </button>
          ))}
        </div>
      )}

      {renderResults()}
    </div>
  );
}