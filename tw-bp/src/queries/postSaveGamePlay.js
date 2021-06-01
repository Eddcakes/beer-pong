export async function postSaveGamePlay(data) {
  const { game_ID: gameId, ...rest } = data;
  try {
    const updateGame = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/v1/games/${gameId}`,
      {
        method: 'POST',
        body: JSON.stringify(rest),
        headers: {
          'content-type': 'application/json',
        },
        credentials: 'include',
      }
    );
    const resp = await updateGame.json();
    return resp;
  } catch (err) {
    throw new Error(err);
  }
}
