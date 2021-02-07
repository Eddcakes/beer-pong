import React, { useEffect, useState } from 'react';
import Joi from 'joi';
import { Link, useHistory } from 'react-router-dom';
import { Card, Button, Container, Input } from '../components';

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
        const signInResp = await postSignIn(signInCreds);
        if (signInResp.error !== undefined) {
          return setErrorMsg(
            'Unable to login, please double check your credentials.'
          );
        }
        localStorage.setItem('tw-bp:jwt', signInResp.token);
        history.push('/');
      } catch (err) {
        setErrorMsg('Something went wrong!');
        console.log('error', err);
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
    <Container>
      <div className='text-center'>Icon</div>
      <Card title='Sign in'>
        <form>
          <Input
            label='Username'
            name='username'
            required={true}
            value={username}
            onChange={handleUsername}
          />
          <Input
            label='Password'
            name='password'
            type='password'
            required={true}
            value={password}
            onChange={handlePassword}
          />
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
    </Container>
  );
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
