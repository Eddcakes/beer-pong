import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Joi from 'joi';
import { Card, Button } from '../components';

const schema = Joi.object().keys({
  username: Joi.string()
    .trim()
    .regex(/^[a-zA-Z0-9_]+$/)
    .min(2)
    .max(30)
    .required(),
  password: Joi.string().trim().min(6).required(),
  confirmPassword: Joi.string().trim().min(6).required(),
});

export function SignUp({ updatePageTitle }) {
  let history = useHistory();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleUsername = (evt) => setUsername(evt.target.value);
  const handleEmail = (evt) => setEmail(evt.target.value);
  const handlePassword = (evt) => setPassword(evt.target.value);
  const handleConfirmPassword = (evt) => setConfirmPassword(evt.target.value);

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    if (validUser()) {
      const newUserCreds = {
        username: username,
        password: password,
      };
      try {
        //post to server
        const signupResp = await postSignUp(newUserCreds);
        if (signupResp.error !== undefined) {
          return setErrorMsg(signupResp.error);
        }
        //redirect to login page on successful account creation
        // changing to store login token
        localStorage.setItem('tw-bp:jwt', signupResp.token);
        history.push('/');
      } catch (err) {
        setErrorMsg('Something went wrong!');
        console.log('error', err);
      }
    }
  };

  function validUser() {
    if (password === confirmPassword) {
      const valid = schema.validate({
        username: username,
        password: password,
        confirmPassword: confirmPassword,
      });
      if (valid.error === undefined) {
        return true;
      } else {
        // could check what type of error to make sure we create a good error for the user
        setErrorMsg(valid.error.message);
        return false;
      }
    } else {
      setErrorMsg('Password and Confirm password must be the same');
    }
  }

  useEffect(() => {
    updatePageTitle('Sign up');
  }, [updatePageTitle]);

  return (
    <div>
      <div className='text-center'>Icon</div>
      <Card title='Sign up'>
        <form>
          <div className='flex flex-col'>
            <label htmlFor='username'>Username</label>
            <input
              name='username'
              required
              value={username}
              onChange={handleUsername}
              aria-describedby='usernameHelp'
            />
            <small id='usernameHelp'>
              Username must be between 2 and 30 characters. Alphanumeric and
              underscores only.
            </small>
          </div>
          <div className='flex flex-col'>
            <label htmlFor='email'>Email address</label>
            <input
              name='email'
              type='email'
              value={email}
              onChange={handleEmail}
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
              aria-describedby='passwordHelp'
            />
            <small id='passwordHelp'>
              Password must be at least 6 characters.
            </small>
          </div>
          <div className='flex flex-col'>
            <label htmlFor='password'>Confirm Password</label>
            <input
              name='confirmPassword'
              minLength='6'
              type='password'
              required
              value={confirmPassword}
              onChange={handleConfirmPassword}
            />
          </div>
          {errorMsg.length > 0 && <p className='text-red-700'>{errorMsg}</p>}
          <div className='pt-2'>
            <Button text='Sign up' handleClick={handleSubmit} />
          </div>
          <Link to='/signin' className='text-link-text hover:underline'>
            Or sign in here
          </Link>
        </form>
      </Card>
    </div>
  );
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
