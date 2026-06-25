const express = require('express');
const router = express.Router();
const normaController = require('../controllers/norma.controller');
const { authMiddleware, adminMiddleware } = require('../middlewares/auth.middleware');

router.get('/', normaController.listar);
router.get('/activas', normaController.listarActivas);
router.get('/:id', normaController.obtenerPorId);
router.post('/', authMiddleware, adminMiddleware, normaController.crear);
router.put('/:id', authMiddleware, adminMiddleware, normaController.actualizar);
router.delete('/:id', authMiddleware, adminMiddleware, normaController.eliminar);

module.exports = router;
