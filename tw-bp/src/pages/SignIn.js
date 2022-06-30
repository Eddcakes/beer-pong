import { useState } from 'react';
import Joi from 'joi';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import {
  Card,
  Button,
  Container,
  Input,
  Decoration,
  Logo,
} from '../components';
import { useAuth } from '../hooks/useAuth';
import { usePageTitle } from '../hooks/usePageTitle';

const schema = Joi.object().keys({
  username: Joi.string()
    .trim()
    .regex(/^[a-zA-Z0-9_]+$/)
    .min(2)
    .max(30)
    .required(),
  password: Joi.string().trim().min(6).required(),
});

export function SignIn() {
  usePageTitle('Sign in');
  let navigate = useNavigate();
  let location = useLocation();
  /* redirect from location, or redirect home */
  let { from } = location.state || { from: { pathname: '/' } };
  const auth = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleUsername = (evt) => setUsername(evt.target.value);
  const handlePassword = (evt) => setPassword(evt.target.value);

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    if (validUser()) {
      const signInCreds = {
        username: username,
        password: password,
      };
      try {
        const signInResp = await auth.signIn(signInCreds);
        // auth.user is set in the AuthProvider
        if (signInResp.error) {
          return setErrorMsg(
            'Unable to login, please double check your credentials.'
          );
        }
        navigate(from);
      } catch (err) {
        setErrorMsg('Something went wrong!');
      }
    }
  };

  function validUser() {
    const valid = schema.validate({
      username: username,
      password: password,
    });
    if (valid.error === undefined) {
      return true;
    } else {
      //for sign in *should* be a generic message
      setErrorMsg('Unable to login, please double check your credentials.');
      return false;
    }
  }
  return (
    <Container maxW='max-w-screen-sm'>
      <div className='flex justify-center pb-4'>
        <Logo />
      </div>
      <Card
        title={
          <div className='flex flex-col text-center'>
            <Decoration />
            <h2 className='text-3xl font-semibold text-primary-text py-2'>
              Sign in
            </h2>
          </div>
        }
      >
        <form onSubmit={handleSubmit}>
          <Input
            label='Username'
            id='username'
            name='username'
            required={true}
            value={username}
            onChange={handleUsername}
            autoComplete='username'
          />
          <Input
            label='Password'
            id='password'
            name='password'
            type='password'
            required={true}
            value={password}
            onChange={handlePassword}
            autoComplete='current-password'
          />
          <Link
            to='/forgot-password'
            className='text-link-text hover:underline'
          >
            Forgotten password?
          </Link>
          {errorMsg.length > 0 && <p className='text-negative'>{errorMsg}</p>}
          <div className='pt-2'>
            <Button text='Sign in' color='outlined' fullWidth type='submit' />
          </div>
          <Link to='/signup' className='text-link-text hover:underline'>
            Or sign up here
          </Link>
        </form>
      </Card>
    </Container>
  );
}
