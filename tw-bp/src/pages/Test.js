import React, { useEffect } from 'react';

import { Button, Header, Card, Match, Container, Swatch } from '../components';
import { AuthContext } from '../contexts';

export function Test({ updatePageTitle }) {
  const testGame = {
    home_name: 'home player',
    home_id: 1,
    homeCupsLeft: 0,
    away_name: 'away player',
    away_id: 2,
    awayCupsLeft: 3,
    event: 'some event',
    date: 'new Date()',
    venue: 'soeme venue',
    notes: 'notes',
  };

  useEffect(() => {
    //probably fill this in with name / or doesnt exist after loaded player details
    updatePageTitle(`Test components page`);
  }, [updatePageTitle]);
  return (
    <AuthContext.Consumer>
      {({ user }) => (
        <>
          <Header />
          <Container>
            <div>
              Auth check:
              {user === null || user === undefined
                ? 'You can log in here or search for a user!'
                : `hi ${user.username}`}
            </div>
            <div className='text-center space-y-2'>
              <div>
                <Button variant='square' text='square button' />
              </div>
              <div>
                <Button
                  variant='square'
                  color='outlined'
                  text='square button outlined'
                />
              </div>
              <div>
                <Button text='regular button' color='outlined' />
              </div>
              <div>
                <Button text='disabled button' color='outlined' disabled />
              </div>
              <div>
                <Button text='link as button' to='/test' color='outlined' />
              </div>
              <div>
                <Button
                  text='square link as button'
                  to='/test'
                  variant='square'
                  color='outlined'
                />
              </div>
            </div>
            <div>
              <Card title='title of cart'>can take children</Card>
            </div>
            <div>
              <Match details={testGame} />
            </div>
            <div>
              <Card title='Match'>
                <Match details={testGame} />
              </Card>
            </div>
            <div></div>
            <Swatch />
          </Container>
        </>
      )}
    </AuthContext.Consumer>
  );
}
