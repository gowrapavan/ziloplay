import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
// ❌ We no longer need useSearch
// import { useSearch } from "../context/SearchContext";
import logo from "../assets/logo.png";

export default function Header() {
  const [localQuery, setLocalQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchDrawerOpen, setIsSearchDrawerOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState('all'); // This is now only for UI styling
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (localQuery.trim()) {
      // Navigate to the search page with the query
      navigate(`/search?query=${localQuery}`);
      
      // Clear and close everything
      setLocalQuery("");
      setIsMobileMenuOpen(false);
      setIsSearchDrawerOpen(false);
    }
  };

  const activeLinkStyle = {
    color: '#E50914',
    fontWeight: 'bold',
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const toggleSearchDrawer = () => {
    setIsSearchDrawerOpen(prev => !prev);
    if (isMobileMenuOpen) setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prev => !prev);
    if (isSearchDrawerOpen) setIsSearchDrawerOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center justify-between gap-4 p-3 md:px-6 bg-black/90 backdrop-blur-sm shadow-md shadow-black/30">
        <div className="flex items-center gap-8">
          <Link to="/" className="transition-transform hover:scale-105 flex-shrink-0">
            <img src={logo} alt="ZiloPlay Logo" className="h-8" />
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-gray-300">
            <NavLink to="/" style={({ isActive }) => isActive ? activeLinkStyle : undefined}>Home</NavLink>
            <NavLink to="/movies" style={({ isActive }) => isActive ? activeLinkStyle : undefined}>Movies</NavLink>
            <NavLink to="/tv-shows" style={({ isActive }) => isActive ? activeLinkStyle : undefined}>TV Shows</NavLink>
            <NavLink to="/anime" style={({ isActive }) => isActive ? activeLinkStyle : undefined}>Anime</NavLink>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <form onSubmit={handleSearch} className="hidden md:block relative w-64">
            <input
              type="text"
              placeholder="Search..."
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              className="w-full pl-4 pr-10 py-2 text-white bg-gray-900 border-2 border-gray-700 rounded-full focus:outline-none focus:border-red-600"
            />
            <button type="submit" className="absolute top-1/2 right-4 -translate-y-1/2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>
          <div className="flex items-center gap-4 md:hidden">
            <button onClick={toggleSearchDrawer} aria-label="Toggle search">
              {isSearchDrawerOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              )}
            </button>
            <button onClick={toggleMobileMenu} aria-label="Open navigation menu" className={`${isSearchDrawerOpen ? 'hidden' : 'block'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>
      <div 
        className={`fixed top-14 left-0 right-0 z-20 bg-black shadow-lg transition-transform duration-300 ease-in-out md:hidden ${
          isSearchDrawerOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <form onSubmit={handleSearch} className="relative w-full p-4">
          <input
            type="text"
            placeholder="Search..."
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            className="w-full pl-4 pr-10 py-3 text-white bg-gray-900 border-2 border-gray-700 rounded-full focus:outline-none focus:border-red-600"
          />
          <button type="submit" className="absolute top-1/2 right-8 -translate-y-1/2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </form>
        <div className="flex border-t border-b border-gray-700">
          <button 
            onClick={() => setSearchFilter('all')} 
            className={`flex-1 py-3 text-center text-sm font-medium transition-colors ${
              searchFilter === 'all' 
              ? 'text-white border-b-2 border-red-600' 
              : 'text-gray-500 border-b-2 border-transparent'
            }`}
          >
            All
          </button>
          <button 
            onClick={() => setSearchFilter('movie')} 
            className={`flex-1 py-3 text-center text-sm font-medium transition-colors ${
              searchFilter === 'movie' 
              ? 'text-white border-b-2 border-red-600' 
              : 'text-gray-500 border-b-2 border-transparent'
            }`}
          >
            Movies
          </button>
          <button 
            onClick={() => setSearchFilter('tv')} 
            className={`flex-1 py-3 text-center text-sm font-medium transition-colors ${
              searchFilter === 'tv' 
              ? 'text-white border-b-2 border-red-600' 
              : 'text-gray-500 border-b-2 border-transparent'
            }`}
          >
            TV Shows
          </button>
        </div>
      </div>
      <div 
        className={`fixed inset-0 z-40 bg-black p-3 flex flex-col transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex justify-end mb-8">
          <button onClick={closeMobileMenu} aria-label="Close navigation menu">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="flex flex-col items-center gap-8 text-gray-300 text-2xl">
          <NavLink to="/" style={({ isActive }) => isActive ? activeLinkStyle : undefined} onClick={closeMobileMenu}>Home</NavLink>
          <NavLink to="/movies" style={({ isActive }) => isActive ? activeLinkStyle : undefined} onClick={closeMobileMenu}>Movies</NavLink>
          <NavLink to="/tv-shows" style={({ isActive }) => isActive ? activeLinkStyle : undefined} onClick={closeMobileMenu}>TV Shows</NavLink>
          <NavLink to="/anime" style={({ isActive }) => isActive ? activeLinkStyle : undefined} onClick={closeMobileMenu}>Anime</NavLink>
        </nav>
      </div>
    </>
  );
}