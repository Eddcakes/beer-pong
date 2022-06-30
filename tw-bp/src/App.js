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
  ForgotPasswordReset,
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
  const changeTheme = (evt) => {
    localStorage.setItem('tw-bp:theme', evt.target.value);
    setTheme(evt.target.value);
  };

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);
  return (
    <ThemeProvider theme={theme} changeTheme={changeTheme}>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <Refreshing />
          <Router>
            <Routes>
              <Route path='/versus/*' element={<Versus />} />
              <Route
                path='/player/new'
                element={
                  <RequireRole redirectTo='/signin' minimumRole={5}>
                    <NewPlayer />
                  </RequireRole>
                }
              />
              <Route path='/player/:playerId' element={<Player />} />
              <Route path='/records/' element={<Records />} />
              <Route path='/games/' exact element={<Games />} />
              <Route
                path='/games/new'
                element={
                  <RequireRole redirectTo='/signin' minimumRole={1}>
                    <NewGame />
                  </RequireRole>
                }
              />
              <Route
                path='/games/:gameId'
                element={
                  <RequireRole redirectTo='/signin' minimumRole={1}>
                    <Game />
                  </RequireRole>
                }
              />
              <Route path='/tournaments' exact element={<Tournament />} />
              <Route
                path='/tournaments/:tournamentId'
                element={<Tournament />}
              />
              <Route path='/settings' element={<Settings />}></Route>
              <Route
                path='/signin'
                element={
                  <AlreadySignedIn>
                    <SignIn />
                  </AlreadySignedIn>
                }
              />
              <Route
                path='/signup'
                element={
                  <AlreadySignedIn>
                    <SignUp />
                  </AlreadySignedIn>
                }
              />
              <Route
                path='/forgot-password'
                element={
                  <AlreadySignedIn>
                    <ForgotPassword />
                  </AlreadySignedIn>
                }
              />
              <Route
                path='/forgot-password/:token'
                element={
                  <AlreadySignedIn>
                    <ForgotPasswordReset />
                  </AlreadySignedIn>
                }
              />
              <Route path='/test' element={<Test />} />
              <Route path='/' exact element={<Home />} />
              <Route path='/*' element={<E404 />} />
            </Routes>
          </Router>
          <ReactQueryDevtools />
        </QueryClientProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
