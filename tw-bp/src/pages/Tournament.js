import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

export function Tournament({ updatePageTitle }) {
  const { tournamentId } = useParams();
  useEffect(() => {
    updatePageTitle(`Tournament: ${tournamentId}`);
  }, [updatePageTitle, tournamentId]);
  return <div>tournament page {tournamentId}</div>;
}
