export async function fetchPlayerOverview(playerId) {
  const overviewResp = await fetch(
    `${process.env.REACT_APP_BACKEND_URL}/api/v1/overview/${playerId}`
  );
  const overview = await overviewResp.json();
  return overview;
}
