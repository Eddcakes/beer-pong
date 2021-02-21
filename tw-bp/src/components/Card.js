import React from 'react';

export function Card({ title, children }) {
  return (
    <div className='bg-sec-background rounded-lg p-6 m-6'>
      <h2 className='text-3xl font-semibold text-left text-primary-text py-2'>
        {title}
      </h2>
      {children}
    </div>
  );
}
