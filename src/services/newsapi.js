export const getMovieNews = async () => {
  try {
    const res = await fetch("/.netlify/functions/news");

    if (!res.ok) {
      throw new Error("Failed to fetch news");
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }
};
