import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';

import {
  Container,
  Header,
  TournamentList,
  TournamentDetail,
} from '../components';
import { usePageTitle } from '../hooks/usePageTitle';
import { fetchTournamentById } from '../queries';

export function Tournament() {
  const { tournamentId } = useParams();
  usePageTitle(`Tournament ${tournamentId ? `: ${tournamentId}` : 'list'}`);
  const { data, isLoading } = useQuery(['tournamentsById', tournamentId], () =>
    fetchTournamentById(tournamentId)
  );
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
