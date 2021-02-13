import React, { useEffect, useState } from 'react';
import {
  Button,
  ButtonSquare,
  Nav,
  Card,
  Match,
  Container,
  Swatch,
} from '../components';
import AuthContext from '../AuthContext';

export function Test({ updatePageTitle }) {
  const [players, setPlayers] = useState([]);

  const testGame = {
    home: 'home player',
    homeCupsLeft: 0,
    away: 'away player',
    awayCupsLeft: 3,
    event: 'some event',
    date: 'new Date()',
    venue: 'soeme venue',
    notes: 'notes',
  };

  useEffect(() => {
    //probably fill this in with name / or doesnt exist after loaded player details
    updatePageTitle(`Test components page`);
    fetch('http://localhost:1337/api/v1/players')
      .then((response) => response.json())
      .then((data) => {
        setPlayers(data);
      });
  }, [updatePageTitle]);
  return (
    <AuthContext.Consumer>
      {({ user }) => (
        <>
          <Nav />
          <Container>
            <div>
              Auth check:
              {user === null || user === undefined
                ? 'You can log in here or search for a user!'
                : `hi ${user.username}`}
            </div>
            <div className='text-center space-y-2'>
              <div>
                <ButtonSquare text='square button' />
              </div>
              <div>
                <Button text='regular button' />
              </div>
            </div>
            <div>
              <Card title='title of cart'>can take children</Card>
            </div>
            <div>
              <Match game={testGame} />
            </div>
            <div>
              <Card title='Match'>
                <Match game={testGame} />
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
