import { useRef } from 'react';
import { useMachine } from '@xstate/react';
import { useMutation, useQueryClient } from 'react-query';

import { createMachineFromState } from '../tableMachine';
import { Button, buttonColor, Modal } from './index';
import { Cups } from './Cups';
import { postSaveGamePlay } from '../queries';

//on start first throw - Math.random() < 0.5;
// https://react-query.tanstack.com/guides/mutations
export function GamePlay({ gameDetails }) {
  const queryClient = useQueryClient();
  const gameMutate = useMutation(postSaveGamePlay, {
    onError: (error) => {
      // error toast
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['game', gameDetails.id]);
      //save toast
    },
  });
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
      id: gameDetails.id,
      player1: gameDetails.player1,
      player2: gameDetails.player2,
      homeCupsLeft: state.context.homeCupsLeft,
      awayCupsLeft: state.context.awayCupsLeft,
      forfeit: state.context.forfeit,
      table: toStringify,
    };
    gameMutate.mutate(data);
  };

  return (
    <>
      <div className='text-center'>
        <Button text='Save' onClick={handleSubmit} />
      </div>
      <div className='grid md:grid-cols-2'>
        <div className='grid grid-cols-2'>
          <span>Name:</span>
          <span>{gameDetails.home_name}</span>
          <span>home cups left:</span>
          <span>{state.context.homeCupsLeft}</span>
          <span>hit rim:</span>
          <span>{state.context.awayCupRimCount}</span>
          <span>reracked:</span>
          <span>{JSON.stringify(state.context.homeCupRerackComplete)}</span>
          <div className='col-span-2 m-auto text-center pt-4'>
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
              <div className='p-4'>
                <Button
                  text='Home forfeit?'
                  onClick={(_, evt) => {
                    let check = window.confirm('Are you sure HOME forfeits?');
                    if (check) {
                      send('FORFEIT_HOME');
                    }
                  }}
                />
              </div>
            )}
          </div>
        </div>
        <div>
          <div className='grid grid-cols-2'>
            <span>Name:</span>
            <span>{gameDetails.away_name}</span>
            <span>home cups left:</span>
            <span>{state.context.awayCupsLeft}</span>
            <span>hit rim:</span>
            <span>{state.context.homeCupRimCount}</span>
            <span>reracked:</span>
            <span>{JSON.stringify(state.context.awayCupRerackComplete)}</span>
            <div className='col-span-2 m-auto text-center pt-4'>
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
                <div className='p-4'>
                  <Button
                    text='Away forfeit?'
                    onClick={(_, evt) => {
                      let check = window.confirm('Are you sure AWAY forfeits?');
                      if (check) {
                        send('FORFEIT_AWAY');
                      }
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
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
