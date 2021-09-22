import bcrypt from 'bcryptjs';

export const apiGetAllUsers = (db) => async (req, res) => {
  try {
    const allUsers = await db.getAllUsers(req.session.user.id);
    res.json(allUsers);
  } catch (err) {
    res.status(500);
    res.send(err.message);
  }
};

export const apiPatchUser = (db) => async (req, res) => {
  try {
    const userDetails = req.body;
    if (userDetails.password) {
      userDetails.password = await bcrypt.hash(userDetails.password, 12);
    }
    const updateUser = await db.patchUser(req.session.user.id, userDetails);
    res.json(updateUser);
  } catch (err) {
    res.status(500);
    res.send(err.message);
  }
};
