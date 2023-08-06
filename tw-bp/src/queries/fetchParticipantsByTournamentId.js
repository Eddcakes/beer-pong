export async function fetchParticipantsByTournamentId(id) {
  const participants = await fetch(
    `${process.env.REACT_APP_BACKEND_URL}/api/v1/tournaments/${id}/participants`
  );
  const resp = await participants.json();
  return resp;
}
