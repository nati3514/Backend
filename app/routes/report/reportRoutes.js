const express = require('express');
// const multer = require('../middleware/multer'); // Middleware for file uploads
const reportController = require('../../controller/report/reportController');
//const storage = multer.memoryStorage(); // Use memory storage for processing uploaded files before saving
//const upload = multer({ storage });
const router = express.Router();

router.post('/reports', reportController.createReport); // Create a report with file upload
// router.post('/reports', multer.array('attachments', 10), reportController.createReport); // Create a report with file upload
router.get('/reports', reportController.getReports); // Get all reports
//router.get('/reports/:id', reportController.getReportById); // Get a specific report by ID
router.put('/reports/:id', reportController.updateReport);
router.get('/analytics', reportController.Analytics);

module.exports = router;

