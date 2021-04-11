import { useState, useEffect } from 'react';
import { NavLink, useHistory, useLocation } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth';

export function Menu() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);
  const location = useLocation();
  const history = useHistory();
  const auth = useAuth();

  const handleSignOut = () => {
    auth.signOut();
    closeMenu();
    history.push(location.pathname);
    // if its a protected route redirect should activate anyway
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
        className={`
      h-12
      w-12
      rounded-full
      border
      focus:outline-none
      mr-4
      z-20
      relative`}
        onClick={toggleMenu}
      >
        {auth.user ? <span>T</span> : <span>F</span>}
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