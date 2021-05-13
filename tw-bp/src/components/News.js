import { useState, useEffect } from 'react';
/* news & pinned news, events? */
import { PinnedNews } from './PinnedNews';

export function News() {
  const [newsData, setNewsData] = useState();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function fetchData() {
      try {
        const news = await fetchNews();
        console.log(news);
        setNewsData(news);
        setLoading(false);
      } catch (err) {
        console.error('cannot get news', err);
      }
    }
    fetchData();
  }, []);
  if (loading) {
    return (
      <>
        <span>Loading news...</span>
      </>
    );
  }
  return (
    <>
      <PinnedNews />
      <section>Grab news {newsData.length}</section>
    </>
  );
}

async function fetchNews() {
  const news = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/news/`);
  const resp = await news.json();
  return resp;
}
