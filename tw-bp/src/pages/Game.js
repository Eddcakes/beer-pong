import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth';
import { Container, Header, Card } from '../components';
import { GamePlay } from '../components/GamePlay';
/*
  only "authorised" users for this game should be able to save changes
*/

/* owner -> playerId, side -> home/away, how to calculate for 10 cups/team games */
export function Game({ updatePageTitle }) {
  const auth = useAuth();
  const { gameId } = useParams();
  // might be nice to save first throw
  // const [firstThrow, setFirstThrow] = useState(null)
  const [gameDetails, setGameDetails] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const getGameDetails = await fetchGameById(gameId);
      //am i happy setting it to undefined if user not logged in?
      if (getGameDetails.length > 0) {
        setGameDetails(getGameDetails[0]);
      }
    }
    fetchData();
  }, [gameId]);

  useEffect(() => {
    updatePageTitle(`Game: ${gameId}`);
  }, [updatePageTitle, gameId]);
  if (gameDetails === null) {
    return <div>Loading</div>;
  }
  return (
    <>
      <Header />
      <Container>
        {
          <Card
            title={
              <CardTitle
                home={gameDetails.home_name}
                away={gameDetails.away_name}
                number={gameDetails.game_ID}
              />
            }
          >
            <div className='text-center'>
              {gameDetails.tournament_ID && (
                <div>
                  <div>{gameDetails.event}</div>
                  <div>{gameDetails.stage}</div>
                </div>
              )}
              <div>
                <div>Venue: {gameDetails.venue}</div>
                <div>Starting cups: 6</div>
                {gameDetails.forfeit ? <div>Ended by forfeit</div> : null}
                {gameDetails.notes && <div>Notes: {gameDetails.notes}</div>}
              </div>
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <h2 className='font-bold text-center'>Home Results</h2>
                <div>Name: {gameDetails.home_name}</div>
                <div>Cups left: {gameDetails.homeCupsLeft}</div>
              </div>
              <div>
                <h2 className='font-bold text-center'>Away Results</h2>
                <div>Name: {gameDetails.away_name}</div>
                <div>Cups left: {gameDetails.awayCupsLeft}</div>
              </div>
            </div>
            {/* check for if table json in db needs a better check than just exists haha */}
            {gameDetails.game_table ? (
              <GamePlay gameDetails={gameDetails} />
            ) : (
              <div className='text-center text-sm font-bold pt-4'>
                Table state was not entered 😥
              </div>
            )}
          </Card>
        }
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

async function fetchGameById(gameId) {
  try {
    const game = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/v1/games/${gameId}`,
      {
        credentials: 'include',
      }
    );
    const resp = await game.json();
    return resp;
  } catch (err) {
    throw new Error(err);
  }
}
