import React from 'react';

export function Swatch() {
  return (
    <div className='bg-white m-2 p-6 uppercase text-center'>
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
  );
}
