import React, { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

import { Nav, Card, Avatar } from '../components';

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
      <div></div>
      <Card title='Placeholder'>
        <div className='text-primary-text'>
          <Avatar />
        </div>
        <p>
          {user === null || user === undefined
            ? 'default home settings'
            : `hi ${user.username}`}
        </p>
      </Card>
    </>
  );
}

<>
  <Nav />
</>;
