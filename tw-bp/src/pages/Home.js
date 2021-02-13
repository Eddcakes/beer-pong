import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

import { Nav, Container, Card, Avatar } from '../components';
import AuthContext from '../AuthContext';

//should i use fetchPlayerOverview here too?
export function Home({ updatePageTitle }) {
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
    <AuthContext.Consumer>
      {({ user }) => (
        <>
          <Nav />
          <Container>
            <div>
              {user === null || user === undefined
                ? 'default home settings'
                : `hi ${user.username}`}
            </div>
            <Card title='Placeholder'>
              <div className='text-primary-text'>
                <Avatar />
              </div>
              <Link to='/test' className='text-link-text hover:underline'>
                Test page
              </Link>
            </Card>
          </Container>
        </>
      )}
    </AuthContext.Consumer>
  );
}

<>
  <Nav />
</>;
