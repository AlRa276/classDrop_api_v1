const express = require('express');
const router = express.Router();
const guardadosArchivoController = require('../controllers/guardadosArchivo.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');

router.post('/:archivoId', authMiddleware, guardadosArchivoController.guardar);
router.delete('/:archivoId', authMiddleware, guardadosArchivoController.quitar);
router.get('/usuario', authMiddleware, guardadosArchivoController.listarPorUsuario);
router.get('/usuario/archivos', authMiddleware, guardadosArchivoController.listarArchivosGuardados);
router.get('/usuario/contador', authMiddleware, guardadosArchivoController.contarPorUsuario);

module.exports = router;