import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { searchMedia, PROFILE_IMG_BASE_URL } from '../services/api';
import Loader from '../components/Loader';
import SearchGrid from '../components/Search/SearchGrid';
import SearchRow from '../components/Search/SearchRow';

// Internal helper for person results
const PersonSearchCard = ({ person }) => (
  <Link to={`/actor/${person.id}`} className="flex flex-col items-center group min-w-[120px]">
    <img
      src={person.profile_path ? `${PROFILE_IMG_BASE_URL}${person.profile_path}` : 'https://placehold.co/185x278/1f2937/9ca3af?text=No+Photo'}
      alt={person.name}
      className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-2 border-transparent group-hover:border-red-600 transition-all duration-300 shadow-lg"
    />
    <p className="mt-3 text-sm font-semibold text-gray-300 group-hover:text-white text-center truncate w-full">
      {person.name}
    </p>
    <p className="text-xs text-gray-500 text-center">{person.known_for_department}</p>
  </Link>
);

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
        // UPDATED FILTER: Include 'person' and allow items with either poster OR profile path
        const filtered = res.results.filter(
          (item) => 
            (item.media_type === 'movie' || item.media_type === 'tv' || item.media_type === 'person') && 
            (item.poster_path || item.profile_path)
        );
        setResults(filtered);
        setLoading(false);
        setActiveFilter('all'); // Reset filter on new search
      }
      performSearch();
    } else {
      setResults([]);
    }
  }, [query]);

  const movies = results.filter(item => item.media_type === 'movie');
  const tvShows = results.filter(item => item.media_type === 'tv');
  const people = results.filter(item => item.media_type === 'person');

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
        <div className="space-y-16 pb-20">
          {/* People Section (Shown at top for better discoverability) */}
          {people.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-white mb-6 pl-4 border-l-4 border-red-600">Actors & Crew</h2>
              <div className="flex gap-6 overflow-x-auto pb-4 px-4 scrollbar-hide">
                {people.map(p => <PersonSearchCard key={p.id} person={p} />)}
              </div>
            </section>
          )}

          {movies.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-white mb-6 pl-4 border-l-4 border-red-600">Movies</h2>
              <SearchRow items={movies} />
            </section>
          )}

          {tvShows.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-white mb-6 pl-4 border-l-4 border-red-600">TV Shows</h2>
              <SearchRow items={tvShows} />
            </section>
          )}
        </div>
      );
    }
    
    if (activeFilter === 'movie') return <SearchGrid items={movies} />;
    if (activeFilter === 'tv') return <SearchGrid items={tvShows} />;
    if (activeFilter === 'person') return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8 pb-20">
        {people.map(p => <PersonSearchCard key={p.id} person={p} />)}
      </div>
    );
  };

  return (
    <div className="min-h-screen pt-28 md:pt-32 px-4 md:px-8 bg-[#121212] text-white">
      {query && (
        <h1 className="text-2xl md:text-4xl font-bold mb-8 text-gray-200">
          Search results for <span className="text-white">"{query}"</span>
        </h1>
      )}
      
      {/* Updated Filter Tabs */}
      {results.length > 0 && (
        <div className="flex gap-6 border-b border-white/10 mb-10 overflow-x-auto scrollbar-hide">
          {[
            { id: 'all', label: 'All' },
            { id: 'movie', label: `Movies (${movies.length})` },
            { id: 'tv', label: `TV Shows (${tvShows.length})` },
            { id: 'person', label: `People (${people.length})` }
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)} 
              className={`pb-4 px-2 text-sm md:text-base font-medium transition-all relative whitespace-nowrap ${
                activeFilter === tab.id ? 'text-white' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {tab.label}
              {activeFilter === tab.id && (
                <span className="absolute bottom-0 left-0 w-full h-1 bg-red-600 rounded-t-full shadow-[0_-2px_10px_rgba(229,9,20,0.5)]"></span>
              )}
            </button>
          ))}
        </div>
      )}

      {renderResults()}
    </div>
  );
}