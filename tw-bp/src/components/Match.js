import React from 'react';

export function Match({ game }) {
  const winner = () => {
    if (game.homeCupsLeft === 0) {
      return (
        <div className='text-center font-bold'>
          {game.away} WINNER {game.awayCupsLeft} cups left!
        </div>
      );
    } else {
      return (
        <div className='text-center font-bold'>
          {game.home} WINNER {game.homeCupsLeft} cups left!
        </div>
      );
    }
  };
  return (
    <div className='border my-2'>
      <div className='text-center'>
        <div>{game.event}</div>
        <div>{game.date}</div>
        <div>{game.venue}</div>
      </div>

      <div className='flex justify-between'>
        <div>Home: {game.home}</div>
        <div>Away: {game.away}</div>
      </div>
      {winner()}
      {game.notes !== null && (
        <div className='text-center'>Notes: {game.notes}</div>
      )}
    </div>
  );
}
