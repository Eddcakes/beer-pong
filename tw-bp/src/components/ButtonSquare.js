import React from 'react';

//assessibility concerns
export function ButtonSquare({
  text,
  handleClick = () => {},
  loading = false,
}) {
  return (
    <button
      className={`g-transparent
      h-28
      w-28
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
      focus:outline-none
      md:w-auto
      transform 
      duration-75
      ease-in-out
      active:scale-y-95
      origin-bottom
      select-none
      `}
      onClick={handleClick}
    >
      <div className='items-center text-center'>{text}</div>
    </button>
  );
}

/*
Picture button
<span> background image </span> absolute 
<span> background mask color </span>
<span> <span>text</span> <span>icon</span> </span> flex
*/
