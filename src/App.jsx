import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Movies from "./pages/Movies";
import TvShows from "./pages/TvShows";
import Anime from "./pages/Anime";
import ActorDetails from "./pages/ActorDetails";
import NewsPage from "./pages/NewsPage";
import Watch from "./pages/Watch";
import AnimeWatch from "./pages/AnimeWatch"; // Import the new page
import Search from "./pages/Search";
import CompanyDetailsPage from './pages/CompanyDetailsPage';
import ScrollToTop from "./components/ScrollToTop"; // Ensure this component is created
import Watchlist from "./pages/Watchlist"; // Import the page

export default function App() {
  
  // 🚀 Logic for Auto-Hiding Red Scrollbar
  useEffect(() => {
    let scrollTimeout;

    const handleScroll = () => {
      // Add class to show scrollbar when movement is detected
      document.body.classList.add('scrolling');

      // Reset the timer
      window.clearTimeout(scrollTimeout);

      // Hide scrollbar after 1.5 seconds of inactivity
      scrollTimeout = setTimeout(() => {
        document.body.classList.remove('scrolling');
      }, 1500);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.clearTimeout(scrollTimeout);
    };
  }, []);

  return (
    <BrowserRouter>
      {/* 🔼 Resets scroll position to top on every navigation */}
      <ScrollToTop />
      
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="movies" element={<Movies />} />
          <Route path="tv-shows" element={<TvShows />} />
          <Route path="anime" element={<Anime />} />
          <Route path="actor/:id" element={<ActorDetails />} />
          <Route path="watch/:mediaType/:id" element={<Watch />} />
          <Route path="watch/anime/:id" element={<AnimeWatch />} />
          <Route path="news" element={<NewsPage />} />
          <Route path="watchlist" element={<Watchlist />} />
          <Route path="company/:companyId" element={<CompanyDetailsPage />} />
          <Route path="search" element={<Search />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}