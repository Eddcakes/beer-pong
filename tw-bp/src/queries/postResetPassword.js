export async function postResetPassword(data) {
  const { token, ...credentials } = data;
  try {
    const updatePassword = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/v1/auth/reset-password/${token}`,
      {
        method: 'POST',
        body: JSON.stringify(credentials),
        headers: {
          'content-type': 'application/json',
        },
      }
    );
    const resp = await updatePassword.json();
    return resp;
  } catch (err) {
    throw new Error(err);
  }
}
