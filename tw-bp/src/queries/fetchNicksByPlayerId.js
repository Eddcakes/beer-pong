export async function fetchNicksByPlayerId(playerId) {
  const nicks = await fetch(
    `${process.env.REACT_APP_BACKEND_URL}/api/v1/nicknames/player/${playerId}`
  );
  const resp = await nicks.json();
  return resp;
}
