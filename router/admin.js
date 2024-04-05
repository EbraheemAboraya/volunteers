const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const checkRole = require("../middleware/authMiddleware");
const uploadMiddleware = require("../middleware/img");
const loginController = require('../controllers/login');




router.post("/admin/signup", adminController.signup);
router.post("/addprogram", loginController.ensureToken, adminController.AddProgram);
router.put("/updateprogram", loginController.ensureToken, adminController.updateProgram);
router.delete("/deleteprogram", loginController.ensureToken, adminController.deleteProgram);


// router.post("/add-program",uploadMiddleware.single("image"),adminController.AddProgram);

module.exports = router;
