import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { useQuery } from 'react-query';
import gfm from 'remark-gfm';

/* news & pinned news, events? */
import { PinnedNews } from './PinnedNews';
import { fetchNews } from '../queries';

const maxHeight = {
  small: { size: '10rem', class: 'max-h-40', value: 160 },
  medium: { size: '16rem', class: 'max-h-64', value: 256 },
  large: { size: '20rem', class: 'max-h-80', value: 320 },
  xlarge: { size: '24rem', class: 'max-h-96', value: 384 },
};

export function News() {
  const { isLoading, error, data } = useQuery('news', fetchNews);
  if (error) {
    return (
      <>
        <span>Error loading news...</span>
      </>
    );
  }
  if (isLoading) {
    return (
      <>
        <span>Loading news...</span>
      </>
    );
  }
  return (
    <>
      <PinnedNews />
      {data.map((article) => {
        return (
          <ClipNews
            key={article.id}
            content={article.content}
            size={maxHeight.large}
          />
        );
      })}
    </>
  );
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
        ${!showExpand && 'border-b'}
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
