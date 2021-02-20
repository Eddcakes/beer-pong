import { AuthContext } from './AuthContext';
import { useProvideAuth } from './hooks/useProvideAuth';

export function AuthProvider({ children }) {
  const auth = useProvideAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}
