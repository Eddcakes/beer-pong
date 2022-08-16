import { useQuery } from 'react-query';

import { fetchGamesByTournamentId, fetchTournamentById } from '../../queries';
import { MatchGrid, Card } from '../index';
import { Group } from './Group';

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

function TournamentGames({ id }) {
  const { data: games, isLoading: isLoadingGames } = useQuery(
    ['gamesByTournamentId', id],
    () => fetchGamesByTournamentId(id)
  );
  const gamesByStages = groupByStage(games);
  /* do we want to split these, so can have seperate group stage
  final stage */
  return (
    <div className='space-y-4'>
      {isLoadingGames && <div>loading games...</div>}
      {gamesByStages?.group1 && (
        <Group details={gamesByStages?.group1} title='group1' />
      )}
      {gamesByStages?.group2 && (
        <Group details={gamesByStages?.group2} title='group2' />
      )}
      {!isLoadingGames && <MatchGrid games={games} />}
    </div>
  );
}

function groupByStage(games) {
  if (games == null) return {};
  let stages = {};
  let seen = [];
  games.forEach((game) => {
    if (seen.includes(game.stage)) {
      stages[game.stage].push(game);
    } else {
      seen.push(game.stage);
      stages[game.stage] = [game];
    }
  });
  return stages;
}
