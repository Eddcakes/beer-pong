import React, { useEffect } from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';

import { Header, Container, PlayerDetails } from '../components';
import { fetchPlayerById } from '../queries';

/* add last 5 games */
export function Player({ updatePageTitle }) {
  const { playerId } = useParams();
  const { data, isLoading } = useQuery(['player', playerId], () =>
    fetchPlayerById(playerId)
  );
  //set page title
  useEffect(() => {
    //probably fill this in with name / or doesnt exist after loaded player details
    updatePageTitle(`Player: ${playerId}`);
  }, [updatePageTitle, playerId]);

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
