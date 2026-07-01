const express = require('express');
const router = express.Router();
const materiaController = require('../controllers/materia.controller');
const { authMiddleware, adminMiddleware } = require('../middlewares/auth.middleware');

router.get('/', materiaController.listarTodas);
router.get('/cuatrimestre/:id', materiaController.listarPorCuatrimestre);
router.get('/:id', materiaController.obtenerPorId);
router.post('/', authMiddleware, adminMiddleware, materiaController.crear);
router.put('/:id', authMiddleware, adminMiddleware, materiaController.actualizar);
router.delete('/:id', authMiddleware, adminMiddleware, materiaController.eliminar);

module.exports = router;