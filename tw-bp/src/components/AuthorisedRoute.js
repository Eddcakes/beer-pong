import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import { Unauthorised } from '../pages';
import { useAuth } from '../hooks/useAuth';

export function AuthorisedRoute({ children, minimumRole = 1, ...rest }) {
  let auth = useAuth();

  const checkRole = (roleLevel) => {
    if (auth.user.role_level >= Number(roleLevel)) {
      return children;
    } else {
      return <Unauthorised />;
    }
  };

  if (auth.user === null) {
    return <div>loading session</div>;
  }
  return (
    <Route
      {...rest}
      render={({ location }) =>
        auth.user ? (
          checkRole(minimumRole)
        ) : (
          <Redirect to={{ pathname: '/signin', state: { from: location } }} />
        )
      }
    />
  );
}
