export async function postNewGame(data) {
  const newGame = await fetch(
    `${process.env.REACT_APP_BACKEND_URL}/api/v1/games/new`,
    {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'content-type': 'application/json',
      },
      credentials: 'include',
    }
  );
  const newGameJson = await newGame.json();
  return newGameJson;
}
