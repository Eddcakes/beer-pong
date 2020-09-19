import React from 'react';

export function PlayerOverview({ details }) {
  return (
    <ul>
      <li className='p-2 flex justify-between'>
        <span>Games played</span>
        <span>
          {details.player1.length > 0 ? details.player1[0].games : '*'}
        </span>
        <span>
          {details.player2.length > 0 ? details.player2[0].games : '*'}
        </span>
      </li>
      <li className='p-2 flex justify-between'>
        <span>Forfeits</span>
        <span>
          {details.player1.length > 0 ? details.player1[0].forfeits : '*'}
        </span>
        <span>
          {details.player2.length > 0 ? details.player2[0].forfeits : '*'}
        </span>
      </li>
      <li className='p-2 flex justify-between'>
        <span>Total wins</span>
        <span>
          {details.player1.length > 0
            ? details.player1[0].homeWins + details.player1[0].awayWins
            : '*'}
        </span>
        <span>
          {details.player2.length > 0
            ? details.player2[0].homeWins + details.player2[0].awayWins
            : '*'}
        </span>
      </li>
      <li className='p-2 flex justify-between'>
        <span>Win %</span>
        <span>
          {details.player1.length > 0
            ? (
                ((details.player1[0].homeWins + details.player1[0].awayWins) /
                  details.player1[0].games) *
                100
              ).toFixed(2) + '%'
            : '*'}
        </span>
        <span>
          {details.player2.length > 0
            ? (
                ((details.player2[0].homeWins + details.player2[0].awayWins) /
                  details.player2[0].games) *
                100
              ).toFixed(2) + '%'
            : '*'}
        </span>
      </li>
      <li className='p-2 flex justify-between'>
        <span>Reached quarters</span>
        <span>
          {details.player1.length > 0 ? details.player1[0].quarterFinals : '*'}
        </span>
        <span>
          {details.player2.length > 0 ? details.player2[0].quarterFinals : '*'}
        </span>
      </li>
      <li className='p-2 flex justify-between'>
        <span>Reached semis</span>
        <span>
          {details.player1.length > 0 ? details.player1[0].semiFinals : '*'}
        </span>
        <span>
          {details.player2.length > 0 ? details.player2[0].semiFinals : '*'}
        </span>
      </li>
      <li className='p-2 flex justify-between'>
        <span>Reached final</span>
        <span>
          {details.player1.length > 0 ? details.player1[0].finals : '*'}
        </span>
        <span>
          {details.player2.length > 0 ? details.player2[0].finals : '*'}
        </span>
      </li>
      <li className='p-2 flex justify-between'>
        <span>Tournament Wins</span>
        <span>
          {details.player1.length > 0 ? details.player1[0].finalsWon : '*'}
        </span>
        <span>
          {details.player2.length > 0 ? details.player2[0].finalsWon : '*'}
        </span>
      </li>
    </ul>
  );
}
