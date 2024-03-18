const express = require('express');
const router = express.Router();
const loginController = require('../controllers/login');

router.get("/register", loginController.showSignupForm);
router.get("/login", loginController.showLoginForm);
router.post("/login", loginController.login);
router.get("/logout", loginController.logout);

module.exports = router;


