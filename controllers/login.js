const jwt = require("jsonwebtoken");
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
    let user;

    const admin = await adminRepository.findByUsername(userName);
    if (admin) {
      user = admin;
    } else {
      const volunteer = await volunteerRepository.findByUsername(userName);
      if (volunteer) {
        user = volunteer;
      } else {
        return res.status(401).send("Invalid username or password");
      }
      if (password === volunteer.password) {
        req.session.user = volunteer;
        return true;
      }
    }
    let isMatch;
    if (password === user.password) {
      isMatch = true;
    } else {
      return false;
    }

    const tokenPayload = {
      id: user._id,
      userName: user.userName,
      role: user.role,
    };

    const token = jwt.sign({tokenPayload},'my_secret_key');
    res.json({token: token});

  } catch (error) {
    console.error(error);
    res.status(500).send("Error logging in");
  }
};

const logout = (req, res) => {
  return res.redirect("/login");
};

function ensureToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403); 
  }
}

module.exports = {
  showLoginForm,
  showSignupForm,
  login,
  logout,
  ensureToken,
};
