import React, { useState, useContext, useEffect } from 'react';
import Joi from 'joi';
import { Button } from './Button';

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
      console.log(myPreferences);
      if (myPreferences.length > 0) {
        setPreferences(myPreferences[0]);
      }
    }
    fetchData();
  }, []);
  return (
    <form>
      <div className='flex flex-col mb-2'>
        <label htmlFor='avatarLink'>Link to avatar</label>
        <input
          className='w-full block appearance-none bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500'
          name='avatarLink'
          value={preferences.avatarLink}
          onChange={updatePreferences}
        />
        {errorMsg.length > 0 && <p className='text-red-700'>{errorMsg}</p>}
      </div>
      <Button text='Save changes' handleClick={saveChanges}></Button>
    </form>
  );
}

async function fetchPreferences() {
  const player = await fetch(`http://localhost:1337/api/v1/preferences/`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('tw-bp:jwt')}`,
    },
  });
  const resp = await player.json();
  return resp;
}

async function postPreferences(newPreferences) {
  console.log(JSON.stringify(newPreferences));
  const preferences = await fetch(`http://localhost:1337/api/v1/preferences/`, {
    method: 'POST',
    body: JSON.stringify(newPreferences),
    headers: {
      Authorization: `Bearer ${localStorage.getItem('tw-bp:jwt')}`,
      'content-type': 'application/json',
    },
  });
  const resp = await preferences.json();
  return resp;
}
