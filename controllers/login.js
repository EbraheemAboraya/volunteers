const bcrypt = require("bcrypt");
const adminRepository = require("../repository/admin");
const volunteerRepository = require("../repository/volunteer");

const showLoginForm = (req, res) => {
  res.render("login");
};

const showSignupForm = (req, res) => {
  res.render("signup");
};

const login = async (req, res) => {
  const { userName, password } = req.body;
  console.log("ihm hereeeeeeeeeeeeeeeeeeeeeeeee");
  try {
    const admin = await adminRepository.findByUsername(userName);
    if (!admin) {
      const volunteer = await volunteerRepository.findByUsername(userName);
      if (!volunteer) {
        return res.status(401).send("Invalid username or password");
      }
      if (password === volunteer.password) {
        req.session.user = volunteer;
        return true;
      }
    }
    if (password === admin.password) {
      req.session.user = admin;
      return res.redirect("/admin/index");
    } else {
      return false;
    }
  } catch (error) {
    return res.status(500).send("Error logging in");
  }
};

const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("Error logging out");
    }
    return res.redirect("/login");
  });
};

module.exports = {
  showLoginForm,
  showSignupForm,
  login,
  logout,
};
