export async function fetchTournaments() {
  try {
    const tournaments = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/v1/tournaments/`,
      {
        credentials: 'include',
      }
    );
    const resp = await tournaments.json();
    return resp;
  } catch (err) {
    throw new Error(err);
  }
}
