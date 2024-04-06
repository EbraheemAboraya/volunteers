const express = require('express');
const router = express.Router();
const volunteerController = require('../controllers/volunteerController');
const loginController = require('../controllers/login');



router.get("/volunteer/programs",loginController.ensureToken,volunteerController.getPrograms);
router.get("/volunteer/Individual",loginController.ensureToken,volunteerController.getIndividual);
router.post("/volunteer/signup",volunteerController.signup);
router.post("/volunteer/sendToJoinProg",loginController.ensureToken,volunteerController.sendToJoin);
router.get("/volunteer/progress",loginController.ensureToken,volunteerController.getProgress);
router.post("/volunteer/finish-Program",loginController.ensureToken,volunteerController.finishProgram);





module.exports = router;


