export async function fetchGamesByTournamentId(id) {
  const player = await fetch(
    `${process.env.REACT_APP_BACKEND_URL}/api/v1/games/tournament/${id}`
  );
  const resp = await player.json();
  return resp;
}
