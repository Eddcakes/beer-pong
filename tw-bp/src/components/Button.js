import React from 'react';

//assessibility concerns
export function Button({
  text,
  handleClick = () => {},
  loading = false,
  props,
}) {
  return (
    <button
      className={`g-transparent
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
      `}
      onClick={handleClick}
      {...props}
    >
      {text}
    </button>
  );
}

/* 
tailwind config
added active for scale, border, margin
added press for spacing (3px)
as border width is in px but spacing all defined in rem we couldnt get exact
*/
