const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");
const loginController = require("../controllers/login");

router.post(
  "/addReport",
  loginController.ensureToken,
  reportController.createReport
);

module.exports = router;
