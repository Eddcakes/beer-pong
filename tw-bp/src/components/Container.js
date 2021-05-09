import React from 'react';

// helper to keep content a nice max-width

export function Container({ maxW = '', maxH = '', children }) {
  return (
    <div className={`container mx-auto space-y-2 ${maxW} ${maxH}`}>
      {children}
    </div>
  );
}
