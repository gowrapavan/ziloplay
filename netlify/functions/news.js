export async function handler() {
  const url = `https://newsapi.org/v2/everything?q=movie+cinema+hollywood&language=en&sortBy=publishedAt&pageSize=30&apiKey=${process.env.NEWS_API_KEY}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    const filtered =
      data.articles?.filter(article =>
        article.title !== "[Removed]" &&
        article.urlToImage &&
        article.description
      ) || [];

    return {
      statusCode: 200,
      body: JSON.stringify(filtered),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify([]),
    };
  }
}
