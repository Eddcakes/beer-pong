import React, { useEffect, useState } from 'react';
import { Swatch } from '../components/Swatch';
import { Card } from '../components/Card';
import { Match } from '../components/Match';
import { PlayerPicker } from '../components/PlayerPicker';

/* could have some defaults like *current player -> player 1 by default
  if only one player filled in - fetch player stats not the comparison stats?
*/

export function Versus({ updatePageTitle }) {
  const [players, setPlayers] = useState({
    player1: '',
    player2: '',
  });
  const [loading, setLoading] = useState(false);
  const [playerNames, setPlayerNames] = useState([]);
  const [gameData, setGameData] = useState([]);

  const selectPlayer = (name, value) => {
    setPlayers({ ...players, [name]: value });
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
      <Card title='Player search'>
        <div className='flex justify-between p-2'>
          <PlayerPicker
            players={players}
            playerNames={playerNames}
            name='player1'
            selectPlayer={selectPlayer}
          />
          <PlayerPicker
            players={players}
            playerNames={playerNames}
            name='player2'
            selectPlayer={selectPlayer}
          />
        </div>

        <div className='text-center mt-2'>
          <button
            className='bg-primary-text hover:bg-positive text-secondary font-bold py-2 px-4 rounded w-1/2'
            onClick={goCompare}
          >
            GO
          </button>
        </div>
      </Card>

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
