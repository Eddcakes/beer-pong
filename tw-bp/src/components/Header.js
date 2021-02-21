import { Nav } from './Nav';
import { Logo } from './Logo';

export function Header() {
  return (
    <header>
      <div className='flex items-center justify-between'>
        <Logo />
        <Nav />
        <div>avatar btn</div>
      </div>
    </header>
  );
}
