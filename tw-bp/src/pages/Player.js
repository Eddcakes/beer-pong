import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Nav, Container } from '../components';
import AuthContext from '../AuthContext';

//should i use fetchPlayerOverview here too?
export function Player({ updatePageTitle }) {
  const { playerId } = useParams();
  const [playerData, setPlayerData] = useState({});
  //const [loading, setLoading] = useState(true);

  //set page title
  useEffect(() => {
    //probably fill this in with name / or doesnt exist after loaded player details
    updatePageTitle(`Player: ${playerId}`);
  }, [updatePageTitle, playerId]);

  //load details
  useEffect(() => {
    //if no parameter is passed to the route then its undefined
    if (playerId !== undefined) {
      //setLoading(true);
      fetchPlayer(playerId).then((player) => {
        setPlayerData(player[0]);
      });
    } else {
      //use Auth provider
      // if no user is selected in the URL we can default to the current user
      // would we want to auto add this user id to the URL automatically?
    }
  }, [playerId]);

  return (
    <AuthContext.Consumer>
      {({ user }) => (
        <>
          <Nav />
          <Container>
            <div>
              {user === null || user === undefined
                ? 'You can log in here or search for a user!'
                : `hi ${user.username}`}
            </div>
            {playerData && <div>{playerData.name}</div>}
          </Container>
        </>
      )}
    </AuthContext.Consumer>
  );
}

async function fetchPlayer(playerId) {
  const player = await fetch(
    `http://localhost:1337/api/v1/players/${playerId}`
  );
  const resp = await player.json();
  return resp;
}
