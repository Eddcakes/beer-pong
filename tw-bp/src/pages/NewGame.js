import React, { useEffect, useReducer, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Joi from 'joi';

import {
  Button,
  buttonVariant,
  buttonColor,
  Card,
  Checkbox,
  Container,
  Header,
  InputNumber,
  PlayerPicker,
  Select,
  Toggle,
} from '../components';
import { createInitialCups } from '../utils/tableMachine';
import { fetchPlayers, fetchVenues, postNewGame } from '../queries';
import { useQuery, useMutation, useQueryClient } from 'react-query';

/* clicking on tournament match, would auto fill in game page if not played*/
/* list of error msgs https://github.com/sideway/joi/blob/master/API.md#list-of-errors */

/* advanced settings, teams (2 each)? would it be possible to do 3v1
  turn into a wizard form instead?
  how many players, player + their cups, next player
  or just have a small + button to add new player to the team
*/

const initialForm = {
  player1: '',
  player2: '',
  venue: '',
  gameSize: 6,
  homeCupsLeft: 6,
  awayCupsLeft: 6,
  homeForfeit: false,
  awayForfeit: false,
};

function reducer(state, action) {
  switch (action.type) {
    case 'inputField':
      return { ...state, [action.fieldName]: action.value };
    case 'inputNumberField':
      return { ...state, [action.fieldName]: Number(action.value) };
    case 'inputCheckbox':
      return { ...state, [action.fieldName]: action.checked };
    case 'playerButton':
      return { ...state, [action.fieldName]: Number(action.value) };
    case 'selectField':
      return { ...state, [action.fieldName]: Number(action.value) };
    case 'initialise':
      return { ...state };
    default:
      return { ...state };
  }
}

export function NewGame({ updatePageTitle }) {
  let navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutate } = useMutation(postNewGame, {
    onError: (error) => {
      setErrorMsg('Could not create game, please try again later.');
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries('games');
      navigate(`/games/${data.id}`);
    },
  });
  const minGameSize = 6;
  const maxGameSize = 6;
  const [formState, dispatch] = useReducer(reducer, initialForm);
  const [pastGame, setPastGame] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const players = useQuery('players', fetchPlayers);
  const venues = useQuery('venues', fetchVenues);

  const selectPlayer = (name, value) => {
    //how to prevent picking the same player?
    dispatch({
      type: 'playerButton',
      fieldName: name,
      value: value,
    });
    //reset error msg after interacting with button
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

  const handleChangeNumber = (evt) => {
    dispatch({
      type: 'inputNumberField',
      fieldName: evt.target.name,
      value: evt.target.value,
    });
    // naive reset error msg
    if (errorMsg.length > 0) {
      setErrorMsg('');
    }
  };

  const handleToggle = () => {
    // reset results
    dispatch({
      type: 'inputNumberField',
      fieldName: 'homeCupsLeft',
      value: formState['gameSize'],
    });
    dispatch({
      type: 'inputNumberField',
      fieldName: 'awayCupsLeft',
      value: formState['gameSize'],
    });
    dispatch({
      type: 'inputCheckbox',
      fieldName: 'homeForfeit',
      checked: false,
    });
    dispatch({
      type: 'inputCheckbox',
      fieldName: 'awayForfeit',
      checked: false,
    });
    setPastGame(!pastGame);
  };

  const handleForfeitCheck = (evt) => {
    dispatch({
      type: 'inputCheckbox',
      fieldName: evt.target.name,
      checked: evt.target.checked,
    });
    if (evt.target.name.includes('home')) {
      dispatch({
        type: 'inputNumberField',
        fieldName: 'homeCupsLeft',
        value: 0,
      });
    } else if (evt.target.name.includes('away')) {
      dispatch({
        type: 'inputNumberField',
        fieldName: 'awayCupsLeft',
        value: 0,
      });
    }
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    if (validForm()) {
      const initialTable = {
        homeCups: createInitialCups(formState.player1, 'home'),
        preRackHomeCups: null,
        awayCups: createInitialCups(formState.player2, 'away'),
        preRackAwayCups: null,
        firstThrow: null,
        homeCupsLeft: 6,
        homeCupRerackComplete: false,
        homeCupRimCount: 0,
        awayCupsLeft: 6,
        awayCupRerackComplete: false,
        awayCupRimCount: 0,
        forfeit: false,
        winner: null,
        turns: 0,
        selectedCup: null,
        isHovering: false,
        lastHover: { x: null, y: null },
        cupNewPos: { x: null, y: null },
        stack: [],
      };
      const values = {
        ...formState,
        created: new Date(),
        table: pastGame ? null : initialTable,
        locked: pastGame,
      };
      console.log(values);
      mutate(values);
    }
  };

  function validForm() {
    if (formState.player1 !== formState.player2) {
      const valid = schema.validate({
        player1: formState.player1,
        player2: formState.player2,
        venue: formState.venue,
        gameSize: formState.gameSize,
        homeCupsLeft: formState.homeCupsLeft,
        awayCupsLeft: formState.awayCupsLeft,
        forfeit: formState.homeForfeit || formState.awayForfeit,
      });
      if (valid.error === undefined) {
        return true;
      } else {
        // could check what type of error to make sure we create a good error for the user
        setErrorMsg(valid.error.message);
        return false;
      }
    } else {
      setErrorMsg('Player 1 and Player 2 must be different!');
    }
  }

  /* schema */
  const schema = Joi.object().keys({
    player1: Joi.number()
      .required()
      .messages({ 'number.base': 'Player 1 must be selected' }),
    player2: Joi.number()
      .required()
      .messages({ 'number.base': 'Player 2 must be selected' }),
    venue: Joi.number()
      .required()
      .messages({ 'number.base': 'venue is required' }),
    gameSize: Joi.number()
      .integer()
      .less(maxGameSize + 1)
      .greater(minGameSize - 1)
      .required()
      .messages({
        'number.less': `Game size must be less than ${maxGameSize + 1}`,
        'number.greater': `Game size must be more than ${minGameSize - 1}`,
      }),
    homeCupsLeft: Joi.number()
      .integer()
      .less(maxGameSize + 1)
      .greater(-1)
      .required()
      .messages({
        'number.less': `Maximum number of cups must be less than ${
          maxGameSize + 1
        }`,
        'number.greater': `Minimum number of cups is 0!`,
      }),
    awayCupsLeft: Joi.number()
      .integer()
      .less(maxGameSize + 1)
      .greater(-1)
      .required()
      .messages({
        'number.less': `Maximum number of cups must be less than ${
          maxGameSize + 1
        }`,
        'number.greater': `Minimum number of cups is 0!`,
      }),
    forfeit: Joi.boolean().required(),
  });

  useEffect(() => {
    updatePageTitle('Friendlies');
  }, [updatePageTitle]);
  return (
    <>
      <Header />
      <Container maxW='max-w-xl'>
        {players.isLoading && <div>Loading players...</div>}
        {!players.isLoading && (
          <Card title='New friendly'>
            <label htmlFor='player1'>Home:</label>
            <PlayerPicker
              name='player1'
              playerNames={players.data}
              selected={formState['player1']}
              selectPlayer={selectPlayer}
              variant={buttonVariant.regular}
              color={buttonColor.outlined}
              fullWidth
            />
            <label htmlFor='player2'>Away:</label>
            <PlayerPicker
              name='player2'
              playerNames={players.data}
              selected={formState['player2']}
              selectPlayer={selectPlayer}
              variant={buttonVariant.regular}
              color={buttonColor.outlined}
              fullWidth
            />
            <form onSubmit={handleSubmit} className='space-y-2'>
              <input type='hidden' value={formState['player1']} />
              <input type='hidden' value={formState['player2']} />
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
              <div>
                <p>Has the game already been completed?</p>
                <div className='grid justify-center'>
                  <Toggle toggle={handleToggle} active={pastGame} />
                </div>
              </div>
              {pastGame && (
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <h2 className='font-bold text-center'>Home Results</h2>
                    <div>Name: {players.data[formState.player1 - 1]?.name}</div>
                    <InputNumber
                      label='Home cups left'
                      name='homeCupsLeft'
                      value={formState['homeCupsLeft']}
                      min={0}
                      max={maxGameSize}
                      onChange={handleChangeNumber}
                    />
                    <Checkbox
                      label='forfeited?'
                      name='homeForfeit'
                      checked={formState['homeForfeit']}
                      handleChange={handleForfeitCheck}
                    />
                  </div>
                  <div>
                    <h2 className='font-bold text-center'>Away Results</h2>
                    <div>Name: {players.data[formState.player2 - 1]?.name}</div>
                    <InputNumber
                      label='Away cups left'
                      name='awayCupsLeft'
                      value={formState['awayCupsLeft']}
                      min={0}
                      max={maxGameSize}
                      onChange={handleChangeNumber}
                    />
                    <Checkbox
                      label='forfeited?'
                      name='awayForfeit'
                      checked={formState['awayForfeit']}
                      handleChange={handleForfeitCheck}
                    />
                  </div>
                </div>
              )}
              {errorMsg.length > 0 && (
                <p className='text-negative'>{errorMsg}</p>
              )}
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
