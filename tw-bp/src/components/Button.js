import React from 'react';

//assessibility concerns
export function Button({
  text,
  handleClick = () => {},
  loading = false,
  ...props
}) {
  return (
    <button
      className={`g-transparent
      h-12
      hover:bg-primary-light
      hover:border-primary
      active:bg-primary-active
      text-primary-text
      font-semibold
      hover:text-white
      active:text-white
      py-2
      px-4 
      border
      border-primary
      rounded
      border-b-4
      active:border-b
      focus:outline-none
      w-full
      md:w-auto
      transform 
      duration-75
      ease-in-out
      active:scale-y-95
      origin-bottom
      select-none
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
