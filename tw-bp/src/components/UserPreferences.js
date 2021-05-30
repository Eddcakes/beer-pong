import React, { useState, useEffect } from 'react';
import Joi from 'joi';
import { Button } from './Button';
import { Input } from './Input';
import { useMutation, useQuery } from 'react-query';
import { fetchPreferences, postPreferences } from '../queries';

const schema = Joi.object().keys({
  avatar_link: Joi.string().trim().uri(),
});

export function UserPreferences() {
  //do i need to use authcontext to decide to only show preferences to logged in users
  // const { user } = useContext(AuthContext);import AuthContext from '../AuthContext';
  const [preferences, setPreferences] = useState({ avatarLink: '' });
  const { isLoading, data, error } = useQuery(
    ['preferences'],
    fetchPreferences
  );
  const mutation = useMutation((data) => postPreferences(data), {
    onError: (error, variables, context) => {
      setErrorMsg(error);
    },
    onSuccess: (data, variables, context) => {
      console.log('saved changes!');
    },
  });
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
      mutation.mutate(data);
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
