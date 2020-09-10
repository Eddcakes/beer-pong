import React, { useEffect, useState } from 'react';
import { Swatch } from '../components/Swatch';
import { Card } from '../components/Card';
import { Match } from '../components/Match';

/* could have some defaults like *current player -> player 1 by default
  if only one player filled in - fetch player stats not the comparison stats?
*/

export function Versus({ updatePageTitle }) {
  const [players, setPlayers] = useState({ player1: '', player2: '' });
  const [loading, setLoading] = useState(false);
  const [playerNames, setPlayerNames] = useState([]);
  const [gameData, setGameData] = useState([]);

  const updatePlayer = (evt) => {
    setPlayers({ ...players, [evt.target.name]: evt.target.value });
  };

  const goCompare = () => {
    if (players.player1.length > 0 && players.player2.length > 0) {
      fetch(
        `http://localhost:1337/api/v1/versus/${players.player1}/${players.player2}`
      )
        .then((response) => response.json())
        .then((data) => {
          setGameData(data);
          setLoading(false);
        });
    } else {
      alert('You need to fill in both players to see versus stats');
    }
  };

  useEffect(() => {
    updatePageTitle('Compare player stats');
  }, [updatePageTitle]);

  useEffect(() => {
    //load player name options
    fetch('http://localhost:1337/api/v1/players')
      .then((response) => response.json())
      .then((data) => {
        setPlayerNames(data);
      });
  }, []);
  return (
    <div>
      <div className='bg-sec-background rounded-lg p-6 m-6'>
        <div className='flex flex-col md:flex-row text-center'>
          <div className='md:text-left md:w-1/2 flex flex-col'>
            <label htmlFor='player1'>Player 1</label>
            <select
              name='player1'
              value={players.player1}
              onChange={updatePlayer}
            >
              {playerNames.length > 0 ? (
                <>
                  <option value='0'></option>
                  {playerNames.map((player) => (
                    <option key={player.player_ID} value={player.player_ID}>
                      {player.name}
                    </option>
                  ))}
                </>
              ) : (
                <option value='0'></option>
              )}
            </select>
          </div>
          <div className='md:text-right md:w-1/2 flex flex-col'>
            <label htmlFor='player2'>Player 2</label>
            <select
              name='player2'
              value={players.player2}
              onChange={updatePlayer}
            >
              {playerNames.length > 0 ? (
                <>
                  <option value='0'></option>
                  {playerNames.map((player) => (
                    <option key={player.player_ID} value={player.player_ID}>
                      {player.name}
                    </option>
                  ))}
                </>
              ) : (
                <option value='0'></option>
              )}
            </select>
          </div>
        </div>
        <div className='text-center mt-2'>
          <button
            className='bg-primary-text hover:bg-positive text-secondary font-bold py-2 px-4 rounded w-1/2'
            onClick={goCompare}
          >
            GO
          </button>
        </div>
      </div>
      <Card title='Games'>
        {gameData.length > 0 ? (
          gameData.map((game) => <Match key={game.game_ID} game={game} />)
        ) : (
          <div>No games played ⚠</div>
        )}
      </Card>

      <div>
        notes
        <div>WINS</div>
        <div>Win %</div>
        <div>times played</div>
        <div>recent results</div>
      </div>
      <Swatch />
    </div>
  );
}
