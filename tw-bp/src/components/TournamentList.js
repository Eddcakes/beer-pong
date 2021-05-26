import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import placeholderImg from '../assets/evt-placeholder.jpg';
/* sidebar on homepage */
export function TournamentList() {
  const [tournaments, setTournaments] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const getGameDetails = await fetchTournaments();
      if (getGameDetails.length > 0) {
        setTournaments(getGameDetails);
      }
    }
    fetchData();
  }, []);
  return (
    <>
      <div>
        <h3 className='text-right italic bg-sec-background pr-4'>Upcoming</h3>
        {tournaments
          .filter((event) => {
            const date = new Date(event.date);
            return date > new Date();
          })
          .map((t) => (
            <Short
              key={`${t.tournament_ID}`}
              id={t.tournament_ID}
              title={t.title}
              date={t.date}
            />
          ))}
      </div>
      <div>
        <h3 className='text-right italic bg-sec-background pr-4'>Previous</h3>
        {tournaments
          .filter((event) => {
            const date = new Date(event.date);
            return date < new Date();
          })
          .map((t) => (
            <Short
              key={`${t.tournament_ID}`}
              id={t.tournament_ID}
              title={t.title}
              date={t.date}
            />
          ))}
      </div>
    </>
  );
}

function Short({ image = '', id, title, date }) {
  const shortDate = new Date(date).toLocaleDateString('en-GB');
  return (
    <div className='grid grid-cols-6 gap-4'>
      <img
        src={placeholderImg}
        className='object-contain h-24 w-24 col-span-2'
        alt='Event preview'
      />
      <div className='p-2 col-span-4 flex flex-col justify-between'>
        <Link
          to={`/tournaments/${id}`}
          className='font-semibold text-link-text hover:underline'
        >
          {title}
        </Link>
        <span className='text-right font-bold'>{shortDate}</span>
      </div>
    </div>
  );
}

/* 
      <figure className='relative col-span-2'>
        <img
          src={placeholderImg}
          className='object-contain h-24 w-24'
          alt='Event preview'
        />
        <figcaption className='absolute font-semibold text-white -mt-10'>
          {date}
        </figcaption>
*/

async function fetchTournaments() {
  try {
    const tournaments = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/v1/tournaments/`,
      {
        credentials: 'include',
      }
    );
    const resp = await tournaments.json();
    return resp;
  } catch (err) {
    throw new Error(err);
  }
}
