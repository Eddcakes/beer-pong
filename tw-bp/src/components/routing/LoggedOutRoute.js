import React from 'react';
import { Redirect, Route } from 'react-router-dom';

import { useAuth } from '../../hooks/useAuth';

export function LoggedOutRoute({ children, updatePageTitle, ...rest }) {
  const { user } = useAuth();

  return (
    <Route
      {...rest}
      render={() => {
        if (user) {
          //already logged in
          return <Redirect to='/' />;
        } else {
          return children;
        }
      }}
    />
  );
}
