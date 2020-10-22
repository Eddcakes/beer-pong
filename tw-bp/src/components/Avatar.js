import React, { useState } from 'react';

// hook to check valid token?
export function Avatar() {
  const userToken = localStorage.getItem('tw-bp:jwt');
  const [loggedIn] = useState(validToken(userToken)); //setLoggedIn
  return (
    <button className='border h-12 w-12 rounded-full m-1 p-3 border-blue-500 hover:bg-blue-900 focus:outline-none focus:shadow-outline overflow-hidden'>
      {loggedIn ? <div>T</div> : <div>F</div>}
    </button>
  );
}

function validToken(userToken) {
  //do something with token
  if (userToken === null) {
    return false;
  }
  return true;
}
