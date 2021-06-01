export async function fetchNews() {
  const news = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/news/`);
  const resp = await news.json();
  return resp;
}
