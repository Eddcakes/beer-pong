export async function fetchRecentGamesByPlayerId(playerId) {
  const recentGames = await fetch(
    `${process.env.REACT_APP_BACKEND_URL}/api/v1/games/recent/${playerId}`
  );
  const resp = await recentGames.json();
  return resp;
}
