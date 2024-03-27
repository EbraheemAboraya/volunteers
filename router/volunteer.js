const express = require('express');
const router = express.Router();
const volunteerController = require('../controllers/volunteerController');
const loginController = require('../controllers/login');



router.get("/volunteer/programs",loginController.ensureToken,volunteerController.getPrograms);
router.get("/volunteer/Individual",loginController.ensureToken,volunteerController.getIndividual);

router.post("/volunteer/signup",volunteerController.signup);



module.exports = router;


