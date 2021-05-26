import React, { useState } from 'react';

//helper component to see all my theme options on any page
export function Swatch() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <div className='bg-white w-1/2 p-2 mx-4 text-center bottom-0 float-right sticky rounded-t-lg'>
      <button onClick={toggleOpen} className='w-full h-full'>
        {isOpen ? 'Hide swatch' : 'Show swatch'}
      </button>
      {isOpen ? (
        <div className='uppercase'>
          <div className='border-2 border-black overflow-x-hidden'>
            <div className='bg-primary p-2 truncate'>primary</div>
            <div className='bg-primary-light p-2 truncate'>primaryLight</div>
            <div className='bg-primary-active p-2 truncate'>primaryActive</div>
            <div className='bg-secondary p-2 truncate'>secondary</div>
            <div className='bg-positive p-2 truncate'>positive</div>
            <div className='bg-negative p-2 truncate'>negative</div>
            <div className='bg-primary-text p-2 truncate'>primaryText</div>
            <div className='bg-secondary-text-text p-2 truncate'>
              secondaryText
            </div>
            <div className='bg-link-text p-2 truncate'>linkText</div>
            <div className='bg-primary-background p-2 truncate'>
              primaryBackground
            </div>
            <div className='bg-sec-background p-2 truncate'>
              secondaryBackground
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
