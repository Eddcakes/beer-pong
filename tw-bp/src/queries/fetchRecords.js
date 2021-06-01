export async function fetchRecords() {
  try {
    const records = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/v1/records/`,
      {
        credentials: 'include',
      }
    );
    const resp = await records.json();
    return resp;
  } catch (err) {
    throw new Error(err);
  }
}
