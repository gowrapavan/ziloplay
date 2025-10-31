import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchMedia } from '../services/api';
import Loader from '../components/Loader';
// ✅ FIX: Import both MediaGrid and MediaRow
import MediaGrid from '../components/MediaGrid';
import MediaRow from '../components/MediaRow';

export default function Search() {
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  
  const query = searchParams.get('query');

  useEffect(() => {
    // Run search whenever the query in the URL changes
    if (query) {
      async function performSearch() {
        setLoading(true);
        const res = await searchMedia(query);
        const filtered = res.results.filter(
          (item) => (item.media_type === 'movie' || item.media_type === 'tv') && item.poster_path
        );
        setResults(filtered);
        setLoading(false);
      }
      performSearch();
    } else {
      setResults([]); // Clear results if query is empty
    }
  }, [query]);

  // Filter results based on the active tab
  const movies = results.filter(item => item.media_type === 'movie');
  const tvShows = results.filter(item => item.media_type === 'tv');

  const renderResults = () => {
    if (loading) {
      return <Loader />;
    }
    if (results.length === 0 && query) {
      return <p className="text-gray-400 text-center">No results found for "{query}".</p>;
    }

    // ✅ FIX: Use MediaRow for the 'all' filter and MediaGrid for the others.
    if (activeFilter === 'all') {
      return (
        <div className="space-y-12">
          {movies.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Movies</h2>
              <MediaRow items={movies} />
            </section>
          )}
          {tvShows.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">TV Shows</h2>
              <MediaRow items={tvShows} />
            </section>
          )}
        </div>
      );
    }
    if (activeFilter === 'movie') {
      return <MediaGrid items={movies} />;
    }
    if (activeFilter === 'tv') {
      return <MediaGrid items={tvShows} />;
    }
  };

  return (
    <div className="min-h-screen pt-8 px-4 md:px-8">
      <h1 className="text-3xl font-bold text-white mb-6">Search results for "{query}"</h1>
      
      {/* Redesigned Filter Tab Bar */}
      <div className="flex border-b border-gray-700 mb-8">
        <button 
          onClick={() => setActiveFilter('all')} 
          className={`py-3 px-4 text-center text-sm font-medium transition-colors ${
            activeFilter === 'all' 
            ? 'text-white border-b-2 border-red-600' 
            : 'text-gray-500 border-b-2 border-transparent hover:text-gray-300'
          }`}
        >
          All
        </button>
        <button 
          onClick={() => setActiveFilter('movie')} 
          className={`py-3 px-4 text-center text-sm font-medium transition-colors ${
            activeFilter === 'movie' 
            ? 'text-white border-b-2 border-red-600' 
            : 'text-gray-500 border-b-2 border-transparent hover:text-gray-300'
          }`}
        >
          Movies ({movies.length})
        </button>
        <button 
          onClick={() => setActiveFilter('tv')} 
          className={`py-3 px-4 text-center text-sm font-medium transition-colors ${
            activeFilter === 'tv' 
            ? 'text-white border-b-2 border-red-600' 
            : 'text-gray-500 border-b-2 border-transparent hover:text-gray-300'
          }`}
        >
          TV Shows ({tvShows.length})
        </button>
      </div>

      {/* Results Section */}
      {renderResults()}
    </div>
  );
}