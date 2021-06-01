import React, { useState, useEffect } from 'react';
import Joi from 'joi';
import { Button } from './Button';
import { Input } from './Input';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { fetchPreferences, postPreferences } from '../queries';
import { useAuth } from '../hooks/useAuth';

const schema = Joi.object().keys({
  avatar_link: Joi.string().trim().uri(),
});

export function UserPreferences() {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState({ avatarLink: '' });
  const queryClient = useQueryClient();
  const { isLoading, data, error } = useQuery(
    ['preferences'],
    fetchPreferences,
    { enabled: !!user }
  );
  const mutation = useMutation(postPreferences, {
    onError: (error) => {
      setErrorMsg(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries('preferences');
    },
  });
  const [errorMsg, setErrorMsg] = useState('');

  //name of property and value
  const updatePreferences = (evt) => {
    const { name, value } = evt.target;
    setPreferences((old) => ({ ...old, [name]: value }));
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
    if (valid.error === undefined) {
      return true;
    } else {
      setErrorMsg(valid.error.message);
      return false;
    }
  }

  useEffect(() => {
    //sync form state with react-query, or use uncontrolled components with a default?
    if (data) {
      setPreferences(data[0]);
    }
  }, [data]);

  if (!user) {
    return <div>Please log in to save personal preferences</div>;
  }
  return (
    <form>
      {isLoading && <span>Loading...</span>}
      {error && <span>Error {JSON.stringify(error, null, 2)}</span>}
      {!isLoading && (
        <>
          <Input
            name='avatarLink'
            label='Link to avatar'
            value={preferences?.avatarLink}
            onChange={updatePreferences}
            errorMsg={errorMsg}
          />
          <Button
            text='Save changes'
            handleClick={saveChanges}
            disabled={mutation.isLoading}
          />
        </>
      )}
    </form>
  );
}
