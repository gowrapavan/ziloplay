import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPopularActors, PROFILE_IMG_BASE_URL } from "../../services/api";
import Loader from "../Loader";

export default function PopularActors() {
  const [actors, setActors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getPopularActors();
        setActors(data);
      } catch (err) {
        console.error("Actor fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <Loader />;

  return (
    <section className="mt-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 px-2">
        <h2 className="text-3xl font-bold tracking-tight">Popular Actors</h2>
        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
          Trending Faces
        </span>
      </div>

      {/* Scroll Row */}
      <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide px-2">
        {actors.map(actor => (
          <Link
            key={actor.id}
            to={`/actor/${actor.id}`}
            className="group flex-shrink-0 w-36 md:w-48"
          >
            <div className="relative overflow-hidden rounded-2xl shadow-xl ring-1 ring-white/10">
              <img
                src={
                  actor.profile_path
                    ? `${PROFILE_IMG_BASE_URL}${actor.profile_path}`
                    : "https://placehold.co/300x450/111827/9ca3af?text=No+Image"
                }
                alt={actor.name}
                className="w-full h-full object-cover aspect-[2/3] group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            <h3 className="mt-3 text-sm font-bold text-center group-hover:text-red-500 transition-colors line-clamp-1">
              {actor.name}
            </h3>

            {actor.known_for_department && (
              <p className="text-[10px] text-gray-500 text-center uppercase tracking-widest">
                {actor.known_for_department}
              </p>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
