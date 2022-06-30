import { Link } from 'react-router-dom';

import { Header, Container, TournamentList, News } from '../components';
import { usePageTitle } from '../hooks/usePageTitle';

export function Home() {
  usePageTitle('Home');

  return (
    <>
      <Header />
      <Container>
        <div className='grid grid-cols-6 gap-4'>
          <section className='col-span-6 md:col-span-4 space-y-6'>
            <News />
          </section>
          <aside className='col-span-6 md:col-span-2 md:border-l-2 p-4'>
            <h2>
              <Link
                to='/tournaments'
                className='text-link-text hover:underline text-3xl font-semibold'
              >
                Events
              </Link>
            </h2>
            <TournamentList />
          </aside>
        </div>
      </Container>
    </>
  );
}
