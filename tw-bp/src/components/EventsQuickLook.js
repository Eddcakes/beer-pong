import { Link } from 'react-router-dom';

import placeholderImg from '../assets/evt-placeholder.jpg';
/* sidebar on homepage */
export function EventsQuickLook() {
  /* on larger screens should be at the side of main content, on mobile underneath */
  return (
    <>
      <h2>
        <Link
          to='/events'
          className='text-link-text hover:underline text-3xl font-semibold'
        >
          Events
        </Link>
      </h2>
      <div>
        <h3 className='text-right italic bg-sec-background pr-4'>Upcoming</h3>
        <Short id={1} title='Example to show in the section' date='13/01/22' />
        <Short id={2} title='dfa fdasfd g fsa hsgf adsf gfsdf' />
        <Short id={3} title='lorem gfsd asdf gfds gfsd' />
      </div>
      <div>
        <h3 className='text-right italic bg-sec-background pr-4'>Previous</h3>
        <Short id={4} title='Example to show in the section' />
        <Short id={5} title='dfa fdasfd g fsa hsgf adsf gfsdf' />
        <Short id={6} title='lorem gfsd asdf gfds gfsd' />
      </div>
    </>
  );
}

function Short({ image = '', id, title, date }) {
  return (
    <div className='grid grid-cols-6 gap-4'>
      <img
        src={placeholderImg}
        className='object-contain h-24 w-24 col-span-2'
        alt='Event preview'
      />
      <div className='p-2 col-span-4 flex flex-col justify-between'>
        <Link
          to={`/event/${id}`}
          className='font-semibold text-link-text hover:underline'
        >
          {title}
        </Link>
        <span className='text-right font-bold'>{date}</span>
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
