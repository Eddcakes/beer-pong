import React from 'react';

import { useAuth } from '../hooks/useAuth';

export function Avatar() {
  const { user } = useAuth();
  return (
    <button className='border h-12 w-12 rounded-full m-1 p-3 border-blue-500 hover:bg-blue-900 focus:outline-none focus:shadow-outline overflow-hidden'>
      {user ? <div>T</div> : <div>F</div>}
    </button>
  );
}
