import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

import { ThemeProvider } from './ThemeProvider';
import { AuthProvider } from './AuthProvider';
import { applyTheme, DEFAULT_THEME } from './theme';
import {
  E404,
  Game,
  Games,
  Home,
  NewGame,
  Player,
  Settings,
  Tournament,
  Versus,
  SignIn,
  SignUp,
  Test,
  Records,
} from './pages';
import { LoggedOutRoute } from './components/LoggedOutRoute';
import { AuthorisedRoute, Refreshing } from './components';

/* could try lazy loading protected routes like NewGame? */

const defaultTheme = () => {
  if (localStorage.getItem('tw-bp:theme'))
    return localStorage.getItem('tw-bp:theme');
  if (window.matchMedia && window.matchMedia('prefers-color-scheme: dark')) {
    return 'dark';
  } else {
    return DEFAULT_THEME;
  }
};

const queryClient = new QueryClient();

function App() {
  //probably want a authentication provider so in <Route render can redirect depending if logged in or not
  //if its null, its not loaded yet. if undefined user not logge in
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
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <Refreshing />
          <Router>
            <Switch>
              <Route path='/versus/:player1Id(\d+)?/:player2Id(\d+)?'>
                <Versus updatePageTitle={updatePageTitle} />
              </Route>
              <Route path='/player/:playerId(\d+)?'>
                <Player updatePageTitle={updatePageTitle} />
              </Route>
              <Route path='/records/'>
                <Records updatePageTitle={updatePageTitle} />
              </Route>
              <Route path='/games/' exact>
                <Games updatePageTitle={updatePageTitle} />
              </Route>
              <AuthorisedRoute path='/games/new'>
                <NewGame updatePageTitle={updatePageTitle} />
              </AuthorisedRoute>
              <AuthorisedRoute path='/games/:gameId(\d+)'>
                <Game updatePageTitle={updatePageTitle} />
              </AuthorisedRoute>
              <Route path='/tournaments' exact>
                <Tournament updatePageTitle={updatePageTitle} />
              </Route>
              <Route path='/tournaments/:tournamentId(\d+)'>
                <Tournament updatePageTitle={updatePageTitle} />
              </Route>
              <Route path='/settings'>
                <Settings updatePageTitle={updatePageTitle} />
              </Route>
              <LoggedOutRoute path='/signin'>
                <SignIn updatePageTitle={updatePageTitle} />
              </LoggedOutRoute>
              <LoggedOutRoute path='/signup'>
                <SignUp updatePageTitle={updatePageTitle} />
              </LoggedOutRoute>
              <Route path='/test'>
                <Test updatePageTitle={updatePageTitle} />
              </Route>
              <Route path='/' exact>
                <Home updatePageTitle={updatePageTitle} />
              </Route>
              <Route path='/*'>
                <E404 updatePageTitle={updatePageTitle} />
              </Route>
            </Switch>
          </Router>
          <ReactQueryDevtools />
        </QueryClientProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
