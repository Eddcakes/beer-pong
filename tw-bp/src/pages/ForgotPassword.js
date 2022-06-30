import { useState } from 'react';
import Joi from 'joi';
import { useMutation } from 'react-query';
import {
  Button,
  Card,
  Container,
  Decoration,
  Input,
  Logo,
} from '../components';
import { Link } from 'react-router-dom';
import { postForgotPassword } from '../queries/postForgotPassword';
import { usePageTitle } from '../hooks/usePageTitle';

const schema = Joi.object().keys({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .trim()
    .required(),
});

export function ForgotPassword() {
  usePageTitle('Forgotten password');
  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleEmail = (evt) => setEmail(evt.target.value);

  const sendEmailMutation = useMutation(postForgotPassword, {
    onError: (error) => {
      setErrorMsg(error);
    },
    onSuccess: (resp) => {
      setErrorMsg('');
      if (resp.error) {
        setErrorMsg(resp.error);
      }
      if (resp.message.includes('Please wait')) {
        setErrorMsg(resp.message);
      }
      if (resp.message.includes('this email')) {
        setSuccessMsg(resp.message);
      }
    },
  });

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');
    if (validEmailFormat()) {
      const postEmail = {
        email: email,
      };
      sendEmailMutation.mutate(postEmail);
    }
  };

  function validEmailFormat() {
    const valid = schema.validate({
      email: email,
    });
    if (valid.error == null) {
      return true;
    } else {
      setErrorMsg('Error with email format');
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
              Reset your password
            </h2>
          </div>
        }
      >
        <form onSubmit={handleSubmit}>
          <Input
            label='Email'
            id='email'
            name='email'
            required={true}
            value={email}
            onChange={handleEmail}
            autoComplete='email'
            errorMsg={errorMsg}
          />
          <div className='pt-2'>
            <Button
              text='Send reset link'
              disabled={sendEmailMutation.isLoading}
              color='outlined'
              fullWidth
              type='submit'
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
