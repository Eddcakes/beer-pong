export async function fetchPlayerById(playerId) {
  try {
    const player = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/v1/players/${playerId}`,
      {
        credentials: 'include',
      }
    );
    const resp = await player.json();
    return resp;
  } catch (err) {
    throw new Error(err);
  }
}
