import { Link } from "react-router-dom";
import MediaCard from "./MediaCard";

export default function MediaRow({ title, items, mediaType, category }) {
  if (!items || !items.length) return null;

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between px-5 mb-5">
        <div className="flex items-center gap-3">
          <div className="h-7 w-1 bg-red-600 rounded-full" />
          <h2 className="text-xl md:text-2xl font-bold text-gray-200 uppercase tracking-tight">
            {title}
          </h2>
        </div>

{/* 🚀 Redesigned View All Button with Low Rounding */}
        {category && (
          <Link 
            to={`/category/${mediaType}/${category}`} 
            className="text-[10px] font-black text-white transition-all bg-white/5 hover:bg-red-600 px-4 py-2 rounded-sm uppercase tracking-[0.2em] border border-white/5 hover:border-red-600 active:scale-95 shadow-sm"
          >
            View All
          </Link>
        )}
      </div>

      <div className="flex overflow-x-auto gap-4 px-5 pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
        {items.map((item) => (
          <MediaCard key={item.id} item={item} mediaType={mediaType} />
        ))}
        <div className="flex-shrink-0 w-1"></div>
      </div>
    </section>
  );
}