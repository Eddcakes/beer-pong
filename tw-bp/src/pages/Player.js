import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Header, Container, PlayerOverview } from '../components';
import { useAuth } from '../hooks/useAuth';

/* add last 5 games */
export function Player({ updatePageTitle }) {
  const auth = useAuth();
  const { playerId } = useParams();
  const [loading, setLoading] = useState(true);
  const [playerData, setPlayerData] = useState({});
  const [playerOverview, setPlayerOverview] = useState([]);
  const [playerRecords, setPlayerRecords] = useState([]);
  const [playerNicks, setPlayerNicks] = useState([]);

  //set page title
  useEffect(() => {
    //probably fill this in with name / or doesnt exist after loaded player details
    updatePageTitle(`Player: ${playerId}`);
  }, [updatePageTitle, playerId]);

  useEffect(() => {
    const getPlayer = async () => {
      fetchPlayer(playerId).then((player) => {
        setPlayerData(player[0]);
      });
    };
    const getOverview = async () => {
      fetchPlayerOverview(playerId).then((overview) => {
        setPlayerOverview(overview[0]);
      });
    };
    const getRecords = async () => {
      fetchPlayerRecords(playerId).then((records) => {
        setPlayerRecords(records);
      });
    };
    const getNicks = async () => {
      fetchNicks(playerId).then((nicks) => {
        setPlayerNicks(nicks);
      });
    };
    //if no parameter is passed to the route then its undefined
    if (playerId !== undefined) {
      Promise.all([getPlayer(), getOverview(), getRecords(), getNicks()]).then(
        (values) => {
          setLoading(false);
        }
      );
    } else {
      setLoading(false);
    }
  }, [playerId]);
  return (
    <>
      <Header />
      <Container maxW='max-w-screen-md'>
        <div className='p-6 space-y-4'>
          {loading ? 'loading...' : null}
          {!loading && playerData ? (
            <>
              <div className='flex flex-row'>
                <div>{playerData.name}</div>

                <ul>
                  {playerNicks
                    .filter((name) => name.nick !== playerData.name)
                    .map((nick) => {
                      return (
                        <li key={`${nick.nick}${nick.nick_ID}`}>{nick.nick}</li>
                      );
                    })}
                </ul>
              </div>

              <PlayerOverview
                details={{ player1: playerOverview, player2: '' }}
              />
              {playerRecords.map((record) => {
                return <div key={record.record_ID}>{record.label}🥇</div>;
              })}
            </>
          ) : (
            `Cannot find player data for playerId: ${playerId}`
          )}
        </div>
      </Container>
    </>
  );
}

async function fetchPlayer(playerId) {
  const player = await fetch(
    `${process.env.REACT_APP_BACKEND_URL}/api/v1/players/${playerId}`
  );
  const resp = await player.json();
  return resp;
}

async function fetchPlayerOverview(playerId) {
  const overviewResp = await fetch(
    `${process.env.REACT_APP_BACKEND_URL}/api/v1/overview/${playerId}`
  );
  const overview = await overviewResp.json();
  return overview;
}

async function fetchPlayerRecords(playerId) {
  const records = await fetch(
    `${process.env.REACT_APP_BACKEND_URL}/api/v1/records/player/${playerId}`
  );
  const resp = await records.json();
  return resp;
}

async function fetchNicks(playerId) {
  const nicks = await fetch(
    `${process.env.REACT_APP_BACKEND_URL}/api/v1/nicknames/player/${playerId}`
  );
  const resp = await nicks.json();
  return resp;
}
