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

module.exports = router;