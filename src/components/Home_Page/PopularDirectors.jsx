import { useEffect, useState } from "react";
import { getPopularDirectors } from "../../services/api";
import Loader from "../Loader";
import ActorRow from "./ActorRow"; // reuse
import ActorCard from "./ActorCard"; // reuse

export default function PopularDirectors() {
  const [directors, setDirectors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getPopularDirectors();
        setDirectors(data);
      } catch (err) {
        console.error("Director fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <Loader />;

  return <ActorRow title="Popular Directors" actors={directors} />;
}
