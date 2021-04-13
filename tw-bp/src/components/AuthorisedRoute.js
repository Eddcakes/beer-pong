import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth';

export function AuthorisedRoute({ children, ...rest }) {
  let auth = useAuth();
  if (auth.user === null) {
    return <div>loading session</div>;
  }
  return (
    <Route
      {...rest}
      render={({ location }) =>
        auth.user ? (
          children
        ) : (
          <Redirect to={{ pathname: '/signin', state: { from: location } }} />
        )
      }
    />
  );
}

/* 
To work with different levels of access could use something like this. 
Need to remember to add level to backend auth

  const accessLevels = [
    { name: 'admin', level: 5},
    { name: 'creator', level: 1},
  ]

  export function AuthorisedRoute({children, ...rest}) {
  let auth = useAuth();
  const checkRole = (role) => {
    //minimum role required
    if (auth.user.role.level >= role.level) {
      return (children)
    }
    // does not match minimum role
    return (
      <Unauthorised />
    )
  }
  return (
    <Route {...rest}
    render={ ({location}) => (auth.user 
    ? checkRole(access)
    : <Redirect to={{pathname: '/signin', state: { from: location}}} />)
    }
    />
  )
}
*/
