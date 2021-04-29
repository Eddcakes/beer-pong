import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth';
import {
  Container,
  Header,
  Card,
  Button,
  buttonColor,
  Modal,
} from '../components';
/*
  only "authorised" users for this game should be able to save changes
*/
const table = {
  firstThrow: 'player', // inbuilt coin to flip?
  homeCups: createInitialCups(),
  awayCups: [],
};
/* owner -> playerId, side -> home/away, how to calculate for 10 cups/team games */
function createInitialCups(owner, side) {
  return [
    { name: `${side}x6-y2`, x: '6', y: '2', owner: `${owner}`, hit: null },
    { name: `${side}x4-y6`, x: '4', y: '6', owner: `${owner}`, hit: null },
    { name: `${side}x8-y6`, x: '8', y: '6', owner: `${owner}`, hit: null },
    { name: `${side}x2-y10`, x: '2', y: '10', owner: `${owner}`, hit: null },
    { name: `${side}x6-y10`, x: '6', y: '10', owner: `${owner}`, hit: null },
    { name: `${side}x10-y10`, x: '10', y: '10', owner: `${owner}`, hit: null },
  ];
}

export function Game({ updatePageTitle }) {
  const auth = useAuth();
  const { gameId } = useParams();
  // might be nice to save first throw
  // const [firstThrow, setFirstThrow] = useState(null)
  const [gameDetails, setGameDetails] = useState(null);
  const [table, setTable] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedCup, setSelectedCup] = useState(null);
  const closeModal = () => {
    setShowModal(false);
    //reset selectedCup
    setSelectedCup(null);
  };
  const handleCupClick = (evt, details) => {
    setSelectedCup(details);
    setShowModal(true);
  };

  const updateCups = (evt) => {
    const type = evt.target.name;
    const side = selectedCup.name.startsWith('home') ? 'homeCups' : 'awayCups';
    let originalCups = table[side].filter(
      (cup) => cup.name !== selectedCup.name
    );
    let hitCup = {
      ...selectedCup,
      hit: { timestamp: new Date().toISOString(), type: type },
    };
    setTable({ ...table, [side]: [...originalCups, hitCup] });
    setSelectedCup(null);
    setShowModal(false);
  };

  useEffect(() => {
    async function fetchData() {
      const getGameDetails = await fetchGameById(gameId);
      //am i happy setting it to undefined if user not logged in?
      if (getGameDetails.length > 0) {
        setGameDetails(getGameDetails[0]);
        if (getGameDetails[0]?.home_ID && getGameDetails[0]?.away_ID) {
          setTable({
            homeCups: createInitialCups(getGameDetails[0].home_ID, 'home'),
            awayCups: createInitialCups(getGameDetails[0].away_ID, 'away'),
          });
        }
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
            {gameDetails.tournament_ID && (
              <div>
                <div>{gameDetails.event}</div>
                <div>{gameDetails.stage}</div>
              </div>
            )}
            <div>{gameDetails.venue}</div>
            <div>{gameDetails.notes}</div>
            {table && (
              <>
                <div>
                  <div>{gameDetails.home_name}</div>
                  <div>{gameDetails.homeCupsLeft}</div>
                  <Cups
                    cups={table.homeCups}
                    gameSize={6}
                    updateCups={handleCupClick}
                  />
                </div>
                <div>
                  <div>{gameDetails.away_name}</div>
                  <div>{gameDetails.awayCupsLeft}</div>
                  <Cups
                    cups={table.awayCups}
                    gameSize={6}
                    updateCups={handleCupClick}
                  />
                </div>
              </>
            )}
          </Card>
        }
        <Modal isOpen={showModal} dismiss={closeModal} title='Cup details'>
          <div className='p-2 flex flex-col space-y-8'>
            <Button
              name='sink'
              text='Sink'
              onClick={updateCups}
              color={buttonColor.outlined}
            />
            <Button
              name='catch'
              text='Catch'
              onClick={updateCups}
              color={buttonColor.outlined}
            />
            <Button
              name='spill'
              text='Spill'
              onClick={updateCups}
              color={buttonColor.outlined}
            />
            <Button
              name='other'
              text='Other'
              onClick={updateCups}
              color={buttonColor.outlined}
            />
          </div>
        </Modal>
      </Container>
    </>
  );
}

function Cups({ cups, gameSize = 6, updateCups = () => {} }) {
  /* update cups need to be used for both, click to kill and rearange */
  // 10 vs 6 cup games, do they need to be rendered differently?
  const [lastHover, setLastHover] = useState({ x: null, y: null });
  const [rerackMode, setRerackMode] = useState(false);
  // const [hoverOverlay, setHoverOverlay] = useState()
  const cupsRef = useRef(null);
  //let points = cupsRef.current ? cupsRef.current.createSVGPoint() : null;

  const highlightSize = 4;
  const centreAdjustment = 1.5;
  const resetLastHover = () => {
    setLastHover({ x: null, y: null });
  };
  const handleHover = (evt) => {
    if (cupsRef.current === null) {
      return;
    }
    let point = cupsRef.current.createSVGPoint();
    point.x = evt.clientX;
    point.y = evt.clientY;
    const cursorPoint = point.matrixTransform(
      evt.target.getScreenCTM().inverse()
    );
    // clamped is viewbox - hoverbox size?
    const clampedX = floorBound(cursorPoint.x - centreAdjustment, 0, 8);
    const clampedY = floorBound(cursorPoint.y - centreAdjustment, 0, 8);
    if (clampedX !== lastHover.x || clampedY !== lastHover.y) {
      setLastHover({ x: clampedX, y: clampedY });
    }
  };
  const handleStartRerack = () => setRerackMode(true);
  const handleEndRerack = () => setRerackMode(false);
  /* onClick on the svg might need to be only used when ready to 
  "place" the rearanged piece */
  const handleRerack = (evt) => {
    console.log(`move clicked to x: ${lastHover.x}, y: ${lastHover.y}`);
    //click on element, this lifts and adds to highlight element? or just places where next click
  };

  if (Number(gameSize) === 10) {
    return (
      <svg viewBox='0 0 12 12'>
        <circle />
      </svg>
    );
  }
  return (
    <div className='grid justify-center'>
      <svg
        className='border'
        viewBox='0 0 12 12'
        height='15em'
        width='15em'
        ref={cupsRef}
        onMouseMove={rerackMode ? handleHover : undefined}
        onMouseLeave={rerackMode ? resetLastHover : undefined}
        onClick={rerackMode ? handleRerack : undefined}
      >
        <line
          x1={0}
          y1={1}
          x2={12}
          y2={1}
          className='stroke-current text-gray-500'
          strokeWidth={0.1}
        />
        {lastHover.x != null && lastHover.y != null && (
          <HoverElement x={lastHover.x} y={lastHover.y} size={highlightSize} />
        )}
        {cups
          .filter((cup) => !cup.hit)
          .map((cup) => {
            return <Cup details={cup} key={cup.name} onClick={updateCups} />;
          })}
      </svg>
      <div className='pt-4'>
        {rerackMode ? (
          <Button text='Save' onClick={handleEndRerack} fullWidth />
        ) : (
          <Button text='Rerack' onClick={handleStartRerack} fullWidth />
        )}
      </div>
    </div>
  );
}

function Cup({ details, onClick }) {
  return (
    <circle
      cx={details.x}
      cy={details.y}
      r='2'
      name={details.name}
      className='cursor-pointer'
      onClick={(evt) => onClick(evt, details)}
    />
  );
}

function floorBound(num, lower, upper) {
  if (num > upper) {
    return upper;
  }
  if (num < lower) {
    return lower;
  }
  return Math.floor(num);
}

function HoverElement({ x, y, size = 4 }) {
  return (
    <rect
      x={x}
      y={y}
      height={size}
      width={size}
      className='fill-current text-blue-500 opacity-25'
    />
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
