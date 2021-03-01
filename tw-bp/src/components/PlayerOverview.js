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
      <ColumnPlayer
        playerData={details.player1}
        last={!Object.keys(details.player2).length > 0}
      />
      <ColumnPlayer
        playerData={details.player2}
        last={Object.keys(details.player2).length > 0}
      />
    </div>
  );
}

function ColumnHeader({ labels, show }) {
  if (!show)
    return <div className='w-1/2 border border-primary-background'></div>;
  return (
    <div className='w-1/2 border-primary-background table-start'>
      {labels.map((label) => (
        <Cell key={label} header={true}>
          {label}
        </Cell>
      ))}
    </div>
  );
}

function ColumnPlayer({ last = true, playerData }) {
  if (Object.keys(playerData).length < 1) {
    return (
      <div className='text-center text-xl w-1/4 text-primary-text'>
        Please select a player
      </div>
    );
  } else {
    return (
      <div
        className={`text-right w-1/4 border-primary-background ${
          last ? 'table-end' : ''
        }`}
      >
        <Cell>{playerData.games ? playerData.games : '0'}</Cell>
        <Cell>{playerData.forfeits ? playerData.forfeits : '0'}</Cell>
        <Cell>
          {playerData.homeWins && playerData.awayWins
            ? playerData.homeWins + playerData.awayWins
            : '0'}
        </Cell>
        <Cell>
          {playerData.homeWins && playerData.awayWins && playerData.games
            ? (
                ((playerData.homeWins + playerData.awayWins) /
                  playerData.games) *
                100
              ).toFixed(2) + '%'
            : '0'}
        </Cell>
        <Cell>{playerData.quarterFinals ? playerData.quarterFinals : '0'}</Cell>
        <Cell>{playerData.semiFinals ? playerData.semiFinals : '0'}</Cell>
        <Cell>{playerData.finals ? playerData.finals : '0'}</Cell>
        <Cell>{playerData.finalsWon ? playerData.finalsWon : '0'}</Cell>
      </div>
    );
  }
}

function Cell({ header = false, children }) {
  return (
    <div
      className={`${
        header ? 'header' : ''
      } border-primary-background table-like-border py-2 px-4`}
    >
      {children}
    </div>
  );
}
