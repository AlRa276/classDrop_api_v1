const express = require('express');
const router = express.Router();
const descargasArchivoController = require('../controllers/descargasArchivo.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');

router.post('/', authMiddleware, descargasArchivoController.registrar);
router.get('/usuario', authMiddleware, descargasArchivoController.listarPorUsuario);
router.get('/usuario/contador', authMiddleware, descargasArchivoController.contarPorUsuario);
router.get('/archivo/:id', authMiddleware, descargasArchivoController.listarPorArchivo);

module.exports = router;