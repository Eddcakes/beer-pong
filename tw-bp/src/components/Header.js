import { Nav } from './Nav';
import { Logo } from './Logo';
import { Menu } from './Menu';

export function Header() {
  return (
    <header className='flex items-center justify-between h-20 py-3 shadow'>
      <Logo />
      <Nav />
      <Menu />
    </header>
  );
}
