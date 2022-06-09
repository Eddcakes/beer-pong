export async function postUpdatePassword(data) {
  try {
    const updatePassword = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/v1/auth/update`,
      {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'content-type': 'application/json',
        },
        credentials: 'include',
      }
    );
    const resp = await updatePassword.json();
    return resp;
  } catch (err) {
    throw new Error(err);
  }
}
