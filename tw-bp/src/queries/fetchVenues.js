export async function fetchVenues() {
  try {
    const fetchVenues = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/v1/venues`,
      {
        credentials: 'include',
      }
    );
    const venuesJson = await fetchVenues.json();
    return venuesJson;
  } catch (err) {
    throw new Error(err);
  }
}
