import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';

import { PlayerOverview, MatchGrid } from '../components';
import {
  fetchNicksByPlayerId,
  fetchPlayerById,
  fetchPlayerOverview,
  fetchRecentGamesByPlayerId,
  fetchRecordsByPlayerId,
} from '../queries';

export function PlayerDetails({ playerId }) {
  // const { isLoading, error, data } = useQuery('games', fetchGames);
  const player = useQuery(['player', playerId], () =>
    fetchPlayerById(playerId)
  );
  const overview = useQuery(['overview', playerId], () =>
    fetchPlayerOverview(playerId)
  );
  const records = useQuery(['records', playerId], () =>
    fetchRecordsByPlayerId(playerId)
  );
  const nicks = useQuery(['nicks', playerId], () =>
    fetchNicksByPlayerId(playerId)
  );
  const recentGames = useQuery(['recentGames', playerId], () =>
    fetchRecentGamesByPlayerId(playerId)
  );

  return (
    <>
      <div className='grid grid-cols-6 grid-rows-2 gap-2'>
        <h2 className='text-xl font-bold bg-primary text-secondary-text px-4 py-2 col-span-2'>
          {!player.isLoading && player?.data[0].name}
        </h2>
        <Link
          to={`/versus/${playerId}`}
          className='px-4 py-2 text-link-text underline'
        >
          Compare!
        </Link>
        {!nicks.isLoading && !player.isLoading && (
          <>
            <span className='row-start-2 col-start-2 px-4'>nicks</span>
            <ul className='row-start-2 col-start-3'>
              {nicks?.data
                .filter((name) => name.nick !== player.data[0].name)
                .map((nick) => {
                  return <li key={`${nick.nick}${nick.id}`}>{nick.nick}</li>;
                })}
            </ul>
          </>
        )}
      </div>
      <h2 className='text-lg font-bold'>Overview</h2>
      {!overview.isLoading && <PlayerOverview details={overview.data} />}
      {!recentGames.isLoading && (
        <>
          <h2 className='text-lg font-bold'>Recent games</h2>
          <MatchGrid games={recentGames.data} />
        </>
      )}
      {!records.isLoading && records?.data.length > 0 && (
        <>
          <h2 className='text-lg font-bold'>Accolades</h2>
          {records?.data.map((record) => {
            return <div key={record.id}>{record.label}🥇</div>;
          })}
        </>
      )}
    </>
  );
}
