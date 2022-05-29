import { Navigate } from 'react-router-dom';

import { Unauthorised } from '../../pages';
import { useAuth } from '../../hooks/useAuth';

export function RequireRole({
  children,
  minimumRole = 1,
  redirectTo = '/signin',
}) {
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
  return auth.user ? checkRole(minimumRole) : <Navigate to={redirectTo} />;
}
