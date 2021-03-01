import { Nav } from './Nav';
import { Logo } from './Logo';
import { Menu } from './Menu';

export function Header() {
  return (
    <header className='flex items-center justify-between h-24 py-3'>
      <Logo />
      <Nav />
      <Menu />
    </header>
  );
}
