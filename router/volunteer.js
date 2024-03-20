const express = require('express');
const router = express.Router();
const volunteerController = require('../controllers/volunteerController');
const checkRole = require('../middleware/authMiddleware');


router.get("/volunteer/index", checkRole('volunteer'),volunteerController.getindex);
router.post("/volunteer/signup",volunteerController.signup);



module.exports = router;


