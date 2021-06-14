import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth';
import { Container, Header, Card, GamePlay, GameView } from '../components';
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
        {error && <div>Error {gameId}</div>}
        {isLoading && <div>Loading {gameId}</div>}
        {!isLoading && (
          <Card
            title={
              <CardTitle
                home={data[0].home_name}
                away={data[0].away_name}
                number={data[0].id}
              />
            }
          >
            {data[0].locked && (
              <div className='text-right' title='This game is locked'>
                locked 🔒
              </div>
            )}
            <div className='text-center'>
              {data[0].tournament && (
                <div>
                  <div>{data[0].event}</div>
                  <div>{data[0].stage}</div>
                </div>
              )}
              <div>
                <div>Venue: {data[0].venue}</div>
                <div>Starting cups: 6</div>
                {data[0].forfeit ? <div>Ended by forfeit</div> : null}
                {data[0].notes && <div>Notes: {data[0].notes}</div>}
              </div>
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <h2 className='font-bold text-center'>Home Results</h2>
                <div>Name: {data[0].home_name}</div>
                <div>Cups left: {data[0].home_cups_left}</div>
              </div>
              <div>
                <h2 className='font-bold text-center'>Away Results</h2>
                <div>Name: {data[0].away_name}</div>
                <div>Cups left: {data[0].away_cups_left}</div>
              </div>
            </div>
            {/* check for if table json in db needs a better check than just exists haha */}
            {data[0]?.game_table ? (
              !data[0].locked ? (
                <GamePlay gameDetails={data[0]} access='' />
              ) : (
                <GameView gameDetails={data[0]} />
              )
            ) : (
              <div className='text-center text-sm font-bold pt-4'>
                Table state was not entered 😥
              </div>
            )}
          </Card>
        )}
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

change home_cups_left/away_cups_left
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
