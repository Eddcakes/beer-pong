import { Link } from 'react-router-dom';

import { Table, Td, Th } from '../layout';

export function Standings({ details }) {
  const standings = createStandings(details);
  return (
    <Table>
      <thead>
        <tr>
          <Th aria-label='position'>#</Th>
          <Th>Player</Th>
          <Th>Won</Th>
          <Th>Lost</Th>
          <Th>Cup difference</Th>
          <Th hideSmall>Form</Th>
        </tr>
      </thead>
      <tbody>
        {sortStandings(standings).map((stats, idx) => {
          return <StandingsRow key={stats.id} details={stats} rank={idx + 1} />;
        })}
      </tbody>
    </Table>
  );
}

function StandingsRow({ details, rank }) {
  return (
    <tr>
      <Td>{rank}</Td>
      <Td>
        <Link className='text-link-text underline' to={`/player/${details.id}`}>
          {details.name}
        </Link>
      </Td>
      <Td>{details.won}</Td>
      <Td>{details.lost}</Td>
      <Td>{details.cupDifference}</Td>
      <Td hideSmall>
        {details.history.map((g) => (
          <FormBadge key={g.against} result={g.result} />
        ))}
      </Td>
    </tr>
  );
}

function FormBadge({ result }) {
  const bg = result.toUpperCase() === 'W' ? 'bg-positive' : 'bg-negative';
  return (
    <span className={`${bg} text-white p-2 mx-1 font-mono text`}>{result}</span>
  );
}

function createStandings(games) {
  let players = [];
  let seen = [];
  games.forEach((game) => {
    let winner = null;
    if (game.home_cups_left === 0) {
      winner = game.away_id;
    } else if (game.away_cups_left === 0) {
      winner = game.home_id;
    }
    if (!seen.includes(game.home_id)) {
      seen.push(game.home_id);
      players.push({
        id: game.home_id,
        name: game.home_name,
        won: 0,
        lost: 0,
        cupDifference: 0,
        history: [],
      });
    }
    if (!seen.includes(game.away_id)) {
      seen.push(game.away_id);
      players.push({
        id: game.away_id,
        name: game.away_name,
        won: 0,
        lost: 0,
        cupDifference: 0,
        history: [],
      });
    }
    if (winner == null) return;
    const homeIdx = seen.indexOf(game.home_id);
    const awayIdx = seen.indexOf(game.away_id);
    if (winner === game.home_id) {
      players[homeIdx].won += 1;
      players[homeIdx].history.push({ against: game.away_id, result: 'W' });
    } else {
      players[homeIdx].lost += 1;
      players[homeIdx].history.push({ against: game.away_id, result: 'L' });
    }
    if (winner === game.away_id) {
      players[awayIdx].won += 1;
      players[awayIdx].history.push({ against: game.home_id, result: 'W' });
    } else {
      players[awayIdx].lost += 1;
      players[awayIdx].history.push({ against: game.home_id, result: 'L' });
    }
    players[homeIdx].cupDifference += game.home_cups_left - game.away_cups_left;
    players[awayIdx].cupDifference += game.away_cups_left - game.home_cups_left;
  });
  return players;
}

function sortStandings(rankedGames) {
  return [...rankedGames].sort((a, b) => {
    if (a.won > b.won) {
      return -1;
    }
    if (a.won < b.won) {
      return 1;
    }
    if (a.won === b.won) {
      if (a.cupDifference > b.cupDifference) {
        return -1;
      }
      if (a.cupDifference < b.cupDifference) {
        return 1;
      }
      if (a.cupDifference === b.cupDifference) {
        const h2hResult = a.history.find((res) => res.against === b.id);
        if (h2hResult.result === 'W') {
          return -1;
        }
        if (h2hResult.result === 'L') {
          return 1;
        }
        return 0;
      }
      return 0;
    }
    return 0;
  });
}
