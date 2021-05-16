import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
/* news & pinned news, events? */
import { PinnedNews } from './PinnedNews';

const maxHeight = {
  small: { size: '10rem', class: 'max-h-40', value: 160 },
  medium: { size: '16rem', class: 'max-h-64', value: 256 },
  large: { size: '20rem', class: 'max-h-80', value: 320 },
  xlarge: { size: '24rem', class: 'max-h-96', value: 384 },
};

export function News() {
  const [newsData, setNewsData] = useState();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function fetchData() {
      try {
        const news = await fetchNews();
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
          <ClipNews
            key={article.news_ID}
            content={article.content}
            size={maxHeight.large}
          />
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

/* create an extension panel? or link to news page */

function ClipNews({ size = maxHeight.large, content }) {
  const clipRef = useRef(null);
  // if content is bigger than size then overflow hidden and button to expand
  const [showExpand, setShowExpand] = useState(false);
  const [expand, setExpand] = useState(false);
  const toggleExpand = () => setExpand(!expand);
  useEffect(() => {
    if (clipRef.current === null) return;
    const refHeight = clipRef.current.getBoundingClientRect().height;
    if (refHeight >= size.value) {
      setShowExpand(true);
      console.log('show expanded');
    }
  }, [size.value]);
  return (
    <>
      <section
        ref={clipRef}
        className={`prose lg:prose-xl 
        overflow-hidden
        transition-all
        duration-700
        ${size.class}
        ${expand && 'max-h-full'}
        ${showExpand && !expand && 'mask-bottom-transparent'}
        `}
      >
        <ReactMarkdown remarkPlugins={[gfm]}>{content}</ReactMarkdown>
      </section>
      {showExpand ? (
        <div
          className='text-center text-link-text underline border-b mb-4 pb-2'
          onClick={toggleExpand}
        >
          {!expand ? 'Read more 🔽' : 'Read less 🔼'}
        </div>
      ) : null}
    </>
  );
}
