import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Button } from '../components';

export function SignUp({ updatePageTitle }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleUsername = (evt) => setUsername(evt.target.value);
  const handleEmail = (evt) => setEmail(evt.target.value);
  const handlePassword = (evt) => setPassword(evt.target.value);
  const handleConfirmPassword = (evt) => setConfirmPassword(evt.target.value);

  const handleSubmit = () => {
    if (password !== confirmPassword) {
    }
    console.log(`user: ${username} email: ${email} pass: ${password}`);
  };

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
            <label htmlFor='password'>Password</label>
            <input
              name='confirmPassword'
              minLength='6'
              type='password'
              required
              value={confirmPassword}
              onChange={handleConfirmPassword}
            />
          </div>
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
