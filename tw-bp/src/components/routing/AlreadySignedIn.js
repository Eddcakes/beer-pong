import { Navigate } from 'react-router-dom';

import { useAuth } from '../../hooks/useAuth';

export function AlreadySignedIn({ children, redirectTo = '/' }) {
  const { user } = useAuth();
  if (user) {
    return <Navigate to={redirectTo} />;
  }
  return children;
}
