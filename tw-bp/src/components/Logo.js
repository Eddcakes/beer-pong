import logo from '../assets/beer-pong.svg';

export function Logo() {
  return (
    <div className='px-4'>
      <img src={logo} alt='logo' className='w-16' />
    </div>
  );
}
