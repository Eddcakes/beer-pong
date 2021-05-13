import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
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
      {newsData.map((article) => {
        return (
          <section key={article.news_ID} className='prose lg:prose-xl'>
            <ReactMarkdown remarkPlugins={[gfm]}>
              {article.content}
            </ReactMarkdown>
          </section>
        );
      })}
    </>
  );
}

async function fetchNews() {
  const news = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/news/`);
  const resp = await news.json();
  return resp;
}
