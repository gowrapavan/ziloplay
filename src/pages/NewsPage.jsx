import { useEffect, useState } from "react";
import { getMovieNews } from "../services/newsapi";
import Loader from "../components/Loader";

export default function NewsPage() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Latest Movie News - Ziloplay";
    async function load() {
      const articles = await getMovieNews();
      setNews(articles);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-28 px-5 pb-20">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black mb-4">Latest Headlines</h1>
          <div className="h-1 w-20 bg-red-600 rounded-full" />
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.map((article, index) => (
            <a 
              href={article.url} 
              target="_blank" 
              rel="noopener noreferrer"
              key={index} 
              className="group bg-[#161616] rounded-3xl overflow-hidden border border-white/5 hover:border-red-600/50 transition-all duration-300 shadow-xl flex flex-col"
            >
              <div className="relative h-52 overflow-hidden">
                <img 
                  src={article.urlToImage} 
                  alt={article.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-red-600 text-[10px] font-black px-2 py-1 rounded uppercase tracking-tighter">
                  {article.source.name}
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <span className="text-gray-500 text-[10px] uppercase font-bold tracking-widest mb-2">
                  {new Date(article.publishedAt).toLocaleDateString()}
                </span>
                <h2 className="text-xl font-bold leading-tight mb-3 group-hover:text-red-500 transition-colors line-clamp-2">
                  {article.title}
                </h2>
                <p className="text-gray-400 text-sm line-clamp-3 mb-4 italic">
                  {article.description}
                </p>
                <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-300">Read Full Article</span>
                  <svg className="w-4 h-4 text-red-600 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}