const express = require('express');
const router = express.Router();
const analysisController = require('../controllers/analysisController');
const validatePDF = require('../middlewares/validatePDF');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/hemogram', authMiddleware, validatePDF, analysisController.analyzeHemogram);

module.exports = router;