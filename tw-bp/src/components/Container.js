import React from 'react';

// helper to keep content a nice max-width

export function Container({ children }) {
  return <div className='container mx-auto space-y-2'>{children}</div>;
}
