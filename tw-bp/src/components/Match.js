import { Link } from 'react-router-dom';

export function Match({ details }) {
  const isWinner = (cupsLeft) => {
    return cupsLeft === 0 ? true : false;
  };
  return (
    <div className='shadow px-4 pb-4 space-y-2'>
      <div className='flex justify-between text-xs font-semibold'>
        <div>{details.venue}</div>
        <div>{details.tournament_id ? details.stage : 'friendly'} </div>
      </div>
      <div className='text-center'>
        <div className='font-bold'>{details.event}</div>
        <div className='text-xs'>
          {details.date && formatDateString(details.date)}
        </div>
      </div>
      <div className='grid grid-cols-2 text-center'>
        <div>
          <Link
            className={`text-link-text underline relative ${
              isWinner(details.away_cups_left) && 'psudo-winner'
            }`}
            to={`/player/${details.home_id}`}
          >
            {details.home_name}
          </Link>
          <div>{details.home_cups_left}</div>
        </div>
        <div>
          <Link
            className={`text-link-text underline relative ${
              isWinner(details.home_cups_left) && 'psudo-winner'
            }`}
            to={`/player/${details.away_id}`}
          >
            {details.away_name}
          </Link>
          <div>{details.away_cups_left}</div>
        </div>
      </div>
      <div className='text-right'>
        <Link className='text-link-text underline' to={`/games/${details.id}`}>
          details...
        </Link>
      </div>
    </div>
  );
}

const formatDateString = (dateString) => {
  let justDateString = dateString.split('T')[0].split('-').reverse().join('-');
  return justDateString;
};
