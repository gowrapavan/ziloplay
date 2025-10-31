import { createContext, useContext, useState } from 'react';

// 1. Create the context
const SearchContext = createContext();

// 2. Create a provider component
export function SearchProvider({ children }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // ✅ ADDED: State for the search filter
  const [searchFilter, setSearchFilter] = useState('all');

  const value = {
    searchQuery,
    setSearchQuery,
    searchResults,
    setSearchResults,
    loading,
    setLoading,
    // ✅ ADDED: Pass the filter state and setter to the context
    searchFilter,
    setSearchFilter,
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
}

// 3. Create a custom hook for easy access
export function useSearch() {
  return useContext(SearchContext);
}
