import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Joi from 'joi';
import { Card, Button, Container, Input } from '../components';

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
        // change to http secure cookies store login token
        localStorage.setItem('tw-bp:jwt', signupResp.token);
        history.push('/');
      } catch (err) {
        setErrorMsg('Something went wrong!');
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
    <Container>
      <div className='text-center'>Icon</div>
      <Card title='Sign up'>
        <form>
          <Input
            label='Username'
            name='username'
            required={true}
            value={username}
            onChange={handleUsername}
            aria-describedby='usernameHelp'
            helpText='Username must be between 2 and 30 characters. Alphanumeric and
              underscores only.'
          />
          <Input
            label='Email address'
            name='email'
            type='email'
            value={email}
            onChange={handleEmail}
          />
          <Input
            label='Password'
            name='password'
            minLength='6'
            type='password'
            required
            value={password}
            onChange={handlePassword}
            aria-describedby='passwordHelp'
            helpText='Password must be at least 6 characters.'
          />

          <Input
            label='Confirm Password'
            name='confirmPassword'
            minLength='6'
            type='password'
            required
            value={confirmPassword}
            onChange={handleConfirmPassword}
          />
          {errorMsg.length > 0 && <p className='text-red-700'>{errorMsg}</p>}
          <div className='pt-2'>
            <Button text='Sign up' handleClick={handleSubmit} />
          </div>
          <Link to='/signin' className='text-link-text hover:underline'>
            Or sign in here
          </Link>
        </form>
      </Card>
    </Container>
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
