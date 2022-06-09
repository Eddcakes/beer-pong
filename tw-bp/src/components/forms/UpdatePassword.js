import { useState } from 'react';
import Joi from 'joi';
import { useMutation } from 'react-query';

import { useAuth } from '../../hooks/useAuth';
import { Input, Button } from '../../components';
import { postUpdatePassword } from '../../queries';

const schema = Joi.object().keys({
  username: Joi.string()
    .trim()
    .regex(/^[a-zA-Z0-9_]+$/)
    .min(2)
    .max(30)
    .required(),
  currentPassword: Joi.string().trim().min(6).required(),
  newPassword: Joi.string().trim().min(6).required(),
  confirmPassword: Joi.any()
    .equal(Joi.ref('newPassword'))
    .required()
    .label('Confirm new password')
    .options({
      messages: { 'any.only': '{{#label}} must match new password' },
    }),
});

export function UpdatePassword() {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleCurrentPassword = (evt) => setCurrentPassword(evt.target.value);
  const handleNewPassword = (evt) => setNewPassword(evt.target.value);
  const handleConfirmPassword = (evt) => setConfirmPassword(evt.target.value);

  const mutation = useMutation(postUpdatePassword, {
    onError: (error) => {
      setErrorMsg(error);
    },
    onSuccess: (resp) => {
      setErrorMsg('');
      if (resp.error) {
        setErrorMsg(resp.error);
      }
      if (resp.message.includes('Updated password')) {
        console.log('Updated password successfully');
      }
    },
  });

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    setErrorMsg('');
    if (validDetails()) {
      const data = {
        username: user.username,
        currentPassword: currentPassword,
        newPassword: newPassword,
      };
      mutation.mutate(data);
    }
  };

  function validDetails() {
    const valid = schema.validate({
      username: user.username,
      currentPassword: currentPassword,
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
  if (!user) {
    return <div>Please log in to change account details</div>;
  }
  return (
    <form onSubmit={handleSubmit}>
      {mutation.error && (
        <span>Error {JSON.stringify(mutation.error, null, 2)}</span>
      )}
      <input
        aria-hidden={true}
        aria-label='username'
        type='text'
        autoComplete='username'
        defaultValue={user.username}
        className='hidden'
      />
      <Input
        label='Current password'
        id='currentPassword'
        name='currentPassword'
        type='password'
        required
        value={currentPassword}
        onChange={handleCurrentPassword}
        autoComplete='current-password'
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
      <Button text='Save changes' type='submit' disabled={mutation.isLoading} />
    </form>
  );
}
