const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const checkRole = require("../middleware/authMiddleware");
const uploadMiddleware = require("../middleware/img");
const loginController = require('../controllers/login');




router.post("/admin/signup", adminController.signup);
router.post("/add-program", loginController.ensureToken, adminController.AddProgram);
router.put("/update-program", loginController.ensureToken, adminController.updateProgram);
router.delete("/delete-program", loginController.ensureToken, adminController.deleteProgram);


// router.post("/add-program",uploadMiddleware.single("image"),adminController.AddProgram);

module.exports = router;
