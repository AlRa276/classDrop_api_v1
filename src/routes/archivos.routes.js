const express = require('express');
const router = express.Router();
const archivoController = require('../controllers/archivo.controller');
const { authMiddleware, adminMiddleware } = require('../middlewares/auth.middleware');

router.get('/publicados', archivoController.listarPublicados);
router.patch('/:id/estado', authMiddleware, adminMiddleware, archivoController.actualizarEstado);
router.get('/:id', archivoController.obtenerPorId);
router.post('/', authMiddleware, archivoController.crear);
router.delete('/:id', authMiddleware, archivoController.eliminar);

module.exports = router;
