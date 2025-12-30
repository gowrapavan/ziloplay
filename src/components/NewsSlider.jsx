import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMovieNews } from "../services/newsapi";

export default function NewsSlider() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const articles = await getMovieNews();
      // We only need the top 10 for the home page slider
      setNews(articles.slice(0, 10));
      setLoading(false);
    }
    load();
  }, []);

  if (loading || news.length === 0) return null;

  return (
    <section className="my-12 px-4 md:px-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="h-8 w-1 bg-red-600 rounded-full" />
          <h2 className="text-2xl font-bold tracking-tight text-white">Latest Movie News</h2>
        </div>
        <Link 
          to="/news" 
          className="text-xs font-bold text-red-500 uppercase tracking-widest hover:text-red-400 transition-colors"
        >
          View All
        </Link>
      </div>

      {/* Horizontal Sliding Row */}
      <div className="flex overflow-x-auto gap-5 pb-6 scrollbar-hide snap-x">
        {news.map((article, index) => (
          <a
            key={index}
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 w-[280px] md:w-[350px] bg-[#161616] rounded-2xl overflow-hidden border border-white/5 hover:border-red-600/40 transition-all duration-300 snap-start group"
          >
            <div className="relative h-40 overflow-hidden">
              <img
                src={article.urlToImage}
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#161616] to-transparent opacity-60" />
              <span className="absolute bottom-3 left-3 bg-red-600 text-[9px] font-black px-2 py-0.5 rounded uppercase">
                {article.source.name}
              </span>
            </div>
            <div className="p-4">
              <h3 className="text-sm font-bold text-gray-100 line-clamp-2 group-hover:text-red-500 transition-colors leading-snug">
                {article.title}
              </h3>
              <p className="text-[11px] text-gray-500 mt-2 italic line-clamp-1">
                {new Date(article.publishedAt).toDateString()}
              </p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}