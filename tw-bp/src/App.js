import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
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
          <Route path='/signin'>
            <SignIn updatePageTitle={updatePageTitle} />
          </Route>
          <Route path='/signup'>
            <SignUp updatePageTitle={updatePageTitle} />
          </Route>
          <Route path='/' exact>
            <>
              <Nav />
              <Card
                title='Placeholder'
                children={<div className='text-primary-text'>Landing page</div>}
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
