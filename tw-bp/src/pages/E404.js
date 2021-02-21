import React, { useEffect } from 'react';
import { Header } from '../components';

export function E404({ updatePageTitle }) {
  useEffect(() => {
    updatePageTitle('Error 404 page was not found');
  });
  return (
    <>
      <Header />
      <div className='h-full'>E404 page not found</div>
    </>
  );
}
