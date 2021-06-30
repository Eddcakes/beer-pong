export async function fetchRecordsByPlayerId(playerId) {
  const records = await fetch(
    `${process.env.REACT_APP_BACKEND_URL}/api/v1/records/player/${playerId}`
  );
  const resp = await records.json();
  return resp;
}
