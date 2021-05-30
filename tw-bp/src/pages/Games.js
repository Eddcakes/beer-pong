import { useEffect } from 'react';
import { useQuery } from 'react-query';

import { Button, Container, Header, MatchGrid } from '../components';
import { fetchGames } from '../queries';

export function Games({ updatePageTitle }) {
  const { isLoading, error, data } = useQuery('games', fetchGames);
  useEffect(() => {
    updatePageTitle(`Game`);
  }, [updatePageTitle]);
  return (
    <>
      <Header />
      <Container maxW='max-w-screen-md'>
        <div className='p-6 space-y-4'>
          <div className='text-center'>
            <Button text='New Game' to='/games/new' />
          </div>
          {isLoading && <div>Loading games...</div>}
          {!isLoading && <MatchGrid games={data} />}
          {error && <div>Error trying to fetch games</div>}
        </div>
      </Container>
      <div className='spacer py-8'></div>
    </>
  );
}
