import React from 'react';
import AuthContext from './AuthContext';

export function AuthProvider({ user, signOut, children }) {
  return (
    <AuthContext.Provider value={{ user: user, signOut: signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
