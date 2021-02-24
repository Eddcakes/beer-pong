import React from 'react';
import { Decoration } from './Decoration';

export function Card({ title, children }) {
  return (
    <div className='bg-sec-background rounded-lg p-6 m-6'>
      <div className='inline-flex flex-col'>
        <Decoration />
        <h2 className='text-3xl font-semibold text-left text-primary-text py-2'>
          {title}
        </h2>
      </div>
      {children}
    </div>
  );
}
