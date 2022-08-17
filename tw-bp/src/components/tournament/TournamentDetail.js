import { useQuery } from 'react-query';

import { fetchTournamentById } from '../../queries';
import { Card } from '../index';
import { TournamentGames } from './TournamentGames';

export function TournamentDetail({ id }) {
  const {
    data: tournament,
    isLoading: isLoadingTournament,
    isError: tournamentError,
  } = useQuery(['tournamentsById', id], () => fetchTournamentById(id));

  if (tournament?.error) {
    return <div>{tournament.message}</div>;
  }
  return (
    <div>
      {isLoadingTournament ? (
        <div>Loading details...</div>
      ) : tournament.length > 0 ? (
        <div>
          <div className='mb-4'>
            <TournamentInfo tournament={tournament[0]} />
          </div>
          <TournamentGames id={id} />
        </div>
      ) : (
        <div>Tournament does not exist</div>
      )}
      {tournamentError && <div>Error trying to fetch tournament {id}</div>}
    </div>
  );
}

function TournamentInfo({ tournament }) {
  return (
    <Card title={tournament.title}>
      <div>
        <h2>{tournament.venue_title}</h2>
        <div>{tournament.date}</div>
        <div>num of participants</div>
        <div>tournament stages (groups into single elim)</div>
      </div>
    </Card>
  );
}
