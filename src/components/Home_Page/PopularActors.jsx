import { useEffect, useState } from "react";
import { getPopularActors } from "../../services/api";
import Loader from "../Loader";
import ActorRow from "./ActorRow";

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

  return <ActorRow title="Popular Actors" actors={actors} />;
}
