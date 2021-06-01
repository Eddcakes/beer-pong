import React from 'react';

// helper to keep content a nice max-width

export function Container({ maxW = '', maxH = '', children }) {
  return (
    <div className={`container mx-auto p-6 space-y-4 ${maxW} ${maxH}`}>
      {children}
    </div>
  );
}
