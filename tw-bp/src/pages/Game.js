import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useMachine } from '@xstate/react';

import { useAuth } from '../hooks/useAuth';
import {
  Container,
  Header,
  Card,
  Button,
  buttonColor,
  Modal,
} from '../components';
import { createTableMachine, createInitialCups } from '../tableMachine';
/*
  only "authorised" users for this game should be able to save changes
*/

/* owner -> playerId, side -> home/away, how to calculate for 10 cups/team games */

const initialHome = createInitialCups(1, 'home');
const initialAway = createInitialCups(2, 'away');

const tableMachine = createTableMachine(initialHome, initialAway, 'home');

export function Game({ updatePageTitle }) {
  const auth = useAuth();
  const { gameId } = useParams();
  const [state, send] = useMachine(tableMachine);
  const centreAdjustment = 1.5;
  const cupsRef = useRef(null);
  const svgCoord = (evt) => {
    if (cupsRef.current === null) {
      return;
    }
    let point = cupsRef.current.createSVGPoint();
    point.x = evt.clientX;
    point.y = evt.clientY;
    const cursorPoint = point.matrixTransform(
      evt.target.getScreenCTM().inverse()
    );
    const clampedX = floorBound(cursorPoint.x - centreAdjustment, 0, 8);
    const clampedY = floorBound(cursorPoint.y - centreAdjustment, 0, 8);
    return send({
      type: 'NEWPOS',
      position: { x: clampedX, y: clampedY },
      details: evt,
    });
  };

  const newMove = (evt) => {
    if (cupsRef.current === null) {
      return;
    }
    let point = cupsRef.current.createSVGPoint();
    point.x = evt.clientX;
    point.y = evt.clientY;
    const cursorPoint = point.matrixTransform(
      evt.target.getScreenCTM().inverse()
    );
    const clampedX = floorBound(cursorPoint.x - centreAdjustment, 0, 8);
    const clampedY = floorBound(cursorPoint.y - centreAdjustment, 0, 8);
    return send({
      type: 'MOUSEMOVE',
      position: { x: clampedX, y: clampedY },
      details: evt,
    });
  };
  /* original */
  // might be nice to save first throw
  // const [firstThrow, setFirstThrow] = useState(null)
  const [gameDetails, setGameDetails] = useState(null);
  const [table, setTable] = useState(null);

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
                  {state.matches('rerack') ? (
                    <>
                      <Button
                        text='Save'
                        onClick={() => send('SAVE')}
                        fullWidth
                      />
                      <Button
                        text='Cancel'
                        onClick={() => send('CANCEL')}
                        fullWidth
                      />
                    </>
                  ) : (
                    <Button
                      text='Rerack'
                      onClick={() => send('RERACK')}
                      fullWidth
                    />
                  )}
                </div>
                <div>
                  <div>{gameDetails.home_name}</div>
                  <div>home cups left: {state.context.homeCupsLeft}</div>
                  <div>hit rim: {state.context.awayCupRimCount}</div>
                  <div>
                    reracked:
                    {JSON.stringify(state.context.homeCupRerackComplete)}
                  </div>
                  <Cups
                    side='home'
                    cups={state.context.homeCups}
                    gameSize={6}
                    forwardRef={cupsRef}
                    mouseExit={() => send('EXIT')}
                    pickCup={(evt) => send({ type: 'PICKCUP', details: evt })}
                    newMove={newMove}
                    svgCoord={svgCoord}
                    rerack={state.matches('rerack')}
                    movingState={state.matches('rerack.moving')}
                    lastHover={state.context.lastHover}
                  />
                  {state.matches('playing') && (
                    <Button
                      text='Home forfeit?'
                      onClick={(_, evt) => send('FORFEIT_HOME')}
                    />
                  )}
                </div>
                <div>
                  <div>{gameDetails.away_name}</div>
                  <div>away cups left: {state.context.awayCupsLeft}</div>
                  <div>hit rim: {state.context.homeCupRimCount}</div>
                  <div>
                    reracked:{' '}
                    {JSON.stringify(state.context.awayCupRerackComplete)}
                  </div>
                  <Cups
                    side='away'
                    cups={state.context.awayCups}
                    gameSize={6}
                    forwardRef={cupsRef}
                    mouseExit={() => send('EXIT')}
                    pickCup={(evt) => send({ type: 'PICKCUP', details: evt })}
                    newMove={newMove}
                    svgCoord={svgCoord}
                    rerack={state.matches('rerack')}
                    movingState={state.matches('rerack.moving')}
                    lastHover={state.context.lastHover}
                  />
                  {state.matches('playing') && (
                    <Button
                      text='Away forfeit?'
                      onClick={(_, evt) => send('FORFEIT_AWAY')}
                    />
                  )}
                </div>
                <Button text='Submit' />
              </>
            )}
          </Card>
        }
        <Modal
          isOpen={state.matches('modal')}
          dismiss={() => send('CANCEL')}
          title='Cup details'
        >
          <div className='p-2 flex flex-col space-y-8'>
            <Button
              name='sink'
              text='Sink'
              onClick={() => send('SINK')}
              color={buttonColor.outlined}
            />
            <Button
              name='catch'
              text='Catch'
              onClick={() => send('CATCH')}
              color={buttonColor.outlined}
            />
            <Button
              name='spill'
              text='Spill'
              onClick={() => send('SPILL')}
              color={buttonColor.outlined}
            />
            <Button
              name='other'
              text='Other'
              onClick={() => send('OTHER')}
              color={buttonColor.outlined}
            />
            <Button
              name='rim'
              text='Rim'
              onClick={() => send('RIM')}
              color={buttonColor.outlined}
            />
          </div>
        </Modal>
      </Container>
    </>
  );
}

export function Cups({
  side,
  cups,
  forwardRef,
  gameSize = 6,
  mouseExit,
  pickCup,
  newMove,
  svgCoord,
  rerack,
  movingState,
  lastHover,
}) {
  const lines = createGridLines(gameSize);
  const highlightSize = 4; //
  if (Number(gameSize) === 10) {
    return <svg viewBox='0 0 12 12' data-name={`${side}Svg`}></svg>;
  }
  return (
    <div className='grid justify-center'>
      <svg
        viewBox='0 0 12 12'
        height='15em'
        width='15em'
        data-name={`${side}Svg`}
        ref={forwardRef}
        onMouseMove={newMove}
        onMouseLeave={mouseExit}
        onClick={movingState ? svgCoord : undefined} //pickspot
        className='border'
      >
        {rerack &&
          lines.map(({ x1, y1, x2, y2 }) => (
            <line
              key={`${x1}${x2}${y1}${y2}`}
              x1={x1}
              x2={x2}
              y1={y1}
              y2={y2}
              className='stroke-current text-gray-500'
              strokeWidth={0.1}
            />
          ))}
        {movingState && (
          <HoverElement x={lastHover.x} y={lastHover.y} size={highlightSize} />
        )}
        {cups
          .filter((cup) => !cup.hit)
          .map((cup) => {
            return (
              <Cup
                details={cup}
                key={cup.name}
                rerack={rerack}
                pickCup={pickCup}
              />
            );
          })}
      </svg>
    </div>
  );
}

export function Cup({ details, pickCup, rerack }) {
  const rad = 2;
  if (details?.rim) {
    return (
      <g>
        <circle
          cx={details.x}
          cy={details.y}
          r={rad}
          name={details.name}
          className='cursor-pointer'
          data-name={details.name}
          onClick={pickCup}
        />
        <text
          x={details.x}
          y={Number(details.y) + 0.5}
          textAnchor='middle'
          className='pointer-events-none fill-current text-red-500'
          style={{ fontSize: '0.1rem' }}
        >
          {details.rim.length}
        </text>
      </g>
    );
  }
  return (
    <circle
      cx={details.x}
      cy={details.y}
      r={rad}
      name={details.name}
      className='cursor-pointer'
      data-name={details.name}
      onClick={pickCup}
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
  if (x != null || y != null) {
    return (
      <rect
        x={x}
        y={y}
        height={size}
        width={size}
        className='fill-current text-blue-500 opacity-25'
      />
    );
  } else {
    return null;
  }
}

function createGridLines(size) {
  const viewSize = size * 2;
  let lineList = [];
  for (let ii = 0; ii < viewSize; ii++) {
    lineList.push({ x1: 0, y1: ii, x2: viewSize, y2: ii });
    lineList.push({ x1: ii, y1: 0, x2: ii, y2: viewSize });
  }
  return lineList;
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
