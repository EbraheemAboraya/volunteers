const express = require("express");
const {
  getMessages,
  sendMessage,
} = require("../controllers/message.controller");
const loginController = require("../controllers/login");

const router = express.Router();

router.get("/:id", loginController.ensureToken, getMessages);
router.post("/send/:id", loginController.ensureToken, sendMessage);

module.exports = router;
