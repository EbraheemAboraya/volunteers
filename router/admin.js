const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const checkRole = require("../middleware/authMiddleware");
const uploadMiddleware = require('../middleware/img'); 


router.get("/admin/index", checkRole("admin"), adminController.getProfile);
router.post("/admin/signup", adminController.signup);
router.get("/admin/addProgram", adminController.getProgramPage);
router.post("/add-program", uploadMiddleware.single('image'),adminController.AddProgram);


module.exports = router;
