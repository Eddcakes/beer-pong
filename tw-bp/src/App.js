import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

import { ThemeProvider, AuthProvider } from './contexts';
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
  NewPlayer,
  ForgotPassword,
} from './pages';
import { AlreadySignedIn, RequireRole, Refreshing } from './components';

/* could try lazy loading protected routes like NewGame? */

const defaultTheme = () => {
  if (localStorage.getItem('tw-bp:theme')) {
    return localStorage.getItem('tw-bp:theme');
  }
  /* dark theme needs work before it should be default */
  return DEFAULT_THEME;
  /*   if (window.matchMedia && window.matchMedia('prefers-color-scheme: dark')) {
    return 'dark';
  } else {
    return DEFAULT_THEME;
  } */
};

const queryClient = new QueryClient();

function App() {
  //probably want a authentication provider so in <Route render can redirect depending if logged in or not
  //if its null, its not loaded yet. if undefined user not logged in
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
            <Routes>
              <Route
                path='/versus/*'
                element={<Versus updatePageTitle={updatePageTitle} />}
              />
              <Route
                path='/player/new'
                element={
                  <RequireRole
                    redirectTo='/signin'
                    minimumRole={5}
                    updatePageTitle={updatePageTitle}
                  >
                    <NewPlayer updatePageTitle={updatePageTitle} />
                  </RequireRole>
                }
              />
              <Route
                path='/player/:playerId'
                element={<Player updatePageTitle={updatePageTitle} />}
              />
              <Route
                path='/records/'
                element={<Records updatePageTitle={updatePageTitle} />}
              />
              <Route
                path='/games/'
                exact
                element={<Games updatePageTitle={updatePageTitle} />}
              />
              <Route
                path='/games/new'
                element={
                  <RequireRole redirectTo='/signin' minimumRole={1}>
                    <NewGame updatePageTitle={updatePageTitle} />
                  </RequireRole>
                }
              />
              <Route
                path='/games/:gameId'
                element={
                  <RequireRole redirectTo='/signin' minimumRole={1}>
                    <Game updatePageTitle={updatePageTitle} />
                  </RequireRole>
                }
              />
              <Route
                path='/tournaments'
                exact
                element={<Tournament updatePageTitle={updatePageTitle} />}
              />
              <Route
                path='/tournaments/:tournamentId'
                element={<Tournament updatePageTitle={updatePageTitle} />}
              />
              <Route
                path='/settings'
                element={<Settings updatePageTitle={updatePageTitle} />}
              ></Route>
              <Route
                path='/signin'
                element={
                  <AlreadySignedIn>
                    <SignIn updatePageTitle={updatePageTitle} />
                  </AlreadySignedIn>
                }
              />
              <Route
                path='/signup'
                element={
                  <AlreadySignedIn>
                    <SignUp updatePageTitle={updatePageTitle} />
                  </AlreadySignedIn>
                }
              />
              <Route
                path='/forgot-password'
                element={
                  <AlreadySignedIn>
                    <ForgotPassword updatePageTitle={updatePageTitle} />
                  </AlreadySignedIn>
                }
              />
              <Route
                path='/test'
                element={<Test updatePageTitle={updatePageTitle} />}
              />
              <Route
                path='/'
                exact
                element={<Home updatePageTitle={updatePageTitle} />}
              />
              <Route
                path='/*'
                element={<E404 updatePageTitle={updatePageTitle} />}
              />
            </Routes>
          </Router>
          <ReactQueryDevtools />
        </QueryClientProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
