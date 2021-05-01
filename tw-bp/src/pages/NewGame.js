import React, { useEffect, useReducer, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Joi from 'joi';

import {
  Button,
  buttonVariant,
  buttonColor,
  Card,
  Container,
  Header,
  PlayerPicker,
  Select,
} from '../components';
import { createInitialCups } from '../tableMachine';

/* clicking on tournament match, would auto fill in game page if not played*/
/* list of error msgs https://github.com/sideway/joi/blob/master/API.md#list-of-errors */
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
});

const initialForm = {
  player1: '',
  player2: '',
  venue: '',
};

function reducer(state, action) {
  switch (action.type) {
    case 'inputField':
      return { ...state, [action.fieldName]: action.value };
    case 'playerButton':
      return { ...state, [action.fieldName]: action.value };
    case 'initialise':
      return { ...state };
    default:
      return { ...state };
  }
}

export function NewGame({ updatePageTitle }) {
  let history = useHistory();
  const [formState, dispatch] = useReducer(reducer, initialForm);
  const [playerList, setPlayerList] = useState(null);
  const [venueList, setVenueList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

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

  const handleChange = (evt) => {
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
        winner: undefined,
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
        table: initialTable,
      };
      console.log('hit submit', values);
      try {
        const createGame = await postNewGame(values);
        console.log(createGame);
        if (createGame.error) {
          return setErrorMsg(createGame.error);
        }
        history.push(`/game/${createGame.gameId}`);
      } catch (err) {
        setErrorMsg('Could not create game, please try again later.');
      }
    }
  };

  function validForm() {
    if (formState.player1 !== formState.player2) {
      const valid = schema.validate({
        player1: formState.player1,
        player2: formState.player2,
        venue: formState.venue,
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

  const getPlayers = async () => {
    try {
      const fetchPlayers = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/players`,
        {
          credentials: 'include',
        }
      );
      const playersJson = await fetchPlayers.json();
      setPlayerList(playersJson);
      return playersJson;
    } catch (err) {
      console.error('fetching players error:', err);
    }
  };

  const getVenues = async () => {
    try {
      const fetchVenues = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/venues`,
        {
          credentials: 'include',
        }
      );
      const venuesJson = await fetchVenues.json();
      setVenueList(venuesJson);
      return venuesJson;
    } catch (err) {
      console.error('fetching venues error:', err);
    }
  };

  useEffect(() => {
    updatePageTitle('Friendlies');
  }, [updatePageTitle]);

  useEffect(() => {
    //load player name options
    Promise.all([getPlayers(), getVenues()]).then((values) => {
      setLoading(false);
    });
  }, []);
  if (loading) {
    return <div>loading</div>;
  }
  return (
    <>
      <Header />
      <Container>
        <Card title='New friendly'>
          <label htmlFor='player1'>Home:</label>
          <PlayerPicker
            name='player1'
            playerNames={playerList}
            selected={formState['player1']}
            selectPlayer={selectPlayer}
            variant={buttonVariant.regular}
            color={buttonColor.outlined}
          />
          <label htmlFor='player2'>Away:</label>
          <PlayerPicker
            name='player2'
            playerNames={playerList}
            selected={formState['player2']}
            selectPlayer={selectPlayer}
            variant={buttonVariant.regular}
            color={buttonColor.outlined}
          />
          <form onSubmit={handleSubmit}>
            <input type='hidden' value={formState['player1']} />
            <input type='hidden' value={formState['player2']} />
            <label htmlFor='venue'>
              Pick venue, or leave blank to fill later
            </label>
            <Select name='venue' onChange={handleChange}>
              {venueList.map((item) => {
                return (
                  <option key={item.venue_ID} value={item.venue_ID}>
                    {item.title}
                  </option>
                );
              })}
            </Select>
            {/* advanced settings, teams (2 each)? would it be possible to do 3v1
              turn into a wizard form instead?
              how many players, player + their cups, next player
              or just have a small + button to add new player to the team

              create *initial* table state here instead of Game
            */}
            {errorMsg.length > 0 && <p className='text-negative'>{errorMsg}</p>}
            <div className='pt-4'>
              <Button text='Create!' type='submit' />
            </div>
          </form>
        </Card>
      </Container>
    </>
  );
}

async function postNewGame(data) {
  const newGame = await fetch(
    `${process.env.REACT_APP_BACKEND_URL}/api/v1/games/new`,
    {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'content-type': 'application/json',
      },
      credentials: 'include',
    }
  );
  const newGameJson = await newGame.json();
  return newGameJson;
}
