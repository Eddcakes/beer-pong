import React from 'react';

//slot 1 (title and player 1) slot 2 (player2)
export function PlayerOverview({ details }) {
  const headers = [
    'Games played',
    'Forfeits',
    'Total Wins',
    'Win %',
    'Reached quarters',
    'Reached semis',
    'Reached final',
    'Tournament Wins',
  ];
  return (
    <div className='flex justify-between items-center'>
      <ColumnHeader labels={headers} />
      <ColumnPlayer playerData={details.player1} />
      <ColumnPlayer playerData={details.player2} />
    </div>
  );
}

function ColumnHeader({ labels }) {
  return (
    <div>
      {labels.map((label) => (
        <div key={label} className='header'>
          {label}
        </div>
      ))}
    </div>
  );
}

function ColumnPlayer({ playerData }) {
  if (Object.keys(playerData).length < 1) {
    return <div className='text-center'>please select player</div>;
  } else {
    return (
      <div className='text-right'>
        <div>{playerData.games ? playerData.games : '0'}</div>
        <div>{playerData.forfeits ? playerData.forfeits : '0'}</div>
        <div>
          {playerData.homeWins && playerData.awayWins
            ? playerData.homeWins + playerData.awayWins
            : '0'}
        </div>{' '}
        <div>
          {playerData.homeWins && playerData.awayWins && playerData.games
            ? (
                ((playerData.homeWins + playerData.awayWins) /
                  playerData.games) *
                100
              ).toFixed(2) + '%'
            : '0'}
        </div>{' '}
        <div>{playerData.quarterFinals ? playerData.quarterFinals : '0'}</div>
        <div>{playerData.semiFinals ? playerData.semiFinals : '0'}</div>
        <div>{playerData.finals ? playerData.finals : '0'}</div>
        <div>{playerData.finalsWon ? playerData.finalsWon : '0'}</div>
      </div>
    );
  }
}
