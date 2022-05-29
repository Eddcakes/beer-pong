import React, { useEffect } from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';

import {
  Container,
  Header,
  TournamentList,
  TournamentDetail,
} from '../components';
import { fetchTournamentById } from '../queries';

export function Tournament({ updatePageTitle }) {
  const { tournamentId } = useParams();
  const { data, isLoading } = useQuery(['tournamentsById', tournamentId], () =>
    fetchTournamentById(tournamentId)
  );

  useEffect(() => {
    updatePageTitle(`Tournament: ${tournamentId}`);
  }, [updatePageTitle, tournamentId]);
  return (
    <>
      <Header />
      <Container>
        {tournamentId ? (
          isLoading ? (
            'loading...'
          ) : data.length > 0 ? (
            <TournamentDetail id={tournamentId} />
          ) : (
            'This tournament does not exist!'
          )
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
