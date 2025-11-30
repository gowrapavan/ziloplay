import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; 
import { fetchCompanyDetails, fetchCompanyMovies, fetchCompanyTV, getImageUrl } from "../services/api"; 
import Loader from "../components/Loader";
import MediaGrid from "../components/MediaGrid"; 

export default function CompanyDetailsPage() {
  const { companyId } = useParams(); 
  const navigate = useNavigate();
  
  // --- Data State ---
  const [company, setCompany] = useState(null);
  const [movies, setMovies] = useState([]);
  const [tvShows, setTvShows] = useState([]);
  
  // --- Pagination State ---
  const [moviePage, setMoviePage] = useState(1);
  const [movieTotalPages, setMovieTotalPages] = useState(1);
  
  const [tvPage, setTvPage] = useState(1);
  const [tvTotalPages, setTvTotalPages] = useState(1);

  // --- UI State ---
  const [activeTab, setActiveTab] = useState("movie"); // 'movie' | 'tv'
  const [loading, setLoading] = useState(true); // Initial page load
  const [loadingMore, setLoadingMore] = useState(false); // Loading next page
  const [headerBg, setHeaderBg] = useState(null);

  // 1. Initial Load (Page 1)
  useEffect(() => {
    if (!companyId) return;

    async function loadData() {
      setLoading(true);
      try {
        const [compData, movData, tvData] = await Promise.all([
          fetchCompanyDetails(companyId),
          fetchCompanyMovies(companyId, 1), // Fetch Page 1
          fetchCompanyTV(companyId, 1)      // Fetch Page 1
        ]);

        setCompany(compData);
        
        // Handle Movies
        setMovies(movData.results);
        setMovieTotalPages(movData.totalPages);

        // Handle TV
        setTvShows(tvData.results);
        setTvTotalPages(tvData.totalPages);
        
        // Determine Hero Background
        const bestBackdrop = movData.results[0]?.backdrop_path || tvData.results[0]?.backdrop_path;
        if (bestBackdrop) {
          setHeaderBg(getImageUrl(bestBackdrop, "original"));
        }

        // Auto-switch to TV if no movies
        if (movData.results.length === 0 && tvData.results.length > 0) {
          setActiveTab("tv");
        }

      } catch (err) {
        console.error("Failed to load company data", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [companyId]); 

  // 2. Handle "Load More" Click
  const handleLoadMore = async () => {
    setLoadingMore(true);
    try {
      if (activeTab === "movie") {
        const nextPage = moviePage + 1;
        const data = await fetchCompanyMovies(companyId, nextPage);
        
        // Append new results to existing list
        setMovies(prev => [...prev, ...data.results]); 
        setMoviePage(nextPage);
      } else {
        const nextPage = tvPage + 1;
        const data = await fetchCompanyTV(companyId, nextPage);
        
        // Append new results to existing list
        setTvShows(prev => [...prev, ...data.results]);
        setTvPage(nextPage);
      }
    } catch (error) {
      console.error("Error loading more pages:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  // --- RENDER HELPERS ---
  if (loading) return <Loader />;

  if (!company) {
    return (
      <div className="pt-24 text-center text-white">
        <h2 className="text-2xl">Company not found</h2>
        <button onClick={() => navigate(-1)} className="mt-4 text-blue-500 hover:underline">Go Back</button>
      </div>
    );
  }

  const logoUrl = getImageUrl(company.logo_path, "original");
  
  // Select logic based on active tab
  const displayList = activeTab === "movie" ? movies : tvShows;
  const currentPage = activeTab === "movie" ? moviePage : tvPage;
  const totalPages = activeTab === "movie" ? movieTotalPages : tvTotalPages;
  const showLoadMore = currentPage < totalPages;

  return (
    <div className="min-h-screen bg-[#0f1014] text-white">
      
      {/* --- HERO SECTION --- */}
      <div 
        className="relative h-[50vh] min-h-[400px] flex flex-col items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: headerBg ? `url(${headerBg})` : 'none' }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/60 to-[#0f1014] z-0"></div>
        <button 
          onClick={() => navigate(-1)} 
          className="absolute top-24 left-6 z-20 px-4 py-2 bg-black/50 border border-white/20 rounded-full hover:bg-white hover:text-black transition duration-200 backdrop-blur-sm"
        >
          ← Back
        </button>
        <div className="relative z-10 flex flex-col items-center text-center p-4 animate-fadeIn">
          {logoUrl ? (
            <div className="bg-white/10 p-6 rounded-xl backdrop-blur-md border border-white/10 mb-6 shadow-2xl">
              <img src={logoUrl} alt={company.name} className="h-20 md:h-28 object-contain drop-shadow-lg" />
            </div>
          ) : (
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{company.name}</h1>
          )}
          <div className="flex items-center gap-2 text-gray-300 text-sm md:text-base font-medium">
            {company.origin_country && <span>{company.origin_country}</span>}
            <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
            <span>{movies.length + tvShows.length} Titles Loaded</span>
          </div>
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <main className="max-w-[1400px] mx-auto px-4 -mt-8 relative z-20 pb-20">
        
        {/* Tabs */}
        <div className="flex justify-center gap-8 mb-8 border-b border-gray-800">
          <button 
            onClick={() => setActiveTab('movie')}
            className={`pb-4 text-lg font-semibold transition-colors duration-200 relative ${
              activeTab === 'movie' ? 'text-white border-b-2 border-red-600' : 'text-gray-500 hover:text-white'
            }`}
          >
            Movies
          </button>
          
          <button 
            onClick={() => setActiveTab('tv')}
            className={`pb-4 text-lg font-semibold transition-colors duration-200 relative ${
              activeTab === 'tv' ? 'text-white border-b-2 border-red-600' : 'text-gray-500 hover:text-white'
            }`}
          >
            TV Shows
          </button>
        </div>

        {/* Media Grid */}
        <MediaGrid items={displayList} mediaType={activeTab} />

        {/* Load More Button */}
        {showLoadMore && displayList.length > 0 && (
          <div className="flex justify-center mt-8">
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingMore ? (
                 <span className="flex items-center gap-2">
                   <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                   Loading...
                 </span>
              ) : (
                 "Load More Results"
              )}
            </button>
          </div>
        )}

      </main>
    </div>
  );
}