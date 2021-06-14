import React from 'react';

// array of player details
export function PlayerOverview({ details }) {
  const headers = [
    'Name',
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
  if (details.length > 0) {
    showHeaders = true;
  } else {
    showHeaders = false;
  }
  return (
    <div className='flex flex-row items-center '>
      <ColumnHeader labels={headers} show={showHeaders} />
      {details.map((player, idx) => {
        // check if idx is last in details
        const last = details.length - 1;
        if (player == null) return null;
        return (
          <ColumnPlayer
            playerData={player}
            last={idx === last}
            key={`${player?.name}${idx}`}
          />
        );
      })}
    </div>
  );
}

function ColumnHeader({ labels, show }) {
  if (!show) return <div className='w-1/2 border border-secondary'></div>;
  return (
    <div className='w-1/2 border-secondary table-start'>
      {labels.map((label) => (
        <Cell key={label} header={true}>
          {label}
        </Cell>
      ))}
    </div>
  );
}

function ColumnPlayer({ last = true, playerData }) {
  return (
    <div
      className={`text-right w-1/4 border-secondary ${last ? 'table-end' : ''}`}
    >
      <Cell>{playerData.name ? playerData.name : ''}</Cell>
      <Cell>{playerData.games ? playerData.games : '0'}</Cell>
      <Cell>{playerData.forfeits ? playerData.forfeits : '0'}</Cell>
      <Cell>
        {playerData.homeWins && playerData.awayWins
          ? Number(playerData.homeWins) + Number(playerData.awayWins)
          : '0'}
      </Cell>
      <Cell>
        {playerData.homeWins && playerData.awayWins && playerData.games
          ? (
              ((Number(playerData.homeWins) + Number(playerData.awayWins)) /
                Number(playerData.games)) *
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

function Cell({ header = false, children }) {
  return (
    <div
      className={`${
        header ? 'header' : ''
      } border-secondary table-like-border py-2 px-4`}
    >
      {children}
    </div>
  );
}
