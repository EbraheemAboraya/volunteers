const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const checkRole = require('../middleware/authMiddleware');


router.get("/admin/index",checkRole('admin'), adminController.getProfile);
router.post("/admin/signup",adminController.signup);


module.exports = router;


