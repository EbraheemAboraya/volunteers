const express = require("express");
const router = express.Router();
const loginController = require("../controllers/login");

router.post("/login", loginController.login);
router.get(
  "/user-data",
  loginController.ensureToken,
  loginController.getUserData
);
router.get(
  "/userImage/:id/:role",
  loginController.ensureToken,
  loginController.userImage
);

module.exports = router;