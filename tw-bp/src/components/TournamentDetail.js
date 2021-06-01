import { useQuery } from 'react-query';
import { fetchGamesByTournamentId, fetchTournamentById } from '../queries';
import { MatchGrid } from './MatchGrid';

export function TournamentDetail({ id }) {
  const { data: games, isLoading: isLoadingGames } = useQuery(
    ['gamesByTournamentId', id],
    () => fetchGamesByTournamentId(id)
  );
  const { data: tournament, isLoading: isLoadingTournament } = useQuery(
    ['tournamentsById', id],
    () => fetchTournamentById(id)
  );

  const isLoading = isLoadingGames || isLoadingTournament;
  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <div>This is Tournament: {id}</div>
      <>
        <div>
          details:
          <pre>{JSON.stringify(tournament, null, 2)}</pre>
        </div>
        <>
          <h2 className='text-lg'>Games</h2>
          <MatchGrid games={games} />
        </>
      </>
    </div>
  );
}
