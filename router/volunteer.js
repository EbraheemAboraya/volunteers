const express = require("express");
const router = express.Router();
<<<<<<< HEAD
const volunteerController = require('../controllers/volunteerController');
const loginController = require('../controllers/login');
const upload = require("../middleware/img");



router.get("/volunteer/programs",loginController.ensureToken,volunteerController.getPrograms);
router.get("/volunteer/Individual",loginController.ensureToken,volunteerController.getIndividual);
router.post("/volunteer/signup",upload.single('selectedFile'),volunteerController.signup);
router.post("/volunteer/sendToJoinProg",loginController.ensureToken,volunteerController.sendToJoin);
router.get("/volunteer/progress",loginController.ensureToken,volunteerController.getProgress);
router.post("/volunteer/finish-Program",loginController.ensureToken,volunteerController.finishProgram);
router.get("/api/users",loginController.ensureToken,volunteerController.getUsersForSidebar);




=======
const volunteerController = require("../controllers/volunteerController");
const loginController = require("../controllers/login");
const multer = require("multer");
const upload = require("../middleware/img");

router.get(
  "/volunteer/programs",
  loginController.ensureToken,
  volunteerController.getPrograms
);
router.get(
  "/volunteer/Individual",
  loginController.ensureToken,
  volunteerController.getIndividual
);
router.post(
  "/volunteer/signup",
  upload.single("selectedFile"),
  volunteerController.signup
);
router.post(
  "/volunteer/sendToJoinProg",
  loginController.ensureToken,
  volunteerController.sendToJoin
);
router.get(
  "/volunteer/progress",
  loginController.ensureToken,
  volunteerController.getProgress
);
router.post(
  "/volunteer/finish-Program",
  loginController.ensureToken,
  volunteerController.finishProgram
);
>>>>>>> 0d73ed0454c43ad406d878aa327d4fba7417f52d

module.exports = router;
