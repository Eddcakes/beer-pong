import React, { useEffect, useState } from 'react';
import Joi from 'joi';
import { Link, useHistory } from 'react-router-dom';
import { Card, Button } from '../components';
import { useAuth } from '../AuthProvider';

const schema = Joi.object().keys({
  username: Joi.string()
    .trim()
    .regex(/^[a-zA-Z0-9_]+$/)
    .min(2)
    .max(30)
    .required(),
  password: Joi.string().trim().min(6).required(),
});

export function SignIn({ updatePageTitle }) {
  let history = useHistory();
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
        if (signInResp.error !== undefined) {
          return setErrorMsg(
            'Unable to login, please double check your credentials.'
          );
        }
        localStorage.setItem('tw-bp:jwt', signInResp.token);
        history.push('/');
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

  useEffect(() => {
    updatePageTitle('Sign in');
  }, [updatePageTitle]);
  return (
    <div>
      <div className='text-center'>Icon</div>
      <Card title='Sign in'>
        <form>
          <div className='flex flex-col'>
            <label htmlFor='username'>Username</label>
            <input
              name='username'
              required
              value={username}
              onChange={handleUsername}
            />
          </div>
          <div className='flex flex-col'>
            <label htmlFor='password'>Password</label>
            <input
              name='password'
              minLength='6'
              type='password'
              required
              value={password}
              onChange={handlePassword}
            />
          </div>
          <Link to='/' className='text-link-text hover:underline'>
            Forgotten password?
          </Link>
          {errorMsg.length > 0 && <p className='text-red-700'>{errorMsg}</p>}
          <div className='pt-2'>
            <Button text='Sign in' handleClick={handleSubmit} />
          </div>
          <Link to='/signup' className='text-link-text hover:underline'>
            Or sign up here
          </Link>
        </form>
      </Card>
    </div>
  );
}
