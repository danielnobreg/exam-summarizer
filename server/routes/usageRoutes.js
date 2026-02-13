const express = require('express');
const router = express.Router();
const usageController = require('../controllers/usageController');
const authMiddleware = require('../middlewares/authMiddleware');

// rota pra verificar se o usuário pode fazer análise
router.post('/check', authMiddleware, usageController.checkUsageLimit);

// rota pra registrar que o usuário fez uma análise
router.post('/increment', authMiddleware, usageController.incrementUsage);

// rota pra resetar o uso (admin)
router.post('/reset', authMiddleware, usageController.resetUsage);

module.exports = router;