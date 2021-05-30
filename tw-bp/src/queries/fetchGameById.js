export async function fetchGameById(gameId) {
  try {
    const game = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/v1/games/${gameId}`,
      {
        credentials: 'include',
      }
    );
    const resp = await game.json();
    return resp;
  } catch (err) {
    throw new Error(err);
  }
}
