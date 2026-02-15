const express = require('express');
const router = express.Router();
const usageController = require('../controllers/usageController');
const { authMiddleware, requireAdmin } = require('../middlewares/authMiddleware');

// rota pra verificar se o usuário pode fazer análise
router.post('/check', authMiddleware, usageController.checkUsageLimit);

// rota pra registrar que o usuário fez uma análise
router.post('/increment', authMiddleware, usageController.incrementUsage);

// rota pra resetar o uso (somente admin)
router.post('/reset', authMiddleware, requireAdmin, usageController.resetUsage);

module.exports = router;