import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';

import placeholderImg from '../../assets/evt-placeholder.jpg';
import { fetchTournaments } from '../../queries';

export function TournamentList() {
  const { isLoading, error, data } = useQuery('tournaments', fetchTournaments);
  const todaysDate = new Date();
  const [previousEvents, upcomingEvents] = splitDataByDate(todaysDate, data);

  if (error) {
    <div>Error with tournaments</div>;
  }
  return (
    <>
      <div>
        <h3 className='text-right italic bg-sec-background pr-4'>Upcoming</h3>
        {isLoading && <div>loading...</div>}
        {upcomingEvents.length > 0 ? (
          upcomingEvents.map((t) => (
            <Short key={`${t.id}`} id={t.id} title={t.title} date={t.date} />
          ))
        ) : (
          <div className='px-2 py-8'>Maybe we should plan something...</div>
        )}
      </div>
      <div>
        <h3 className='text-right italic bg-sec-background pr-4'>Previous</h3>
        {isLoading && <div>loading...</div>}
        {previousEvents.map((t) => (
          <Short key={`${t.id}`} id={t.id} title={t.title} date={t.date} />
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

function splitDataByDate(checkDate, data) {
  let before = [];
  let after = [];
  if (data) {
    data.forEach((event) => {
      const eventDate = new Date(event.date);
      if (eventDate > checkDate) {
        after.push(event);
      } else {
        before.push(event);
      }
    });
  }
  return [before, after];
}
