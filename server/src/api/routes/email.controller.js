export const apiConfirmEmail = (db) => async (req, res) => {
  try {
    console.log('api confirm email');
    const { email, subject, text } = req.body;
    // find account by email

    // check if user exists
    // if exists but not clicked confirm
    // resend confirm

    const confirmEmail = db.postEmail(email, subject, text);
    res.json(confirmEmail);
  } catch (err) {
    res.status(500);
    res.send(err.message);
  }
};
