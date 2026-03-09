const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authMiddleware, requireAdmin } = require('../middlewares/authMiddleware');

// rota protegida — somente admin autenticado pode criar usuários
router.post('/create-user', authMiddleware, requireAdmin, adminController.createUser);

// rota protegida — somente admin pode listar usuários
router.get('/list-users', authMiddleware, requireAdmin, adminController.listUsers);

// rota protegida — somente admin pode apagar usuários
router.delete('/delete-user/:id', authMiddleware, requireAdmin, adminController.deleteUser);

// histórico global
router.get('/global-history', authMiddleware, requireAdmin, adminController.getGlobalHistory);
router.delete('/global-history/:userId/:historyId', authMiddleware, requireAdmin, adminController.undoHistoryItem);

module.exports = router;