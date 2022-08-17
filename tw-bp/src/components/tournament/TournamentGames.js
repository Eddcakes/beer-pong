import { useQuery } from 'react-query';

import { fetchGamesByTournamentId } from '../../queries';
import { MatchGrid } from '../MatchGrid';
import { Group } from './Group';

export function TournamentGames({ id }) {
  const { data: games, isLoading: isLoadingGames } = useQuery(
    ['gamesByTournamentId', id],
    () => fetchGamesByTournamentId(id)
  );
  const gamesByStages = groupByStage(games);
  const groupGames = Object.keys(gamesByStages).filter((stage) =>
    stage.includes('group')
  );
  return (
    <div className='space-y-4'>
      {isLoadingGames && <div>loading games...</div>}
      {groupGames.map((key) => {
        return <Group details={gamesByStages[key]} title={key} />;
      })}
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
