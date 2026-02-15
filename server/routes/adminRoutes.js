const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authMiddleware, requireAdmin } = require('../middlewares/authMiddleware');

// rota protegida — somente admin autenticado pode criar usuários
router.post('/create-user', authMiddleware, requireAdmin, adminController.createUser);

// rota protegida — somente admin pode listar usuários
router.get('/list-users', authMiddleware, requireAdmin, adminController.listUsers);

module.exports = router;