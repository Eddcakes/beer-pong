import React from 'react';

//assessibility concerns
export const buttonVariant = {
  square: 'square',
  regular: 'regular',
};

export const buttonColor = {
  outlined: 'outlined',
  primary: 'primary',
  secondary: 'secondary',
};

export function Button({
  variant = 'regular',
  color = 'primary',
  text,
  handleClick = () => {},
  loading = false,
  ...props
}) {
  let customisations = {
    bg: 'bg-primary',
    text: 'text-secondary-text',
    borderColor: 'border-primary-light',
    hoverBg: 'hover:bg-primary-light',
    hoverBorder: 'hover:border-primary-active',
    hoverText: 'hover:text-white',
    activeBg: 'active:bg-primary-active',
    activeText: 'active:text-white',
  };
  switch (color) {
    case buttonColor.primary:
      customisations = {
        ...customisations,
        bg: 'bg-primary',
        text: 'text-secondary-text',
        borderColor: 'border-primary-light',
        hoverBg: 'hover:bg-primary-light',
        hoverBorder: 'hover:border-primary-active',
        hoverText: 'hover:text-white',
        activeBg: 'active:bg-primary-active',
        activeText: 'active:text-white',
      };
      break;
    case buttonColor.outlined:
      customisations = {
        ...customisations,
        bg: 'bg-transparent',
        text: 'text-primary-text',
      };
      break;
    case buttonColor.secondary:
      customisations = {
        ...customisations,
        bg: 'bg-secondary',
      };
      break;
    default:
    //customisations already set
  }

  if (variant === buttonVariant.square) {
    return (
      <button
        className={`
      h-28
      w-28
      ${customisations.bg}
      ${customisations.text}
      font-semibold
      py-2
      px-4 
      border
      ${customisations.borderColor}
      border-b-4 
      rounded
      select-none
      origin-bottom
      transform      
      duration-75
      ease-in-out
      active:scale-y-95
      ${customisations.hoverBg}
      ${customisations.hoverBorder}
      ${customisations.hoverText}
      ${customisations.activeBg}
      ${customisations.activeText}
      active:border-b
      focus:outline-none
      `}
        onClick={handleClick}
        {...props}
      >
        <span className='items-center text-center'>{text}</span>
      </button>
    );
  }
  return (
    <button
      className={`
      h-12
      font-semibold
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
      ${customisations.bg}
      ${customisations.text}
      ${customisations.borderColor}
      ${customisations.hoverBg}
      ${customisations.hoverBorder}
      ${customisations.hoverText}
      ${customisations.activeBg}
      ${customisations.activeText}
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

/*
Picture button
<span> background image </span> absolute 
<span> background mask color </span>
<span> <span>text</span> <span>icon</span> </span> flex
*/
