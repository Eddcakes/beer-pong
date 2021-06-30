import React from 'react';
import { Link } from 'react-router-dom';

//accessibility  concerns
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
  fullWidth = false,
  text,
  handleClick = () => {},
  loading = false,
  to,
  disabled = false,
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
  const squareClasses = `
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
  disabled:cursor-not-allowed
  disabled:bg-primary-active
  disabled:border-primary-active
  disabled:text-white
  disabled:scale-y-95
  `;
  const regularClasses = `
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
  ${!fullWidth && 'md:w-auto'}
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
  disabled:cursor-not-allowed
  disabled:bg-primary-active
  disabled:border-primary-active
  disabled:text-white
  disabled:scale-y-95
  `;
  if (to) {
    return (
      <LinkAsButton
        to={to}
        classes={
          variant === buttonVariant.square ? squareClasses : regularClasses
        }
        square={variant === buttonVariant.square}
        text={text}
      />
    );
  }
  if (variant === buttonVariant.square) {
    return (
      <button
        className={squareClasses}
        onClick={handleClick}
        disabled={disabled}
        {...props}
      >
        <span className='items-center text-center pointer-events-none'>
          {text}
        </span>
      </button>
    );
  }
  return (
    <button
      className={regularClasses}
      onClick={handleClick}
      disabled={disabled}
      {...props}
    >
      {text}
    </button>
  );
}

function LinkAsButton({ to, classes, text, square }) {
  if (square) {
    return (
      <Link className={`${classes} inline-block`} to={to}>
        <span className='items-center text-center'>{text}</span>
      </Link>
    );
  }
  return (
    <Link className={`${classes} inline-block`} to={to}>
      {text}
    </Link>
  );
}

/* 
tailwind config
added active for scale, border, margin
added press for spacing (3px)
as border width is in px but spacing all defined in rem we couldnt get exact
added disabled
*/

/*
Picture button
<span> background image </span> absolute 
<span> background mask color </span>
<span> <span>text</span> <span>icon</span> </span> flex
*/
