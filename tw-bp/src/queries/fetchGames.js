export async function fetchGames() {
  try {
    const games = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/v1/games/`,
      {
        credentials: 'include',
      }
    );
    const resp = await games.json();
    return resp;
  } catch (err) {
    throw new Error(err);
  }
}
