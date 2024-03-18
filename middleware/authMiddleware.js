function checkRole(role) {
  return (req, res, next) => {
    if (req.session.user && req.session.user.role === role) {
      next();
    } else {
      res.status(401).redirect('/login');
    }
  };
}
module.exports = checkRole;
