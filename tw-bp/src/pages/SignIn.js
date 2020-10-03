import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Button } from '../components';

export function SignIn({ updatePageTitle }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleUsername = (evt) => setUsername(evt.target.value);
  const handlePassword = (evt) => setPassword(evt.target.value);

  const handleSubmit = () => {
    console.log(`user: ${username} pass: ${password}`);
  };

  useEffect(() => {}, [updatePageTitle]);
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
