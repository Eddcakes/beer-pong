import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import { ThemeProvider } from './ThemeProvider';
import { Card, Nav } from './components';
import { applyTheme, DEFAULT_THEME } from './theme';
import {
  E404,
  Player,
  Settings,
  Tournament,
  Versus,
  SignIn,
  SignUp,
} from './pages';
import { Avatar } from './components/Avatar';

const defaultTheme = () => {
  if (localStorage.getItem('tw-bp:theme'))
    return localStorage.getItem('tw-bp:theme');
  if (window.matchMedia && window.matchMedia('prefers-color-scheme: dark')) {
    return 'dark';
  } else {
    return DEFAULT_THEME;
  }
};

function App() {
  //probably want a authentication provider so in <Route render can redirect depending if logged in or not
  const userToken = localStorage.getItem('tw-bp:jwt');
  const [loggedIn] = useState(validToken(userToken));
  const [theme, setTheme] = useState(defaultTheme);
  const [pageTitle, setPageTitle] = useState('');
  const updatePageTitle = (newTitle) => setPageTitle(newTitle);
  const changeTheme = (evt) => {
    localStorage.setItem('tw-bp:theme', evt.target.value);
    setTheme(evt.target.value);
  };

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    document.title = pageTitle;
  }, [pageTitle]);
  return (
    <ThemeProvider theme={theme} changeTheme={changeTheme}>
      <Router>
        <Switch>
          <Route path='/versus/:player1Id(\d+)?/:player2Id(\d+)?'>
            <Versus updatePageTitle={updatePageTitle} />
          </Route>
          <Route path='/player/:playerId(\d+)?'>
            <Player updatePageTitle={updatePageTitle} />
          </Route>
          <Route path='/tournament/:tournamentId(\d+)'>
            <Tournament updatePageTitle={updatePageTitle} />
          </Route>
          <Route path='/settings'>
            <Settings updatePageTitle={updatePageTitle} />
          </Route>
          <Route
            path='/signin'
            render={() => {
              if (!loggedIn) {
                return <SignIn updatePageTitle={updatePageTitle} />;
              } else {
                return <Redirect to='/' />;
              }
            }}
          />
          <Route
            path='/signup'
            render={() => {
              if (!loggedIn) {
                return <SignUp updatePageTitle={updatePageTitle} />;
              } else {
                return <Redirect to='/' />;
              }
            }}
          />
          <Route path='/' exact>
            <>
              <Nav />
              <Card
                title='Placeholder'
                children={
                  <div className='text-primary-text'>
                    <Avatar />
                  </div>
                }
              />
            </>
          </Route>
          <Route path='/*'>
            <E404 updatePageTitle={updatePageTitle} />
          </Route>
        </Switch>
      </Router>
    </ThemeProvider>
  );
}

export default App;

function validToken(userToken) {
  //do something with token
  if (userToken === null) {
    return false;
  }
  return true;
}
