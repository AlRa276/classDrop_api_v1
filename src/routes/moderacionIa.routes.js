const express = require('express');
const router = express.Router();
const moderacionIaController = require('../controllers/moderacionIa.controller');
const { authMiddleware, adminMiddleware } = require('../middlewares/auth.middleware');

router.post('/', authMiddleware, adminMiddleware, moderacionIaController.registrar);
router.get('/archivo/:archivoId', authMiddleware, adminMiddleware, moderacionIaController.listarPorArchivo);

module.exports = router;
