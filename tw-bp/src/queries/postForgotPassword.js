export async function postForgotPassword(data) {
  try {
    const forgotPassword = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/v1/email`, ///auth/forgot-password
      {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'content-type': 'application/json',
        },
        credentials: 'include',
      }
    );
    const resp = await forgotPassword.json();
    return resp;
  } catch (err) {
    throw new Error(err);
  }
}
