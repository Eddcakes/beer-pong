import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

import { Nav, Container, Card, Avatar } from '../components';
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
      <Nav />
      <Container>
        <Card title='Placeholder'>
          <div className='text-primary-text'>
            <Avatar />
          </div>
          <p>{user ? `hi ${user.username}` : 'default home settings'}</p>
          <Link to='/test' className='text-link-text hover:underline'>
            Test page
          </Link>
        </Card>
      </Container>
    </>
  );
}
