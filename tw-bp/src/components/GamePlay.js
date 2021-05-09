import { useRef } from 'react';
import { useMachine } from '@xstate/react';

import { createMachineFromState } from '../tableMachine';
import { Button, buttonColor, Modal } from './index';
import { Cups } from './Cups';

//on start first throw - Math.random() < 0.5;

export function GamePlay({ gameDetails }) {
  const tableMachine = createMachineFromState(gameDetails.game_table);
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

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    //check form valid, skipping for prototype
    const toStringify = JSON.stringify(state.context);
    let data = {
      //...gameDetails,
      game_ID: gameDetails.game_ID,
      player1: gameDetails.player1,
      player2: gameDetails.player2,
      homeCupsLeft: state.context.homeCupsLeft,
      awayCupsLeft: state.context.awayCupsLeft,
      // forfeit: havent set context for side of forfeit yet
      table: toStringify,
    };
    try {
      const updateGame = await postSaveGamePlay(data);
      if (updateGame.error) {
        return console.error('no ui error fuk', updateGame.error);
      }
      window.location.reload();
    } catch (err) {
      console.log('error when trying to post', err);
    }
    // console.log(data);
  };

  return (
    <>
      <div>
        {state.matches('rerack') ? (
          <>
            <Button text='Save' onClick={() => send('SAVE')} fullWidth />
            <Button text='Cancel' onClick={() => send('CANCEL')} fullWidth />
          </>
        ) : (
          <Button text='Rerack' onClick={() => send('RERACK')} fullWidth />
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
          selectedCup={state.context.selectedCup}
        />
        {state.matches('playing') && (
          <div className='pb-4'>
            {' '}
            <Button
              text='Home forfeit?'
              onClick={(_, evt) => send('FORFEIT_HOME')}
            />
          </div>
        )}
      </div>
      <div>
        <div>{gameDetails.away_name}</div>
        <div>away cups left: {state.context.awayCupsLeft}</div>
        <div>hit rim: {state.context.homeCupRimCount}</div>
        <div>
          reracked: {JSON.stringify(state.context.awayCupRerackComplete)}
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
          selectedCup={state.context.selectedCup}
        />
        {state.matches('playing') && (
          <div className='pb-4'>
            <Button
              text='Away forfeit?'
              onClick={(_, evt) => send('FORFEIT_AWAY')}
            />
          </div>
        )}
      </div>
      <div className='mb-16'>
        <Button text='Submit' onClick={handleSubmit} />
      </div>

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
    </>
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

async function postSaveGamePlay(data) {
  const { game_ID: gameId, ...rest } = data;
  try {
    const updateGame = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/v1/games/${gameId}`,
      {
        method: 'POST',
        body: JSON.stringify(rest),
        headers: {
          'content-type': 'application/json',
        },
        credentials: 'include',
      }
    );
    const resp = await updateGame.json();
    return resp;
  } catch (err) {
    throw new Error(err);
  }
}
