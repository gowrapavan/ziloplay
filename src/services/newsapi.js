const NEWS_API_KEY = "348c01bb5c0749bc8484ae85138426b8";

/**
 * Fetches a large list of movie news using the 'everything' endpoint.
 */
export const getMovieNews = async () => {
  // Use 'everything' instead of 'top-headlines' for a much larger result set
  // pageSize=30 ensures we get at least 30 articles
  const url = `https://newsapi.org/v2/everything?q=movie+cinema+hollywood&language=en&sortBy=publishedAt&pageSize=30&apiKey=${NEWS_API_KEY}`;
  
  try {
    const res = await fetch(url);
    const data = await res.json();
    
    // Filter to ensure we only show valid articles with images and descriptions
    return data.articles?.filter(article => 
      article.title !== "[Removed]" && 
      article.urlToImage && 
      article.description
    ) || [];
  } catch (error) {
    console.error("Failed to fetch news:", error);
    return [];
  }
};