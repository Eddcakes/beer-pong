import { useQuery } from 'react-query';

import { fetchGamesByTournamentId, fetchTournamentById } from '../../queries';
import { MatchGrid } from '../index';

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
          <TournamentInfo tournament={tournament[0]} />
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
    <div>
      <h2>{tournament.title}</h2>
      <h2>{tournament.venue_title}</h2>
      <div>{tournament.date}</div>
    </div>
  );
}

function TournamentGames({ id }) {
  const { data: games, isLoading: isLoadingGames } = useQuery(
    ['gamesByTournamentId', id],
    () => fetchGamesByTournamentId(id)
  );
  return (
    <>
      <h2 className='text-lg'>Games</h2>
      {isLoadingGames && <div>loading games...</div>}
      {!isLoadingGames && <MatchGrid games={games} />}
    </>
  );
}
