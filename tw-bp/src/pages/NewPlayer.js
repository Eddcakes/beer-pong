import Joi from 'joi';
import { useReducer, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import { Header, Card, Container, Input, Button } from '../components';
import { postNewPlayer } from '../queries';

const schema = Joi.object().keys({
  playerName: Joi.string()
    .required()
    .messages({ 'string.base': 'A name must be entered' }),
});

const initialForm = {
  playerName: '',
};

function reducer(state, action) {
  switch (action.type) {
    case 'inputField':
      return { ...state, [action.fieldName]: action.value };
    default:
      return { ...state };
  }
}

export function NewPlayer() {
  const [errorMsg, setErrorMsg] = useState('');
  const [formState, dispatch] = useReducer(reducer, initialForm);
  const queryClient = useQueryClient();
  const { mutate } = useMutation(postNewPlayer, {
    onError: (error) => {
      setErrorMsg('Could not create player, please try again later.');
    },
    onSuccess: (data) => {
      // currently queries (based on fetch) return as success if we send back custom error
      if (data.error) {
        setErrorMsg(data.error); // or data.message
      } else {
        queryClient.invalidateQueries('players');
        // history.push(`/games/${data.id}`);
        // nothing really to do on player page at the moment
      }
    },
  });

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
  const handleSubmit = async (evt) => {
    evt.preventDefault();
    if (validForm()) {
      mutate(formState);
    }
  };
  return (
    <>
      <Header />
      <Container maxW='max-w-xl'>
        <Card title='New Player'>
          <form onSubmit={handleSubmit} className='space-y-2'>
            <Input
              label='Enter player name'
              name='playerName'
              onChange={handleInput}
            />
            {errorMsg.length > 0 && <p className='text-negative'>{errorMsg}</p>}
            <div className='pt-4'>
              <Button
                text='Create!'
                type='submit'
                fullWidth
                disabled={formState['playerName'].length < 1}
              />
            </div>
          </form>
        </Card>
      </Container>
    </>
  );
}
