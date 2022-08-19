import Joi from 'joi';
import { useReducer, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import {
  Header,
  Card,
  Container,
  Input,
  Button,
  Select,
  MobileSpacer,
} from '../components';
import { usePageTitle } from '../hooks/usePageTitle';
import { fetchVenues, postNewTournament } from '../queries';

const schema = Joi.object().keys({
  title: Joi.string()
    .required()
    .messages({ 'string.base': 'A name must be entered' }),
  date: Joi.string()
    .required()
    .messages({ 'string.base': 'Starting date must be entered' }),
  venue_id: Joi.number()
    .required()
    .messages({ 'number.base': 'A venue is required' }),
});

const initialForm = {
  title: '',
  date: '',
  venue: '',
};

function reducer(state, action) {
  switch (action.type) {
    case 'inputField':
      return { ...state, [action.fieldName]: action.value };
    case 'selectField':
      return { ...state, [action.fieldName]: Number(action.value) };
    default:
      return { ...state };
  }
}

export function NewTournament() {
  usePageTitle('New tournament');
  const [errorMsg, setErrorMsg] = useState('');
  const [formState, dispatch] = useReducer(reducer, initialForm);
  const queryClient = useQueryClient();
  const mutation = useMutation(postNewTournament, {
    onError: (error) => {
      setErrorMsg('Could not create tournament, please try again later.');
    },
    onSuccess: (data) => {
      if (data.error) {
        setErrorMsg(data.error);
      } else {
        queryClient.invalidateQueries('tournaments');
        // redirect with history.push
      }
    },
  });

  const venues = useQuery('venues', fetchVenues);

  function validForm() {
    const valid = schema.validate(formState);
    if (valid.error) {
      setErrorMsg(valid.error.message);
      return false;
    }
    return true;
  }

  const handleInput = (evt) => {
    dispatch({
      type: 'inputField',
      fieldName: evt.target.name,
      value: evt.target.value,
    });
    // naive reset error msg
    if (errorMsg.length > 0) {
      setErrorMsg('');
    }
  };

  const handleSelect = (evt) => {
    dispatch({
      type: 'selectField',
      fieldName: evt.target.name,
      value: evt.target.value,
    });
    // naive reset error msg
    if (errorMsg.length > 0) {
      setErrorMsg('');
    }
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    if (validForm()) {
      mutation.mutate(formState);
    }
  };
  return (
    <>
      <Header />
      <Container maxW='max-w-xl'>
        <Card title='New Tournament'>
          <form onSubmit={handleSubmit} className='space-y-2'>
            <Input
              label='Enter tournament title'
              name='tournamentTitle'
              onChange={handleInput}
            />
            <Input label='Enter tournament date' name='date' type='date' />
            {venues.isLoading && <div>Loading players...</div>}
            {!venues.isLoading && (
              <Select name='venue' onChange={handleSelect}>
                {venues.data.map((item) => {
                  return (
                    <option key={item.id} value={item.id}>
                      {item.title}
                    </option>
                  );
                })}
              </Select>
            )}
            {errorMsg.length > 0 && <p className='text-negative'>{errorMsg}</p>}
            <div className='pt-4'>
              <Button
                text='Create!'
                type='submit'
                fullWidth
                disabled={mutation.isLoading}
              />
            </div>
          </form>
        </Card>
      </Container>
      <MobileSpacer />
    </>
  );
}
