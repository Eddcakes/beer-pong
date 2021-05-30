export async function fetchPlayers() {
  try {
    const fetchPlayers = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/v1/players`,
      {
        credentials: 'include',
      }
    );
    const playersJson = await fetchPlayers.json();
    return playersJson;
  } catch (err) {
    throw new Error(err);
  }
}
