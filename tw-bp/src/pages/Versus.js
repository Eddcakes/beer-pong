import React, { useCallback, useEffect, useState } from 'react';
import { Card } from '../components/Card';
import { Match } from '../components/Match';
import { PlayerPicker } from '../components/PlayerPicker';
import { PlayerOverview } from '../components/PlayerOverview';
import { Header, Container } from '../components';
import { useHistory } from 'react-router';

export function Versus({ updatePageTitle }) {
  let history = useHistory();
  const [players, setPlayers] = useState({
    player1: '',
    player2: '',
  });
  const [playerNames, setPlayerNames] = useState([]);
  const [gameData, setGameData] = useState([]);
  const [playerOverview, setPlayerOverview] = useState([]);

  const selectPlayer = useCallback(
    (name, value) => {
      //how to prevent picking the same player?
      setPlayers((previous) => ({ ...previous, [name]: value }));
      // split path
      const sp = history.location.pathname.split('/');
      fetchPlayerOverview(value).then((overview) => {
        if (name === 'player1') {
          if (isIntOrStringInt(value)) {
            setPlayerOverview((previous) => {
              return previous.length > 1
                ? [overview[0], previous[1]]
                : [overview[0]];
            });
            history.push(`${[sp[0], sp[1], value, sp[3]].join('/')}`);
          } else {
            history.push(`${[sp[0], sp[1]].join('/')}`);
          }
        } else {
          if (isIntOrStringInt(value)) {
            setPlayerOverview((previous) => [previous[0], overview[0]]);
            history.push(`${[sp[0], sp[1], sp[2], value].join('/')}`);
          }
        }
      });
    },
    [history]
  );

  const goCompare = (player1, player2) => {
    if (player1.length > 0 && player2.length > 0) {
      fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/versus/${player1}/${player2}`
      )
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
    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/players`, {
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((data) => {
        setPlayerNames(data);
      });
  }, []);

  useEffect(() => {
    // joi validation for path?
    const splitPath = window.location.pathname.split('/');
    const player1Id = splitPath[2];
    const player2Id = splitPath[3];
    // maybe move check for exist into selectPlayer
    if (playerNames.length > 0) {
      let player1Exists = playerNames.some(
        (player) => player.player_ID === Number(player1Id)
      );
      if (player1Exists) {
        selectPlayer('player1', player1Id);
        // if player exists then check player 2
        if (isIntOrStringInt(player2Id)) {
          let player2Exists = playerNames.some(
            (player) => player.player_ID === Number(player2Id)
          );
          if (player2Exists) {
            selectPlayer('player2', player2Id);
          }
        }
      }
    }
  }, [playerNames, selectPlayer]);

  //when player changes goCompare
  useEffect(() => {
    if (players.player1.length > 0 && players.player2.length > 0) {
      goCompare(players.player1, players.player2);
    }
  }, [players]);

  return (
    <>
      <Header />
      <Container>
        <div className='p-6'>
          <Card title='Player search'>
            <div className='flex justify-around p-2'>
              <PlayerPicker
                playerNames={playerNames}
                selected={players['player1']}
                name='player1'
                selectPlayer={selectPlayer}
              />
              <PlayerPicker
                playerNames={playerNames}
                selected={players['player2']}
                name='player2'
                selectPlayer={selectPlayer}
                disabled={players.player1.length < 1}
              />
            </div>
          </Card>
          {players.player1.length > 0 || players.player2.length > 0 ? (
            <>
              <Card title='Overview'>
                <PlayerOverview details={playerOverview} />
              </Card>
              <Card title='Games'>
                <div className='grid md:grid-cols-3 gap-4'>
                  {gameData.length > 0 ? (
                    gameData.map((game) => (
                      <Match key={game.game_ID} details={game} />
                    ))
                  ) : (
                    <div>No games played ⚠</div>
                  )}
                </div>
              </Card>
            </>
          ) : null}
        </div>
      </Container>
    </>
  );
}

function isIntOrStringInt(param) {
  return param === '' ? false : Number.isInteger(Number(param));
}

async function fetchPlayerOverview(playerId) {
  const overviewResp = await fetch(
    `${process.env.REACT_APP_BACKEND_URL}/api/v1/overview/${playerId}`
  );
  const overview = await overviewResp.json();
  return overview;
}
