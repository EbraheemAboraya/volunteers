const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report');
const loginController = require('../controllers/login');

router.post('/addReport',loginController.ensureToken, reportController.createReport);
router.get('/getReports', loginController.ensureToken,reportController.getAllReports);
router.get('/getReport/:id',loginController.ensureToken, reportController.getReportById);
router.put('/updateReport/:id',loginController.ensureToken, reportController.updateReport);
router.delete('/deleteReport/:id',loginController.ensureToken, reportController.deleteReport);

module.exports = router;