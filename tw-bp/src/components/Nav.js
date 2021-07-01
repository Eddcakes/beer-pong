import React from 'react';
import { NavLink } from 'react-router-dom';

import { useWindowSize } from '../hooks/useWindowSize';
import { Divider } from './layout';

/* uld like to break nav down for mobile view 
  have bottom nav similar to Youtube mobile
  keep logo/search/profile icon in the header
*/
export function Nav() {
  let size = useWindowSize();

  if (size.width > 640) {
    return (
      <div className='w-96'>
        <nav className='text-center font-mono'>
          <ul className='flex flex-row'>
            <li className='w-full'>
              <StyledNavLink to={'/'} exact text='Home' />
            </li>
            <li className='w-full'>
              <StyledNavLink to={'/games'} text='Games' />
            </li>
            <li className='w-full'>
              <StyledNavLink to={'/versus'} text='Versus' />
            </li>
          </ul>
        </nav>
      </div>
    );
  }
  return (
    <div className='fixed bottom-0 w-full bg-primary-background z-10'>
      <Divider />
      <nav className='text-center py-4 font-mono flex justify-center items-center'>
        <ul className='flex flex-row justify-between w-full'>
          <li className='w-full'>
            <StyledNavLink to={'/'} exact text='Home' />
          </li>
          <li className='w-full'>
            <StyledNavLink to={'/games'} text='Games' />
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
      className='p-2 font-bold text-xl uppercase inline-block w-full hover:text-primary border-b-4 border-opacity-0'
    >
      {text}
    </NavLink>
  );
};
