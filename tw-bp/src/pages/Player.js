import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';

import { Header, Container, PlayerDetails } from '../components';
import { usePageTitle } from '../hooks/usePageTitle';
import { fetchPlayerById } from '../queries';

export function Player() {
  const { playerId } = useParams();
  const { data, isLoading } = useQuery(['player', playerId], () =>
    fetchPlayerById(playerId)
  );
  usePageTitle(`Player: ${playerId}`);
  return (
    <>
      <Header />
      <Container maxW='max-w-screen-md'>
        <div className='p-6 space-y-4'>
          {playerId ? (
            isLoading ? (
              'loading...'
            ) : data.length > 0 ? (
              <PlayerDetails playerId={playerId} />
            ) : (
              'This player does not exist!'
            )
          ) : (
            'player list?'
          )}
        </div>
      </Container>
    </>
  );
}
