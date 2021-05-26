import { useEffect, useState } from 'react';

import { Button, Container, Header, MatchGrid } from '../components';

export function Games({ updatePageTitle }) {
  const [games, setGames] = useState([]);
  useEffect(() => {
    async function fetchData() {
      const getGameDetails = await fetchGames();
      if (getGameDetails.length > 0) {
        setGames(getGameDetails);
      }
    }
    fetchData();
  }, []);

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
          <MatchGrid games={games} />
        </div>
      </Container>
      <div className='spacer py-8'></div>
    </>
  );
}

async function fetchGames() {
  try {
    const games = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/v1/games/`,
      {
        credentials: 'include',
      }
    );
    const resp = await games.json();
    return resp;
  } catch (err) {
    throw new Error(err);
  }
}
