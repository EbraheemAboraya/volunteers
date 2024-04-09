const jwt = require("jsonwebtoken");
const adminRepository = require("../repository/admin");
const volunteerRepository = require("../repository/volunteer");

function getTok(req, res) {}

const login = async (req, res) => {
  const { userName, password } = req.body;
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
    }
    if (password === user.password) {
      const tokenPayload = {
        id: user._id,
        userName: user.userName,
        role: user.role,
        address: user.address,
        name: user.fullName,
      };
      const token = jwt.sign({ tokenPayload }, "my_secret_key");
      return res.json({ token: token });
    } else {
      return res.send(false);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error logging in");
  }
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

function getUserData(req, res) {
  try {
    const tokenWithoutQuotes = req.token.replace(/"/g, "");
    jwt.verify(tokenWithoutQuotes, "my_secret_key", async function (err, data) {
      if (err) {
        res.sendStatus(403);
      } else {
        return res.status(200).send(data.tokenPayload);
      }
    });
  } catch (err) {
    return res.status(err?.status || 500).json({ message: err.message });
  }
}

const userImage = async (req, res) => {
  try {
    const { role, id } = req.params;

<<<<<<< HEAD
        if (role === "volunteer") {
          const volImage = await volunteerRepository.getVolunteerData(id);
          if (!volImage) return false
          return res.status(200).send(volImage.image);
        } else {
          const adminImage = await adminRepository.getAdminData(id);
          if (!adminImage) return false
          return res.status(200).json(adminImage.image);
        }
=======
    if (role === "volunteer") {
      const volImage = await volunteerRepository.getVolunteerData(id);
      if (!volImage) return false;
      return res.status(200).send(volImage.image);
    } else {
      const adminImage = await adminRepository.getAdminData(id);
      if (!adminImage) return false;
      return res.status(200).send(adminImage.image);
    }
>>>>>>> 0d73ed0454c43ad406d878aa327d4fba7417f52d
  } catch (err) {
    return res.status(err?.status || 500).json({ message: err.message });
  }
};

module.exports = {
  login,
  ensureToken,
  getUserData,
  getTok,
  userImage,
};
