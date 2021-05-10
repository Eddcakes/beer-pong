import { Link } from 'react-router-dom';

import logo from '../assets/beer-pong.svg';

export function Logo() {
  return (
    <div className='px-4'>
      <Link to='/'>
        <img src={logo} alt='logo with link home' className='w-16' />
      </Link>
    </div>
  );
}
