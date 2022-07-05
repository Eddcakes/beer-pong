import { Link } from 'react-router-dom';
import { CircleRight } from '../icons';

export function Match({ details }) {
  return (
    <div className='shadow px-2 py-2 space-y-4'>
      <div className='flex flex-col justify-between h-full'>
        <MatchHeader
          venue={details.venue}
          tournamentGame={!!details.tournament_id}
          stage={details.stage}
        />
        <MatchDetails
          event={details.event}
          home={{
            id: details.home_id,
            name: details.home_name,
            cupsLeft: details.home_cups_left,
          }}
          away={{
            id: details.away_id,
            name: details.away_name,
            cupsLeft: details.away_cups_left,
          }}
        />
        <MatchFooter date={details.date} matchId={details.id} />
      </div>
    </div>
  );
}

function MatchHeader({ venue, tournamentGame, stage }) {
  return (
    <div className='flex justify-between text-xs font-semibold'>
      <div>{venue}</div>
      <div>{tournamentGame ? stage : 'friendly'} </div>
    </div>
  );
}

function MatchFooter({ date, matchId }) {
  return (
    <div className='flex justify-between items-end'>
      <div className='text-xs'>{date && formatDateString(date)}</div>
      <Link
        className='text-primary hover:text-primary-light'
        to={`/games/${matchId}`}
        title='match details'
      >
        <CircleRight role='img' aria-label='Open game details' />
      </Link>
    </div>
  );
}

function MatchDetails({ event, home, away }) {
  const isWinner = (cupsLeft) => {
    return cupsLeft === 0 ? true : false;
  };
  return (
    <>
      <div className='text-center'>
        <div className='font-bold'>{event || '-'}</div>
      </div>
      <div className='pt-2 grid grid-cols-2 text-center'>
        <div>
          <Link
            className={`text-link-text underline relative ${
              isWinner(away.cupsLeft) && 'psudo-winner'
            }`}
            to={`/player/${home.id}`}
          >
            {home.name}
          </Link>
          <div>{home.cupsLeft}</div>
        </div>
        <div>
          <Link
            className={`text-link-text underline relative ${
              isWinner(home.cupsLeft) && 'psudo-winner'
            }`}
            to={`/player/${away.id}`}
          >
            {away.name}
          </Link>
          <div>{away.cupsLeft}</div>
        </div>
      </div>
    </>
  );
}

const formatDateString = (dateString) => {
  let justDateString = dateString.split('T')[0].split('-').reverse().join('-');
  return justDateString;
};
