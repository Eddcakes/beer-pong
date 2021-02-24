import React from 'react';
import { NavLink } from 'react-router-dom';

import { useWindowSize } from '../hooks/useWindowSize';

/* uld like to break nav down for mobile view 
  have bottom nav similar to Youtube mobile
  keep logo/search/profile icon in the header
*/
export function Nav() {
  let size = useWindowSize();

  if (size.width > 640) {
    return (
      <nav className='text-center border-b-2 py-6 font-mono'>
        <ul className='flex flex-row justify-between'>
          <li className='w-full'>
            <StyledNavLink to={'/'} exact text='Home' />
          </li>
          <li className='w-full'>
            <StyledNavLink to={'/player'} text='Players' />
          </li>
          <li className='w-full'>
            <StyledNavLink to={'/versus'} text='Versus' />
          </li>
        </ul>
      </nav>
    );
  }
  return (
    <div className='fixed bottom-0 w-full'>
      <nav className='text-center border-b-2 py-6 font-mono flex justify-center items-center'>
        <ul className='flex flex-row justify-between w-full'>
          <li className='w-full'>
            <StyledNavLink to={'/'} exact text='Home' />
          </li>
          <li className='w-full'>
            <StyledNavLink to={'/player'} text='Players' />
          </li>
          <li className='w-full'>
            <StyledNavLink to={'/versus'} text='Versus' />
          </li>
        </ul>
      </nav>
    </div>
  );
}

const StyledNavLink = ({ to, text, exact = false }) => {
  return (
    <NavLink
      to={to}
      exact={exact}
      activeClassName='text-primary border-b-4 border-solid border-primary'
      className='p-2 font-bold text-xl uppercase inline-block w-full hover:text-primary'
    >
      {text}
    </NavLink>
  );
};
