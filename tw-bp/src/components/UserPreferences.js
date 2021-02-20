import React, { useState, useEffect } from 'react';
import Joi from 'joi';
import { Button } from './Button';
import { Input } from './Input';

const schema = Joi.object().keys({
  avatar_link: Joi.string().trim().uri(),
});

export function UserPreferences() {
  //do i need to use authcontext to decide to only show preferences to logged in users
  // const { user } = useContext(AuthContext);import AuthContext from '../AuthContext';
  const [preferences, setPreferences] = useState({ avatarLink: '' });
  // create a variable for initial changes, to compare with current preferences to decide if to post update
  // const [startingPreferences, setStartingPreferences] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  //name of property and value
  const updatePreferences = (evt) => {
    const { name, value } = evt.target;
    setPreferences({ ...preferences, [name]: value });
  };

  const saveChanges = async (evt) => {
    evt.preventDefault();
    if (validPreferences()) {
      //data that we be posting
      const data = {
        avatar_link: preferences.avatarLink,
      };
      const post = await postPreferences(data);
      try {
        if (post.error !== undefined) {
          // returning post.error here returns server side error
          // don't always want to show that to use'Error with posting data to server'
          return setErrorMsg(post.error);
        }
        //successfully posted
        window.alert('Saved changes!'); //create a msg toast component?
      } catch (err) {
        setErrorMsg('Something went wrong!');
        console.log('error', err);
      }
    }
  };

  function validPreferences() {
    const valid = schema.validate({
      avatar_link: preferences.avatarLink,
    });
    //if (startingPreferences !== preferences) {
    if (valid.error === undefined) {
      return true;
    } else {
      //or create custom error msg for user
      setErrorMsg(valid.error.message);
      return false;
    }
  }
  //else {
  //}

  useEffect(() => {
    async function fetchData() {
      const myPreferences = await fetchPreferences();
      //am i happy setting it to undefined if user not logged in?
      if (myPreferences.length > 0) {
        setPreferences(myPreferences[0]);
      }
    }
    fetchData();
  }, []);
  return (
    <form>
      <Input
        name='avatarLink'
        label='Link to avatar'
        value={preferences.avatarLink}
        onChange={updatePreferences}
        errorMsg={errorMsg}
      />
      <Button text='Save changes' handleClick={saveChanges}></Button>
    </form>
  );
}

async function fetchPreferences() {
  const player = await fetch(
    `${process.env.REACT_APP_BACKEND_URL}/api/v1/preferences/`,
    {
      credentials: 'include',
    }
  );
  const resp = await player.json();
  return resp;
}

async function postPreferences(newPreferences) {
  console.log(JSON.stringify(newPreferences));
  const preferences = await fetch(
    `${process.env.REACT_APP_BACKEND_URL}/api/v1/preferences/`,
    {
      method: 'POST',
      body: JSON.stringify(newPreferences),
      credentials: 'include',
    }
  );
  const resp = await preferences.json();
  return resp;
}
