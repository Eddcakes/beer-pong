import { useEffect, useState } from 'react';

export function useProvideAuth() {
  const [user, setUser] = useState(null);

  const signUp = async (details) => {
    try {
      const signUpNewUser = await postSignUp(details);
      if (signUpNewUser.error) {
        return signUpNewUser;
      }
      setUser(signUpNewUser.user);
      return signUpNewUser;
    } catch (err) {
      return { postError: 'failed to post' };
    }
  };

  const signIn = async (creds) => {
    try {
      const signMeIn = await postSignIn(creds);
      setUser(signMeIn.user);
      return signMeIn;
    } catch (err) {
      return { postError: 'failed to post' };
    }
  };

  const signOut = async () => {
    try {
      const signOutResponse = await postSignOut();
      setUser(null);
      return signOutResponse;
    } catch (err) {
      // cant reach
    }
    setUser(null);
  };

  useEffect(() => {
    // if user changes then set the object as appropriate
    async function checkSession() {
      console.log('fetchSession');
      const userSession = await fetchSession();
      setUser(userSession.user);
    }
    checkSession();
  }, []);

  return {
    user,
    signUp,
    signIn,
    signOut,
  };
}

async function postSignUp(data) {
  const signup = await fetch(
    `${process.env.REACT_APP_BACKEND_URL}/api/v1/auth/signup`,
    {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'content-type': 'application/json',
      },
      credentials: 'include',
    }
  );
  const dataJson = await signup.json();
  return dataJson;
}

async function fetchSession() {
  const userSession = await fetch(
    `${process.env.REACT_APP_BACKEND_URL}/api/v1`,
    { credentials: 'include' }
  );
  const userSessionJson = await userSession.json();
  console.log('fetch session', userSessionJson);
  return userSessionJson;
}

async function postSignOut() {
  const signOut = await fetch(
    `${process.env.REACT_APP_BACKEND_URL}/api/v1/auth/signout`,
    {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      credentials: 'include',
    }
  );
  const signOutJson = await signOut.json();
  return signOutJson;
}

async function postSignIn(data) {
  const signIn = await fetch(
    `${process.env.REACT_APP_BACKEND_URL}/api/v1/auth/signin`,
    {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'content-type': 'application/json',
      },
      credentials: 'include',
    }
  );
  const dataJson = await signIn.json();
  return dataJson;
}
