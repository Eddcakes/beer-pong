import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Header,
  TournamentList,
  TournamentDetail,
} from '../components';

export function Tournament({ updatePageTitle }) {
  const { tournamentId } = useParams();

  useEffect(() => {
    updatePageTitle(`Tournament: ${tournamentId}`);
  }, [updatePageTitle, tournamentId]);
  return (
    <>
      <Header />
      <Container>
        {tournamentId ? (
          <TournamentDetail id={tournamentId} />
        ) : (
          <TournamentList />
        )}
      </Container>
    </>
  );
}

/* 
New tournament or new game button should look like this Group-hover element
https://tailwindcss.com/docs/pseudo-class-variants
*/
