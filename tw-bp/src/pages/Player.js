import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

//should i use fetchPlayerOverview here too?
export function Player({ updatePageTitle }) {
  const { playerId } = useParams();
  const [playerData, setPlayerData] = useState({});
  const [loading, setLoading] = useState(true);

  //set page title
  useEffect(() => {
    //probably fill this in with name / or doesnt exist after loaded player details
    updatePageTitle(`Player: ${playerId}`);
  }, [updatePageTitle, playerId]);

  //load details
  useEffect(() => {
    if (playerId !== undefined) {
      setLoading(true);
      fetchPlayer(playerId).then((player) => {
        setPlayerData(player[0]);
      });
    }
  }, [playerId]);

  return (
    <div>
      <div>hi</div>
      {playerData && <div>{playerData.name}</div>}
    </div>
  );
}

async function fetchPlayer(playerId) {
  const player = await fetch(
    `http://localhost:1337/api/v1/players/${playerId}`
  );
  const resp = await player.json();
  return resp;
}
