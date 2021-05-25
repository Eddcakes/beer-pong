import { useEffect, useState } from 'react';
import { MatchGrid } from './MatchGrid';

export function TournamentDetail({ id }) {
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState({});
  const [games, setGames] = useState([]);
  useEffect(() => {
    const getTournamentById = async () => {
      fetchTournamentById(id).then((tournament) => {
        setDetail(tournament[0]);
      });
    };
    const getGames = async () => {
      fetchGamesByTournamentId(id).then((data) => {
        setGames(data);
      });
    };
    if (id != null) {
      Promise.all([getTournamentById(), getGames()]).then((values) => {
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [id]);
  return (
    <div>
      <div>This is Tournament: {id}</div>
      {loading ? 'loading...' : null}
      {!loading && detail ? (
        <>
          <div className='overflow-auto'>details: {JSON.stringify(detail)}</div>
          {games.length > 0 ? (
            <>
              <h2 className='text-lg'>Games</h2>
              <MatchGrid games={games} />
            </>
          ) : null}
        </>
      ) : null}
    </div>
  );
}

async function fetchTournamentById(id) {
  const player = await fetch(
    `${process.env.REACT_APP_BACKEND_URL}/api/v1/tournaments/${id}`
  );
  const resp = await player.json();
  return resp;
}

async function fetchGamesByTournamentId(id) {
  const player = await fetch(
    `${process.env.REACT_APP_BACKEND_URL}/api/v1/games/tournament/${id}`
  );
  const resp = await player.json();
  return resp;
}
