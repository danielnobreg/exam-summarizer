const express = require('express');
const router = express.Router();
const analysisController = require('../controllers/analysisController');
const validatePDF = require('../middlewares/validatePDF');

router.post('/hemogram', validatePDF, analysisController.analyzeHemogram);

module.exports = router;