export async function fetchVersus(players) {
  const { player1, player2 } = players;
  try {
    const games = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/v1/versus/${player1}/${player2}`,
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
