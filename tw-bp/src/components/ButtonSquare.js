import React from 'react';

//assessibility concerns
export function ButtonSquare({
  text,
  handleClick = () => {},
  loading = false,
  props,
  children
}) {
  return (
    <button
      className={`g-transparent
      h-20
      w-20
      hover:bg-blue-300
      hover:border-blue-500
      active:bg-blue-400
      text-blue-700
      font-semibold
      hover:text-white
      active:text-white
      py-2
      px-4 
      border
      border-blue-500
      hover:border-transparent
      rounded
      border-b-4
      active:border-b
      active:mt-press
      focus:outline-none
      w-full
      md:w-auto
      text-xs
      `}
      onClick={handleClick}
      {...props}
    >
      {text}
    </button>
  );
}
