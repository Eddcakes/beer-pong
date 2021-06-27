import React, { useEffect, useReducer, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Joi from 'joi';

import {
  Button,
  Card,
  Container,
  Header,
  InputNumber,
  Select,
  Input,
} from '../components';
import { fetchPlayers, fetchVenues } from '../queries';
import { useQuery, useMutation, useQueryClient } from 'react-query';

const initialForm = {
  tournamentName: '',
  venue: '',
  gameSize: 6,
};

function reducer(state, action) {
  switch (action.type) {
    case 'inputField':
      return { ...state, [action.fieldName]: action.value };
    case 'inputNumberField':
      return { ...state, [action.fieldName]: Number(action.value) };
    case 'selectField':
      return { ...state, [action.fieldName]: Number(action.value) };
    case 'initialise':
      return { ...state };
    default:
      return { ...state };
  }
}

export function NewTournament({ updatePageTitle }) {
  const [formState, dispatch] = useReducer(reducer, initialForm);
  const players = useQuery('players', fetchPlayers);
  const venues = useQuery('venues', fetchVenues);
  const minGameSize = 6;
  const maxGameSize = 6;
  const handleInput = (evt) => {
    dispatch({
      type: 'inputField',
      fieldName: evt.target.name,
      value: evt.target.value,
    });
  };

  const handleSelect = (evt) => {
    dispatch({
      type: 'selectField',
      fieldName: evt.target.name,
      value: evt.target.value,
    });
  };
  const handleChangeNumber = (evt) => {
    dispatch({
      type: 'inputNumberField',
      fieldName: evt.target.name,
      value: evt.target.value,
    });
  };
  useEffect(() => {
    updatePageTitle('New Tournament');
  }, [updatePageTitle]);
  return (
    <>
      <Header />
      <Container maxW='max-w-xl'>
        {players.isLoading && <div>Loading players...</div>}
        {!players.isLoading && (
          <Card title='New tournament'>
            <Input
              name='tournamentName'
              label='Tournament name'
              placeholder='Tournament name'
              value={formState['tournamentName']}
              onChange={handleInput}
              required
            />
            <form className='space-y-2'>
              <label htmlFor='venue'>
                Pick venue, or leave blank to fill later
              </label>
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
              <InputNumber
                label='Number of starting cups'
                name='gameSize'
                value={formState['gameSize']}
                min={minGameSize}
                max={maxGameSize}
                onChange={handleChangeNumber}
              />
              {/* Next page, more like a wizard?
                should have option to "save", before publish

                only create the games on publish or start*
              */}
              <div className='pt-4'>
                <Button text='Create!' type='submit' fullWidth />
              </div>
            </form>
          </Card>
        )}
      </Container>
      <div className='spacer py-8'></div>
    </>
  );
}
