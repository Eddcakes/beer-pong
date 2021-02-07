import React, { useEffect, useState } from 'react';
import { Swatch } from '../components/Swatch';
import { Card } from '../components/Card';
import { Match } from '../components/Match';
import { PlayerPicker } from '../components/PlayerPicker';
import { PlayerOverview } from '../components/PlayerOverview';
import { Nav, Container } from '../components';

/* could have some defaults like *current player -> player 1 by default
  if only one player filled in - fetch player stats not the comparison stats?
*/

export function Versus({ updatePageTitle }) {
  const [players, setPlayers] = useState({
    player1: '',
    player2: '',
  });
  const [playerNames, setPlayerNames] = useState([]);
  const [gameData, setGameData] = useState([]);
  //can ichange player1 to be details object rather than array
  const [playerOverview, setPlayerOverview] = useState({
    player1: {},
    player2: {},
  });

  const selectPlayer = (name, value) => {
    //how to prevent picking the same player?
    setPlayers({ ...players, [name]: value });
    // fetch player overview
    fetchPlayerOverview(value).then((overview) => {
      setPlayerOverview({ ...playerOverview, [name]: overview[0] });
    });
  };

  const goCompare = (player1, player2) => {
    if (player1.length > 0 && player2.length > 0) {
      fetch(`http://localhost:1337/api/v1/versus/${player1}/${player2}`)
        .then((response) => response.json())
        .then((data) => {
          setGameData(data);
        });
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

  //when player changes goCompare
  useEffect(() => {
    if (players.player1.length > 0 && players.player2.length > 0) {
      goCompare(players.player1, players.player2);
    }
  }, [players]);

  return (
    <>
      <Nav />
      <Container>
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
        </Card>
        {players.player1.length > 0 || players.player2.length > 0 ? (
          <>
            <Card title='Overview'>
              <PlayerOverview details={playerOverview} />
            </Card>
            <Card title='Games'>
              {gameData.length > 0 ? (
                gameData.map((game) => <Match key={game.game_ID} game={game} />)
              ) : (
                <div>No games played ⚠</div>
              )}
            </Card>
          </>
        ) : null}

        <Swatch />
      </Container>
    </>
  );
}

async function fetchPlayerOverview(playerId) {
  const overviewResp = await fetch(
    `http://localhost:1337/api/v1/overview/${playerId}`
  );
  const overview = await overviewResp.json();
  return overview;
}
