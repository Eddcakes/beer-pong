import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import { ThemeProvider } from './ThemeProvider';
import { AuthProvider } from './AuthProvider';
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
  const [loggedIn, setLoggedIn] = useState(validToken(userToken));
  //if its null, its not loaded yet. if undefined user not logge in
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState(defaultTheme);
  const [pageTitle, setPageTitle] = useState('');
  const updatePageTitle = (newTitle) => setPageTitle(newTitle);
  const changeTheme = (evt) => {
    localStorage.setItem('tw-bp:theme', evt.target.value);
    setTheme(evt.target.value);
  };
  const signOut = (evt, location) => {
    localStorage.removeItem('tw-bp:jwt');
    setLoggedIn(false);
  };
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    document.title = pageTitle;
  }, [pageTitle]);

  useEffect(() => {
    async function fetchData() {
      const check = await fetchCurrentUser(userToken);
      //am i happy setting it to undefined if user not logged in?
      setUser(check.user);
    }
    fetchData();
  }, [userToken]);
  return (
    <ThemeProvider theme={theme} changeTheme={changeTheme}>
      <AuthProvider user={user} signOut={signOut}>
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
      </AuthProvider>
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

async function fetchCurrentUser(token) {
  const user = await fetch('http://localhost:1337/api/v1/', {
    headers: {
      Authorization: `BEARER ${token}`,
    },
  });
  const resp = await user.json();
  return resp;
}
