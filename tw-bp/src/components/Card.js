import React, { isValidElement } from 'react';

export function Card({ title, children }) {
  let renderTitle = null;
  /* allow using own component */
  if (typeof title === 'string') {
    renderTitle = (
      <h2 className='text-3xl font-semibold text-left text-primary-text py-2'>
        {title}
      </h2>
    );
  } else if (isValidElement(title)) {
    renderTitle = title;
  }
  return (
    <div className='bg-sec-background rounded-lg p-6 m-6'>
      <div>{renderTitle}</div>
      {children}
    </div>
  );
}
