import React, { useContext, useState, useEffect } from 'react';
import AuthContext from './AuthContext';

export function AuthProvider({ children }) {
  const auth = useProvideAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  return useContext(AuthContext);
};

export function useProvideAuth() {
  const [user, setUser] = useState(null);

  const signUp = async (details) => {
    try {
      const signUpNewUser = await postSignUp(details);
      if (signUpNewUser.error) {
        return signUpNewUser;
      }
      try {
        const check = await fetchCurrentUser(signUpNewUser.token);
        setUser(check.user);
      } catch (err) {
        // failure validating token with server
      }
      return signUpNewUser;
    } catch (err) {
      return { postError: 'failed to post' };
    }
  };

  const signIn = async (creds) => {
    try {
      const signMeIn = await postSignIn(creds);
      if (signMeIn.error) {
        return signMeIn;
      }
      // defeating the point in jwt if we are checking back with the server, gna use sessions
      try {
        const check = await fetchCurrentUser(signMeIn.token);
        setUser(check.user);
      } catch (err) {
        // failure validating token with server
      }
      return signMeIn;
    } catch (err) {
      return { postError: 'failed to post' };
    }
  };

  const signOut = () => {
    //
    localStorage.removeItem('tw-bp:jwt');
    setUser(null);
  };

  useEffect(() => {
    //on first render check with server to see if a session exists
    //setUser
  }, []);

  useEffect(() => {
    // if user changes then set the object as appropriate
    async function fetchUserData() {
      const userToken = localStorage.getItem('tw-bp:jwt');
      const check = await fetchCurrentUser(userToken);
      //am i happy setting it to undefined if user not logged in?
      setUser(check.user);
    }
    fetchUserData();
  }, []);

  return {
    user,
    signUp,
    signIn,
    signOut,
  };
}

async function postSignIn(data) {
  const signIn = await fetch(`http://localhost:1337/api/v1/auth/signin`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'content-type': 'application/json',
    },
  });
  const dataJson = await signIn.json();
  return dataJson;
}

async function postSignUp(data) {
  const signup = await fetch(`http://localhost:1337/api/v1/auth/signup`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'content-type': 'application/json',
    },
  });
  const dataJson = await signup.json();
  return dataJson;
}

export async function fetchCurrentUser(token) {
  const user = await fetch('http://localhost:1337/api/v1/', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const resp = await user.json();
  return resp;
}
