const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
//const { authenticateToken } = require('../../middleware/auth');
const dailyReportController = require('../../controller/report/dailyReportController');

const uploadDir = 'uploads/reports';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png'];
    const ext = path.extname(file.originalname).toLowerCase();
    
    if (allowedTypes.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Allowed types: PDF, DOC, DOCX, JPG, JPEG, PNG'));
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Error handling middleware for multer
const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: 'File upload error', error: err.message });
    } else if (err) {
        return res.status(400).json({ message: 'Invalid file', error: err.message });
    }
    next();
};



// Routes
// router.post('/', authenticateToken, upload.single('attachment'), dailyReportController.createDailyReport);
// router.get('/', authenticateToken, dailyReportController.getAllDailyReports);
// router.get('/:id', authenticateToken, dailyReportController.getDailyReportById);
// router.patch('/:id/status', authenticateToken, dailyReportController.updateDailyReportStatus);
// router.delete('/:id', authenticateToken, dailyReportController.deleteDailyReport);
router.post('/', upload.single('attachment'), dailyReportController.createDailyReport);
router.get('/', dailyReportController.getAllDailyReports);
router.get('/:id', dailyReportController.getDailyReportById);
router.patch('/:id/status', dailyReportController.updateDailyReportStatus);
router.delete('/:id', dailyReportController.deleteDailyReport);


module.exports = router;
