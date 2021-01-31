import React from 'react';

export function Card({ title, children }) {
  return (
    <div className='bg-sec-background rounded-lg p-6 m-6'>
      <h2 className='text-lg font-semibold text-left'>{title}</h2>
      {children}
    </div>
  );
}
