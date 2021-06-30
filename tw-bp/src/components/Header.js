import { Nav, Logo, Menu, Search } from '../components';

export function Header() {
  return (
    <header className='flex items-center justify-between h-20 py-3 shadow'>
      <Logo />
      <Nav />
      <Search />
      <Menu />
    </header>
  );
}
