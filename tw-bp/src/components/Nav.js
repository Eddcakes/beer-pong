import React from 'react';
import { NavLink } from 'react-router-dom';
import AuthContext from '../AuthContext';

/* uld like to break nav down for mobile view 
  have bottom nav similar to Youtube mobile
  keep logo/search/profile icon in the header
*/
export function Nav() {
  return (
    <nav className='text-center border-b-2'>
      <ul className='flex flex-row justify-between'>
        <li className='w-full'>
          <NavLink
            to={'/'}
            activeStyle={{ fontWeight: 'bold' }}
            exact
            className='p-2 hover:bg-secondary inline-block w-full'
          >
            Home
          </NavLink>
        </li>
        <li className='w-full'>
          <NavLink
            to={'/player'}
            activeStyle={{ fontWeight: 'bold' }}
            className='p-2 hover:bg-secondary inline-block w-full'
          >
            Player details
          </NavLink>
        </li>
        <li className='w-full'>
          <NavLink
            to={'/versus'}
            activeStyle={{ fontWeight: 'bold' }}
            className='p-2 hover:bg-secondary inline-block w-full'
          >
            Versus
          </NavLink>
        </li>
        <li className='w-full'>
          <NavLink
            to={'/settings'}
            activeStyle={{ fontWeight: 'bold' }}
            className='p-2 hover:bg-secondary inline-block w-full'
          >
            Settings
          </NavLink>
        </li>
        <AuthContext.Consumer>
          {({ user, signOut }) =>
            user === null || user === undefined ? (
              <li className='w-full'>
                <NavLink
                  to={'/signin'}
                  activeStyle={{ fontWeight: 'bold' }}
                  className='p-2 hover:bg-secondary inline-block w-full'
                >
                  Sign in
                </NavLink>
              </li>
            ) : (
              <li className='w-full'>
                <button
                  className='p-2 hover:bg-secondary inline-block w-full'
                  onClick={signOut}
                >
                  Sign out
                </button>
              </li>
            )
          }
        </AuthContext.Consumer>
      </ul>
    </nav>
  );
}
