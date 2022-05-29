import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

import { ChevronDown } from '../icons';
import { useAuth } from '../hooks/useAuth';

/* i think i prefer github version of opening up a drawer to cover the entire right side. currently bit janky when removes scroll bar */

export function Menu() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);
  const navigate = useNavigate();
  const auth = useAuth();

  const handleSignOut = () => {
    auth.signOut();
    closeMenu();
    navigate(0);
    //send toast?
  };
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => (document.body.style.overflow = '');
  }, [isOpen]);
  return (
    <div>
      <button
        aria-label='site-menu'
        className={`
      h-16
      w-16
      rounded-full
      border
      focus:outline-none
      mr-4
      z-20
      relative
      grid
      items-center
      justify-center
      transition
      duration-500
      ease-in-out
      ${auth.user ? 'bg-positive' : 'bg-negative'}       
      `}
        onClick={toggleMenu}
      >
        <ChevronDown />
      </button>
      {isOpen && (
        <>
          <button
            className='bg-gray-500 opacity-75 cursor-default fixed top-0 left-0 right-0 bottom-0 h-full w-full z-10 outline-none'
            tabIndex='-1'
            onClick={closeMenu}
          />
          <div
            className={`
              absolute
              right-0
              w-72
              my-1
              z-20
              border
              bg-primary-background`}
          >
            <ul>
              <MenuItem>
                <NavLink to='/settings' className=' inline-block p-2 w-full'>
                  Preferences
                </NavLink>
              </MenuItem>
              <MenuSpacer />
              {auth.user ? (
                <MenuItem>
                  <button
                    className='font-semibold w-full p-2 text-left'
                    onClick={handleSignOut}
                  >
                    Sign out
                  </button>
                </MenuItem>
              ) : (
                <MenuItem>
                  <NavLink className='w-full inline-block p-2' to='/signin'>
                    Sign in
                  </NavLink>
                </MenuItem>
              )}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

function MenuItem({ children }) {
  return (
    <li className='hover:bg-sec-background cursor-pointer hover:text-primary font-semibold'>
      {children}
    </li>
  );
}
function MenuSpacer() {
  return <li className='border-b-4'></li>;
}
