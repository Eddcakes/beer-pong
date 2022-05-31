import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { Input } from './controls';
import { searchPages } from '../utils/searchPages';

/* bbc search bar spans full screen in a new area */
export function Search() {
  const [inputFocus, setInputFocus] = useState(false);
  const [searchText, setSearchText] = useState('');
  const handleInputFocus = (evt) => {
    if (!inputFocus) {
      return setInputFocus(true);
    }
  };
  const handleInputBlur = (evt) => {
    if (!evt.relatedTarget) {
      setInputFocus(false);
    }
  };

  const handleChange = (evt) => setSearchText(evt.target.value);

  const search = (items) => {
    return items.filter((page) => {
      const cleanText = searchText.trim().toLowerCase();
      const joined = page.matches.join(' ');
      // page.matches.find( match => match.indexOf(cleanText) > 1)
      return joined.indexOf(cleanText) > -1;
    });
  };
  return (
    <>
      <div className='flex flex-col relative max-w-md grow mx-4'>
        <Input
          placeholder='Search site...'
          type='search'
          value={searchText}
          onChange={handleChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
        />
        {inputFocus && searchText.length > 0 && (
          <Suggestions items={search(searchPages)} />
        )}
      </div>
    </>
  );
}

function Suggestions({ items }) {
  const [current, setCurrent] = useState(null);
  const handleHover = (evt) => {
    /* get index of the item with the link property */
    const itemIndex = items
      .map((props) => props.link)
      .indexOf(evt.target.getAttribute('data-path'));
    setCurrent(itemIndex);
  };
  useEffect(() => {
    const keyPressHandler = (evt) => {
      if (evt.key === 'ArrowDown') {
        evt.preventDefault();
        if (current === null) {
          setCurrent(0);
        } else {
          setCurrent(current >= items.length - 1 ? 0 : current + 1);
        }
      }
      if (evt.key === 'ArrowUp') {
        evt.preventDefault();
        if (current === null) {
          setCurrent(0);
        } else {
          setCurrent(current === 0 ? items.length - 1 : current - 1);
        }
      }
    };
    document.addEventListener('keydown', keyPressHandler);

    return () => {
      document.removeEventListener('keydown', keyPressHandler);
    };
  }, [current, items]);

  return (
    <div className='absolute shadow list-none bg-primary-background w-full top-full px-2 pt-2 z-10'>
      <h3 className='font-semibold text-center text-sm border-b pb-2'>
        Search for pages on this site
      </h3>
      <ul className='list-none'>
        {items?.length > 0 &&
          items.map((page, idx) => {
            return (
              <SearchItem
                key={`${page.matches.join('-')}${idx}`}
                item={page}
                handleHover={handleHover}
                active={current === idx}
              />
            );
          })}
      </ul>
    </div>
  );
}

function SearchItem({ item, active, handleHover }) {
  /* using ref to focus link, now we can click enter to open the focused link */
  const itemFocus = useRef(null);
  /*   useEffect(() => {
    if (itemFocus.current === null) return;
    itemFocus.current.focus();
  }, [active]); */
  return (
    <li>
      <Link
        onMouseOver={handleHover}
        className={`inline-block w-full h-full p-4 ${
          active && 'bg-sec-background'
        }`}
        to={`${item.link}`}
        data-path={item.link}
        ref={itemFocus}
      >
        {item.text}
      </Link>
    </li>
  );
}
