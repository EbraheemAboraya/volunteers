const express = require("express");
const router = express.Router();
const loginController = require("../controllers/login");

router.post("/login", loginController.login);
router.get("/logout", loginController.logout);

router.get("/user-data", loginController.ensureToken,loginController.getUserData);

module.exports = router;
