const express = require('express');
const router = express.Router();
const etapaPublicacionController = require('../controllers/etapaPublicacion.controller');
const { authMiddleware, adminMiddleware } = require('../middlewares/auth.middleware');

router.get('/:archivoId', authMiddleware, etapaPublicacionController.obtenerPorArchivo);
router.patch('/:archivoId/:etapa', authMiddleware, adminMiddleware, etapaPublicacionController.avanzarEtapa);

module.exports = router;