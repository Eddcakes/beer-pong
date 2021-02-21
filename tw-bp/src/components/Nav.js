import React from 'react';
import { NavLink, useHistory, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/* uld like to break nav down for mobile view 
  have bottom nav similar to Youtube mobile
  keep logo/search/profile icon in the header
*/
export function Nav() {
  const location = useLocation();
  const history = useHistory();
  const auth = useAuth();

  const handleSignOut = () => {
    auth.signOut();
    history.push(location.pathname);
    // if its a protected route redirect should activate anyway
    //send toast?
  };
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
        <li className='w-full'>
          <StyledNavLink to={'/settings'} text='Settings' />
        </li>
        {auth.user != null ? (
          <li className='w-full'>
            <button
              className='p-2 hover:text-primary inline-block w-full'
              onClick={handleSignOut}
            >
              Sign out
            </button>
          </li>
        ) : (
          <li className='w-full'>
            <StyledNavLink to={'/signin'} text='Sign in' />
          </li>
        )}
      </ul>
    </nav>
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
