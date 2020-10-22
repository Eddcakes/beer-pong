import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Nav } from '../components';

export function Tournament({ updatePageTitle }) {
  const { tournamentId } = useParams();
  useEffect(() => {
    updatePageTitle(`Tournament: ${tournamentId}`);
  }, [updatePageTitle, tournamentId]);
  return (
    <>
      <Nav />
      <div>tournament page {tournamentId}</div>
    </>
  );
}

/* 
New tournament or new game button should look like this Group-hover element
https://tailwindcss.com/docs/pseudo-class-variants
*/
