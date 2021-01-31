import React from 'react';

//slot 1 (title and player 1) slot 2 (player2)
export function PlayerOverview({ details }) {
  const headers = [
    '',
    'Games played',
    'Forfeits',
    'Total Wins',
    'Win %',
    'Reached quarters',
    'Reached semis',
    'Reached final',
    'Tournament Wins',
  ];
  let showHeaders;
  if (
    Object.keys(details.player1).length > 0 ||
    Object.keys(details.player2).length > 0
  ) {
    showHeaders = true;
  } else {
    showHeaders = false;
  }
  return (
    <div className='flex flex-row items-center '>
      <ColumnHeader labels={headers} show={showHeaders} />
      <ColumnPlayer playerData={details.player1} />
      <ColumnPlayer playerData={details.player2} />
    </div>
  );
}

function ColumnHeader({ labels, show }) {
  if (!show) return <div className='w-1/2'></div>;
  return (
    <div className='w-1/2'>
      {labels.map((label) => (
        <div key={label} className='header border'>
          {label}
        </div>
      ))}
    </div>
  );
}

function ColumnPlayer({ playerData }) {
  if (Object.keys(playerData).length < 1) {
    return (
      <div className='text-center text-sm w-1/4'>Please select player</div>
    );
  } else {
    return (
      <div className='text-right w-1/4'>
        <div className='border'>
          {playerData.games ? playerData.games : '0'}
        </div>
        <div className='border'>
          {playerData.forfeits ? playerData.forfeits : '0'}
        </div>
        <div className='border'>
          {playerData.homeWins && playerData.awayWins
            ? playerData.homeWins + playerData.awayWins
            : '0'}
        </div>
        <div className='border'>
          {playerData.homeWins && playerData.awayWins && playerData.games
            ? (
                ((playerData.homeWins + playerData.awayWins) /
                  playerData.games) *
                100
              ).toFixed(2) + '%'
            : '0'}
        </div>
        <div className='border'>
          {playerData.quarterFinals ? playerData.quarterFinals : '0'}
        </div>
        <div className='border'>
          {playerData.semiFinals ? playerData.semiFinals : '0'}
        </div>
        <div className='border'>
          {playerData.finals ? playerData.finals : '0'}
        </div>
        <div className='border'>
          {playerData.finalsWon ? playerData.finalsWon : '0'}
        </div>
      </div>
    );
  }
}
