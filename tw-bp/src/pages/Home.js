import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

import {
  Header,
  Container,
  Card,
  Avatar,
  EventsQuickLook,
  News,
} from '../components';
import { useAuth } from '../hooks/useAuth';

//should i use fetchPlayerOverview here too?
export function Home({ updatePageTitle }) {
  const { user } = useAuth();
  /* 
    would we want the home page to be customiseable by a logged in user?
    news
    events
    Friendly
    Competition
  */
  useEffect(() => {
    updatePageTitle(`Home`);
  }, [updatePageTitle]);

  return (
    <>
      <Header />
      <Container>
        <div className='grid grid-cols-6 gap-4 p-6'>
          <section className='col-span-6 md:col-span-4'>
            <News />
            <Card title='Placeholder'>
              <div className='text-primary-text'>
                <Avatar />
              </div>
              <p>{user ? `hi ${user.username}` : 'default home settings'}</p>
              <div className='flex flex-col'>
                <Link to='/test' className='text-link-text hover:underline'>
                  Test page
                </Link>
                <Link to='/game/new' className='text-link-text hover:underline'>
                  new game
                </Link>
              </div>
            </Card>
          </section>
          <aside className='col-span-6 md:col-span-2 md:border-l-2 p-4'>
            <EventsQuickLook />
          </aside>
        </div>
      </Container>
    </>
  );
}
