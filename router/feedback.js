const express = require("express");
const router = express.Router();
const feedbackcontroller = require("../controllers/feedbackcontroller");
const uploadMiddleware = require("../middleware/img");
const loginController = require('../controllers/login');


router.get('/feedbacks/:ProgramID', loginController.ensureToken, feedbackcontroller.getAllFeedback);
router.get('/feedback/user/:userId',loginController.ensureToken, feedbackcontroller.getFeedbackByUserId);
router.post('/feedbacks',loginController.ensureToken, feedbackcontroller.addFeedback);


module.exports = router;