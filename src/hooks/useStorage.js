import { useState, useEffect } from "react";

export const useStorage = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [continueWatching, setContinueWatching] = useState([]);

  useEffect(() => {
    setWatchlist(JSON.parse(localStorage.getItem("zilo_watchlist") || "[]"));
    setContinueWatching(JSON.parse(localStorage.getItem("zilo_continue") || "[]"));
  }, []);

  // --- Watchlist Logic ---
  const toggleWatchlist = (item) => {
    const isSaved = watchlist.find((i) => i.id === item.id);
    const updated = isSaved ? watchlist.filter((i) => i.id !== item.id) : [...watchlist, item];
    setWatchlist(updated);
    localStorage.setItem("zilo_watchlist", JSON.stringify(updated));
  };

  // --- Continue Watching Logic ---
  const addToContinueWatching = (item) => {
    // Remove if already exists (to move it to the front/start of the list)
    const filtered = continueWatching.filter((i) => i.id !== item.id);
    const updated = [item, ...filtered].slice(0, 10); // Keep only top 10
    setContinueWatching(updated);
    localStorage.setItem("zilo_continue", JSON.stringify(updated));
  };

  return { 
    watchlist, toggleWatchlist, isInWatchlist: (id) => watchlist.some(i => i.id === id),
    continueWatching, addToContinueWatching 
  };
};