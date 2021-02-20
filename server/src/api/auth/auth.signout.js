export const serverSignOut = async (req, res, next) => {
  req.session.destroy();
  res.json({ message: 'successfully logged out' });
};
