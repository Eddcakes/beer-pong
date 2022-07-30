export async function postNewTournament(data) {
  const newTournament = await fetch(
    `${process.env.REACT_APP_BACKEND_URL}/api/v1/tournaments/new`,
    {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'content-type': 'application/json',
      },
      credentials: 'include',
    }
  );
  const newTournamentJson = await newTournament.json();
  return newTournamentJson;
}
