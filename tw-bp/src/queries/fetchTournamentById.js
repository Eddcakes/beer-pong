export async function fetchTournamentById(id) {
  const player = await fetch(
    `${process.env.REACT_APP_BACKEND_URL}/api/v1/tournaments/${id}`
  );
  const resp = await player.json();
  return resp;
}
