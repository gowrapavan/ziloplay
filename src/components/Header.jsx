import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Header() {
  const [localQuery, setLocalQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchDrawerOpen, setIsSearchDrawerOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (localQuery.trim()) {
      navigate(`/search?query=${localQuery}`);
      setLocalQuery("");
      setIsMobileMenuOpen(false);
      setIsSearchDrawerOpen(false);
    }
  };

  // Improved Link Styling
  const navLinkClass = ({ isActive }) => 
    `relative text-2xl md:text-base font-medium transition-colors duration-300 ${
      isActive ? "text-[#E50914] font-bold" : "text-gray-300 hover:text-white"
    }`;

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

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
      <header 
        className={`fixed top-0 w-full z-50 flex items-center justify-between gap-4 p-4 md:px-8 transition-all duration-500 ease-in-out ${
          isScrolled 
            ? "bg-black/90 backdrop-blur-xl shadow-lg shadow-black/50" 
            : "bg-transparent"
        }`}
      >
        {/* Soft Gradient Overlay for top readability */}
        <div className={`absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 to-transparent -z-10 transition-opacity duration-500 ${isScrolled ? 'opacity-0' : 'opacity-100'}`} />

        {/* LOGO */}
        <div className="flex items-center gap-8 z-10">
          <Link to="/" className="transition-transform hover:scale-105 flex-shrink-0">
            <img src={logo} alt="ZiloPlay Logo" className="h-8 md:h-9" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <NavLink to="/" className={navLinkClass}>Home</NavLink>
            <NavLink to="/movies" className={navLinkClass}>Movies</NavLink>
            <NavLink to="/tv-shows" className={navLinkClass}>TV Shows</NavLink>
            <NavLink to="/anime" className={navLinkClass}>Anime</NavLink>
          </nav>
        </div>

        {/* ICONS & SEARCH */}
        <div className="flex items-center gap-5 z-10">
          {/* Desktop Search Input */}
          <form onSubmit={handleSearch} className="hidden md:block relative group">
            <div className={`flex items-center transition-all duration-300 rounded-full border ${
               isScrolled ? "bg-gray-900/80 border-gray-700" : "bg-black/30 border-white/20 backdrop-blur-md"
            } group-focus-within:border-red-600 group-focus-within:bg-black group-focus-within:w-72 w-64`}>
              <svg className="w-5 h-5 text-gray-400 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input
                type="text"
                placeholder="Search titles, people..."
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
                className="w-full bg-transparent text-white px-3 py-2 focus:outline-none placeholder-gray-400 text-sm"
              />
            </div>
          </form>

          {/* Mobile Search Toggle */}
          <button onClick={toggleSearchDrawer} className="md:hidden p-1 rounded-full hover:bg-white/10 transition">
            {isSearchDrawerOpen ? (
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button onClick={toggleMobileMenu} className={`md:hidden p-1 rounded-full hover:bg-white/10 transition ${isSearchDrawerOpen ? 'hidden' : 'block'}`}>
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
        </div>
      </header>

      {/* ================= MOBILE SEARCH DRAWER ================= */}
      <div 
        className={`fixed top-[60px] left-0 right-0 z-40 px-4 py-5  backdrop-blur-l border-b border-white/10 shadow-2xl transition-all duration-300 ease-in-out md:hidden ${
          isSearchDrawerOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-5 invisible'
        }`}
      >
        <form onSubmit={handleSearch} className="relative w-full">
          <div className="relative flex items-center">
            <svg className="absolute left-4 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input
              type="text"
              placeholder="What do you want to watch?"
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              className="w-full bg-white/10 text-white pl-12 pr-4 py-3.5 bg-black/95  rounded-xl border border-white/10 focus:border-red-600 focus:bg-black focus:ring-1 focus:ring-red-600 focus:outline-none transition-all placeholder-gray-500 text-base"
              autoFocus={isSearchDrawerOpen}
            />
          </div>
        </form>
      </div>

      {/* ================= MOBILE MENU FULLSCREEN ================= */}
      <div 
        className={`fixed inset-0 z-50 bg-black/98 backdrop-blur-2xl flex flex-col justify-center items-center transition-all duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? 'opacity-100 visible scale-100' : 'opacity-0 invisible scale-95'
        }`}
      >
        {/* Close Button */}
        <button 
          onClick={closeMobileMenu} 
          className="absolute top-6 right-6 p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        {/* Menu Links */}
        <nav className="flex flex-col items-center gap-10 w-full">
          <NavLink to="/" onClick={closeMobileMenu} className={({isActive}) => `text-3xl font-bold transition-all hover:scale-110 ${isActive ? 'text-[#E50914]' : 'text-gray-300 hover:text-white'}`}>Home</NavLink>
          <NavLink to="/movies" onClick={closeMobileMenu} className={({isActive}) => `text-3xl font-bold transition-all hover:scale-110 ${isActive ? 'text-[#E50914]' : 'text-gray-300 hover:text-white'}`}>Movies</NavLink>
          <NavLink to="/tv-shows" onClick={closeMobileMenu} className={({isActive}) => `text-3xl font-bold transition-all hover:scale-110 ${isActive ? 'text-[#E50914]' : 'text-gray-300 hover:text-white'}`}>TV Shows</NavLink>
          <NavLink to="/anime" onClick={closeMobileMenu} className={({isActive}) => `text-3xl font-bold transition-all hover:scale-110 ${isActive ? 'text-[#E50914]' : 'text-gray-300 hover:text-white'}`}>Anime</NavLink>
        </nav>
      </div>
    </>
  );
}