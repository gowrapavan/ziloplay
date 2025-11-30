import { BrowserRouter, Routes, Route } from "react-router-dom";
// ❌ We can remove the SearchProvider, it's not needed anymore
// import { SearchProvider } from "./context/SearchContext"; 
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Movies from "./pages/Movies";
import TvShows from "./pages/TvShows";
import Anime from "./pages/Anime";
import Watch from "./pages/Watch";
import Search from "./pages/Search"; // ✅ Import the new Search page
import CompanyDetailsPage from './pages/CompanyDetailsPage'; // 👈 The page you want to open

export default function App() {
  return (
    <BrowserRouter>
      {/* ❌ SearchProvider is removed */}
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="movies" element={<Movies />} />
          <Route path="tv-shows" element={<TvShows />} />
          <Route path="anime" element={<Anime />} />
          <Route path="watch/:mediaType/:id" element={<Watch />} />
          <Route path="/company/:companyId" element={<CompanyDetailsPage />} />
          {/* ✅ ADDED: The new route for the search page */}
          <Route path="search" element={<Search />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
