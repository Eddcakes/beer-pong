import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Joi from 'joi';

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
  confirmPassword: Joi.string().trim().min(6).required(),
});

export function SignUp() {
  usePageTitle('Sign up');
  let navigate = useNavigate();
  const auth = useAuth();
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
        const signupResp = await auth.signUp(newUserCreds);
        if (signupResp.error !== undefined) {
          return setErrorMsg(signupResp.error);
        }
        //redirect to login page on successful account creation
        navigate('/');
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
              Sign up
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
            aria-describedby='usernameHelp'
            helpText='Username must be between 2 and 30 characters. Alphanumeric and
              underscores only.'
            autoComplete='username'
          />
          <Input
            label='Email address'
            id='email'
            name='email'
            type='email'
            value={email}
            onChange={handleEmail}
            autoComplete='email'
          />
          <Input
            label='Password'
            id='password'
            name='password'
            minLength='6'
            type='password'
            required
            value={password}
            onChange={handlePassword}
            aria-describedby='passwordHelp'
            helpText='Password must be at least 6 characters.'
            autoComplete='new-password'
          />

          <Input
            label='Confirm Password'
            id='confirmPassword'
            name='confirmPassword'
            minLength='6'
            type='password'
            required
            value={confirmPassword}
            onChange={handleConfirmPassword}
            autoComplete='new-password'
          />
          {errorMsg.length > 0 && <p className='text-negative'>{errorMsg}</p>}
          <div className='pt-2'>
            <Button text='Sign up' color='outlined' fullWidth type='submit' />
          </div>
          <Link to='/signin' className='text-link-text hover:underline'>
            Or sign in here
          </Link>
        </form>
      </Card>
    </Container>
  );
}
