import { useState } from 'react';
import Joi from 'joi';
import jwt_decode from 'jwt-decode';
import { useMutation } from 'react-query';
import { Link, useNavigate, useParams } from 'react-router-dom';

import {
  Button,
  Card,
  Container,
  Decoration,
  Input,
  Logo,
} from '../components';
import { postResetPassword } from '../queries';
import { usePageTitle } from '../hooks/usePageTitle';

const schema = Joi.object().keys({
  newPassword: Joi.string().trim().min(6).required(),
  confirmPassword: Joi.any()
    .equal(Joi.ref('newPassword'))
    .required()
    .label('Confirm new password')
    .options({
      messages: { 'any.only': '{{#label}} must match new password' },
    }),
});

export function ForgotPasswordReset() {
  usePageTitle('Forgotten password');
  const { token } = useParams();
  let navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const tokenDetails = decodeJwt(token);

  const handleNewPassword = (evt) => setNewPassword(evt.target.value);
  const handleConfirmPassword = (evt) => setConfirmPassword(evt.target.value);

  const mutation = useMutation(postResetPassword, {
    onError: (error) => {
      setErrorMsg(error);
    },
    onSuccess: (resp) => {
      setErrorMsg('');
      if (resp.error) {
        setErrorMsg(resp.error);
      }
      if (resp.message.includes('Updated password')) {
        setSuccessMsg(resp.message);
        setTimeout(() => {
          navigate('/signin');
        }, 2000);
      }
    },
  });

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');
    if (validDetails()) {
      const data = {
        token,
        username: tokenDetails.username,
        newPassword: newPassword,
      };
      mutation.mutate(data);
    }
  };

  function validDetails() {
    const valid = schema.validate({
      newPassword: newPassword,
      confirmPassword: confirmPassword,
    });
    if (valid.error == null) {
      return true;
    } else {
      setErrorMsg(valid.error.message);
      return false;
    }
  }

  function decodeJwt(token) {
    let result = {};
    try {
      const decoded = jwt_decode(token);
      result.username = decoded.username;
    } catch (err) {
      result.error = 'Cannot decode JWT';
    }
    return result;
  }
  if (tokenDetails?.error) {
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
                Invalid token
              </h2>
            </div>
          }
        >
          <p>Invalid token</p>
          <Button text='Back' to='/forgot-password' />
        </Card>
      </Container>
    );
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
              Reset your password
            </h2>
          </div>
        }
      >
        <form onSubmit={handleSubmit}>
          <input
            aria-hidden={true}
            aria-label='username'
            type='text'
            autoComplete='username'
            defaultValue={'user'}
            className='hidden'
          />
          <Input
            label='New password'
            id='newPassword'
            name='newPassword'
            minLength='6'
            type='password'
            required
            value={newPassword}
            onChange={handleNewPassword}
            aria-describedby='newPasswordHelp'
            helpText='Password must be at least 6 characters.'
            autoComplete='new-password'
          />
          <Input
            label='Confirm new password'
            id='confirmPassword'
            name='confirmPassword'
            minLength='6'
            type='password'
            required
            value={confirmPassword}
            onChange={handleConfirmPassword}
            aria-describedby='confirmPasswordHelp'
            helpText='Password must be at least 6 characters.'
            autoComplete='new-password'
          />
          {errorMsg.length > 0 && <p className='text-negative'>{errorMsg}</p>}
          <div className='pt-2'>
            <Button
              text='Save changes'
              type='submit'
              disabled={mutation.isLoading}
              color='outlined'
              fullWidth
            />
          </div>
          {successMsg.length > 0 && (
            <p className='py-2 text-positive'>{successMsg}</p>
          )}
          <Link to='/signin' className='text-link-text hover:underline'>
            Or sign in here
          </Link>
        </form>
      </Card>
    </Container>
  );
}
