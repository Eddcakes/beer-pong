import React, { useState } from 'react';

//helper component to see all my theme options on any page
export function Swatch() {
  const [isOpen, setIsOpen] = useState(true);
  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <div className='bg-white w-1/2 p-2 m-4 text-center bottom-0 float-right sticky rounded-t-lg'>
      <button onClick={toggleOpen}>
        {isOpen ? 'Hide swatch' : 'Show swatch'}
      </button>
      {isOpen ? (
        <div className='uppercase'>
          <div className='border-2 border-black'>
            <div className='bg-primary p-2'>primary</div>
            <div className='bg-secondary p-2'>secondary</div>
            <div className='bg-negative p-2'>negative</div>
            <div className='bg-positive p-2'>positive</div>
            <div className='bg-primary-text p-2'>primaryText</div>
            <div className='bg-primary-background p-2'>primaryBackground</div>
            <div className='bg-sec-background p-2'>secondaryBackground</div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
