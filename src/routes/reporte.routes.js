const express = require('express');
const router = express.Router();
const reporteController = require('../controllers/reporte.controller');
const { authMiddleware, adminMiddleware } = require('../middlewares/auth.middleware');

router.post('/', authMiddleware, reporteController.crear);
router.get('/pendientes', authMiddleware, adminMiddleware, reporteController.listarPendientes);
router.put('/:id/resolver', authMiddleware, adminMiddleware, reporteController.resolver);

module.exports = router;
