export async function postNewPlayer(data) {
  const newPlayer = await fetch(
    `${process.env.REACT_APP_BACKEND_URL}/api/v1/players/new`,
    {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'content-type': 'application/json',
      },
      credentials: 'include',
    }
  );
  const newPlayerJson = await newPlayer.json();
  return newPlayerJson;
}
