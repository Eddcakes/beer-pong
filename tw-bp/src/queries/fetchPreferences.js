export async function fetchPreferences() {
  const player = await fetch(
    `${process.env.REACT_APP_BACKEND_URL}/api/v1/preferences/`,
    {
      credentials: 'include',
    }
  );
  const resp = await player.json();
  return resp;
}
