export async function postPreferences(newPreferences) {
  const preferences = await fetch(
    `${process.env.REACT_APP_BACKEND_URL}/api/v1/preferences/`,
    {
      method: 'POST',
      body: JSON.stringify(newPreferences),
      headers: {
        'content-type': 'application/json',
      },
      credentials: 'include',
    }
  );
  const resp = await preferences.json();
  return resp;
}
