import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth';
import { Container, Header, Card } from '../components';
import { GamePlay } from '../components/GamePlay';
import { fetchGameById } from '../queries';
import { useQuery } from 'react-query';
/*
  only "authorised" users for this game should be able to save changes
*/

/* owner -> playerId, side -> home/away, how to calculate for 10 cups/team games */
export function Game({ updatePageTitle }) {
  const auth = useAuth();
  //{JSON.stringify(auth.user)}
  const { gameId } = useParams();
  // might be nice to save first throw
  // const [firstThrow, setFirstThrow] = useState(null)
  const { isLoading, error, data } = useQuery(['game', gameId], () =>
    fetchGameById(gameId)
  );

  useEffect(() => {
    updatePageTitle(`Game: ${gameId}`);
  }, [updatePageTitle, gameId]);
  return (
    <>
      <Header />
      <Container>
        <div className='p-6'>
          {error && <div>Error {gameId}</div>}
          {isLoading && <div>Loading {gameId}</div>}
          {!isLoading && (
            <Card
              title={
                <CardTitle
                  home={data.home_name}
                  away={data.away_name}
                  number={data.game_ID}
                />
              }
            >
              <div className='text-center'>
                {data.tournament_ID && (
                  <div>
                    <div>{data.event}</div>
                    <div>{data.stage}</div>
                  </div>
                )}
                <div>
                  <div>Venue: {data.venue}</div>
                  <div>Starting cups: 6</div>
                  {data.forfeit ? <div>Ended by forfeit</div> : null}
                  {data.notes && <div>Notes: {data.notes}</div>}
                </div>
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <h2 className='font-bold text-center'>Home Results</h2>
                  <div>Name: {data.home_name}</div>
                  <div>Cups left: {data.homeCupsLeft}</div>
                </div>
                <div>
                  <h2 className='font-bold text-center'>Away Results</h2>
                  <div>Name: {data.away_name}</div>
                  <div>Cups left: {data.awayCupsLeft}</div>
                </div>
              </div>
              {/* check for if table json in db needs a better check than just exists haha */}
              {data.game_table ? (
                <GamePlay data={data} access='' />
              ) : (
                <div className='text-center text-sm font-bold pt-4'>
                  Table state was not entered 😥
                </div>
              )}
            </Card>
          )}
        </div>
      </Container>
      <div className='spacer py-8'></div>
    </>
  );
}

/*
 Flip button to help people know which cup is with
 slider to turn? or buttons? (turn 90.)
*/

/*
tabbed interface for home/away? ON MOBILe View
Or just one under each other

SVG with circles as cups

on desktop show side by side

change homeCupsLeft/awayCupsLeft
to home_cups_left
lower case all _ID
pitchSize -> pitch_size
*/

/* 
how to represent rearanges, need to make sure can haddle 10 & 6 cup games
*/

function CardTitle({ home, away, number }) {
  return (
    <div className='flex justify-between'>
      <div className='text-3xl font-semibold text-left text-primary-text py-2'>
        {home} vs {away}
      </div>
      <div>#{number}</div>
    </div>
  );
}
