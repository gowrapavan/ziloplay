import { useEffect, useState, useRef } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { getMediaList, getTrending } from "../services/api";
import Loader from "../components/Loader";
import SearchCard from "../components/Search/SearchCard";

const AdCard = () => (
  <a 
    href="https://anipop.netlify.app" 
    target="_blank" 
    rel="noopener noreferrer"
    className="relative group overflow-hidden rounded-xl bg-gradient-to-br from-red-900/40 to-black border border-white/10 hover:border-red-600 transition-all duration-300 flex flex-col items-center justify-center p-4 min-h-[250px] shadow-2xl"
  >
    <div className="text-center z-10">
      <h3 className="text-red-600 font-black text-2xl mb-1 italic tracking-tighter">AniPop</h3>
      <p className="text-gray-300 text-[10px] font-bold uppercase tracking-widest mb-4">Stream Anime Free</p>
      <div className="inline-block px-4 py-2 bg-red-600 text-white text-[10px] font-black rounded-md uppercase group-hover:scale-110 transition-transform">Visit Site</div>
    </div>
    <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-red-600/10 blur-3xl rounded-full group-hover:bg-red-600/30 transition-all" />
  </a>
);

export default function CategoryPage() {
  const { type, category } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const scrollRef = useRef(null);
  
  const currentPage = parseInt(searchParams.get("page")) || 1;
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    async function loadCategoryData() {
      setLoading(true);
      try {
        let data;
        if (category === "trending") {
          data = await getTrending(type, 'week', currentPage);
        } else {
          data = await getMediaList(type, category, currentPage);
        }
        const filtered = data.results.filter(item => item.poster_path);
        setItems(filtered);
        setTotalPages(data.total_pages > 500 ? 500 : data.total_pages);
      } catch (error) {
        console.error("Error loading category:", error);
      } finally {
        setLoading(false);
        window.scrollTo(0, 0);
      }
    }
    loadCategoryData();
  }, [type, category, currentPage]);

  // Center the active page in the scroll view
  useEffect(() => {
    if (scrollRef.current) {
      const activeBtn = scrollRef.current.querySelector(`[data-page="${currentPage}"]`);
      if (activeBtn) {
        activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [currentPage, loading]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setSearchParams({ page: newPage });
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen pt-28 md:pt-32 px-4 md:px-8 bg-[#121212] text-white">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-8 w-1.5 bg-red-600 rounded-full" />
          <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter">
            {category.replace('_', ' ')} 
            <span className="text-red-600 ml-3">{type === 'movie' ? 'Movies' : 'TV Shows'}</span>
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-6 pb-20">
        {items.map((item) => <SearchCard key={item.id} item={item} mediaType={type} />)}
        {items.length > 0 && <AdCard />}
      </div>

      {/* 🚀 NUMERICAL SCROLLABLE PAGINATION */}
      <div className="flex flex-col items-center gap-6 pb-24">
        <div className="flex items-center w-full max-w-2xl gap-2">
          
          {/* Previous Button */}
          <button 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex-shrink-0 p-3 bg-white/5 hover:bg-red-600 disabled:opacity-10 rounded-full transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
          </button>

          {/* Scrollable Numbers */}
          <div 
            ref={scrollRef}
            className="flex gap-2 overflow-x-auto py-2 px-1 no-scrollbar scroll-smooth mask-fade-edges"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {[...Array(totalPages)].map((_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  data-page={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`flex-shrink-0 w-10 h-10 rounded-lg font-bold text-sm transition-all border ${
                    currentPage === pageNum 
                    ? 'bg-red-600 border-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)]' 
                    : 'bg-white/5 border-white/5 text-gray-400 hover:border-white/20'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
                <style>{`

                .no-scrollbar::-webkit-scrollbar {
                  display: none;
                }
                .no-scrollbar {
                  -ms-overflow-style: none;
                  scrollbar-width: none;
                }
                `}</style>



          {/* Next Button */}
          <button 
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="flex-shrink-0 p-3 bg-white/5 hover:bg-red-600 disabled:opacity-10 rounded-full transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>

        <p className="text-[10px] text-gray-500 uppercase tracking-[0.4em] font-black">
          Jump to Page
        </p>
      </div>
    </div>
  );
}